"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";

import ExpandableTable from "./ExpanableTable";

const CompletedTab = ({ userId }) => {
  const [completedPickUp, setCompletedPickUp] = useState([]);
  const [completedDelivery, setCompletedDelivery] = useState([]);

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
          products ( name,image_url )
        )
      `
      )
      .eq("status", "COMPLETED")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCompletedDelivery(data.filter((o) => o.shipping_method === "delivery"));

    setCompletedPickUp(data.filter((o) => o.shipping_method === "pickup"));
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Delivery */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Delivered</h2>
        <span className="text-sm text-gray-700 font-medium">
          {completedDelivery.length}{" "}
          {completedDelivery.length === 1 ? "order" : "orders"}
        </span>
      </div>
      {completedDelivery.map((order) => (
        <ExpandableTable key={order.id} order={order} />
      ))}

      {/* Pickup */}
      <div className="flex items-center justify-between px-4 py-2 bg-green-100 rounded-lg border border-green-300 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-green-800">Picked up</h2>
        <span className="text-sm text-green-700 font-medium">
          {completedPickUp.length}{" "}
          {completedPickUp.length === 1 ? "order" : "orders"}
        </span>
      </div>
      {completedPickUp.map((order) => (
        <ExpandableTable key={order.id} order={order} />
      ))}
    </div>
  );
};

export default CompletedTab;
