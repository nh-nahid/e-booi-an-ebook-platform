"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, Loader2 } from "lucide-react";
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

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <h1 className="mb-6 text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
          আমার লাইব্রেরি
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
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                  className="group rounded-2xl border border-[#E1E5E8] bg-white p-3 transition-shadow hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)]"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-2.5 truncate text-sm font-bold text-[#0A0E2A]">
                    {book.title}
                  </p>
                  <p className="truncate text-xs text-[#6B7280]">
                    {book.author}
                  </p>

                  <button
                    onClick={() => handleDownload(book._id, book.title)}
                    disabled={isDownloading}
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#2DBDB6] text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
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
        )}
      </div>

      <SiteFooter />
    </div>
  );
}