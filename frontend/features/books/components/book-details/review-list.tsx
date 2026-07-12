"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Review } from "@/features/reviews/types/review.type";


interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
}

function getAvatarUrl(avatar?: string) {
  if (!avatar) return null;

  return `${process.env.NEXT_PUBLIC_API_URL?.replace(
    "/api/v1",
    "",
  )}/uploads/avatars/${avatar}`;
}

export default function ReviewList({
  reviews,
  averageRating,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[#6B7280]">
        এখনও কোনো রিভিউ নেই।
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {typeof averageRating === "number" && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#F7F9FA] p-4">
          <span className="text-3xl font-extrabold text-[#0A0E2A]">
            {averageRating.toFixed(1)}
          </span>

          <div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(averageRating)
                      ? "fill-[#2DBDB6] text-[#2DBDB6]"
                      : "fill-[#E1E5E8] text-[#E1E5E8]"
                  }`}
                />
              ))}
            </div>

            <p className="mt-0.5 text-xs text-[#9AA3AF]">
              {reviews.length} জন রিভিউ দিয়েছেন
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
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
              style={{
                animationDelay: `${index * 0.06}s`,
              }}
              className="animate-in fade-in slide-in-from-bottom-1 border-b border-[#F1F3F5] pb-4 duration-500 fill-mode-both last:border-0"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0A0E2A] text-xs font-bold text-white">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={review.user.name}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#0A0E2A]">
                      {review.user.name}
                    </p>

                    <span className="text-xs text-[#9AA3AF]">
                      {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "fill-[#2DBDB6] text-[#2DBDB6]"
                            : "fill-[#E1E5E8] text-[#E1E5E8]"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}