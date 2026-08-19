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

const VISIBLE_COUNT = 5;
const AUTO_PLAY_MS = 4000;

export default function CategorySection({ categories }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pageCount = Math.max(1, Math.ceil(categories.length / VISIBLE_COUNT));

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(pageCount - 1, next));
      setPage(clamped);
      const node = scrollRef.current;
      if (node) {
        node.scrollTo({ left: clamped * node.clientWidth, behavior: "smooth" });
      }
    },
    [pageCount]
  );

  // Auto-slide, same pattern as the hero banner: advance on a timer and
  // wrap back to the first page, pausing while the pointer is over it.
  useEffect(() => {
    if (paused || pageCount <= 1) return;

    const timer = setInterval(() => {
      setPage((prev) => {
        const next = (prev + 1) % pageCount;
        const node = scrollRef.current;
        if (node) {
          node.scrollTo({ left: next * node.clientWidth, behavior: "smooth" });
        }
        return next;
      });
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [paused, pageCount]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const handleScroll = () => {
      const current = Math.round(node.scrollLeft / Math.max(1, node.clientWidth));
      setPage(current);
    };
    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  if (!categories.length) return null;

  return (
    <section className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
      <SectionHeader title="ক্যাটাগরি সমূহ" href="/books" />

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="
          flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 py-4
          sm:gap-5
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {categories.map((category) => {
          const imageSrc = CATEGORY_IMAGES[category.name];
          return (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name)}`}
              className="
                group relative flex h-[128px] w-[calc(50%-6px)] shrink-0 snap-start
                flex-col items-center justify-start gap-1.5 rounded-xl bg-[#F5F5F4] p-2 pt-3
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
                  relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg
                  bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                  transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105
                  sm:h-16 sm:w-16
                "
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <BookOpen className="h-6 w-6 text-[#0B7A6E] sm:h-8 sm:w-8" strokeWidth={1.75} />
                )}
              </span>

              <span className="px-1 text-center text-[11px] font-bold leading-tight text-[#0A0E2A] line-clamp-2 sm:text-[13px]">
                {category.name}
              </span>

              <span
                className="
                  mt-auto rounded-full border border-[#DADFE2] bg-white px-1.5 py-0.5
                  text-[9px] font-semibold text-[#6B7280] sm:px-2 sm:text-[10px]
                "
              >
                {category.booksCount} টি বই
              </span>
            </Link>
          );
        })}
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`পৃষ্ঠা ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "w-6 bg-[#2DBDB6]" : "w-1.5 bg-[#E1E5E8]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
