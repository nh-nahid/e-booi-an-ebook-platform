"use client";

import { Smartphone, CreditCard, Truck, Check } from "lucide-react";
import { PaymentMethodType } from "../types/checkout.types";

export type PaymentMethod = "mobile_banking" | "card" | "cod";

interface PaymentMethodsProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
  codAvailable: boolean;
}

const OPTIONS: {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: typeof Smartphone;
  requiresPhysical?: boolean;
}[] = [
  {
    id: "bkash", // NOTE: was "mobile_banking" — collapsed to bkash since
                 // shared type has no combined option. Consider separate
                 // bkash/nagad buttons if you need to track provider.
    title: "মোবাইল ব্যাংকিং",
    subtitle: "bKash, Nagad, Rocket",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "কার্ড পেমেন্ট",
    subtitle: "Visa, Mastercard",
    icon: CreditCard,
  },
  {
    id: "cod",
    title: "ক্যাশ অন ডেলিভারি",
    subtitle: "শুধু ফিজিক্যাল বইয়ের জন্য",
    icon: Truck,
    requiresPhysical: true,
  },
];

export default function PaymentMethods({ value, onChange, codAvailable }: PaymentMethodsProps) {
  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:100ms]">
      <h3 className="mb-4 text-sm font-bold text-[#0A0E2A]">পেমেন্ট পদ্ধতি</h3>

      <div className="space-y-2.5">
        {OPTIONS.map((opt) => {
          const disabled = opt.requiresPhysical && !codAvailable;
          const active = value === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`
                flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200
                ${
                  disabled
                    ? "cursor-not-allowed border-[#E1E5E8] opacity-40"
                    : active
                    ? "border-[#2DBDB6] bg-[#E6F7F6]"
                    : "border-[#E1E5E8] hover:border-[#2DBDB6]/50"
                }
              `}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-[#2DBDB6] text-white" : "bg-[#F7F9FA] text-[#6B7280]"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#0A0E2A]">{opt.title}</p>
                <p className="text-xs text-[#6B7280]">
                  {disabled ? "শুধু ফিজিক্যাল বইয়ের অর্ডারে উপলব্ধ" : opt.subtitle}
                </p>
              </div>

              <span
                className={`
                  flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                  ${active ? "border-[#2DBDB6] bg-[#2DBDB6]" : "border-[#E1E5E8]"}
                `}
              >
                {active && <Check className="h-3 w-3 text-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
