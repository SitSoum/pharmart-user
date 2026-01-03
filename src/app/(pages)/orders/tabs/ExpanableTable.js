"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  ON_THE_WAY: "bg-emerald-100 text-emerald-700",
  READY_FOR_PICKUP: "bg-indigo-100 text-indigo-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cancelOrder = async () => {
    setLoading(true);
    try {
      if (order.status === "ACCEPTED") {
        for (const item of order.order_items) {
          const { data } = await supabase
            .from("product_sale_units")
            .select("stock_quantity")
            .eq("product_id", item.products.id)
            .eq("unit_name", item.product_sale_unit)
            .single();

          await supabase
            .from("product_sale_units")
            .update({ stock_quantity: (data?.stock_quantity || 0) + item.quantity })
            .eq("product_id", item.products.id)
            .eq("unit_name", item.product_sale_unit);
        }
      }

      await supabase
        .from("orders")
        .update({ status: "CANCELLED" })
        .eq("id", order.id)
        .in("status", ["PENDING", "PENDING_APPROVAL", "ACCEPTED"]);
    } catch {
      Swal.fire({ title: "Failed to cancel order", icon: "error", confirmButtonText: "OK" });
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="bg-white shadow-md rounded-xl border overflow-hidden mb-6">
      {/* HEADER */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer hover:bg-gray-50 gap-3"
        onClick={() => setOpen(!open)}
      >
        {/* Order info */}
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-gray-800">Order #{order.id}</p>
          <p className="text-sm text-gray-500">{order.stores.name}</p>
          <p className="text-sm text-gray-700">
            Total: <span className="font-semibold">${order.total_amount}</span>
          </p>
          <p className="text-sm text-gray-500">Payment: {order.payment_method}</p>
        </div>

        {/* Status badge + expand icon */}
        <div className="flex items-center gap-3 md:gap-4">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${statusColor[order.status]}`}
          >
            {order.status.replace("_", " ")}
          </span>

          <FaChevronDown
            className={`transition-transform text-gray-500 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* BODY */}
      {open && (
        <div className="p-5 border-t space-y-6">
          {/* PRODUCTS */}
          <div className="space-y-4">
            {order.order_items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[70px_1fr_70px_50px_70px] items-center gap-3 border rounded-lg p-3 md:grid-cols-[100px_1fr_80px_60px_80px]"
              >
                <img
                  src={item.products.image_url}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain rounded"
                />

                <div className="flex flex-col">
                  <p className="font-medium text-sm md:text-base">{item.products.name}</p>
                  <p className="text-xs text-gray-500">Unit: {item.product_sale_unit}</p>
                </div>

                <p className="text-sm text-right">${item.price_at_purchase}</p>
                <p className="text-sm text-center">x{item.quantity}</p>
                <p className="text-sm font-semibold text-right">
                  ${item.price_at_purchase * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* ADDRESSES */}
          <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
            {order.shipping_method === "delivery" && (
              <div>
                <p className="font-semibold mb-1">Delivery Address</p>
                <p className="text-gray-600">{order.full_location}</p>
              </div>
            )}

            <div>
              <p className="font-semibold mb-1">Store Address</p>
              <p className="text-gray-600">{order.stores.address}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {["PENDING", "ACCEPTED"].includes(order.status) && (
            <div className="flex justify-end">
              <button
                onClick={cancelOrder}
                disabled={loading}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg disabled:opacity-50"
              >
                {loading ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}