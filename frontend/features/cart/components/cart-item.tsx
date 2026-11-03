"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";

export interface CartItemData {
  id: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverUrl?: string;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  index?: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  updating?: boolean;
}

export default function CartItem({
  item,
  index = 0,
  onRemove,
}: CartItemProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  const imageUrl = !item.coverUrl
    ? "/placeholder-book.png"
    : item.coverUrl.startsWith("http")
      ? item.coverUrl
      : `${baseUrl}/uploads/books/${item.coverUrl}`;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 6) * 0.05}s` }}
      className="
        flex animate-in fade-in slide-in-from-bottom-1 gap-4 rounded
        border border-line bg-surface p-4 duration-500 fill-mode-both
        transition-all hover:shadow-[0_10px_24px_rgba(10,14,42,0.05)]
      "
    >
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded border border-line bg-gradient-to-br from-soft to-line sm:h-28 sm:w-20">
        <Image
          fill
          src={imageUrl}
          alt={item.title}
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink sm:text-base">
                {item.title}
              </p>

              <p className="mt-0.5 text-xs text-muted-ink">
                লেখক: {item.author}
              </p>

              <span className="mt-1.5 inline-block rounded bg-canvas px-2 py-0.5 text-[10px] font-semibold text-muted-ink">
                eBook
              </span>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-subtle transition-all duration-200 hover:bg-danger-soft hover:text-danger-ink"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink">
            ১ কপি
          </span>

          <div className="text-right">
            <p className="text-sm font-extrabold text-ink sm:text-base">
              ৳ {(item.price * item.quantity).toLocaleString()}
            </p>

            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-xs text-subtle line-through">
                ৳ {(item.originalPrice * item.quantity).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
