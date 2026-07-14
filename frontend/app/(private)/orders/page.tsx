"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import { useAuth } from "@/hooks/use-auth";
import { useMyOrders } from "@/features/orders/hooks/use-orders";
import OrderCard from "@/features/orders/components/order-card";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <h1 className="mb-6 text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
          আমার অর্ডার
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E8] bg-white py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F9FA]">
              <PackageSearch className="h-6 w-6 text-[#9AA3AF]" />
            </span>
            <p className="text-sm font-bold text-[#0A0E2A]">
              আপনার কোনো অর্ডার নেই
            </p>
            <p className="text-xs text-[#6B7280]">
              বই কেনাকাটা শুরু করুন এবং এখানে আপনার অর্ডার দেখুন
            </p>
             <button
            onClick={() => router.push("/books")}
            className="rounded-full cursor-pointer bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white"
          >
            শপিং চালিয়ে যান
          </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}