"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import ExpandableTable from "../../orders/tabs/ExpanableTable";
import { ListOrderedIcon } from "lucide-react";
import { TbTruckDelivery } from "react-icons/tb";
import { GrStakeholder } from "react-icons/gr";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";

const UserDashboard = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    accepted: 0,
    readyForPickup: 0,
    outForDelivery: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0,
    cashPending: 0,
    cardPaid: 0,
  });

  // New loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true); // start loading

    const { data: orderData, error } = await supabase
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchDashboardData:", error);
      setLoading(false); // stop loading if error
      return;
    }

    setOrders(orderData || []);

    const newStats = {
      totalOrders: orderData?.length,
      pending: orderData.filter((o) => o.status === "PENDING").length,
      accepted: orderData.filter((o) => o.status === "ACCEPTED").length,
      readyForPickup: orderData.filter((o) => o.status === "READY_FOR_PICKUP")
        .length,
      outForDelivery: orderData.filter((o) => o.status === "OUT_FOR_DELIVERY")
        .length,
      completed: orderData.filter((o) => o.status === "COMPLETED").length,
      cancelled: orderData.filter((o) =>
        ["CANCELLED", "REJECTED"].includes(o.status)
      ).length,
      totalSpent: orderData
        ?.filter((o) => o.status === "COMPLETED")
        .reduce((acc, o) => acc + Number(o.total_amount), 0),
      cashPending: orderData.filter(
        (o) => o.payment_method === "cash" && o.status !== "COMPLETED"
      ).length,
      cardPaid: orderData.filter(
        (o) => o.payment_method === "card" && o.status === "COMPLETED"
      ).length,
    };

    setStats(newStats);
    setLoading(false); // finish loading
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6  bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Stats cards */}
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-l-4 border-green-500 mb-5">
  <p className="text-lg font-semibold text-gray-800 mb-4">
    Orders Overview
  </p>

  {/* Total Orders */}
  <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Total Orders</span>
      <span className="font-semibold">{stats?.totalOrders}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-green-500 transition-all duration-500"
        style={{
          width: `${(stats?.totalOrders / stats?.totalOrders) * 100 || 0}%`,
        }}
      />
    </div>
  </div>

  {/* Pending */}
  <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Pending</span>
      <span className="font-semibold">{stats?.pending}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-green-400 transition-all duration-500"
        style={{
          width: `${(stats?.pending / stats?.totalOrders) * 100 || 0}%`,
        }}
      />
    </div>
  </div>

  {/* Completed */}
  <div>
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Completed</span>
      <span className="font-semibold">{stats?.completed}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-green-700 transition-all duration-500"
        style={{
          width: `${(stats?.completed / stats?.totalOrders) * 100 || 0}%`,
        }}
      />
    </div>
  </div>
</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-semibold">{stats?.totalOrders}</p>
          </div>

       
          <div className="text-green-500 text-3xl">
            <ListOrderedIcon />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-semibold">{stats?.pending}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xl font-semibold">{stats?.completed}</p>
        </div> */}


        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500 flex justify-between items-center">
          <div>
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-xl font-semibold">${stats?.totalSpent}</p>
          </div>

          <div className="text-green-500 text-3xl">
            <TbReportMoney />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Cash Pending</p>
          <p className="text-xl font-semibold">{stats?.cashPending}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Card Paid</p>
          <p className="text-xl font-semibold">{stats?.cardPaid}</p>
        </div>
      </div>

      {/* Delivery & Pickup status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 ">
        <div className="bg-white p-4 rounded shadow flex justify-between items-center ">
          <div>
            <p className="text-sm text-gray-500">Out for Delivery</p>
            <p className="text-xl font-semibold">{stats?.outForDelivery}</p>
          </div>
          <div className="text-green-500 text-3xl">
            < TbTruckDelivery />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
          <p className="text-sm text-gray-500">Ready for Pickup</p>
          <p className="text-xl font-semibold">{stats?.readyForPickup}</p>
          </div>

           <div className="text-green-500 text-3xl">
            < GrStakeholder />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
          <p className="text-sm text-gray-500">Accepted Orders</p>
          <p className="text-xl font-semibold">{stats?.accepted}</p>
          </div>

          <div className="text-green-500 text-3xl">
            < GiConfirmed />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
          <p className="text-sm text-gray-500">Cancelled / Rejected</p>
          <p className="text-xl font-semibold">{stats?.cancelled}</p>
          </div>

          <div className="text-red-500 text-3xl">
            < GiCancel />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <ExpandableTable key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
