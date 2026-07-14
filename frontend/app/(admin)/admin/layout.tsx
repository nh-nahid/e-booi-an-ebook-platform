"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/features/admin/components/dashboard/sidebar";
import AdminHeader from "@/features/admin/components/dashboard/header";

import { useAuth } from "@/hooks/use-auth"; // adjust path to wherever useAuth actually lives

import AdminLoading from "./loading";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // While auth is resolving, or if the user isn't an authenticated admin,
  // show a loading state instead of the admin shell (avoids a flash of
  // admin UI before the redirect effect fires).
  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return <AdminLoading />;
  }

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