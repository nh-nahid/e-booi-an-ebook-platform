"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

import SectionHeader from "./section-header";
import type { Category } from "../types/home.types";

interface CategorySectionProps {
  categories: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  "ইসলামিক বই": "/images/categories/religious.jpeg",
  "কর্ম ও জীবিকা": "/images/categories/kormo.jpeg",
  "সেলফ লার্নিং": "/images/categories/self.jpeg",
  "সিরিজ": "/images/categories/series.jpeg",
  "বিজ্ঞান": "/images/categories/biggan.jpeg",
  "ব্যবসা": "/images/categories/business.png",
};

const VISIBLE_COUNT = 4;
const AUTO_PLAY_MS = 7000;

// Pinned display order — these show first, in this exact order; any
// other category (not in this list) follows after, in whatever order
// the API returned it in.
const CATEGORY_ORDER = ["ইসলামিক বই", "কর্ম ও জীবিকা", "সেলফ লার্নিং", "সিরিজ"];

function sortCategories(categories: Category[]): Category[] {
  const priority = (name: string) => {
    const idx = CATEGORY_ORDER.indexOf(name);
    return idx === -1 ? CATEGORY_ORDER.length : idx;
  };
  // Array.prototype.sort is stable, so categories outside CATEGORY_ORDER
  // (equal priority) keep their original relative order.
  return [...categories].sort((a, b) => priority(a.name) - priority(b.name));
}

export default function CategorySection({ categories: rawCategories }: CategorySectionProps) {
  const categories = sortCategories(rawCategories);

  // Full-box slide, same technique as the hero banner: the row is
  // transformed with CSS (not native scroll), so the whole box glides
  // as one piece instead of the content just swapping in place.
  const rowRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  // viewport = visible width per page, total = full width of every card
  // laid out in a row (including the ones currently off-screen).
  const [dims, setDims] = useState({ viewport: 0, total: 0 });
  const pageCount = Math.max(1, Math.ceil(categories.length / VISIBLE_COUNT));

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const update = () => setDims({ viewport: node.clientWidth, total: node.scrollWidth });
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [categories.length]);

  // Clamp the offset so the final page never shows a half-empty row —
  // instead it snaps to the true end, overlapping with the previous
  // page's tail so a full set of cards is always visible.
  const maxOffset = Math.max(0, dims.total - dims.viewport);
  const offset = Math.min(page * dims.viewport, maxOffset);

  const goToPage = useCallback(
    (next: number) => {
      setPage(Math.max(0, Math.min(pageCount - 1, next)));
    },
    [pageCount]
  );

  // Touch swipe — same threshold/pattern as the hero banner slider.
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goToPage(page - 1);
    if (delta < -40) goToPage(page + 1);
    touchStartX.current = null;
  };

  // Auto-slide, same pattern as the hero banner: advance on a timer and
  // wrap back to the first page, pausing while the pointer is over it.
  useEffect(() => {
    if (paused || pageCount <= 1) return;

    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % pageCount);
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [paused, pageCount]);

  if (!categories.length) return null;

  return (
    <section className="container mx-auto px-4 pb-1 pt-4 sm:px-10 sm:py-8 lg:px-[60px]">
      <SectionHeader title="ক্যাটাগরি সমূহ" href="/books" />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="overflow-hidden px-1 py-1 sm:py-4"
      >
        <div
          ref={rowRef}
          className="flex gap-2 transition-transform duration-[900ms] ease-in-out sm:gap-5"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {categories.map((category) => {
            const imageSrc = CATEGORY_IMAGES[category.name];
            return (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="
                  group relative flex h-[72px] w-[calc(25%-6px)] shrink-0
                  flex-col items-center justify-start gap-0.5 overflow-hidden rounded bg-[#F5F5F4] p-0.5 pt-0.5
                  shadow-[4px_6px_0px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]
                  ring-1 ring-black/[0.04]
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5
                  hover:shadow-[8px_12px_0px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
                  active:translate-y-0
                  active:shadow-[3px_4px_0px_rgba(0,0,0,0.1)]
                  sm:h-[168px] sm:w-[calc(33.333%-14px)] sm:gap-2 sm:p-3 sm:pt-4
                  sm:shadow-[6px_8px_0px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]
                  md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)]
                "
              >
                <span
                  className="
                    relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded
                    bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                    transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105
                    sm:h-20 sm:w-20
                  "
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 32px"
                      className="object-cover"
                    />
                  ) : (
                    <BookOpen className="h-4 w-4 text-[#0B7A6E] sm:h-10 sm:w-10" strokeWidth={1.75} />
                  )}
                </span>

                <span className="px-0.5 text-center text-[8px] font-bold leading-tight text-[#0A0E2A] line-clamp-2 sm:text-base">
                  {category.name}
                </span>

                <span
                  className="
                    mt-auto rounded-full border border-[#DADFE2] bg-white px-1 py-0.5
                    text-[7px] font-semibold text-[#6B7280] sm:px-2.5 sm:py-1 sm:text-xs
                  "
                >
                  {category.booksCount} টি বই
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-1 flex justify-center gap-1.5 sm:mt-4">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`পৃষ্ঠা ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "w-3 bg-[#2DBDB6]" : "w-1.5 bg-[#E1E5E8]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
