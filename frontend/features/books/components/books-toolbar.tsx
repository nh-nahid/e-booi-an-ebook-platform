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
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <p className="text-xs text-muted-ink">
              <span className="font-semibold text-ink">
                সর্বমোট -{resultCount ?? 0} টি বই
              </span> 
            </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Mobile Filter */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-brand lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink outline-none transition focus:border-brand sm:flex-none"
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
        <div className="hidden items-center rounded-full border border-line p-1 md:flex">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              view === "grid"
                ? "bg-brand text-white"
                : "text-muted-ink hover:text-ink"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              view === "list"
                ? "bg-brand text-white"
                : "text-muted-ink hover:text-ink"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}