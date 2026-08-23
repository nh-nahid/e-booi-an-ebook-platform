"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  Heart,
  ShoppingCart,
  Share2,
  Eye,
  TrendingUp,
  BookOpen,
  Check,
  Clock,
  Flame,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useAddToCart, useCart } from "@/features/cart/hooks/use-cart";
import getCoverImageUrl from "@/features/home/utils/getCoverImageUrl";
import { getBookPreviewUrl } from "@/features/books/api/book.api";
import { bn } from "@/features/books/utils/bn-number";

import BookPreviewModal from "./book-preview-modal";

export interface BookHeroData {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  bookType: "Digital" | "Physical";
  pdfFile: string | null;
  stock: number;
  sold: number;
  views: number;
  isPreOrder: boolean;
  isFeatured: boolean;
}

interface BookHeroProps {
  book: BookHeroData;
}

interface ApiError {
  message: string;
}

export default function BookHero({ book }: BookHeroProps) {
  const [liked, setLiked] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [buying, setBuying] = useState(false);

  const router = useRouter();

  const { data: cartItems } = useCart();
  const addToCartMutation = useAddToCart();

  const added =
    cartItems?.some((item) =>
      typeof item.book === "string"
        ? item.book === book.id
        : item.book?._id === book.id,
    ) ?? false;

  const isPreOrder = book.isPreOrder;
  const hasDiscount =
    typeof book.originalPrice === "number" && book.originalPrice > book.price;
  const discountPct = hasDiscount
    ? Math.round(100 - (book.price / book.originalPrice!) * 100)
    : 0;

  const canPreview = book.bookType === "Digital" && !!book.pdfFile;
  const previewUrl = canPreview ? getBookPreviewUrl(book.id) : "";

  const coverUrl = getCoverImageUrl(book.coverImage);

  const stockLabel = isPreOrder
    ? "প্রি-অর্ডার চলমান"
    : book.stock > 0
      ? `স্টকে আছে (${bn(book.stock)} কপি)`
      : "স্টক নেই";

  const stockColor = isPreOrder
    ? "text-[#0A0E2A]"
    : book.stock > 0
      ? "text-emerald-600"
      : "text-red-600";

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({ bookId: book.id, quantity: 1 });
      toast.success("বইটি কার্টে যোগ করা হয়েছে");
      return true;
    } catch (error: unknown) {
      if (isAxiosError<ApiError>(error)) {
        if (error.response?.status === 401) {
          toast.error("প্রথমে লগইন করুন");
          router.push("/login");
          return false;
        }
        toast.error(error.response?.data?.message ?? "কার্টে যোগ করা যায়নি");
        return false;
      }
      toast.error("কার্টে যোগ করা যায়নি");
      return false;
    }
  };

  const handleCartClick = () => {
    if (added) {
      router.push("/cart");
      return;
    }
    handleAddToCart();
  };

  const handleBuyNow = async () => {
    if (added) {
      router.push("/checkout");
      return;
    }

    setBuying(true);
    const ok = await handleAddToCart();
    setBuying(false);

    if (ok) {
      router.push("/checkout");
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, url });
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

  const handleWhatsappContact = () => {
    if (typeof window === "undefined") return;

    const message = `আমি "${book.title}" বইটি সম্পর্কে জানতে চাই। লিংক: ${window.location.href}`;

    window.open(
      `https://wa.me/8801791148655?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const badge = isPreOrder ? "pre-order" : book.isFeatured ? "popular" : null;

  const adding = addToCartMutation.isPending || buying;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-[128px_1fr] gap-4 sm:grid-cols-[168px_1fr] sm:gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
        {/* cover column */}
        <div className="flex h-full flex-col items-center gap-2.5">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-[#E1E5E8] bg-gradient-to-br from-[#1b2947] to-[#0A0E2A] shadow-[0_10px_24px_rgba(10,14,42,0.14)]">
            {book.coverImage ? (
              <Image
                fill
                src={coverUrl!}
                alt={book.title}
                sizes="(min-width: 1024px) 220px, 168px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-sm font-bold leading-snug text-white">
                {book.title}
              </span>
            )}

            {badge && (
              <span
                className={`absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold text-white sm:left-2 sm:top-2 sm:gap-1 sm:rounded-full sm:px-2 sm:py-1 sm:text-[10px] ${
                  badge === "pre-order" ? "bg-[#0A0E2A]" : "bg-[#2DBDB6]"
                }`}
              >
                {badge === "pre-order" ? (
                  <>
                    <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> প্রি-অর্ডার
                  </>
                ) : (
                  <>
                    <Flame className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> জনপ্রিয়
                  </>
                )}
              </span>
            )}
          </div>

          {canPreview && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="group mt-auto flex w-full items-center justify-center gap-1 rounded border border-[#2DBDB6] bg-transparent px-1.5 py-1.5 text-center text-[9px] font-bold leading-tight text-[#2DBDB6] transition-all duration-200 hover:bg-[#E6F7F6] active:scale-[0.98] sm:mt-0 sm:gap-1.5 sm:px-2 sm:py-2 sm:text-[11px]"
            >
              <Eye className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span>কিছু অংশ পড়ে দেখুন</span>
            </button>
          )}
        </div>

        {/* info column */}
        <div className="flex h-full min-w-0 flex-col">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-extrabold leading-snug text-[#0A0E2A] sm:text-2xl">
              {book.title}
            </h1>
            <button
              type="button"
              onClick={handleShare}
              className="mt-1 shrink-0 text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
              aria-label="Share"
            >
              <Share2 className="h-[18px] w-[18px]" />
            </button>
          </div>

          <p className=" text-sm text-[#6B7280]">{book.author}</p>

          <span className=" inline-block rounded-full text-xs font-bold text-[#0a0e2a93]">
            {book.category}
          </span>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {bn(book.views)} ভিউ
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> {bn(book.sold)} সোল্ড
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
              ৳{bn(book.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-[#9AA3AF] line-through">
                  ৳{bn(book.originalPrice!)}
                </span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                  {bn(discountPct)}% ছাড়
                </span>
              </>
            )}
          </div>

          <p className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${stockColor}`}>
            <Check className="h-3.5 w-3.5" />
            {stockLabel}
          </p>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={adding || (!added && !isPreOrder && book.stock === 0)}
            className="mt-auto w-full max-w-[130px] rounded border border-[#2DBDB6] bg-transparent px-1.5 py-1.5 text-[9px] font-bold leading-tight text-[#2DBDB6] transition-all duration-200 hover:bg-[#E6F7F6] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:max-w-[150px] sm:px-2 sm:py-2 sm:text-[11px]"
          >
            {isPreOrder ? "প্রি-অর্ডার করুন" : "এখনই কিনুন"}
          </button>
        </div>
      </div>

      {/* action bar */}
      <div className="mt-8 grid grid-cols-4 overflow-hidden rounded border border-[#E1E5E8]">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center justify-center border-r border-[#E1E5E8] py-2.5 transition-colors ${
            liked ? "bg-red-50 text-red-500" : "bg-white text-[#6B7280] hover:bg-red-50 hover:text-red-500"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`h-6 w-6 ${liked ? "fill-red-500" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleCartClick}
          disabled={adding || (!added && !isPreOrder && book.stock === 0)}
          className={`flex items-center justify-center border-r border-[#E1E5E8] py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            added ? "bg-[#E6F7F6] text-[#2DBDB6]" : "bg-white text-[#6B7280] hover:bg-[#F0F7F5] hover:text-[#2DBDB6]"
          }`}
          aria-label={added ? "কার্টে যান" : "কার্টে যোগ করুন"}
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : added ? (
            <Check className="h-6 w-6" />
          ) : (
            <ShoppingCart className="h-6 w-6" />
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/checkout?bookId=${book.id}`)}
          disabled={!isPreOrder && book.stock === 0}
          className="flex flex-col items-center justify-center gap-0.5 border-r border-[#E1E5E8] bg-[#2DBDB6] py-1 text-white transition-colors hover:bg-[#1f9d97] disabled:cursor-not-allowed disabled:bg-[#E1E5E8] disabled:text-[#9AA3AF]"
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-[10px] font-bold">Read</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsappContact}
          className="relative flex flex-col items-center justify-center gap-0.5 bg-white py-1 text-[#25D366] transition-colors hover:bg-[#F0FDF6]"
        >
          <FaWhatsapp className="h-6 w-6" />
          <span className="text-[10px] font-bold text-[#0A0E2A]">যোগাযোগ</span>
        </button>
      </div>

      {canPreview && (
        <BookPreviewModal
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          title={book.title}
          previewUrl={previewUrl}
          key={book.id}
        />
      )}
    </div>
  );
}
