"use client";

import { Mail, Phone } from "lucide-react";
import { ContactDetails } from "../types/checkout.types";

interface ContactDetailsFormProps {
  values: ContactDetails;
  onChange: (values: ContactDetails) => void;
  errors?: Partial<Record<keyof ContactDetails, string>>;
}

export default function ContactDetailsForm({
  values,
  onChange,
  errors,
}: ContactDetailsFormProps) {
  return (
    <section className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <h2 className="text-base font-extrabold text-[#0A0E2A]">
        Contact Details
      </h2>
      <p className="mt-1 text-xs text-[#6B7280]">
        We&apos;ll send your order confirmation and digital downloads here.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#0A0E2A]">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
            <input
              type="email"
              value={values.email}
              onChange={(e) => onChange({ ...values, email: e.target.value })}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-[#E1E5E8] bg-white pl-10 pr-4 text-sm text-[#0A0E2A] outline-none transition-all focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
            />
          </div>
          {errors?.email && (
            <p className="mt-1 text-[11px] font-semibold text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#0A0E2A]">
            Phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => onChange({ ...values, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="h-11 w-full rounded-xl border border-[#E1E5E8] bg-white pl-10 pr-4 text-sm text-[#0A0E2A] outline-none transition-all focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]"
            />
          </div>
          {errors?.phone && (
            <p className="mt-1 text-[11px] font-semibold text-red-500">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}