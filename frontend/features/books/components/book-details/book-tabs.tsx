"use client";

import { useState } from "react";

interface BookTabsProps {
  description: string;
  details: { label: string; value: string }[];
  reviewsSlot?: React.ReactNode;
}

const TABS = ["বিবরণ", "বিস্তারিত তথ্য", "রিভিউ"] as const;

export default function BookTabs({ description, details, reviewsSlot }: BookTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("বিবরণ");

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-1 overflow-x-auto border-b border-[#E1E5E8]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              relative shrink-0 px-4 py-3 text-sm font-bold transition-colors duration-200
              ${active === tab ? "text-[#0A0E2A]" : "text-[#9AA3AF] hover:text-[#0A0E2A]"}
            `}
          >
            {tab}
            {active === tab && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#2DBDB6]" />
            )}
          </button>
        ))}
      </div>

      <div className="py-6">
        {active === "বিবরণ" && (
          <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-[#6B7280]">
            {description}
          </p>
        )}

        {active === "বিস্তারিত তথ্য" && (
          <div className="max-w-xl divide-y divide-[#F1F3F5] rounded-2xl border border-[#E1E5E8]">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-[#9AA3AF]">{d.label}</span>
                <span className="font-semibold text-[#0A0E2A]">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {active === "রিভিউ" && (reviewsSlot ?? (
          <p className="text-sm text-[#6B7280]">এখনও কোনো রিভিউ নেই।</p>
        ))}
      </div>
    </div>
  );
}
