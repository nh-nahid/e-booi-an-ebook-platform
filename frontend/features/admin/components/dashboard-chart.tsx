"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export interface CategorySlice {
  name: string;
  value: number;
}

interface DashboardChartProps {
  data: CategorySlice[];
  title?: string;
  subtitle?: string;
}

const COLORS = ["#2DBDB6", "#0A0E2A", "#7FD4CF", "#4A5578", "#B7E8E4", "#9AA3AF"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-xl border border-[#E1E5E8] bg-white px-3 py-2 shadow-[0_10px_24px_rgba(10,14,42,0.1)]">
      <p className="text-xs font-semibold text-[#0A0E2A]">{entry.name}</p>
      <p className="text-xs text-[#6B7280]">{entry.value} books</p>
    </div>
  );
}

export default function DashboardChart({
  data,
  title = "Books by Category",
  subtitle = "Distribution across your catalog",
}: DashboardChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-[#0A0E2A]">{title}</h3>
        <p className="text-xs text-[#6B7280]">{subtitle}</p>
      </div>

      <div className="relative h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-[#0A0E2A]">{total}</span>
          <span className="text-[11px] text-[#6B7280]">Total Books</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs font-medium text-[#6B7280]">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
