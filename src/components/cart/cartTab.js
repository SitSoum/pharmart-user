"use client";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "./cartItem";
import { toggleStatusTab, setCheckOutID } from "@/app/redux/cart";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";

const CartTab = ({ statusTab }) => {
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const [validatedStores, setValidatedStores] = useState([]);

  const handleCloseCart = () => {
    dispatch(toggleStatusTab());
  };

  const handleSetCheckOutID = (coid) => {
    dispatch(setCheckOutID(coid));
  };

  // ✅ Fetch validated stores
  useEffect(() => {
    const fetchValidatedStores = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("name")
        .eq("validated", true);

      if (!error && data) {
        setValidatedStores(data.map((store) => store.name));
      }
    };

    fetchValidatedStores();
  }, []);

  

  return (
    <div
      className={`fixed right-0 pt-25.25 h-full z-499 bg-gray-700 shadow-2xl w-96 flex flex-col border-b rounded-b-lg
      transform transition-transform duration-500 ease-in-out ${
        statusTab ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-5 flex w-full justify-between items-center">
          <h2 className="text-white text-2xl font-extrabold">Shopping Cart</h2>
          <XCircle
            size={24}
            className="text-green-600 hover:text-green-700 cursor-pointer"
            onClick={handleCloseCart}
          />
        </div>

        <div className="px-5 pb-5">
          {carts.length === 0 && (
            <p className="text-gray-300 text-center italic">
              Your cart is empty.
            </p>
          )}

          {carts.map((store, sIndex) => {
            const isValidated = validatedStores.includes(store.store);

            return (
              <div key={sIndex} className="mb-6">
                {/* STORE NAME */}
                <p className="text-white font-bold mb-2 text-lg">
                  Store:{" "}
                  <span
                    className={
                      isValidated ? "text-green-400" : "text-red-400"
                    }
                  >
                    {store.store}
                  </span>
                </p>

                {/* PRODUCTS */}
                <div className="space-y-3">
                  {store.products.map((product, pIndex) => (
                    <CartItem
                      key={pIndex}
                      data={{
                        store_id: store.store_id,
                        store: store.store,
                        productId: product.productId,
                        units: product.units,
                      }}
                    />
                  ))}
                </div>

                {/* CHECKOUT BUTTON */}
                <div className="p-5 w-full">
                  <Link
                    href={isValidated ? `/checkout/${store.store_id}` : "#"}
                    onClick={(e) => {
                      if (!isValidated) {
                        e.preventDefault();
                        return;
                      }
                      handleSetCheckOutID(store.store_id);
                    }}
                    className={`font-semibold py-3 rounded-lg transition flex justify-center w-full mb-5
                      ${
                        isValidated
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-500 text-gray-300 cursor-not-allowed"
                      }
                    `}
                  >
                    {isValidated ? "CHECKOUT" : "STORE NOT VERIFIED"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CartTab;
