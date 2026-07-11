"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Flame, Clock, Star } from "lucide-react";

import type { Book } from "../types/home.types";

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({
  book,
  index = 0,
}: BookCardProps) {
  const [liked, setLiked] = useState(false);

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(
    "/api/v1",
    ""
  )}/uploads/books/${book.coverImage}`;

  return (
    <Link
      href={`/books/${book._id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      className="
        group block w-[120px] shrink-0 animate-in fade-in slide-in-from-bottom-2
        duration-500 fill-mode-both sm:w-[140px]
      "
    >
      <div
        className="
          relative aspect-[3/4.1] overflow-hidden rounded-xl border border-[#E1E5E8]
          bg-white shadow-[0_4px_10px_rgba(10,14,42,0.06)]
          transition-all duration-300
          group-hover:-translate-y-1.5
          group-hover:shadow-[0_14px_28px_rgba(10,14,42,0.14)]
        "
      >
        <img
          src={imageUrl}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {book.isPreOrder && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#0A0E2A] px-2 py-1 text-[9px] font-bold text-white">
            <Clock className="h-2.5 w-2.5" />
            Pre Order
          </span>
        )}

        {!book.isPreOrder && book.isFeatured && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#2DBDB6] px-2 py-1 text-[9px] font-bold text-white">
            <Flame className="h-2.5 w-2.5" />
            Featured
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked((prev) => !prev);
          }}
          className="
            absolute right-2 top-2 flex h-7 w-7 items-center justify-center
            rounded-full bg-white/90 shadow-sm backdrop-blur
            opacity-0 transition-all duration-200 group-hover:opacity-100
          "
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              liked ? "fill-red-500 text-red-500" : "text-[#0A0E2A]"
            }`}
          />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-2 text-sm font-bold text-[#0A0E2A]">
          {book.title}
        </h3>

        <p className="truncate text-xs text-[#6B7280]">
          {book.author}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#2DBDB6]">
            ৳ {book.price}
          </span>

          <span className="flex items-center gap-1 text-xs text-[#6B7280]">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {book.averageRating.toFixed(1)}
            <span>({book.reviewCount})</span>
          </span>
        </div>

        <span className="inline-block rounded-full bg-[#F3F4F6] px-2 py-1 text-[10px] font-medium text-[#6B7280]">
          {book.bookType}
        </span>
      </div>
    </Link>
  );
}