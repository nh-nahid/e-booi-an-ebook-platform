"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  FileText,
  Loader2,
  Package,
  BookOpen,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import { useAuth } from "@/hooks/use-auth";
import {
  useOrder,
  useDownloadBook,
  useDownloadInvoice,
} from "@/features/orders/hooks/use-orders";
import type { Order } from "@/features/orders/types/orders.types";

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

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  sslcommerz: "অনলাইন পেমেন্ট",
  stripe: "কার্ড পেমেন্ট (Stripe)",
  eps: "অনলাইন পেমেন্ট (EPS)",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { user, isLoading: authLoading } = useAuth();
  const { data: order, isLoading, isError } = useOrder(orderId);

  const downloadBookMutation = useDownloadBook();
  const downloadInvoiceMutation = useDownloadInvoice();

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

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center gap-4 px-5 py-16 text-center">
          <p className="text-lg font-bold text-ink">
            অর্ডারটি খুঁজে পাওয়া যায়নি।
          </p>
          <Link
            href="/orders"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
          >
            আমার অর্ডার দেখুন
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

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
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <Link
          href="/orders"
          className="mb-2 flex w-fit items-center gap-1 text-xs font-semibold text-muted-ink transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          অর্ডার তালিকায় ফিরে যান
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
              অর্ডার বিস্তারিত
            </h1>
            <p className="mt-1 text-xs text-muted-ink">
              অর্ডার নম্বর: {order._id}
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

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="mb-4 text-sm font-bold text-ink">
                পণ্যসমূহ
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.book._id}
                    className="flex items-center gap-3 border-b border-soft pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-gradient-to-br from-soft to-line">
                      {item.book.coverImage && (
                        <img
                          src={
                            item.book.coverImage.startsWith("http")
                              ? item.book.coverImage
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/uploads/books/${item.book.coverImage}`
                          }
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {item.bookType === "Digital" ? (
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-brand" />
                        ) : (
                          <Package className="h-3.5 w-3.5 shrink-0 text-muted-ink" />
                        )}
                        <p className="truncate text-sm font-semibold text-ink">
                          {item.book.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-ink">
                        {item.book.author}
                      </p>
                      <p className="mt-0.5 text-xs text-subtle">
                        পরিমাণ: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-ink">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {order.paymentStatus === "paid" && digitalItems.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-soft pt-4">
                  {digitalItems.map((item) => {
                    const isDownloading =
                      downloadBookMutation.isPending &&
                      downloadBookMutation.variables?.bookId ===
                        item.book._id;

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
                </div>
              )}
            </div>

            {order.shippingAddress && (
              <div className="rounded-2xl border border-line bg-surface p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" />
                  <h2 className="text-sm font-bold text-ink">
                    শিপিং ঠিকানা
                  </h2>
                </div>

                <div className="space-y-1 text-sm text-ink">
                  <p className="font-semibold">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-muted-ink">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-muted-ink">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                    {order.shippingAddress.postalCode &&
                      ` - ${order.shippingAddress.postalCode}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-5">
              <h2 className="text-sm font-bold text-ink">মোট বিল</h2>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-ink">সাবটোটাল</span>
                  <span className="font-semibold text-ink">
                    ৳ {order.totalAmount.toLocaleString()}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-ink">ছাড়</span>
                    <span className="font-semibold text-success-ink">
                      - ৳ {order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-ink">পেমেন্ট পদ্ধতি</span>
                  <span className="font-semibold text-ink">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-soft pt-4">
                <span className="text-sm font-bold text-ink">
                  সর্বমোট
                </span>
                <span className="text-xl font-extrabold text-ink">
                  ৳ {order.finalAmount.toLocaleString()}
                </span>
              </div>

              {order.paymentStatus === "paid" && order.invoiceNumber && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloadInvoiceMutation.isPending}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-sm font-bold text-ink transition-colors hover:border-brand disabled:opacity-60"
                >
                  {downloadInvoiceMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  ইনভয়েস ডাউনলোড করুন
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}