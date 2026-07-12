"use client";

import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Check,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { isAxiosError } from "axios";
export interface BookInfoData {
  id: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  isbn?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock: number;
  bookType: "physical" | "digital";
  status: "published" | "pre-order";
  description: string;
}

interface BookInfoProps {
  book: BookInfoData;
  onAddToCart?: (quantity: number) => Promise<void> | void;
  onBuyNow?: (quantity: number) => Promise<void> | void;
}
interface ApiError {
  message: string;
}

export default function BookInfo({
  book,
  onAddToCart,
  onBuyNow,
}: BookInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const isPreOrder = book.status === "pre-order";
  const discount =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(100 - (book.price / book.originalPrice) * 100)
      : 0;

  const handleAddToCart = async () => {
    setAdding(true);

    try {
      await onAddToCart?.(quantity);

      setAdded(true);

      toast.success("বইটি কার্টে যোগ করা হয়েছে");
    } catch (error: unknown) {
      if (isAxiosError<ApiError>(error)) {
        if (error.response?.status === 401) {
          toast.error("প্রথমে লগইন করুন");
          router.push("/login");
          return;
        }

        toast.error(error.response?.data?.message ?? "কার্টে যোগ করা যায়নি");

        return;
      }

      toast.error("কার্টে যোগ করা যায়নি");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-500 [animation-delay:100ms]">
      <span className="inline-block rounded-full bg-[#E6F7F6] px-3 py-1 text-xs font-bold text-[#0A0E2A]">
        {book.category}
      </span>

      <h1 className="mt-3 text-2xl font-extrabold leading-tight text-[#0A0E2A] sm:text-3xl">
        {book.title}
      </h1>
      <p className="mt-1 text-sm text-[#6B7280]">
        লেখক:{" "}
        <span className="font-semibold text-[#0A0E2A]">{book.author}</span>
      </p>

      {typeof book.rating === "number" && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(book.rating!)
                    ? "fill-[#2DBDB6] text-[#2DBDB6]"
                    : "fill-[#E1E5E8] text-[#E1E5E8]"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-[#0A0E2A]">
            {book.rating.toFixed(1)}
          </span>
          {typeof book.reviewCount === "number" && (
            <span className="text-sm text-[#9AA3AF]">
              ({book.reviewCount} রিভিউ)
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <span className="text-3xl font-extrabold text-[#0A0E2A]">
          ৳ {book.price.toLocaleString()}
        </span>
        {book.originalPrice && book.originalPrice > book.price && (
          <>
            <span className="text-lg text-[#9AA3AF] line-through">
              ৳ {book.originalPrice.toLocaleString()}
            </span>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
              {discount}% ছাড়
            </span>
          </>
        )}
      </div>

      <p
        className={`mt-2 flex items-center gap-1.5 text-sm font-semibold ${
          isPreOrder
            ? "text-[#0A0E2A]"
            : book.stock > 0
              ? "text-emerald-600"
              : "text-red-600"
        }`}
      >
        <Check className="h-4 w-4" />
        {isPreOrder
          ? "প্রি-অর্ডার উপলব্ধ"
          : book.stock > 0
            ? `স্টকে আছে (${book.stock} কপি)`
            : "স্টক নেই"}
      </p>

      {/* quantity + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-[#E1E5E8]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={adding || quantity <= 1}
            className="
      flex h-11 w-11 items-center justify-center
      text-[#0A0E2A]
      transition-colors hover:text-[#2DBDB6]
      disabled:cursor-not-allowed
      disabled:opacity-40
    "
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#0A0E2A]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
            disabled={adding || quantity >= book.stock}
            className="
      flex h-11 w-11 items-center justify-center
      text-[#0A0E2A]
      transition-colors hover:text-[#2DBDB6]
      disabled:cursor-not-allowed
      disabled:opacity-40
    "
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => {
            if (added) {
              router.push("/cart");
              return;
            }

            handleAddToCart();
          }}
          disabled={adding || (!added && book.stock === 0)}
          className="
    group relative flex h-11 flex-1 min-w-[160px] items-center justify-center gap-2
    overflow-hidden rounded-full border-0 bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
    px-6 text-sm font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]
    transition-transform duration-150 hover:-translate-y-0.5
    hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
    active:translate-y-0 active:scale-[0.98] disabled:opacity-50
  "
        >
          <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />

          <span className="relative flex items-center gap-2">
            {added ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                কার্টে যান
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {adding
                  ? "যোগ করা হচ্ছে..."
                  : isPreOrder
                    ? "প্রি-অর্ডার করুন"
                    : "কার্টে যোগ করুন"}
              </>
            )}
          </span>
        </button>

        <button
          onClick={() => setLiked((v) => !v)}
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-200
            ${liked ? "border-red-200 bg-red-50 text-red-500" : "border-[#E1E5E8] text-[#6B7280] hover:border-[#2DBDB6] hover:text-[#2DBDB6]"}
          `}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
        </button>

        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E1E5E8] text-[#6B7280] transition-all duration-200 hover:border-[#2DBDB6] hover:text-[#2DBDB6]">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => onBuyNow?.(quantity)}
        className="mt-3 h-11 w-full rounded-full border border-[#0A0E2A] text-sm font-bold text-[#0A0E2A] transition-all duration-200 hover:bg-[#0A0E2A] hover:text-white"
      >
        এখনই কিনুন
      </button>

      {/* trust badges */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-[#F7F9FA] p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#2DBDB6]" />
          <span className="text-xs font-semibold text-[#6B7280]">
            দ্রুত ডেলিভারি
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#2DBDB6]" />
          <span className="text-xs font-semibold text-[#6B7280]">
            ১০০% অরিজিনাল
          </span>
        </div>
      </div>
    </div>
  );
}
