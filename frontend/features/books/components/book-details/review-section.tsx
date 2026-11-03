"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Send, Star } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useAddReview } from "@/features/reviews/hooks/use-review";
import type { Review } from "@/features/reviews/types/review.type";

interface ReviewSectionProps {
  bookId: string;
  reviews: Review[];
}

interface ApiError {
  message: string;
}

function getAvatarUrl(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;

  return `${process.env.NEXT_PUBLIC_API_URL?.replace(
    "/api/v1",
    "",
  )}/uploads/avatars/${avatar}`;
}

export default function ReviewSection({ bookId, reviews }: ReviewSectionProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const addReview = useAddReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("প্রথমে লগইন করুন");
      router.push("/login");
      return;
    }

    const text = comment.trim();
    if (!text) return;

    try {
      await addReview.mutateAsync({ bookId, rating, comment: text });
      toast.success("মন্তব্য যোগ করা হয়েছে");
      setComment("");
      setRating(5);
    } catch (error: unknown) {
      if (isAxiosError<ApiError>(error)) {
        toast.error(
          error.response?.data?.message ?? "মন্তব্য যোগ করা যায়নি",
        );
        return;
      }
      toast.error("মন্তব্য যোগ করা যায়নি");
    }
  };

  return (
    <section className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:120ms]">
      <h2 className="mb-4 text-lg font-extrabold text-ink">
        রিভিউ ও মন্তব্য ({reviews.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="mb-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const active = value <= (hoverRating || rating);

            return (
              <button
                type="button"
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
                aria-label={`${value} স্টার`}
              >
                <Star
                  className={`h-4 w-4 ${
                    active
                      ? "fill-brand text-brand"
                      : "fill-line text-line"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 focus-within:border-brand">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="একটি মন্তব্য লিখুন..."
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
          />
          <button
            type="submit"
            disabled={addReview.isPending || !comment.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="মন্তব্য পাঠান"
          >
            {addReview.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </form>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-ink">এখনও কোনো রিভিউ নেই।</p>
      ) : (
        <div className="max-w-2xl space-y-5">
          {reviews.map((review, index) => {
            const avatar = getAvatarUrl(review.user.avatar);
            const initials = review.user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={review._id}
                style={{ animationDelay: `${index * 0.06}s` }}
                className="animate-in fade-in slide-in-from-bottom-1 flex items-start gap-3 border-b border-soft pb-4 duration-500 fill-mode-both last:border-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-bold text-white">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={review.user.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">
                    {review.user.name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "fill-brand text-brand"
                            : "fill-line text-line"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
