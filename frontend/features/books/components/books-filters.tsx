"use client";

import { X } from "lucide-react";

// ebooi is Digital-only — kept as a single-value union (not a bare
// string) so the rest of the filter's typing stays intact.
const BOOK_TYPES = [{ value: "Digital", label: "Digital" }] as const;

export interface BooksFilterState {
  categories: string[];
  bookType: "Digital" | "";
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

  const toggleType = (bookType: "Digital") => {
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
      className={`rounded-2xl border border-line bg-surface p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Filters</h3>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-strong"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="border-t border-soft py-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-subtle">
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
                      ? "border-brand bg-brand"
                      : "border-line bg-surface"
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-white">
                      <path d="M4.5 8.5L2 6l-.7.7L4.5 10l6-6-.7-.7z" />
                    </svg>
                  )}
                </span>

                <span
                  onClick={() => toggleCategory(cat)}
                  className={
                    checked ? "font-semibold text-ink" : "text-muted-ink"
                  }
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-soft pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-subtle">
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
            className="h-9 w-full rounded-lg border border-line px-3 text-xs text-ink outline-none transition-colors focus:border-brand"
          />

          <span className="text-subtle">—</span>

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
            className="h-9 w-full rounded-lg border border-line px-3 text-xs text-ink outline-none transition-colors focus:border-brand"
          />
        </div>
      </div>
    </div>
  );
}
