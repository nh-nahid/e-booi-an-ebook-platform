"use client";

import Image from "next/image";
import { Wallet, Check } from "lucide-react";
import { PaymentMethodType } from "../types/checkout.types";

interface PaymentMethodsProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

const OPTIONS: {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: typeof Wallet;
}[] = [
  {
    id: "eps",
    title: "অনলাইন পেমেন্ট",
    subtitle: "bKash, Nagad, Rocket, Visa, Mastercard — EPS-এর মাধ্যমে নিরাপদ পেমেন্ট",
    icon: Wallet,
  },
];

export default function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:100ms]">
      <h3 className="mb-4 text-sm font-bold text-ink">পেমেন্ট পদ্ধতি</h3>

      <div className="space-y-2.5">
        {OPTIONS.map((opt) => {
          const active = value === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`
                flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200
                ${
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:border-brand/50"
                }
              `}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-brand text-white" : "bg-canvas text-muted-ink"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{opt.title}</p>
                <p className="text-xs text-muted-ink">{opt.subtitle}</p>
              </div>

              <span
                className={`
                  flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                  ${active ? "border-brand bg-brand" : "border-line"}
                `}
              >
                {active && <Check className="h-3 w-3 text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* "Pay with EPS" badge supplied by EPS for the checkout page. */}
      <Image
        src="/eps/checkout-pay-with-eps.webp"
        alt="Pay with EPS: Visa, Mastercard, American Express, bKash, Nagad, Rocket and others"
        width={1200}
        height={207}
        sizes="260px"
        className="mx-auto mt-4 h-auto w-full max-w-[260px]"
      />
    </div>
  );
}
