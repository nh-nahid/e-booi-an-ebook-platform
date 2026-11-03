"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SalesPoint {
  label: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesPoint[];
  title?: string;
  subtitle?: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-[0_10px_24px_rgba(10,14,42,0.1)]">
      <p className="text-xs font-semibold text-muted-ink">{label}</p>
      <p className="text-sm font-bold text-ink">
        ৳ {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function SalesChart({
  data,
  title = "Sales Overview",
  subtitle = "Revenue trend over time",
}: SalesChartProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">{title}</h3>
          <p className="text-xs text-muted-ink">{subtitle}</p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-ink">
          This month
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DBDB6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2DBDB6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E1E5E8" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#9AA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#E1E5E8" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9AA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#2DBDB6"
              strokeWidth={2.5}
              fill="url(#salesFill)"
              activeDot={{ r: 5, fill: "#2DBDB6", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
