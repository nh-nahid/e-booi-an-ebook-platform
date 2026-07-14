"use client";

import { MapPin, User, Phone, Home } from "lucide-react";
import { ShippingAddress } from "../types/checkout.types";

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
}

const fieldClass = `
  h-11 w-full rounded-xl border border-[#E1E5E8] pl-10 pr-3 text-sm text-[#0A0E2A]
  outline-none transition-all duration-200 placeholder:text-[#9AA3AF]
  focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]
`;

export default function ShippingAddressForm({
  value,
  onChange,
}: ShippingAddressFormProps) {
  const update = <K extends keyof ShippingAddress>(
    key: K,
    v: ShippingAddress[K],
  ) => onChange({ ...value, [key]: v });

  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F7F6]">
          <MapPin className="h-4 w-4 text-[#2DBDB6]" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#0A0E2A]">শিপিং ঠিকানা</h3>
          <p className="text-xs text-[#6B7280]">
            ফিজিক্যাল বই ডেলিভারির জন্য প্রয়োজন
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
            <input
              value={value.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="পুরো নাম"
              className={fieldClass}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
            <input
              value={value.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="মোবাইল নম্বর"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="relative">
          <Home className="absolute left-3.5 top-3 h-4 w-4 text-[#9AA3AF]" />
          <textarea
            value={value.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="সম্পূর্ণ ঠিকানা (বাড়ি নম্বর, রোড, এলাকা)"
            rows={2}
            className="w-full resize-none rounded-xl border border-[#E1E5E8] py-2.5 pl-10 pr-3 text-sm text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF] focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="শহর / জেলা"
            className="h-11 w-full rounded-xl border border-[#E1E5E8] px-3.5 text-sm text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF] focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
          />
          <input
            value={value.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            placeholder="পোস্টাল কোড"
            className="h-11 w-full rounded-xl border border-[#E1E5E8] px-3.5 text-sm text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF] focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
          />
        </div>

        <textarea
          value={value.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="ডেলিভারি নোট (ঐচ্ছিক)"
          rows={2}
          className="w-full resize-none rounded-xl border border-[#E1E5E8] px-3.5 py-2.5 text-sm text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF] focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
        />
      </div>
    </div>
  );
}
