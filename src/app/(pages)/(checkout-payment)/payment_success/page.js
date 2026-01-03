"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeStoreFromCart } from "@/app/redux/cart";

export default function PaymentSuccess() {
  const [error, setError] = useState(null);
  const hasRun = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (!sessionId) {
      setError("No session ID found in URL.");
      return;
    }

    const finalizeOrder = async () => {
       
      try {
        setLoading(true);
        const res = await fetch("/api/create-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.success && data.storeId) {
          dispatch(removeStoreFromCart(Number(data.storeId)));
          setLoading(false);
          router.refresh();
        }

        

        if (!res.ok) {
          setError(data.error || "Failed to create order.");
          return;
        }

        // ✅ refresh server components
        router.refresh();
      } catch (err) {
        setError("Network or server error.");
      }
    };

    finalizeOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful 🎉
          </h1>
          <p className="text-lg mb-6">
            Thank you! Your order has been placed successfully.
          </p>
        </>
      )}

      <button
        onClick={() => router.push("/home")}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go Back Home
      </button>

      {loading && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
  </div>
)}
    </div>
  );
}
