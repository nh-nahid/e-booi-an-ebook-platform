"use client";

import { useState } from "react";
import { Tag, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  itemCount: number;
  onApplyPromo?: (code: string) => Promise<boolean> | boolean;
  onCheckout?: () => Promise<void> | void;
}

export default function OrderSummary({
  subtotal,
  discount = 0,
  deliveryFee = 0,
  itemCount,
  onApplyPromo,
  onCheckout,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [checkingOut, setCheckingOut] = useState(false);

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    if (promoStatus === "success") return;

    setPromoStatus("loading");

    try {
      const success = (await onApplyPromo?.(promoCode)) ?? false;

      setPromoStatus(success ? "success" : "error");
    } catch {
      setPromoStatus("error");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await onCheckout?.();
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-[#E1E5E8] bg-white p-5 animate-in fade-in slide-in-from-right-2 duration-500">
      <h3 className="text-base font-bold text-[#0A0E2A]">অর্ডার সামারি</h3>

      {/* promo code */}
      <div className="mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
            <input
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoStatus("idle");
              }}
              placeholder="প্রোমো কোড"
              className="
                h-10 w-full rounded-full border border-[#E1E5E8] pl-10 pr-3 text-xs font-semibold
                text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF]
                focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]
              "
            />
          </div>
          <button
            onClick={handleApplyPromo}
            disabled={promoStatus === "loading" || promoStatus === "success"}
            className="shrink-0 rounded-full border border-[#0A0E2A] px-4 text-xs font-bold text-[#0A0E2A] transition-colors hover:bg-[#0A0E2A] hover:text-white"
          >
            {promoStatus === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : promoStatus === "success" ? (
              "প্রয়োগ হয়েছে"
            ) : (
              "প্রয়োগ করুন"
            )}
          </button>
        </div>
        {promoStatus === "success" && (
          <p className="mt-1.5 text-xs font-semibold text-emerald-600">
            প্রোমো কোড প্রয়োগ হয়েছে!
          </p>
        )}
        {promoStatus === "error" && (
          <p className="mt-1.5 text-xs font-semibold text-red-600">
            কোডটি সঠিক নয়।
          </p>
        )}
      </div>

      {/* totals */}
      <div className="mt-5 space-y-2.5 border-t border-[#F1F3F5] pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">সাবটোটাল ({itemCount} আইটেম)</span>
          <span className="font-semibold text-[#0A0E2A]">
            ৳ {subtotal.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">ছাড়</span>
            <span className="font-semibold text-emerald-600">
              - ৳ {discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">ডেলিভারি চার্জ</span>
          <span className="font-semibold text-[#0A0E2A]">
            {deliveryFee === 0 ? "ফ্রি" : `৳ ${deliveryFee.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F1F3F5] pt-4">
        <span className="text-sm font-bold text-[#0A0E2A]">সর্বমোট</span>
        <span className="text-xl font-extrabold text-[#0A0E2A]">
          ৳ {total.toLocaleString()}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={checkingOut || itemCount === 0}
        className="
          group relative mt-5 flex h-12 w-full items-center justify-center gap-2 overflow-hidden
          rounded-full border-0 bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-sm font-bold
          text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform duration-150
          hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
          active:translate-y-0 active:scale-[0.98] disabled:opacity-50
        "
      >
        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
        <span className="relative flex items-center gap-2">
          {checkingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              চেকআউট করুন
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </span>
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#9AA3AF]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#2DBDB6]" />
        নিরাপদ ও সুরক্ষিত পেমেন্ট
      </p>
    </div>
  );
}
