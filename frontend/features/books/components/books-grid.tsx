"use client";

import { SearchX, ShoppingCart } from "lucide-react";

import BookCard from "@/features/home/components/book-card";
import type { Book } from "../types/book.types";
import Image from "next/image";

interface BooksGridProps {
  books: Book[];
  view?: "grid" | "list";
  loading?: boolean;
}

function BookCardSkeleton() {
  const shimmer =
    "relative overflow-hidden rounded-xl bg-[#EEF1F2] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

  return (
    <div>
      <div className={`aspect-[3/4.1] w-full ${shimmer}`} />
      <div className={`mt-2 h-3 w-4/5 rounded-full ${shimmer}`} />
      <div className={`mt-1.5 h-3 w-1/2 rounded-full ${shimmer}`} />
    </div>
  );
}

export default function BooksGrid({
  books,
  view = "grid",
  loading = false,
}: BooksGridProps) {
  function getBookImageUrl(image?: string) {
    if (!image) {
      console.log("No image provided");
      return "/placeholder-book.png";
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL?.replace(
      "/api/v1",
      "",
    )}/uploads/books/${image}`;

    return url;
  }

  return (
    <div>
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E1E5E8] py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F9FA]">
            <SearchX className="h-6 w-6 text-[#9AA3AF]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#0A0E2A]">
            No books found
          </p>

          <p className="mt-1 max-w-xs text-xs text-[#6B7280]">
            Try adjusting your filters.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book, index) => (
            <div key={book._id} className="mx-auto w-full max-w-[160px]">
              <BookCard book={book} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((book, index) => (
            <div
              key={book._id}
              style={{
                animationDelay: `${Math.min(index, 8) * 0.05}s`,
              }}
              className="flex animate-in fade-in slide-in-from-bottom-1 items-center gap-4 rounded-2xl border border-[#E1E5E8] bg-white p-3 duration-500 fill-mode-both transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(10,14,42,0.06)]"
            >
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E1E5E8]">
                <Image
                  src={getBookImageUrl(book.coverImage)}
                  alt={book.title}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-[#0A0E2A]">
                  {book.title}
                </h3>

                <p className="mt-1 text-xs text-[#6B7280]">{book.author}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2DBDB6]">
                      ৳ {book.price}
                    </p>

                    <p className="text-xs text-[#6B7280]">{book.bookType}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                    }}
                    className="
    flex items-center gap-2 rounded-full
    bg-[#2DBDB6] px-4 py-2
    text-xs font-semibold text-white
    transition-colors hover:bg-[#1f9d97]
  "
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>কার্টে যোগ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
