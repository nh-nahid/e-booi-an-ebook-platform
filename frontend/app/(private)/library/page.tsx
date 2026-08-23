"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Download, Loader2 } from "lucide-react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import { useAuth } from "@/hooks/use-auth";
import { useLibrary } from "@/features/library/hooks/use-library";
import { useDownloadBook } from "@/features/orders/hooks/use-orders";

export default function LibraryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: books = [], isLoading } = useLibrary();
  const downloadMutation = useDownloadBook();

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

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="container mx-auto px-5 py-3 sm:px-10 sm:py-8 lg:px-[60px]">
        <h1 className="mb-2 text-lg font-extrabold text-[#0A0E2A] sm:mb-6 sm:text-3xl">
          আমার বইসমূহ
        </h1>

        {books.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E8] bg-white py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F9FA]">
              <BookOpen className="h-6 w-6 text-[#9AA3AF]" />
            </span>
            <p className="text-sm font-bold text-[#0A0E2A]">
              আপনার লাইব্রেরিতে কোনো eBook নেই
            </p>
            <p className="text-xs text-[#6B7280]">
              eBook কিনুন এবং সাথে সাথে পড়া শুরু করুন
            </p>
            <Link
              href="/books"
              className="mt-1 flex items-center gap-1.5 rounded-full bg-[#2DBDB6] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              বই কিনুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => {
              const isDownloading =
                downloadMutation.isPending &&
                downloadMutation.variables?.bookId === book._id;

              const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
                "/api/v1",
                "",
              );

              const coverUrl = !book.coverImage
                ? "/placeholder-book.png"
                : book.coverImage.startsWith("http")
                  ? book.coverImage
                  : `${baseUrl}/uploads/books/${book.coverImage}`;

              return (
                <div
                  key={book._id}
                  className="group rounded border border-[#E1E5E8] bg-white p-1.5 transition-shadow hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)] sm:p-3"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-1 truncate text-xs font-bold text-[#0A0E2A] sm:mt-2.5 sm:text-sm">
                    {book.title}
                  </p>
                  <p className="truncate text-[10px] text-[#6B7280] sm:text-xs">
                    {book.author}
                  </p>

                  <button
                    onClick={() => handleDownload(book._id, book.title)}
                    disabled={isDownloading}
                    className="mt-1.5 flex h-7 w-full items-center justify-center gap-1 rounded bg-[#2DBDB6] text-[10px] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:mt-3 sm:h-9 sm:gap-1.5 sm:text-xs"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5" />
                    ) : (
                      <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    )}
                    ডাউনলোড
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-2 sm:mt-10">
          <a
            href="https://www.facebook.com/profile.php?id=61579813011880"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded bg-[#1877F2] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            <FaFacebook className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            ফেসবুক
          </a>

          <a
            href="https://wa.me/8801791148655"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            <FaWhatsapp className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            হোয়াটসঅ্যাপ
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}