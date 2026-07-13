"use client";

import { MapPin } from "lucide-react";
import { ShippingAddress } from "../types/checkout.types";

interface ShippingAddressFormProps {
  values: ShippingAddress;
  onChange: (values: ShippingAddress) => void;
  errors?: Partial<Record<keyof ShippingAddress, string>>;
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#E1E5E8] bg-white px-4 text-sm text-[#0A0E2A] outline-none transition-all focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]";

const labelClass = "mb-1.5 block text-xs font-bold text-[#0A0E2A]";

export default function ShippingAddressForm({
  values,
  onChange,
  errors,
}: ShippingAddressFormProps) {
  const update = (field: keyof ShippingAddress, value: string) =>
    onChange({ ...values, [field]: value });

  return (
    <section className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-[#2DBDB6]" />
        <h2 className="text-base font-extrabold text-[#0A0E2A]">
          Shipping Address
        </h2>
      </div>
      <p className="mt-1 text-xs text-[#6B7280]">
        Required for physical books in your order.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full name</label>
          <input
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Your full name"
            className={inputClass}
          />
          {errors?.fullName && (
            <p className="mt-1 text-[11px] font-semibold text-red-500">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Street address</label>
          <input
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="House, road, area"
            className={inputClass}
          />
          {errors?.address && (
            <p className="mt-1 text-[11px] font-semibold text-red-500">
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>District</label>
          <input
            value={values.district}
            onChange={(e) => update("district", e.target.value)}
            placeholder="e.g. Dhaka"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Dhanmondi"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Postal code</label>
          <input
            value={values.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            placeholder="1205"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone (for delivery)</label>
          <input
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="01XXXXXXXXX"
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}