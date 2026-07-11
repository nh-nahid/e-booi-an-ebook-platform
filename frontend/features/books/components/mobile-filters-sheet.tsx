"use client";

import { X } from "lucide-react";

import BooksFilters, { type BooksFilterState } from "./books-filters";

interface MobileFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  filters: BooksFilterState;
  onChange: (filters: BooksFilterState) => void;
  onClear: () => void;
}

export default function MobileFiltersSheet({
  open,
  onClose,
  categories,
  filters,
  onChange,
  onClear,
}: MobileFiltersSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-in fade-in bg-black/40 duration-200"
      />

      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm animate-in slide-in-from-left duration-300">
        <div className="flex h-full flex-col overflow-y-auto bg-[#F7F9FA] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A0E2A]">Filters</h2>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#E6F7F6] hover:text-[#2DBDB6]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <BooksFilters
            categories={categories}
            filters={filters}
            onChange={onChange}
            onClear={onClear}
          />

          <button
            onClick={onClose}
            className="mt-4 h-11 w-full rounded-full bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-sm font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}