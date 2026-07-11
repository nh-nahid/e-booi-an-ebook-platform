"use client";

import {
  SlidersHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";

interface BooksToolbarProps {
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  resultCount: number;
  onOpenMobileFilters: () => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title (A-Z)" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
];

export default function BooksToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  onOpenMobileFilters,
}: BooksToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E1E5E8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <p className="text-xs ml-5 text-[#6B7280]">
              <span className="font-semibold text-[#0A0E2A]">
                {resultCount ?? 0}
              </span>{" "}
              টি বই পাওয়া গেছে
            </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Mobile Filter */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="flex h-10 items-center gap-2 rounded-full border border-[#E1E5E8] px-4 text-sm font-medium text-[#0A0E2A] transition hover:border-[#2DBDB6] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 rounded-full border border-[#E1E5E8] bg-white px-4 text-sm font-medium text-[#0A0E2A] outline-none transition focus:border-[#2DBDB6]"
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* View */}
        <div className="hidden items-center rounded-full border border-[#E1E5E8] p-1 md:flex">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              view === "grid"
                ? "bg-[#2DBDB6] text-white"
                : "text-[#6B7280] hover:text-[#0A0E2A]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              view === "list"
                ? "bg-[#2DBDB6] text-white"
                : "text-[#6B7280] hover:text-[#0A0E2A]"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}