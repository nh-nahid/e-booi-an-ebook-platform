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
  pending: "bg-[#FFF7E6] text-[#B7791F]",
  processing: "bg-[#E6F7F6] text-[#2DBDB6]",
  shipped: "bg-[#E9F0FF] text-[#3B5BDB]",
  delivered: "bg-[#E6F9EC] text-[#2F9E44]",
  cancelled: "bg-[#FDEDEC] text-red-600",
};

const STATUS_LABELS: Record<Order["orderStatus"], string> = {
  pending: "পেন্ডিং",
  processing: "প্রসেসিং",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
};

const PAYMENT_STATUS_STYLES: Record<Order["paymentStatus"], string> = {
  pending: "bg-[#FFF7E6] text-[#B7791F]",
  paid: "bg-[#E6F9EC] text-[#2F9E44]",
  failed: "bg-[#FDEDEC] text-red-600",
};

const PAYMENT_STATUS_LABELS: Record<Order["paymentStatus"], string> = {
  pending: "পেমেন্ট বাকি",
  paid: "পেমেন্ট সম্পন্ন",
  failed: "পেমেন্ট ব্যর্থ",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  sslcommerz: "অনলাইন পেমেন্ট (SSLCommerz)",
  stripe: "কার্ড পেমেন্ট (Stripe)",
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
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center gap-4 px-5 py-16 text-center">
          <p className="text-lg font-bold text-[#0A0E2A]">
            অর্ডারটি খুঁজে পাওয়া যায়নি।
          </p>
          <Link
            href="/orders"
            className="rounded-full bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white"
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
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <Link
          href="/orders"
          className="mb-2 flex w-fit items-center gap-1 text-xs font-semibold text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          অর্ডার তালিকায় ফিরে যান
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
              অর্ডার বিস্তারিত
            </h1>
            <p className="mt-1 text-xs text-[#6B7280]">
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
            <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#0A0E2A]">
                পণ্যসমূহ
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.book._id}
                    className="flex items-center gap-3 border-b border-[#F1F3F5] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
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
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#2DBDB6]" />
                        ) : (
                          <Package className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
                        )}
                        <p className="truncate text-sm font-semibold text-[#0A0E2A]">
                          {item.book.title}
                        </p>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {item.book.author}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9AA3AF]">
                        পরিমাণ: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-[#0A0E2A]">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {order.paymentStatus === "paid" && digitalItems.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F1F3F5] pt-4">
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
                        className="flex items-center gap-1.5 rounded-full bg-[#2DBDB6] px-3.5 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
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
              <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2DBDB6]" />
                  <h2 className="text-sm font-bold text-[#0A0E2A]">
                    শিপিং ঠিকানা
                  </h2>
                </div>

                <div className="space-y-1 text-sm text-[#0A0E2A]">
                  <p className="font-semibold">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-[#6B7280]">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-[#6B7280]">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                    {order.shippingAddress.postalCode &&
                      ` - ${order.shippingAddress.postalCode}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="sticky top-24 rounded-2xl border border-[#E1E5E8] bg-white p-5">
              <h2 className="text-sm font-bold text-[#0A0E2A]">মোট বিল</h2>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">সাবটোটাল</span>
                  <span className="font-semibold text-[#0A0E2A]">
                    ৳ {order.totalAmount.toLocaleString()}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">ছাড়</span>
                    <span className="font-semibold text-emerald-600">
                      - ৳ {order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">পেমেন্ট পদ্ধতি</span>
                  <span className="font-semibold text-[#0A0E2A]">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F1F3F5] pt-4">
                <span className="text-sm font-bold text-[#0A0E2A]">
                  সর্বমোট
                </span>
                <span className="text-xl font-extrabold text-[#0A0E2A]">
                  ৳ {order.finalAmount.toLocaleString()}
                </span>
              </div>

              {order.paymentStatus === "paid" && order.invoiceNumber && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloadInvoiceMutation.isPending}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E1E5E8] text-sm font-bold text-[#0A0E2A] transition-colors hover:border-[#2DBDB6] disabled:opacity-60"
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