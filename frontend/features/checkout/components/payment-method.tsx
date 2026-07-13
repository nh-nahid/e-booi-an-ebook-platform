"use client";

import { Banknote, CreditCard, Smartphone, Truck } from "lucide-react";
import { PaymentMethodType } from "../types/checkout.types";

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
  allowCod: boolean; // only offered when the order has physical items
}

const OPTIONS: {
  id: PaymentMethodType;
  label: string;
  sub: string;
  icon: typeof CreditCard;
}[] = [
  { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard", icon: CreditCard },
  { id: "bkash", label: "bKash", sub: "Pay with your bKash wallet", icon: Smartphone },
  { id: "nagad", label: "Nagad", sub: "Pay with your Nagad wallet", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", sub: "Pay when it arrives", icon: Truck },
];

export default function PaymentMethod({
  value,
  onChange,
  allowCod,
}: PaymentMethodProps) {
  const options = OPTIONS.filter((opt) => opt.id !== "cod" || allowCod);

  return (
    <section className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="flex items-center gap-2">
        <Banknote className="h-4 w-4 text-[#2DBDB6]" />
        <h2 className="text-base font-extrabold text-[#0A0E2A]">
          Payment Method
        </h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                active
                  ? "border-[#2DBDB6] bg-[#E6F7F6] shadow-[0_0_0_4px_rgba(45,189,182,0.12)]"
                  : "border-[#E1E5E8] bg-white hover:border-[#2DBDB6]/50"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-[#2DBDB6] text-white" : "bg-[#F1F3F5] text-[#6B7280]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0A0E2A]">{opt.label}</p>
                <p className="truncate text-[11px] text-[#6B7280]">{opt.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}