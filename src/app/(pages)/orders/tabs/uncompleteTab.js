"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";

import ExpandableTable from "./ExpanableTable";

const UncompleteTab = ({ userId }) => {
  const [onTheWay, setOnTheWay] = useState([]);
  const [ready, setReady] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total_amount,
        shipping_method,
        payment_method,
        status,
        full_location,
        created_at,
        stores (
          name,
          address
        ),
        order_items (
          quantity,
          price_at_purchase,
          product_sale_unit,
          products ( id,name, image_url )
        )
      `
      )
      .eq("user_id", userId)
      .not("status", "in", '("COMPLETED","CANCELLED","REJECTED")')
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchOrders:", error);
      return;
    }

    setOnTheWay(
      data.filter(
        (o) => o.shipping_method === "delivery" && o.status != "PENDING"
      )
    );

    setReady(
      data.filter(
        (o) => o.shipping_method === "pickup" && o.status != "PENDING"
      )
    );

    setPending(data.filter((o) => o.status == "PENDING"));
  };

  return (
    <div className="h-full w-full overflow-y-auto space-y-6">
      {/* Pending */}
      <div>
        <div className="flex items-center justify-between px-4 py-2 bg-yellow-100 rounded-lg border border-yellow-300 shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800">Pending</h2>
          <span className="text-sm text-yellow-700 font-medium">
            {pending.length} {pending.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {pending.length > 0 ? (
          pending.map((order) => (
            <ExpandableTable key={order.id} order={order} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No pending orders</p>
        )}
      </div>

      {/* On the way */}
      <div>
        <div className="flex items-center justify-between px-4 py-2 bg-blue-100 rounded-lg border border-blue-300 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-800">On the way</h2>
          <span className="text-sm text-blue-700 font-medium">
            {onTheWay.length} {onTheWay.length === 1 ? "order" : "orders"}
          </span>
        </div>
        {onTheWay.length > 0 ? (
          onTheWay.map((order) => (
            <ExpandableTable key={order.id} order={order} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No orders on the way</p>
        )}
      </div>

      {/* Ready for pickup */}
      <div>
        <div className="flex items-center justify-between px-4 py-2 bg-green-100 rounded-lg border border-green-300 shadow-sm">
          <h2 className="text-lg font-semibold text-green-800">
            Ready to be picked up
          </h2>
          <span className="text-sm text-green-700 font-medium">
            {ready.length} {ready.length === 1 ? "order" : "orders"}
          </span>
        </div>
        {ready.length > 0 ? (
          ready.map((order) => <ExpandableTable key={order.id} order={order} />)
        ) : (
          <p className="text-sm text-gray-500 italic">
            No orders ready for pickup
          </p>
        )}
      </div>
    </div>
  );
};

export default UncompleteTab;
