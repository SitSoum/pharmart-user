"use client";

import { useState } from "react";
import UncompleteTab from "./tabs/uncompleteTab";
import CompletedTab from "./tabs/completedTab";
import { getUserIdFromStorage } from "@/app/services/cartService";

export default function OrdersUI() {
  const [tabName, setTabName] = useState("Uncomplete");
  const userId = getUserIdFromStorage();

  const handleTabChange = (e) => {
    setTabName(e.target.id);
    console.log(tabName);
  };

  if (!userId) {
    return (
      <div className="p-6 bg-white h-screen  w-full flex items-center justify-center text-2xl">
        <div>Loading user id</div>
      </div>
    );
  } else {
    console.log("userId:", userId);
    return (
      <div className="p-6 bg-white h-screen  w-full ">
        <div className="flex flex-row  gap-6 mb-6">
          <button
            id="Uncomplete"
            className={`${tabName === "Uncomplete" ? "bg-[#107A1D] text-white" : "bg-transparent text-black"}
           border border-gray-300 rounded-lg text-center text-sm font-medium px-4 py-2 transition-color duration-200`}
            onClick={(e) => handleTabChange(e)}
          >
            Uncomplete
          </button>

          <button
            id="Completed"
            className={`${tabName === "Completed" ? "bg-[#107A1D] text-white" : "bg-transparent text-black"} border border-gray-300 rounded-lg px-4 py-2 text-center text-sm font-medium transition-color duration-200`}
            onClick={(e) => handleTabChange(e)}
          >
            Completed
          </button>
        </div>

        <section className="w-full h-full">
          {tabName === "Uncomplete" && userId ? (
            <UncompleteTab userId={userId} />
          ) : (
            <CompletedTab userId={userId} />
          )}
        </section>
      </div>
    );
  }
}
