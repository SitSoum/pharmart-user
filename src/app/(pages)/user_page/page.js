"use client";

import { FaArrowRight } from "react-icons/fa6";
import { BsBox2, BsBox2Fill } from "react-icons/bs";
import { HiOutlineLocationMarker, HiLocationMarker } from "react-icons/hi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { IoBarChart,IoBarChartOutline } from "react-icons/io5";


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
  let [tab, changeTab] = useState("dashboard");
  const user_id = getUserIdFromStorage();
  const [user, setUser] = useState(null);

  let content;

  if (tab === "orders") {
    content = <OrdersUI />;
  } else if (tab === "location") {
    content = <PageSetLocation />;
  } else if (tab === "saved") {
    content = <SavedItems />;
  } else if (tab === "acc") {
    content = <UserEdit />;
  } else if (tab === "dashboard") {
    content = <UserDashboard userId={user_id} />;
  } else {
    content = <></>;
  }

  useEffect(() => {
    console.log(tab);
  }, [tab]);

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", user_id)
        .single();

      if (error) {
        console.error("Failed to fetch user:", error);
        return;
      }

      setUser(data);
    };

    fetchUser();
  }, [user_id]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/login_registration"; // safer for non-router context
    } catch (error) {
      //alert("Sign-out failed: " + error.message);
      Swal.fire({title: "Sign-out failed", icon: "error",confirmButtonText: "OK"});
    }
  };

  // #107A1D
  // #FF4B4B
  return (
    <div className="page w-screen h-screen flex justify-between items-start mt-30">
      <nav className="border-r-2 border-r-gray-200 min-w-72 h-screen p-6 flex flex-col gap-5 justify-between overflow-y-auto">
        <div>
          <div className="top-panel flex flex-col  mb-4">
            <div className="pic-name-panel flex flex-row justify-between items-center border rounded-t-lg border-gray-200 p-5  ">
              <div className="rounded-full w-20 h-20  overflow-hidden">
                {/* <img src="/assets/cat_profile.png" className="w-full h-full object-cover" /> */}
              </div>
              <span className="text-[32px] font-bold leading-tight">
                {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                <p className="text-sm text-gray-500">{user?.email}</p>
              </span>
            </div>

            <div
              className={`h-12.5 cursor-pointer flex flex-row justify-between items-center p-5 border rounded-b-lg text-white bg-[#107A1D] font-bold ${tab == "acc" ? "" : ""}`}
              onClick={() => changeTab("acc")}
            >
              Account
              <FaArrowRight />
            </div>
          </div>

          <div
            className={` h-12.5 cursor-pointer border  flex flex-row p-5 rounded-lg items-center gap-5 mb-4 ${tab == "dashboard" ? "text-[#107A1D] border-[#107A1D] font-bold" : "text-black border-gray-200 "}`}
            onClick={() => changeTab("dashboard")}
          >
            {tab == "dashboard" ? <IoBarChart/> : <IoBarChartOutline  />}
            Dashboard
          </div>

          <div className={`  mb-4 `}>
            <div
              className={`h-12.5 flex flex-row p-5 items-center gap-5 cursor-pointer border rounded-t-lg ${tab == "orders" ? "text-[#107A1D] border-[#107A1D] font-bold" : "text-black border-gray-200"}`}
              onClick={() => changeTab("orders")}
            >
              {tab == "orders" ? <BsBox2Fill /> : <BsBox2 />}
              My orders
            </div>

            <div
              className={`h-12.5 flex flex-row p-5 gap-5 items-center cursor-pointer  border rounded-b-lg ${tab == "location" ? "text-[#107A1D] border-[#107A1D] font-bold" : "text-black border-gray-200"}`}
              onClick={() => changeTab("location")}
            >
              {tab == "location" ? (
                <HiLocationMarker />
              ) : (
                <HiOutlineLocationMarker />
              )}
              Address
            </div>
          </div>

          <div
            className={` h-12.5 cursor-pointer border  flex flex-row p-5 rounded-lg items-center gap-5 mb-4 ${tab == "saved" ? "text-[#107A1D] border-[#107A1D] font-bold" : "text-black border-gray-200 "}`}
            onClick={() => changeTab("saved")}
          >
            {tab == "saved" ? <BsBookmarkFill /> : <BsBookmark />}
            Saved
          </div>
        </div>

        <button
          className="w-full flex justify-center items-center gap-5 py-2 px-4 border border-[#FF4B4B] rounded-lg shadow-sm text-sm font-medium text-[#FF4B4B] hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out"
          onClick={handleSignOut}
        >
          <IoExitOutline size={24} /> <span>Sign-out </span>
        </button>
      </nav>

      <section className="flex-1  pb-6  w-full h-full relative overflow-y-auto">
        <header className="flex-1 sticky px-4 py-4 top-0 z-50 w-full font-semibold  text-xl bg-white mb-4 shadow-lg ">
          {tab == "acc" ? (
            <span>My account</span>
          ) : tab == "orders" ? (
            <span>My orders</span>
          ) : tab == "location" ? (
            <span>Address setting</span>
          ) : tab == "saved" ? (
            <span>Saved items</span>
          ) : tab == "dashboard" ? (
            <span>My Dashboard</span>
          ) : (
            <></>
          )}
        </header>

        <div className="w-full h-full px-6">{content}</div>
      </section>
    </div>
  );
};

export default UserPage;
