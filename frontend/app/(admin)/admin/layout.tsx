import type { ReactNode } from "react";

import Sidebar from "@/features/admin/components/sidebar";
import AdminHeader from "@/features/admin/components/header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F9FA]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
