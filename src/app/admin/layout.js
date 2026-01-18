import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import Protected from "./protector";

export default function AdminLayout({ children }) {
  return (
   
 <div className="min-h-screen flex text-white">
  {/* Sidebar */}
  <AdminSidebar />

  {/* Main content */}
  <div className="flex-1 flex flex-col">
    <AdminHeader />
    <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
      {children}
    </main>
  </div>
</div>
  );
}
