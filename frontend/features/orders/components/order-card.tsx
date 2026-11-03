"use client";

import Link from "next/link";
import { Download, FileText, Loader2, Package, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { useDownloadBook, useDownloadInvoice } from "../hooks/use-orders";
import type { Order } from "../types/orders.types";

const STATUS_STYLES: Record<Order["orderStatus"], string> = {
  pending: "bg-warn-soft text-warn-ink",
  processing: "bg-brand-soft text-brand",
  shipped: "bg-info-soft text-info-ink",
  delivered: "bg-success-soft text-success-ink",
  cancelled: "bg-danger-soft text-danger-ink",
};

const STATUS_LABELS: Record<Order["orderStatus"], string> = {
  pending: "পেন্ডিং",
  processing: "প্রসেসিং",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
};

const PAYMENT_STATUS_STYLES: Record<Order["paymentStatus"], string> = {
  pending: "bg-warn-soft text-warn-ink",
  paid: "bg-success-soft text-success-ink",
  failed: "bg-danger-soft text-danger-ink",
};

const PAYMENT_STATUS_LABELS: Record<Order["paymentStatus"], string> = {
  pending: "পেমেন্ট বাকি",
  paid: "পেমেন্ট সম্পন্ন",
  failed: "পেমেন্ট ব্যর্থ",
};

export default function OrderCard({ order }: { order: Order }) {
  const downloadBookMutation = useDownloadBook();
  const downloadInvoiceMutation = useDownloadInvoice();

  const digitalItems = order.items.filter(
    (item) => item.bookType === "Digital",
  );

  const handleDownloadBook = (bookId: string, title: string) => {
    downloadBookMutation.mutate(
      { bookId, title },
      {
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ?? "ডাউনলোড করা যায়নি",
            );
          } else {
            toast.error("ডাউনলোড করা যায়নি");
          }
        },
      },
    );
  };

  const handleDownloadInvoice = () => {
    if (!order.invoiceNumber) return;

    downloadInvoiceMutation.mutate(
      { orderId: order._id, invoiceNumber: order.invoiceNumber },
      {
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ?? "ইনভয়েস ডাউনলোড করা যায়নি",
            );
          } else {
            toast.error("ইনভয়েস ডাউনলোড করা যায়নি");
          }
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 animate-in fade-in slide-in-from-bottom-1 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-soft pb-4">
        <div>
          <p className="text-xs text-muted-ink">অর্ডার নম্বর</p>
          <p className="text-sm font-bold text-ink">{order._id}</p>
          <p className="mt-0.5 text-xs text-subtle">
            {new Date(order.createdAt).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.orderStatus]}`}
          >
            {STATUS_LABELS[order.orderStatus]}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${PAYMENT_STATUS_STYLES[order.paymentStatus]}`}
          >
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {order.items.map((item) => (
          <div
            key={item.book._id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2">
              {item.bookType === "Digital" ? (
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-brand" />
              ) : (
                <Package className="h-3.5 w-3.5 shrink-0 text-muted-ink" />
              )}
              <span className="truncate font-medium text-ink">
                {item.book.title}
              </span>
              <span className="shrink-0 text-xs text-subtle">
                x{item.quantity}
              </span>
            </div>
            <span className="shrink-0 font-semibold text-ink">
              ৳ {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-soft pt-4">
        <span className="text-sm font-bold text-ink">সর্বমোট</span>
        <span className="text-base font-extrabold text-ink">
          ৳ {order.finalAmount.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.paymentStatus === "paid" &&
          digitalItems.map((item) => {
            const isDownloading =
              downloadBookMutation.isPending &&
              downloadBookMutation.variables?.bookId === item.book._id;

            return (
              <button
                key={item.book._id}
                onClick={() =>
                  handleDownloadBook(item.book._id, item.book.title)
                }
                disabled={isDownloading}
                className="flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isDownloading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {item.book.title}
              </button>
            );
          })}

        {order.paymentStatus === "paid" && order.invoiceNumber && (
          <button
            onClick={handleDownloadInvoice}
            disabled={downloadInvoiceMutation.isPending}
            className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-bold text-ink transition-colors hover:border-brand disabled:opacity-60"
          >
            {downloadInvoiceMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            ইনভয়েস
          </button>
        )}

        <Link
          href={`/orders/${order._id}`}
          className="ml-auto flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-muted-ink hover:text-brand"
        >
          বিস্তারিত দেখুন
        </Link>
      </div>
    </div>
  );
}