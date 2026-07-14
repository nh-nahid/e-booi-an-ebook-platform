"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Download, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import { useOrder, useDownloadBook } from "@/features/orders/hooks/use-orders";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const { data: order, isLoading, isError } = useOrder(orderId);
  const downloadMutation = useDownloadBook();

  const handleDownload = (bookId: string, title: string) => {
    downloadMutation.mutate(
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

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center gap-4 px-5 py-16 text-center">
          <p className="text-lg font-bold text-[#0A0E2A]">
            অর্ডার তথ্য পাওয়া যায়নি।
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="rounded-full bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white"
          >
            আমার অর্ডার দেখুন
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center gap-4 px-5 py-16 text-center">
          <p className="text-lg font-bold text-[#0A0E2A]">
            অর্ডারটি খুঁজে পাওয়া যায়নি।
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="rounded-full bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white"
          >
            আমার অর্ডার দেখুন
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const digitalItems = order.items.filter(
    (item) => item.bookType === "Digital",
  );
  const physicalItems = order.items.filter(
    (item) => item.bookType === "Physical",
  );

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-5 py-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F7F6]">
            <CheckCircle2 className="h-8 w-8 text-[#2DBDB6]" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-[#0A0E2A]">
            পেমেন্ট সফল হয়েছে
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            অর্ডার নম্বর: {order._id}
          </p>
        </div>

        
          

            <div className="space-y-3">
              {digitalItems.length > 0 && (
  <div className="mt-8 rounded-2xl border border-[#E1E5E8] bg-white p-5">
    <h2 className="mb-4 text-sm font-bold text-[#0A0E2A]">
      আপনার eBook গুলো
    </h2>

    <div className="space-y-3">
      {digitalItems.map((item) => {
        const isDownloading =
          downloadMutation.isPending &&
          downloadMutation.variables?.bookId === item.book._id;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
          "/api/v1",
          "",
        );

        const coverUrl = !item.book.coverImage
          ? "/placeholder-book.png"
          : item.book.coverImage.startsWith("http")
            ? item.book.coverImage
            : `${baseUrl}/uploads/books/${item.book.coverImage}`;

        return (
          <div
            key={item.book._id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E1E5E8] p-3.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
                <img
                  src={coverUrl}
                  alt={item.book.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0A0E2A]">
                  {item.book.title}
                </p>
                <p className="text-xs text-[#6B7280]">{item.book.author}</p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(item.book._id, item.book.title)}
              disabled={isDownloading}
              className="flex shrink-0 items-center cursor-pointer gap-1.5 rounded-full bg-[#2DBDB6] px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              ডাউনলোড
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}
            </div>
          
        

        {physicalItems.length > 0 && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[#E6F7F6] p-4 text-sm text-[#0A0E2A]">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#2DBDB6]" />
            আপনার ফিজিক্যাল বইগুলো শীঘ্রই পাঠানো হবে। অর্ডার স্ট্যাটাস আপনার
            অর্ডার পেজ থেকে দেখতে পারবেন।
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="rounded-full border cursor-pointer border-[#E1E5E8] px-5 py-2.5 text-sm font-bold text-[#0A0E2A] hover:border-[#2DBDB6]"
          >
            আমার অর্ডার দেখুন
          </button>
          <button
            onClick={() => router.push("/books")}
            className="rounded-full cursor-pointer bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white"
          >
            শপিং চালিয়ে যান
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}