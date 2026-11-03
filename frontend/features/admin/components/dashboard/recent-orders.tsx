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
  pending: "bg-warn-soft text-warn-ink",
  processing: "bg-brand-soft text-brand-strong",
  shipped: "bg-[#f3f7e6] text-[#5a9d1f]",
  delivered: "bg-success-soft text-success-ink",
  cancelled: "bg-danger-soft text-danger-ink",
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Recent Orders</h3>
          <p className="text-xs text-muted-ink">Latest purchases across the store</p>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-strong"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-line text-xs font-semibold text-subtle">
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
                className="border-b border-soft text-sm transition-colors last:border-0 hover:bg-canvas"
              >
                <td className="py-3 pr-4 font-semibold text-ink">#{order.id}</td>
                <td className="py-3 pr-4 text-ink">{order.customerName}</td>
                <td className="max-w-[160px] truncate py-3 pr-4 text-muted-ink">
                  {order.bookTitle}
                </td>
                <td className="py-3 pr-4 font-semibold text-ink">
                  ৳ {order.amount.toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-xs text-subtle">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
