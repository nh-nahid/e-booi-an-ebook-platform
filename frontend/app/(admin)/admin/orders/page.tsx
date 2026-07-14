"use client";

import { Fragment, useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminOrders, useUpdateAdminOrderStatus } from "@/features/admin/hooks/admin.hooks";
import type { Order } from "@/features/admin/types/admin.types";

const ORDER_STATUSES: Order["orderStatus"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: Order["paymentStatus"][] = ["pending", "paid", "failed"];

const STATUS_STYLES: Record<Order["orderStatus"], string> = {
  pending: "bg-[#FEF3C7] text-[#92400E]",
  processing: "bg-[#E6F7F6] text-[#0A0E2A]",
  shipped: "bg-[#DBEAFE] text-[#1E40AF]",
  delivered: "bg-[#DCFCE7] text-[#166534]",
  cancelled: "bg-[#FEE2E2] text-[#991B1B]",
};

const PAYMENT_STYLES: Record<Order["paymentStatus"], string> = {
  pending: "bg-[#FEF3C7] text-[#92400E]",
  paid: "bg-[#DCFCE7] text-[#166534]",
  failed: "bg-[#FEE2E2] text-[#991B1B]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<Order["orderStatus"] | "">("");
  const [paymentStatus, setPaymentStatus] = useState<Order["paymentStatus"] | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Debounce search input -> actual query param
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useAdminOrders({
    page,
    search,
    orderStatus: orderStatus || undefined,
    paymentStatus: paymentStatus || undefined,
  });

  const updateStatus = useUpdateAdminOrderStatus();

  const handleStatusChange = (id: string, next: Order["orderStatus"]) => {
    updateStatus.mutate(
      { id, orderStatus: next },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: () => toast.error("Couldn't update order status. Try again."),
      }
    );
  };

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A0E2A]">Orders</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {pagination ? `${pagination.total} total orders` : "Loading orders…"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by invoice, transaction ID, or customer"
            className="h-10 w-full rounded-lg border border-[#E1E5E8] pl-9 pr-3 text-sm text-[#0A0E2A] outline-none focus:border-[#2DBDB6]"
          />
        </div>

        <select
          value={orderStatus}
          onChange={(e) => {
            setOrderStatus(e.target.value as Order["orderStatus"] | "");
            setPage(1);
          }}
          className="h-10 rounded-lg border border-[#E1E5E8] px-3 text-sm text-[#0A0E2A] outline-none focus:border-[#2DBDB6]"
        >
          <option value="">All order statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value as Order["paymentStatus"] | "");
            setPage(1);
          }}
          className="h-10 rounded-lg border border-[#E1E5E8] px-3 text-sm text-[#0A0E2A] outline-none focus:border-[#2DBDB6]"
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E1E5E8] bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading orders…
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-600">
            Couldn&apos;t load orders. Refresh to try again.
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-[#6B7280]">
            <Package className="h-8 w-8 text-[#9AA3AF]" />
            <p className="text-sm">No orders match these filters.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E1E5E8] bg-[#F7F9FA] text-xs uppercase tracking-wide text-[#9AA3AF]">
              <tr>
                <th className="w-8 px-4 py-3" />
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Payment status</th>
                <th className="px-4 py-3">Order status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isExpanded = expandedId === order._id;
                const isUpdatingThisRow =
                  updateStatus.isPending && updateStatus.variables?.id === order._id;

                return (
                  <Fragment key={order._id}>
                    <tr
                      className="cursor-pointer border-b border-[#E1E5E8] last:border-0 hover:bg-[#F7F9FA]"
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    >
                      <td className="px-4 py-3 text-[#9AA3AF]">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#0A0E2A]">
                          {order.user?.name ?? "Deleted user"}
                        </div>
                        <div className="text-xs text-[#9AA3AF]">{order.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 font-medium text-[#0A0E2A]">
                        {formatMoney(order.finalAmount)}
                      </td>
                      <td className="px-4 py-3 capitalize text-[#6B7280]">{order.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${PAYMENT_STYLES[order.paymentStatus]}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            disabled={isUpdatingThisRow}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value as Order["orderStatus"])
                            }
                            className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none disabled:opacity-60 ${STATUS_STYLES[order.orderStatus]}`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s[0].toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          {isUpdatingThisRow && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#9AA3AF]" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-b border-[#E1E5E8] bg-[#F7F9FA]/60 last:border-0">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
                                Shipping
                              </h4>
                              {order.shippingAddress?.fullName ? (
                                <div className="space-y-0.5 text-sm text-[#0A0E2A]">
                                  <p>{order.shippingAddress.fullName}</p>
                                  <p className="text-[#6B7280]">{order.shippingAddress.phone}</p>
                                  <p className="text-[#6B7280]">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                                    {order.shippingAddress.postalCode}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-[#9AA3AF]">Digital order — no shipping</p>
                              )}
                            </div>

                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
                                Items
                              </h4>
                              <ul className="space-y-1 text-sm text-[#0A0E2A]">
                                {order.items.map((item, i) => (
                                  <li key={i} className="flex justify-between">
                                    <span>
                                      {item.quantity}× {item.bookType}
                                    </span>
                                    <span className="text-[#6B7280]">{formatMoney(item.price)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-[#6B7280]">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#E1E5E8] px-3 py-1.5 font-medium text-[#0A0E2A] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#E1E5E8] px-3 py-1.5 font-medium text-[#0A0E2A] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
