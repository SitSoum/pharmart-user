"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "../supabase";
import Sidebar from "@/components/layout/owner/sidebar";
import Header from "@/components/layout/owner/navbar";
import Protected from "./protector";




export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
<Protected>
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
    {/* Header */}
    <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        className={`fixed lg:relative top-0 left-0 h-full bg-white shadow-lg z-50
          w-64 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-4rem)]
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"} lg:p-6`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  </div>
</Protected>

  );
}
