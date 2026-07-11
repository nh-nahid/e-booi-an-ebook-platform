"use client";

import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

interface BooksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  resultCount: number;
  onOpenMobileFilters: () => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function BooksToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  onOpenMobileFilters,
}: BooksToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E1E5E8] bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMobileFilters}
          className="
            flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[#E1E5E8] px-3.5
            text-xs font-bold text-[#0A0E2A] transition-colors hover:border-[#2DBDB6] lg:hidden
          "
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="
            h-10 shrink-0 rounded-full border border-[#E1E5E8] bg-white px-3.5 text-xs font-bold
            text-[#0A0E2A] outline-none transition-colors focus:border-[#2DBDB6]
          "
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="hidden shrink-0 items-center gap-1 rounded-full border border-[#E1E5E8] p-1 sm:flex">
          <button
            onClick={() => onViewChange("grid")}
            className={`
              flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200
              ${view === "grid" ? "bg-[#E6F7F6] text-[#2DBDB6]" : "text-[#9AA3AF] hover:text-[#0A0E2A]"}
            `}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`
              flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200
              ${view === "list" ? "bg-[#E6F7F6] text-[#2DBDB6]" : "text-[#9AA3AF] hover:text-[#0A0E2A]"}
            `}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
