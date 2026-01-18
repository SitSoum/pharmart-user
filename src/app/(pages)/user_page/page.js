"use client";

import { FaArrowRight } from "react-icons/fa6";
import { BsBox2, BsBox2Fill } from "react-icons/bs";
import { HiOutlineLocationMarker, HiLocationMarker } from "react-icons/hi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { IoBarChart, IoBarChartOutline } from "react-icons/io5";
import { SidebarClose, SidebarOpen } from "lucide-react";


import PageSetLocation from "../location/page";
import OrdersUI from "../orders/page";
import { useEffect, useState } from "react";
import UserEdit from "./component/editPage";
import SavedItems from "./component/savedItems";

import { supabase } from "../../supabase";
import { getUserIdFromStorage } from "@/app/services/cartService";
import UserDashboard from "./component/userDashboard";

import Swal from "sweetalert2";

const UserPage = () => {
  const [tab, setTab] = useState("dashboard");
  const user_id = getUserIdFromStorage();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", user_id)
        .single();

      if (!error && data) setUser(data);
    };

    fetchUser();
  }, [user_id]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/login_registration";
    } catch (error) {
      Swal.fire({
        title: "Sign-out failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  let content;
  switch (tab) {
    case "orders":
      content = <OrdersUI />;
      break;
    case "location":
      content = <PageSetLocation />;
      break;
    case "saved":
      content = <SavedItems />;
      break;
    case "acc":
      content = <UserEdit />;
      break;
    case "dashboard":
      content = <UserDashboard userId={user_id} />;
      break;
    default:
      content = null;
  }

  const navItemClass = (active) =>
    `flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition ${
      active
        ? "text-[#107A1D] border-[#107A1D] font-bold bg-green-50"
        : "text-gray-800 border-gray-200 hover:bg-gray-100"
    }`;

  return (
   <div className="flex w-screen h-full overflow-hidden ">
  {/* ================= OPEN SIDEBAR BUTTON ================= */}
  <button
    className="fixed top-50 left-4 z-50 p-3 bg-green-600 text-white rounded-md shadow-md cursor-pointer"
    onClick={() => setSidebarOpen(true)}
  >
    <SidebarOpen/>
  </button>

  {/* ================= SIDEBAR ================= */}
  <aside
    className={`
      fixed z-500 bg-white border-r border-gray-200 w-72 h-full p-6 flex flex-col justify-between transition-transform
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
  >
    <div>
    {/* ================= CLOSE BUTTON ================= */}
    <span className="flex justify-end">
    <button
      className=" text-gray-700 font-bold cursor-pointer mb-4"
      onClick={() => setSidebarOpen(false)}
    >
      <SidebarClose/>
    </button>
    </span>

    <div className="flex flex-col gap-4 overflow-y-auto">
      {/* User info */}
      <div className="flex items-center gap-4 mb-4 border rounded-lg p-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden" />
        <div className="flex flex-col">
          <span className="font-bold text-lg">
            {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
          </span>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-2">
        <div className={navItemClass(tab === "dashboard")} onClick={() => setTab("dashboard")}>
          {tab === "dashboard" ? <IoBarChart /> : <IoBarChartOutline />} Dashboard
        </div>

        <div className={navItemClass(tab === "orders")} onClick={() => setTab("orders")}>
          {tab === "orders" ? <BsBox2Fill /> : <BsBox2 />} My Orders
        </div>

        <div className={navItemClass(tab === "location")} onClick={() => setTab("location")}>
          {tab === "location" ? <HiLocationMarker /> : <HiOutlineLocationMarker />} Address
        </div>

        <div className={navItemClass(tab === "saved")} onClick={() => setTab("saved")}>
          {tab === "saved" ? <BsBookmarkFill /> : <BsBookmark />} Saved Items
        </div>

        <div className={navItemClass(tab === "acc")} onClick={() => setTab("acc")}>
          <FaArrowRight /> Account
        </div>
      </div>
    </div>
    </div>

    {/* Sign-out */}
    <button
      onClick={handleSignOut}
      className="mt-4 flex items-center justify-center gap-2 py-2 px-4 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition"
    >
      <IoExitOutline size={20} /> Sign Out
    </button>
  </aside>

  {/* ================= MAIN CONTENT ================= */}
  <main className="flex-1 flex flex-col h-full overflow-y-auto ml-6 pt-20">
    {/* <header className="sticky top-0 z-40 bg-white p-4 shadow-md font-semibold text-xl">
      {tab === "acc"
        ? "My Account"
        : tab === "orders"
        ? "My Orders"
        : tab === "location"
        ? "Address Settings"
        : tab === "saved"
        ? "Saved Items"
        : "My Dashboard"}
    </header> */}

    <div className="p-6">{content}</div>
  </main>
</div>
  );
};

export default UserPage;
