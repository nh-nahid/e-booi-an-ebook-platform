"use client";

import { useMemo, useState } from "react";
import { Flame, Clock, ZoomIn } from "lucide-react";

interface BookGalleryProps {
  title: string;
  images: string[];
  badge?: "popular" | "pre-order" | null;
}

export default function BookGallery({
  title,
  images,
  badge,
}: BookGalleryProps) {
  const [active, setActive] = useState(0);

  const isPreOrder = badge === "pre-order";

  const imageUrls = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

    return images.map((image) => {
      if (!image) {
        return "/placeholder-book.png";
      }

      // already a full URL
      if (image.startsWith("http")) {
        return image;
      }

      return `${baseUrl}/uploads/books/${image}`;
    });
  }, [images]);

  const hasImages = imageUrls.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-left-2 duration-500">
      <div
        className="
          group relative aspect-[3/4] w-full overflow-hidden rounded-2xl
          border border-[#E1E5E8]
          bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]
          shadow-[0_10px_30px_rgba(10,14,42,0.08)]
        "
      >
        {hasImages && (
          <img
            src={imageUrls[active]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {badge && (
          <span
            className={`
              absolute left-3 top-3 flex items-center gap-1 rounded-full
              px-3 py-1.5 text-xs font-bold text-white
              ${isPreOrder ? "bg-[#0A0E2A]" : "bg-[#2DBDB6]"}
            `}
          >
            {isPreOrder ? (
              <>
                <Clock className="h-3 w-3" />
                Pre Order
              </>
            ) : (
              <>
                <Flame className="h-3 w-3" />
                Popular
              </>
            )}
          </span>
        )}

        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0A0E2A] opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {imageUrls.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {imageUrls.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all
                ${
                  active === i
                    ? "border-[#2DBDB6]"
                    : "border-[#E1E5E8] opacity-70 hover:opacity-100"
                }
              `}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}