"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Tag } from "lucide-react";
import CheckoutItems from "./checkout-items";
import { CheckoutItem, CheckoutSummary } from "../types/checkout.types";

interface OrderSummaryProps {
  items: CheckoutItem[];
  summary: CheckoutSummary;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
  promoStatus?: "idle" | "applied" | "invalid";
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

export default function OrderSummary({
  items,
  summary,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoStatus = "idle",
  onPlaceOrder,
  isSubmitting,
}: OrderSummaryProps) {
  const [promoOpen, setPromoOpen] = useState(false);

  return (
    <div className="sticky top-24 space-y-5">
      <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
        <h2 className="text-base font-extrabold text-[#0A0E2A]">
          Order Summary
        </h2>

        <div className="mt-4 max-h-[340px] overflow-y-auto pr-1">
          <CheckoutItems items={items} />
        </div>

        <div className="mt-4">
          {!promoOpen ? (
            <button
              type="button"
              onClick={() => setPromoOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2DBDB6] hover:underline"
            >
              <Tag className="h-3.5 w-3.5" />
              Have a promo code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                placeholder="Enter code"
                className="h-10 flex-1 rounded-lg border border-[#E1E5E8] bg-white px-3 text-sm text-[#0A0E2A] outline-none focus:border-[#2DBDB6]"
              />
              <button
                type="button"
                onClick={onApplyPromo}
                className="rounded-lg bg-[#0A0E2A] px-4 text-xs font-bold text-white transition-transform active:scale-95"
              >
                Apply
              </button>
            </div>
          )}

          {promoStatus === "applied" && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#1f9d97]">
              Promo code applied.
            </p>
          )}
          {promoStatus === "invalid" && (
            <p className="mt-1.5 text-[11px] font-semibold text-red-500">
              Invalid or expired code.
            </p>
          )}
        </div>

        <div className="mt-5 space-y-2 border-t border-dashed border-[#E1E5E8] pt-4 text-sm">
          <div className="flex justify-between text-[#6B7280]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#0A0E2A]">
              ৳{summary.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-[#6B7280]">
            <span>Shipping</span>
            <span className="font-semibold text-[#0A0E2A]">
              {summary.shippingFee > 0
                ? `৳${summary.shippingFee.toFixed(2)}`
                : "Free"}
            </span>
          </div>

          {summary.discount > 0 && (
            <div className="flex justify-between text-[#6B7280]">
              <span>Discount</span>
              <span className="font-semibold text-[#1f9d97]">
                -৳{summary.discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between border-t border-[#E1E5E8] pt-3 text-base">
            <span className="font-extrabold text-[#0A0E2A]">Total</span>
            <span className="font-extrabold text-[#2DBDB6]">
              ৳{summary.total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting || items.length === 0}
          className="group relative mt-5 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-sm font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing order...
            </>
          ) : (
            "Place Order"
          )}
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#2DBDB6]" />
          Secure checkout · SSL encrypted
        </p>
      </div>
    </div>
  );
}