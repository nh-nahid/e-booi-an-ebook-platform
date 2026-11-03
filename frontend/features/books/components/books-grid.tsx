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
    "relative overflow-hidden rounded-lg bg-soft before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

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

    if (image.startsWith("http")) {
      return image;
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas">
            <SearchX className="h-6 w-6 text-subtle" />
          </div>

          <p className="mt-4 text-sm font-semibold text-ink">
            No books found
          </p>

          <p className="mt-1 max-w-xs text-xs text-muted-ink">
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
                className="flex animate-in fade-in slide-in-from-bottom-1 items-start gap-3 rounded-lg border border-line bg-surface p-3 duration-500 fill-mode-both transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(10,14,42,0.06)] sm:items-center sm:gap-4"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                  <Image
                    src={getBookImageUrl(book.coverImage)}
                    alt={book.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-sm font-bold text-ink">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-ink">{book.author}</p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-brand">
                        ৳ {book.price}
                      </p>

                      <p className="text-xs text-muted-ink">{book.bookType}</p>
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
    flex shrink-0 items-center gap-2 rounded-full
    bg-brand px-4 py-2
    text-xs font-semibold text-white
    transition-colors hover:bg-brand-strong disabled:opacity-60
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