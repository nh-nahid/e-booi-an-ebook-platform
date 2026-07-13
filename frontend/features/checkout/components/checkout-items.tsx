"use client";

import Image from "next/image";
import { Download, Truck } from "lucide-react";
import { CheckoutItem } from "../types/checkout.types";

interface CheckoutItemsProps {
  items: CheckoutItem[];
}

export default function CheckoutItems({ items }: CheckoutItemsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 rounded-2xl border border-[#E1E5E8] bg-white p-3"
        >
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1F3F5]">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <p className="truncate text-sm font-bold text-[#0A0E2A]">
                {item.title}
              </p>
              <p className="text-xs text-[#6B7280]">{item.author}</p>

              <span
                className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  item.format === "digital"
                    ? "bg-[#E6F7F6] text-[#1f9d97]"
                    : "bg-[#FFF4E5] text-[#B45309]"
                }`}
              >
                {item.format === "digital" ? (
                  <Download className="h-2.5 w-2.5" />
                ) : (
                  <Truck className="h-2.5 w-2.5" />
                )}
                {item.format === "digital" ? "Digital" : "Physical"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280]">
                Qty: {item.quantity}
              </span>
              <span className="text-sm font-extrabold text-[#0A0E2A]">
                ৳{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}