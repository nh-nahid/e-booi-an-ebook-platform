"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
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
  stock: number;
  bookType: "Physical" | "Digital";
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
  onQuantityChange,
  onRemove,
  updating = false,
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
        flex animate-in fade-in slide-in-from-bottom-1 gap-4 rounded-2xl
        border border-[#E1E5E8] bg-white p-4 duration-500 fill-mode-both
        transition-all hover:shadow-[0_10px_24px_rgba(10,14,42,0.05)]
      "
    >
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db] sm:h-28 sm:w-20">
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
              <p className="truncate text-sm font-bold text-[#0A0E2A] sm:text-base">
                {item.title}
              </p>

              <p className="mt-0.5 text-xs text-[#6B7280]">
                লেখক: {item.author}
              </p>

              <span className="mt-1.5 inline-block rounded-full bg-[#F7F9FA] px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]">
                {item.bookType}
              </span>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9AA3AF] transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-[#E1E5E8]">
            <button
              onClick={() =>
                onQuantityChange(item.id, Math.max(1, item.quantity - 1))
              }
              disabled={updating || item.bookType === "Digital"}
              className="flex h-9 w-9 items-center justify-center text-[#0A0E2A] transition-colors hover:text-[#2DBDB6] disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="w-7 text-center text-sm font-bold text-[#0A0E2A]">
              {item.bookType === "Digital" ? 1 : item.quantity}
            </span>

            <button
              onClick={() =>
                onQuantityChange(
                  item.id,
                  Math.min(item.stock, item.quantity + 1),
                )
              }
              disabled={updating || item.bookType === "Digital"}
              className="flex h-9 w-9 items-center justify-center text-[#0A0E2A] transition-colors hover:text-[#2DBDB6] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-extrabold text-[#0A0E2A] sm:text-base">
              ৳ {(item.price * item.quantity).toLocaleString()}
            </p>

            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-xs text-[#9AA3AF] line-through">
                ৳ {(item.originalPrice * item.quantity).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
