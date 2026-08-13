"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, BookOpen, Star, Flame, Clock } from "lucide-react";

import type { Book } from "../types/home.types";

// TODO: adjust these field names to match your real Book type exactly
// (this assumes: title, author, price, oldPrice?, coverImage?, rating?, isPreOrder?, isPopular?, slug/_id)

interface BookCardProps {
  book: Book;
  index?: number;
}

// cycling gradient palette so every card looks distinct even without a real cover image,
// same approach as the reference mockup's per-book gradients
const COVER_GRADIENTS = [
  "from-[#2b3a55] to-[#0f1b2d]",
  "from-[#1b6b6b] to-[#0d3b3b]",
  "from-[#3a6ea5] to-[#1c3a5e]",
  "from-[#c98a4b] to-[#8a5a2b]",
  "from-[#2f7d5c] to-[#12141f]",
  "from-[#6b4a8a] to-[#3a2555]",
  "from-[#a5445c] to-[#5c2030]",
  "from-[#4a3a2a] to-[#1c150e]",
];

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const gradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length];
  const oldPrice = (book as any).oldPrice as number | undefined;
  const rating = (book as any).rating as number | undefined;
  const author = (book as any).author as string | undefined;
  const coverImage = (book as any).coverImage as string | undefined;
  const isPreOrder = (book as any).isPreOrder as boolean | undefined;
  const isPopular = (book as any).isPopular as boolean | undefined;
  const slug = (book as any).slug ?? book._id;

  const discount =
    oldPrice && oldPrice > book.price ? Math.round(100 - (book.price / oldPrice) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    // TODO: call your real add-to-cart mutation
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <Link
      href={`/books/${slug}`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      className="
        group block w-[150px] shrink-0 animate-in fade-in slide-in-from-bottom-2
        duration-500 fill-mode-both sm:w-[168px]
      "
    >
      <div
        className="
          relative flex flex-col overflow-hidden rounded-2xl border border-[#E1E5E8] bg-white
          shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.05)]
          transition-all duration-300 group-hover:-translate-y-1.5
          group-hover:shadow-[0_10px_24px_rgba(10,14,42,0.12)]
        "
      >
        {/* cover */}
        <div
          className={`
            relative m-2 flex h-[180px] items-center justify-center overflow-hidden rounded-xl
            bg-gradient-to-br p-4 text-center ${gradient}
          `}
        >
          {coverImage ? (
            <img src={coverImage} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold leading-snug text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.25)]">
              {book.title}
            </span>
          )}

          {(isPopular || isPreOrder) && (
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
              setWishlisted((v) => !v);
            }}
            className="
              absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full
              bg-white/90 text-[#0A0E2A] opacity-0 shadow-sm backdrop-blur transition-all
              duration-200 group-hover:opacity-100
            "
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* body */}
        <div className="flex flex-col items-center gap-1 px-3 pb-3 pt-1 text-center">
          {typeof rating === "number" && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-[#6B7280]">{rating.toFixed(1)}</span>
            </div>
          )}

          <p className="line-clamp-1 text-[13px] font-bold text-[#0A0E2A]">{book.title}</p>
          {author && <p className="line-clamp-1 text-[11px] text-[#9AA3AF]">{author}</p>}

          <p className="mt-0.5 text-sm font-extrabold text-[#2DBDB6]">
            ৳{book.price}
            {oldPrice && oldPrice > book.price && (
              <span className="ml-1.5 text-[11px] font-medium text-[#B0B0B0] line-through">
                ৳{oldPrice}
              </span>
            )}
          </p>

          {/* grouped action bar */}
          <div className="mt-1.5 flex w-full items-stretch overflow-hidden rounded-lg border border-[#E1E5E8]">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setWishlisted((v) => !v);
              }}
              className={`
                flex flex-1 items-center justify-center border-r border-[#E1E5E8] py-1.5
                transition-colors duration-150
                ${wishlisted ? "bg-red-50 text-red-500" : "bg-white text-[#6B7280] hover:bg-red-50 hover:text-red-500"}
              `}
              aria-label="Wishlist"
            >
              <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-red-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="
                flex flex-1 items-center justify-center border-r border-[#E1E5E8] bg-white py-1.5
                text-[#6B7280] transition-colors duration-150 hover:bg-[#F0F7F5] hover:text-[#2DBDB6]
                disabled:opacity-50
              "
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>

            <span
              className="
                flex flex-1 items-center justify-center bg-[#2DBDB6] py-1.5 text-white
                transition-colors duration-150 group-hover:bg-[#1f9d97]
              "
            >
              <BookOpen className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
