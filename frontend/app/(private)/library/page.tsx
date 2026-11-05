"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Download, Loader2, RotateCcw, Search, Share2, Trash2 } from "lucide-react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import { useAuth } from "@/hooks/use-auth";
import { useLibrary, useSetLibraryHidden } from "@/features/library/hooks/use-library";
import { useDownloadBook } from "@/features/orders/hooks/use-orders";

export default function LibraryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: books = [], isLoading } = useLibrary();
  const downloadMutation = useDownloadBook();
  const hideMutation = useSetLibraryHidden();
  const [search, setSearch] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const hiddenCount = books.filter((b) => b.isHidden).length;
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter(
      (b) =>
        !!b.isHidden === showHidden &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
  }, [books, search, showHidden]);

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

  const handleHide = (bookId: string, title: string, hide: boolean) => {
    if (hide && !window.confirm(`"${title}" আপনার লাইব্রেরি থেকে সরাবেন? পরে "সরানো বই" থেকে ফিরিয়ে আনতে পারবেন।`)) {
      return;
    }
    hideMutation.mutate(
      { bookId, hide },
      {
        onSuccess: () => toast.success(hide ? "লাইব্রেরি থেকে সরানো হয়েছে" : "লাইব্রেরিতে ফিরিয়ে আনা হয়েছে"),
        onError: () => toast.error("সম্পন্ন করা যায়নি"),
      },
    );
  };

  const handleRead = (bookId: string) => {
    router.push(`/read/${bookId}`);
  };

  const handleShare = async (bookId: string, title: string) => {
    if (typeof window === "undefined") return;

    const url = `${window.location.origin}/books/${bookId}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("লিংক কপি হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container mx-auto px-5 py-3 sm:px-10 sm:py-8 lg:px-[60px]">
        <h1 className="mb-2 text-lg font-extrabold text-ink sm:mb-6 sm:text-3xl">
          আমার বইসমূহ
        </h1>

        {books.length > 0 && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="লাইব্রেরিতে বই বা লেখক খুঁজুন"
                className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand"
              />
            </div>
            {(hiddenCount > 0 || showHidden) && (
              <button
                onClick={() => setShowHidden((v) => !v)}
                className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-muted-ink hover:text-ink"
              >
                {showHidden ? "← আমার বইসমূহ" : `সরানো বই (${hiddenCount})`}
              </button>
            )}
          </div>
        )}

        {books.length > 0 && shown.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface py-12 text-center text-sm text-muted-ink">
            {showHidden ? "সরানো কোনো বই নেই" : "কোনো বই পাওয়া যায়নি"}
          </p>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas">
              <BookOpen className="h-6 w-6 text-subtle" />
            </span>
            <p className="text-sm font-bold text-ink">
              আপনার লাইব্রেরিতে কোনো eBook নেই
            </p>
            <p className="text-xs text-muted-ink">
              eBook কিনুন এবং সাথে সাথে পড়া শুরু করুন
            </p>
            <Link
              href="/books"
              className="mt-1 flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              বই কিনুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {shown.map((book) => {
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
                  className="group rounded border border-line bg-surface p-1.5 transition-shadow hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)] sm:p-3"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded border border-line bg-gradient-to-br from-soft to-line">
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-1 truncate text-xs font-bold text-ink sm:mt-2.5 sm:text-sm">
                    {book.title}
                  </p>
                  <p className="truncate text-[10px] text-muted-ink sm:text-xs">
                    {book.author}
                  </p>

                  <div className="mt-1.5 flex h-7 w-full items-stretch overflow-hidden rounded border border-line sm:mt-3 sm:h-9">
                    <button
                      onClick={() => handleDownload(book._id, book.title)}
                      disabled={isDownloading}
                      aria-label="ডাউনলোড"
                      className="flex flex-1 items-center justify-center border-r border-line bg-surface text-muted-ink transition-colors hover:bg-brand-soft hover:text-brand disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5" />
                      ) : (
                        <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRead(book._id)}
                      aria-label="পড়ুন"
                      className="flex flex-1 items-center justify-center border-r border-line bg-brand text-white transition-colors hover:bg-brand-strong"
                    >
                      <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>

                    <button
                      onClick={() => handleShare(book._id, book.title)}
                      aria-label="শেয়ার করুন"
                      className="flex flex-1 items-center justify-center border-r border-line bg-surface text-muted-ink transition-colors hover:bg-brand-soft hover:text-brand"
                    >
                      <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>

                    <button
                      onClick={() => handleHide(book._id, book.title, !book.isHidden)}
                      disabled={hideMutation.isPending}
                      aria-label={book.isHidden ? "ফিরিয়ে আনুন" : "লাইব্রেরি থেকে সরান"}
                      className="flex flex-1 items-center justify-center bg-surface text-muted-ink transition-colors hover:bg-danger-soft hover:text-danger-ink disabled:opacity-60"
                    >
                      {book.isHidden ? (
                        <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      )}
                    </button>
                  </div>
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