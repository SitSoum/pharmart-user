"use client";
import { useEffect, useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { changeQuantity } from "@/app/redux/cart";
import { supabase } from "@/app/supabase";
import Link from "next/link";
// import { getUserIdFromStorage } from "@/app/services/cartService";
// import { syncCartToSupabase } from "@/app/services/cartService";

export default function CartItem({ data }) {
  const { store_id, store, productId, units } = data;

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  //const cartItems = useSelector((state) => state.cart.items);
  //const userId = getUserIdFromStorage();




  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          image_url,
          visible,
          product_sale_units (
            unit_name,
            price
          ),
          stores (
            name
          )
        `)
        .eq("id", productId)
        .single();

      if (!error && data) {
        setDetail({
          id: data.id,
          name: data.name,
          slug: data.slug,
          image_url: data.image_url,
          visible: data.visible,
          store: data.stores?.name,
          sale_units: data.product_sale_units.map(u => ({
            unit: u.unit_name,
            price: Number(u.price),
          })),
        });
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading || !detail) return null;

  const updateQty = (unit, qty) => {
    if (qty < 0) return;

   console.log("updateQty called, store id:",store_id)

    dispatch(
      changeQuantity({
        store_id,
        productId,
        unit,
        qty,
      })
    );
   
  };

  const totalPrice = units.reduce((sum, u) => {
    const su = detail.sale_units.find(s => s.unit === u.unit);
    return sum + (su?.price || 0) * u.qty;
  }, 0);

  return (
    <div className="flex flex-col bg-slate-700 text-white p-4 rounded-lg border border-slate-600 gap-4">

      {/* Header */}
      <Link href={`/product/${detail.slug}`} className="flex items-center gap-4">
        <img
          src={detail.image_url}
          alt={detail.name}
          className="w-16 h-16 rounded-lg object-fit border border-gray-500"
        />

        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{detail.name}</h3>
          <p className="text-gray-300 text-sm">{detail.store}</p>
        </div>
         </Link>


        <p className="ml-auto font-bold text-lg">
          ${totalPrice.toFixed(2)}
        </p>
     
      {/* Units */}
      <div className="flex flex-col gap-2 bg-slate-800 rounded-lg p-3">
        {!detail.visible && (
          <p className="text-red-400 text-sm mb-2">
            Product has been deleted, please remove it from your cart
          </p>
        )}

        {units.map((u, i) => {
          const price =
            detail.sale_units.find(s => s.unit === u.unit)?.price || 0;

          return (
            <div
              key={i}
              className="flex justify-between items-center border-b border-slate-600 pb-2 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="font-medium capitalize">{u.unit}</span>
                <span className="text-gray-400 text-sm">
                  ${price.toFixed(2)} each
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-200 text-slate-900 w-7 h-7 rounded-full font-bold cursor-pointer"
                  onClick={() => updateQty(u.unit, u.qty - 1)}
                >
                  -
                </button>

                <span className="font-semibold">{u.qty}</span>

                <button
                  className={`bg-gray-200 text-slate-900 w-7 h-7 rounded-full font-bold cursor-pointer ${
                    !detail.visible ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => detail.visible && updateQty(u.unit, u.qty + 1)}
                  disabled={!detail.visible}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

