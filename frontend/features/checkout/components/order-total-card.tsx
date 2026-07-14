"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

interface OrderTotalCardProps {
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  hasPhysicalItems: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
  onPlaceOrder?: () => Promise<void> | void;
}

export default function OrderTotalCard({
  subtotal,
  discount = 0,
  deliveryFee = 0,
  hasPhysicalItems,
  disabled = false,
  isSubmitting = false,
  onPlaceOrder,
}: OrderTotalCardProps) {
  const [loading, setLoading] = useState(false);

 const total = Math.max(0, subtotal - discount + deliveryFee);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await onPlaceOrder?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-[#E1E5E8] bg-white p-5 animate-in fade-in slide-in-from-right-2 duration-500">
      <h3 className="text-base font-bold text-[#0A0E2A]">মোট বিল</h3>

      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">সাবটোটাল</span>
          <span className="font-semibold text-[#0A0E2A]">৳ {subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">ছাড়</span>
            <span className="font-semibold text-emerald-600">- ৳ {discount.toLocaleString()}</span>
          </div>
        )}

        {hasPhysicalItems && (
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">ডেলিভারি চার্জ</span>
            <span className="font-semibold text-[#0A0E2A]">
              {deliveryFee === 0 ? "ফ্রি" : `৳ ${deliveryFee.toLocaleString()}`}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F1F3F5] pt-4">
        <span className="text-sm font-bold text-[#0A0E2A]">সর্বমোট</span>
        <span className="text-xl font-extrabold text-[#0A0E2A]">৳ {total.toLocaleString()}</span>
      </div>

      <button
         onClick={onPlaceOrder}
        disabled={disabled || isSubmitting}
        className="
          group relative mt-5 flex h-12 w-full items-center justify-center gap-2 overflow-hidden
          rounded-full border-0 bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-sm font-bold
          text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform duration-150
          hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
          active:translate-y-0 active:scale-[0.98] disabled:opacity-50 cursor-pointer
        "
      >
        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
        <span className="relative flex items-center gap-2">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Lock className="h-4 w-4" />
              অর্ডার সম্পন্ন করুন
            </>
          )}
        </span>
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#9AA3AF]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#2DBDB6]" />
        SSL এনক্রিপ্টেড নিরাপদ চেকআউট
      </p>
    </div>
  );
}
