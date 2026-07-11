"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Flame, Clock } from "lucide-react";

export interface Book {
  id: string;
  title: string;
  price?: number;
  coverUrl?: string;
  badge?: "popular" | "pre-order" | null;
}

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const [liked, setLiked] = useState(false);
  const isPreOrder = book.badge === "pre-order";

  return (
    <Link
      href={`/books/${book.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      className="
        group block w-[120px] shrink-0 animate-in fade-in slide-in-from-bottom-2
        duration-500 fill-mode-both sm:w-[140px]
      "
    >
      <div
        className="
          relative aspect-[3/4.1] w-full overflow-hidden rounded-xl border border-[#E1E5E8]
          bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db] shadow-[0_4px_10px_rgba(10,14,42,0.06)]
          transition-all duration-300
          group-hover:-translate-y-1.5 group-hover:shadow-[0_14px_28px_rgba(10,14,42,0.14)]
        "
      >
        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {book.badge && (
          <span
            className={`
              absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[9px]
              font-bold text-white
              ${isPreOrder ? "bg-[#0A0E2A]" : "bg-[#2DBDB6]"}
            `}
          >
            {isPreOrder ? (
              <>
                <Clock className="h-2.5 w-2.5" /> শীঘ্রই
              </>
            ) : (
              <>
                <Flame className="h-2.5 w-2.5" /> জনপ্রিয়
              </>
            )}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked((v) => !v);
          }}
          className="
            absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full
            bg-white/90 text-[#0A0E2A] opacity-0 shadow-sm backdrop-blur transition-all
            duration-200 group-hover:opacity-100
          "
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>

        {/* subtle bottom gradient for readability if a real cover exists */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <p className="mt-2 truncate text-xs font-bold text-[#0A0E2A] sm:text-sm">
        {book.title}
      </p>
      <p className="text-[11px] font-semibold text-[#6B7280] sm:text-xs">
        {isPreOrder ? "প্রি-অর্ডার" : book.price ? `৳ ${book.price}` : ""}
      </p>
    </Link>
  );
}
