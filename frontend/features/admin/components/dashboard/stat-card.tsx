"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  DollarSign,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap = {
  dollar: DollarSign,
  book: BookOpen,
  users: Users,
  shopping: ShoppingBag,
} satisfies Record<string, LucideIcon>;

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof iconMap;
  trend?: number;
  trendLabel?: string;
  accent?: "teal" | "navy";
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel = "vs last month",
  accent = "teal",
}: StatCardProps) {
  const Icon = iconMap[icon];
  const isUp = (trend ?? 0) >= 0;

  const accentBg = accent === "teal" ? "#E6F7F6" : "#0A0E2A0D";
  const accentColor = accent === "teal" ? "#2DBDB6" : "#0A0E2A";

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl border border-line bg-surface p-5
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(10,14,42,0.08)]
      "
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
        style={{ background: accentColor }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-ink">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink">
            {value}
          </p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentBg }}
        >
          <Icon
            className="h-5 w-5"
            style={{ color: accentColor }}
          />
        </div>
      </div>

      {typeof trend === "number" && (
        <div className="relative mt-3 flex items-center gap-1.5">
          <span
            className={`
              flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold
              ${
                isUp
                  ? "bg-brand-soft text-brand-strong"
                  : "bg-danger-soft text-danger-ink"
              }
            `}
          >
            {isUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>

          <span className="text-[11px] text-subtle">
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}