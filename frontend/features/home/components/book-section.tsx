"use client";

import { useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useInView } from "@/hooks/use-in-view";
import type { Book } from "../types/home.types";
import SectionHeader from "./section-header";
import BookCard from "./book-card";

interface BookSectionProps {
  title: string;
  href?: string;
  books: Book[];
  /** First section on the page: show immediately, no scroll-reveal. */
  eager?: boolean;
}

const VISIBLE_COUNT = 6;

export default function BookSection({ title, href = "/books", books, eager }: BookSectionProps) {
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView<HTMLElement>({ disabled: eager });

  // Split books into fixed-size pages of VISIBLE_COUNT so every page shows
  // full cards only — no partially-cut-off card at the row's edge.
  const pages = useMemo(() => {
    const chunks: Book[][] = [];
    for (let i = 0; i < books.length; i += VISIBLE_COUNT) {
      chunks.push(books.slice(i, i + VISIBLE_COUNT));
    }
    return chunks;
  }, [books]);

  const pageCount = pages.length;

  const goToPage = useCallback(
    (next: number) => {
      setPage((prev) => {
        const clamped = Math.max(0, Math.min(pageCount - 1, next));
        return clamped;
      });
    },
    [pageCount]
  );

  if (!books.length) return null;

  return (
    <section
      ref={ref}
      className={`
        container relative mx-auto px-5 pb-6 pt-2 transition-all duration-700 ease-out sm:py-6 sm:px-10 lg:px-[60px]
        ${inView ? "opacity-100 translate-y-0" : "translate-y-6 opacity-0"}
      `}
    >
      <SectionHeader title={title} href={href} />

      <div className="group/row relative">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          aria-label="আগের বই"
          className="
            absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
            rounded-full border border-line bg-surface text-ink opacity-0 shadow-md
            transition-all duration-200 hover:scale-110 hover:border-brand hover:text-brand
            active:scale-95
            disabled:pointer-events-none disabled:opacity-0
            group-hover/row:opacity-100 lg:flex
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= pageCount - 1}
          aria-label="পরবর্তী বই"
          className="
            absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
            rounded-full border border-line bg-surface text-ink opacity-0 shadow-md
            transition-all duration-200 hover:scale-110 hover:border-brand hover:text-brand
            active:scale-95
            disabled:pointer-events-none disabled:opacity-0
            group-hover/row:opacity-100 lg:flex
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {pages.map((pageBooks, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6"
              >
                {pageBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={pageIndex * VISIBLE_COUNT + index} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`পৃষ্ঠা ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "w-3 bg-brand" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
