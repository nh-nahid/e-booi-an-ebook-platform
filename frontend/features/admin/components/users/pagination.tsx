"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="
          flex h-9 w-9 items-center justify-center rounded-full border border-line
          text-ink transition-all duration-200
          hover:border-brand hover:text-brand
          disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink
        "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-1.5 text-sm text-subtle">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`
              flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold
              transition-all duration-200
              ${
                p === page
                  ? "bg-gradient-to-br from-brand to-brand-strong text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]"
                  : "text-muted-ink hover:bg-canvas hover:text-ink"
              }
            `}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="
          flex h-9 w-9 items-center justify-center rounded-full border border-line
          text-ink transition-all duration-200
          hover:border-brand hover:text-brand
          disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink
        "
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
