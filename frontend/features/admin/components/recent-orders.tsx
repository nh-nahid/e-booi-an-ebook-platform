"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  bookTitle: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-[#E6F7F6] text-[#1f9d97]",
  shipped: "bg-[#f5f7e6] text-[#1f669d]",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0A0E2A]">Recent Orders</h3>
          <p className="text-xs text-[#6B7280]">Latest purchases across the store</p>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-bold text-[#2DBDB6] transition-colors hover:text-[#1f9d97]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-[#E1E5E8] text-xs font-semibold text-[#9AA3AF]">
              <th className="pb-2 pr-4 font-semibold">Order</th>
              <th className="pb-2 pr-4 font-semibold">Customer</th>
              <th className="pb-2 pr-4 font-semibold">Book</th>
              <th className="pb-2 pr-4 font-semibold">Amount</th>
              <th className="pb-2 pr-4 font-semibold">Status</th>
              <th className="pb-2 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#F1F3F5] text-sm transition-colors last:border-0 hover:bg-[#F7F9FA]"
              >
                <td className="py-3 pr-4 font-semibold text-[#0A0E2A]">#{order.id}</td>
                <td className="py-3 pr-4 text-[#0A0E2A]">{order.customerName}</td>
                <td className="max-w-[160px] truncate py-3 pr-4 text-[#6B7280]">
                  {order.bookTitle}
                </td>
                <td className="py-3 pr-4 font-semibold text-[#0A0E2A]">
                  ৳ {order.amount.toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-xs text-[#9AA3AF]">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
