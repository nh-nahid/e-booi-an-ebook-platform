"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

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

const VISIBLE_COUNT = 3;
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
  // Pages follow the real layout (cards per row changes with screen width).
  const pageCount = dims.viewport
    ? Math.max(1, Math.ceil(dims.total / dims.viewport - 0.05))
    : Math.max(1, Math.ceil(categories.length / VISIBLE_COUNT));

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
  const baseOffset = Math.min(page * dims.viewport, maxOffset);

  const goToPage = useCallback(
    (next: number) => {
      setPage(Math.max(0, Math.min(pageCount - 1, next)));
    },
    [pageCount]
  );

  // Swipe / drag with finger or mouse: the row follows the pointer, and on
  // release snaps to the previous/next page when dragged far enough.
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDragX(dx);
  };
  const endDrag = () => {
    if (startX.current === null) return;
    const dx = dragX;
    startX.current = null;
    setDragging(false);
    setDragX(0);
    if (dx > 50) goToPage(page - 1);
    else if (dx < -50) goToPage(page + 1);
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
    <section className="container mx-auto px-5 pb-3 pt-8 sm:py-8 sm:px-10 lg:px-[60px]">
      <SectionHeader title="ক্যাটাগরি সমূহ" href="/books" />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        style={{ touchAction: "pan-y" }}
        className={`overflow-hidden px-1 py-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div
          ref={rowRef}
          className={`flex gap-2 sm:gap-5 ${dragging ? "" : "transition-transform duration-[900ms] ease-in-out"}`}
          style={{ transform: `translateX(${dragX - baseOffset}px)` }}
        >
          {categories.map((category) => {
            const imageSrc = CATEGORY_IMAGES[category.name];
            return (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                draggable={false}
                onClickCapture={(e) => {
                  // A drag must not count as a click on a card.
                  if (moved.current) {
                    e.preventDefault();
                    moved.current = false;
                  }
                }}
                className="select-none 
                  group relative flex h-[104px] w-[calc(33.333%_-_6px)] shrink-0
                  flex-col items-center justify-start gap-1 overflow-hidden rounded-xl bg-soft p-1.5 pt-2
                  shadow-[4px_6px_0px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]
                  ring-1 ring-black/[0.04]
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5
                  hover:shadow-[8px_12px_0px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
                  active:translate-y-0
                  active:shadow-[3px_4px_0px_rgba(0,0,0,0.1)]
                  sm:h-[168px] sm:w-[calc(33.333%_-_14px)] sm:gap-2 sm:p-3 sm:pt-4
                  sm:shadow-[6px_8px_0px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]
                  md:w-[calc(25%_-_15px)] lg:w-[calc(20%_-_16px)]
                "
              >
                <span
                  className="
                    relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg
                    bg-surface shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                    transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105
                    sm:h-20 sm:w-20
                  "
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 40px"
                      className="object-cover"
                    />
                  ) : (
                    <BookOpen className="h-5 w-5 text-brand-strong sm:h-10 sm:w-10" strokeWidth={1.75} />
                  )}
                </span>

                <span className="px-1 text-center text-[11px] font-bold leading-tight text-ink line-clamp-2 sm:text-base">
                  {category.name}
                </span>

                <span
                  className="
                    mt-auto rounded-full border border-line bg-surface px-1.5 py-0.5
                    text-[9px] font-semibold text-muted-ink sm:px-2.5 sm:py-1 sm:text-xs
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
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="আগের"
            className="rounded-full border border-line bg-surface p-1 text-muted-ink disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`পৃষ্ঠা ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full bg-muted-ink transition-all duration-300 ${
                i === page ? "opacity-100" : "opacity-30"
              }`}
            />
          ))}
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="পরের"
            className="rounded-full border border-line bg-surface p-1 text-muted-ink disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
