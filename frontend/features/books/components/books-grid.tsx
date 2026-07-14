"use client";

import { useRouter } from "next/navigation";
import { SearchX, ShoppingCart, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import BookCard from "@/features/home/components/book-card";
import type { Book } from "../types/book.types";
import Image from "next/image";

import { useAddToCart, useCart } from "@/features/cart/hooks/use-cart"; // adjust path if different

interface BooksGridProps {
  books: Book[];
  view?: "grid" | "list";
  loading?: boolean;
}

interface ApiError {
  message: string;
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
  const router = useRouter();
  const { data: cartItems } = useCart();
  const addToCartMutation = useAddToCart();

  function getBookImageUrl(image?: string) {
    if (!image) {
      return "/placeholder-book.png";
    }

    return `${process.env.NEXT_PUBLIC_API_URL?.replace(
      "/api/v1",
      "",
    )}/uploads/books/${image}`;
  }

  const isInCart = (bookId: string) =>
    cartItems?.some((item) =>
      typeof item.book === "string" ? item.book === bookId : item.book?._id === bookId,
    ) ?? false;

  const handleAddToCart = async (bookId: string) => {
    if (isInCart(bookId)) {
      
      router.push("/cart");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ bookId, quantity: 1 });
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
    }
  };

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
          {books.map((book, index) => {
            const inCart = isInCart(book._id);
            const isAdding =
              addToCartMutation.isPending &&
              addToCartMutation.variables?.bookId === book._id;

            return (
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
                      disabled={isAdding}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(book._id);
                      }}
                      className="
    flex items-center gap-2 rounded-full
    bg-[#2DBDB6] px-4 py-2
    text-xs font-semibold text-white
    transition-colors hover:bg-[#1f9d97] disabled:opacity-60
  "
                    >
                      {isAdding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : inCart ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      <span>{inCart ? "কার্টে আছে" : "কার্টে যোগ করুন"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}