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
      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              relative shrink-0 px-4 py-3 text-sm font-bold transition-colors duration-200
              ${active === tab ? "text-ink" : "text-subtle hover:text-ink"}
            `}
          >
            {tab}
            {active === tab && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>

      <div className="py-6">
        {active === "বিবরণ" && (
          <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-ink">
            {description}
          </p>
        )}

        {active === "বিস্তারিত তথ্য" && (
          <div className="max-w-xl divide-y divide-soft rounded-2xl border border-line">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-subtle">{d.label}</span>
                <span className="font-semibold text-ink">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {active === "রিভিউ" && (reviewsSlot ?? (
          <p className="text-sm text-muted-ink">এখনও কোনো রিভিউ নেই।</p>
        ))}
      </div>
    </div>
  );
}
