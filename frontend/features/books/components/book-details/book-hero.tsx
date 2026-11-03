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
  Download,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useAddToCart, useCart } from "@/features/cart/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLibrary } from "@/features/library/hooks/use-library";
import { useDownloadBook } from "@/features/orders/hooks/use-orders";
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
  sold: number;
  views: number;
  isPreOrder: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
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

  const { user } = useAuth();
  const { data: cartItems } = useCart();
  const addToCartMutation = useAddToCart();

  const { data: libraryBooks } = useLibrary({ enabled: !!user });
  const downloadMutation = useDownloadBook();
  const isPurchased =
    libraryBooks?.some((libBook) => libBook._id === book.id) ?? false;

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

  const handleDownload = () => {
    downloadMutation.mutate(
      { bookId: book.id, title: book.title },
      {
        onError: () => toast.error("ডাউনলোড করা যায়নি"),
      },
    );
  };

  const handleRead = () => {
    router.push(`/read/${book.id}`);
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
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-line bg-gradient-to-br from-[#1b2947] to-navy shadow-[0_10px_24px_rgba(10,14,42,0.14)]">
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

            
          </div>

          {canPreview && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="group mt-auto flex w-full items-center justify-center gap-1 rounded border  bg-transparent px-1.5 py-1.5 text-center text-[9px] font-bold leading-tight text-[#293b3bd4] transition-all duration-200 hover:bg-brand-soft active:scale-[0.98] sm:mt-0 sm:gap-1.5 sm:px-2 sm:py-2 sm:text-[11px]"
            >
              <Eye className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span>কিছু অংশ পড়ে দেখুন</span>
            </button>
          )}
        </div>

        {/* info column */}
        <div className="flex h-full min-w-0 flex-col">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-extrabold leading-snug text-ink sm:text-2xl">
              {book.title}
            </h1>
            <button
              type="button"
              onClick={handleShare}
              className="mt-1 shrink-0 text-muted-ink transition-colors hover:text-brand"
              aria-label="Share"
            >
              <Share2 className="h-[18px] w-[18px]" />
            </button>
          </div>

          <p className=" text-sm text-muted-ink">{book.author}</p>

          <span className=" inline-block rounded py-0.5 max-w-[150px]  bg-[#2dbdb63c] text-xs font-bold text-[#0a0e2a93]">
            {book.category}
          </span>

          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(book.averageRating)
                      ? "fill-brand text-brand"
                      : "fill-line text-line"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-ink">
              {bn(book.averageRating.toFixed(1))}
            </span>
            <span className="text-xs text-subtle">({bn(book.reviewCount)} রিভিউ)</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-ink">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {bn(book.views)} ভিউ
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> {bn(book.sold)} সোল্ড
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-extrabold text-ink sm:text-3xl">
              ৳{bn(book.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-subtle line-through">
                  ৳{bn(book.originalPrice!)}
                </span>
                <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-bold text-danger-ink">
                  {bn(discountPct)}% ছাড়
                </span>
              </>
            )}
          </div>

          {isPurchased ? (
            <span className="mt-auto flex w-full max-w-[150px] items-center justify-center gap-1 rounded border border-success-ink/30 bg-success-soft px-1.5 py-1.5 text-[9px] font-bold leading-tight text-success-ink sm:mt-3 sm:px-2 sm:py-2 sm:text-[11px]">
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> কেনা হয়েছে
            </span>
          ) : (
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={adding}
              className="mt-auto w-full max-w-[130px] rounded border border bg-transparent px-1.5 py-1.5 text-[9px] font-bold leading-tight text-[#293b3bd4] transition-all duration-200 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:max-w-[150px] sm:px-2 sm:py-2 sm:text-[11px]"
            >
              {isPreOrder ? "প্রি-অর্ডার করুন" : "এখনই কিনুন"}
            </button>
          )}
        </div>
      </div>

      {/* action bar — download/read/share once purchased, otherwise the
          usual wishlist/cart/preview/contact bar */}
      {isPurchased ? (
        <div className="mt-8 grid grid-cols-4 overflow-hidden rounded border border-line">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="flex flex-col items-center justify-center gap-0.5 border-r border-line bg-surface py-1 text-muted-ink transition-colors hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloadMutation.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Download className="h-6 w-6" />
            )}
            <span className="text-[10px] font-bold">ডাউনলোড</span>
          </button>

          <button
            type="button"
            onClick={handleRead}
            className="flex flex-col items-center justify-center gap-0.5 border-r border-line bg-brand py-1 text-white transition-colors hover:bg-brand-strong"
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-[10px] font-bold">পড়ুন</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsappContact}
            className="relative flex flex-col items-center justify-center gap-0.5 border-r border-line bg-surface py-1 text-[#25D366] transition-colors hover:bg-success-soft"
          >
            <FaWhatsapp className="h-6 w-6" />
            <span className="text-[10px] font-bold text-ink">যোগাযোগ</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-0.5 bg-surface py-1 text-muted-ink transition-colors hover:bg-brand-soft hover:text-brand"
          >
            <Share2 className="h-6 w-6" />
            <span className="text-[10px] font-bold">শেয়ার</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-4 overflow-hidden rounded border border-line">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={`flex items-center justify-center border-r border-line py-2.5 transition-colors ${
              liked ? "bg-danger-soft text-danger-ink" : "bg-surface text-muted-ink hover:bg-danger-soft hover:text-danger-ink"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`h-6 w-6 ${liked ? "fill-red-500" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleCartClick}
            disabled={adding}
            className={`flex items-center justify-center border-r border-line py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "bg-brand-soft text-brand" : "bg-surface text-muted-ink hover:bg-brand-soft hover:text-brand"
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
            className="flex flex-col items-center justify-center gap-0.5 border-r border-line bg-brand py-1 text-white transition-colors hover:bg-brand-strong"
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-[10px] font-bold">Read</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsappContact}
            className="relative flex flex-col items-center justify-center gap-0.5 bg-surface py-1 text-[#25D366] transition-colors hover:bg-success-soft"
          >
            <FaWhatsapp className="h-6 w-6" />
            <span className="text-[10px] font-bold text-ink">যোগাযোগ</span>
          </button>
        </div>
      )}

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
