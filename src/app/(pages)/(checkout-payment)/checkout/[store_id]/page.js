"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import CartItem from "../components/cartItem";

import { useSelector, useDispatch } from "react-redux";
import { getUserIdFromStorage } from "@/app/services/cartService";
import { removeStoreFromCart } from "@/app/redux/cart";

import { supabase } from "@/app/supabase";
import { loadStripe } from "@stripe/stripe-js";

import Swal from "sweetalert2";
import Spinner from "@/components/spinner";

const CheckoutPage = () => {
  const [loadingProduct, setLoadingProduct] = useState(false);
  const { store_id } = useParams(); // param as string
  const storeId = Number(store_id);
  const userId = getUserIdFromStorage();

  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [store_name, setStoreName] = useState("");
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const isSyncing = useSelector(state => state.cart.isSyncing);

  const customerName = "Soum"; // temporary demo

  useEffect(()=>{
    setLoadingProduct(true);
  },[userId, storeId,cartItems])

  useEffect(() => {
    if (!userId || !storeId) return;
    if (isSyncing) return;

    const fetchCheckoutItems = async () => {

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
        quantity,
        product_id,
        sale_unit_id,
        products (
          id,
          name,
          slug,
          image_url,
          visible
        ),
        product_sale_units (
          id,
          unit_name,
          price
        ),
        cart!inner (
          user_id
        )
      `
        )
        .eq("store_id", storeId)
        .eq("cart.user_id", userId);

      if (error) {
        console.error(error);
        return;
      }

      const mapped = data
        .filter((item) => item.products?.visible)
        .map((item) => ({
          productId: item.product_id,
          name: item.products.name,
          slug: item.products.slug,
          image_url: item.products.image_url,
          store_id: storeId,
          units: [
            {
              unit: item.product_sale_units.unit_name,
              qty: item.quantity,
              price: Number(item.product_sale_units.price),
            },
          ],
        }));

      setCheckoutProducts(mapped);
      setLoadingProduct(false);
    };

    fetchCheckoutItems();
  }, [userId, storeId,isSyncing]);

  useEffect(() => {
    if (!userId) return; // exit if no user yet

    const fetchAddress = async () => {
      try {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (data) {
          setAddress(data.full_location); // ✅ use `data`
          setLongitude(data.longitude);
          setLatitude(data.latitude);
        } else {
          setAddress("No address");
        }
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, [userId]);

  // Subtotal calculation with correct pricing
  const subtotal = checkoutProducts.reduce((sum, p) => {
    return sum + p.units.reduce((uSum, u) => uSum + u.price * u.qty, 0);
  }, 0);

  const shipping = 1.0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const makeCashOrder = async () => {
    try {
      if (!checkoutProducts.length) return;

      // 1️⃣ Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          store_id: checkoutProducts[0].store_id,
          full_location: address,
          longitude,
          latitude,
          total_amount: total,
          shipping_method: shippingMethod,
          payment_method: "cash",
          checkout_session_id: `CASH-${Date.now()}`,
          created_at: new Date(),
          status: "PENDING",
        })
        .select()
        .single();
      if (orderError) throw orderError;

      // 2️⃣ Insert order items
      const orderItems = [];
      checkoutProducts.forEach((product) =>
        product.units.forEach((unit) => {
          orderItems.push({
            order_id: order.id,
            product_id: product.productId,
            product_sale_unit: unit.unit,
            quantity: unit.qty,
            price_at_purchase: unit.price,
            subtotal: unit.qty * unit.price,
            created_at: new Date(),
          });
        })
      );

      if (orderItems.length) {
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
        if (itemsError) throw itemsError;
      }

      // 3️⃣ Payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: userId,
        order_id: order.id,
        amount: total,
        currency: "USD",
        status: "CASH_PENDING",
        created_at: new Date(),
      });
      if (paymentError) throw paymentError;

      // 4️⃣ Remove items from Supabase cart
      const productIds = checkoutProducts.map((p) => p.productId);
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .in("product_id", productIds)
        .eq("store_id", checkoutProducts[0].store_id);
      if (deleteError) console.error("Failed to remove items:", deleteError);

      // 5️⃣ Remove store from Redux
      dispatch(removeStoreFromCart(storeId));

      Swal.fire({
        title: "Success!",
        text: "Cash order placed successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      router.replace("/home");
    } catch (err) {
      console.error("Cash order failed:", err);
      Swal.fire({
        title: "Failed!",
        text: "Failed to place cash order!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const makeCreditPayment = async () => {
 

    const body = {
      totalAmount: Number(total.toFixed(2)),
      customerName,
      user_id: userId,
      full_location: address,
      longitude, // typo kept for mapping
      latitude,
      store_id: checkoutProducts[0]?.store_id,
      paymentMethod,
      shippingMethod,
      items: checkoutProducts,
    };

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error("Failed to create Stripe session:", session);
        Swal({
          title: "Failed!",
          text: "Failed to create payment session. Please try again!",
          icon: "error",
          confirmButtonText: "OK",
        });
        // alert("Failed to create payment session. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      Swal({
        title: "Payment,Failed!",
        text: "Check console for details!",
        icon: "error",
        confirmButtonText: "OK",
      });
      //alert("Payment failed. Check console for details.");
    }
  };

  //alert

  const makePurchase = () => {
    if (paymentMethod === "cash") makeCashOrder();
    else if (paymentMethod === "card") makeCreditPayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 mt-50">
      <header className="flex items-center justify-between border-b pb-4 mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-extrabold text-green-700 tracking-wider">
            PHAR<span className="text-gray-800">MART</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- SHIPPING INFORMATION --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Checkout</h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Shipping Information
          </h3>

          {/* Shipping/Pickup Radio Buttons */}
          <div className="flex space-x-6 mb-6">
            <label
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${shippingMethod === "delivery" ? "border-green-600 bg-lime-50" : "border-gray-300"}`}
            >
              <input
                type="radio"
                name="shipping-method"
                value="delivery"
                checked={shippingMethod === "delivery"}
                onChange={() => setShippingMethod("delivery")}
                className="form-radio h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Delivery
              </span>
            </label>
            <label
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${shippingMethod === "pickup" ? "border-green-600 bg-lime-50" : "border-gray-300"}`}
            >
              <input
                type="radio"
                name="shipping-method"
                value="pickup"
                checked={shippingMethod === "pickup"}
                onChange={() => setShippingMethod("pickup")}
                className="form-radio h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Pick up
              </span>
            </label>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Location</h3>

          {shippingMethod == "delivery" ? (
            <div className="flex flex-wrap gap-2 items-center">
              <Select className="bg-gray-100">
                <SelectTrigger className="h-10 border-0 rounded-lg text-emerald-600 bg-gray-100 font-semibold focus:ring-0">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>

                <SelectContent className="z-600">
                  <SelectItem value="item">{address}</SelectItem>

                  <SelectSeparator />
                </SelectContent>
              </Select>

              <label className="mx-2 font-light text-black"> or </label>
              <Link href="/location" className="text-blue-600 underline">
                + New location
              </Link>
            </div>
          ) : (
            <></>
          )}

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Payment Method
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {/* Cash */}
              <button
                className={`flex justify-center items-center p-3 border rounded-md transition w-full 
                ${paymentMethod === "cash" ? "border-green-600 bg-lime-50" : "border-gray-300"}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <span className="text-sm font-medium text-gray-700">Cash</span>
              </button>

              {/* Credit Card */}
              <button
                className={`flex justify-center items-center p-3 border rounded-md transition w-full 
              ${paymentMethod === "card" ? "border-green-600 bg-lime-50" : "border-gray-300"}`}
                onClick={() => setPaymentMethod("card")}
              >
                <span className="text-sm font-medium text-gray-700">
                  Credit Card
                </span>
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start mt-6">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I have read and agree to the{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Terms and Conditions
              </a>
              .
            </label>
          </div>
        </div>

        {/* --- REVIEW YOUR CART --- */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-lime-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Review your cart
          </h3>

          {/* Cart Items */}
          {loadingProduct ? (
            <Spinner />
          ) : (
            <div className="space-y-4 pb-4 border-b">
              <div className="space-y-3">
                {checkoutProducts ? (
                  checkoutProducts.map((product, i) => (
                    <CartItem
                      key={i}
                      data={{
                        store_id: storeId,
                        productId: product.productId,
                        units: product.units.map((u) => ({
                          unit: u.unit,
                          qty: u.qty,
                        })),
                      }}
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1 text-sm pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-800">
                ${shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-red-500">
                -${discount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t mt-4 pt-4">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-xl font-extrabold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={makePurchase}
            disabled={!agreedToTerms}
            className={`w-full py-3 mt-6 rounded-md text-white font-bold transition duration-150 ${
              agreedToTerms
                ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
