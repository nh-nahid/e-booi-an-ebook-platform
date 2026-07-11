"use client";

import { X } from "lucide-react";

const BOOK_TYPES = [
  { value: "Physical", label: "Physical" },
  { value: "Digital", label: "Digital" },
] as const;

export interface BooksFilterState {
  categories: string[];
  bookType: "Digital" | "Physical" | "";
  minPrice: number;
  maxPrice: number;
}

interface BooksFiltersProps {
  categories: string[];
  filters: BooksFilterState;
  onChange: (filters: BooksFilterState) => void;
  onClear: () => void;
  className?: string;
}

export default function BooksFilters({
  categories,
  filters,
  onChange,
  onClear,
  className = "",
}: BooksFiltersProps) {
  const toggleCategory = (category: string) => {
  const exists = filters.categories.includes(category);

  onChange({
    ...filters,
    categories: exists
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category],
  });
};

  const toggleType = (bookType: "Digital" | "Physical") => {
    onChange({
      ...filters,
      bookType: filters.bookType === bookType ? "" : bookType,
    });
  };

const hasActiveFilters =
  filters.categories.length > 0 ||
  filters.bookType !== "" ||
  filters.minPrice > 0 ||
  filters.maxPrice > 0;

  return (
    <div
      className={`rounded-2xl border border-[#E1E5E8] bg-white p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0A0E2A]">Filters</h3>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-[#2DBDB6] hover:text-[#1f9d97]"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="border-t border-[#F1F3F5] py-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
          Category
        </p>

        <div className="space-y-2.5">
          {categories.map((cat) => {
            const checked = filters.categories.includes(cat);

            return (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <span
                  onClick={() => toggleCategory(cat)}
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-all ${
                    checked
                      ? "border-[#2DBDB6] bg-[#2DBDB6]"
                      : "border-[#E1E5E8] bg-white"
                  }`}
                >
                  {checked && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 fill-white"
                    >
                      <path d="M4.5 8.5L2 6l-.7.7L4.5 10l6-6-.7-.7z" />
                    </svg>
                  )}
                </span>

                <span
                  onClick={() => toggleCategory(cat)}
                  className={
                    checked
                      ? "font-semibold text-[#0A0E2A]"
                      : "text-[#6B7280]"
                  }
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div className="border-t border-[#F1F3F5] py-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
          Format
        </p>

        <div className="flex gap-2">
          {BOOK_TYPES.map((type) => {
            const active = filters.bookType === type.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleType(type.value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "border-[#2DBDB6] bg-[#E6F7F6] text-[#0A0E2A]"
                    : "border-[#E1E5E8] text-[#6B7280] hover:border-[#2DBDB6]"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-[#F1F3F5] pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
          Price Range
        </p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: Number(e.target.value) || 0,
              })
            }
            placeholder="Min"
            className="h-9 w-full rounded-lg border border-[#E1E5E8] px-3 text-xs text-[#0A0E2A] outline-none transition-colors focus:border-[#2DBDB6]"
          />

          <span className="text-[#9AA3AF]">—</span>

          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: Number(e.target.value) || 0,
              })
            }
            placeholder="Max"
            className="h-9 w-full rounded-lg border border-[#E1E5E8] px-3 text-xs text-[#0A0E2A] outline-none transition-colors focus:border-[#2DBDB6]"
          />
        </div>
      </div>
    </div>
  );
}