"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

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

export default function CategorySection({ categories }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
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

      <div className="relative flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          aria-label="আগের ক্যাটাগরি"
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0A0E2A]
            bg-[#F2F4F5] shadow-[4px_4px_10px_rgba(163,177,198,0.4),-4px_-4px_10px_rgba(255,255,255,0.9)]
            transition-all duration-200 hover:-translate-y-0.5
            active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.7)]
            disabled:opacity-30 disabled:hover:translate-y-0
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="
            flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-3
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
                  group relative flex h-[110px] w-[calc(20%-10px)] min-w-[128px] shrink-0 snap-start
                  flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg p-2.5
                  bg-gradient-to-br from-[#E9ECEF] to-[#D3D9DE]
                  shadow-[6px_6px_14px_rgba(163,177,198,0.5),-6px_-6px_14px_rgba(255,255,255,0.9),inset_0_1px_0_rgba(255,255,255,0.6)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5 hover:scale-[1.03]
                  hover:shadow-[9px_9px_20px_rgba(163,177,198,0.55),-9px_-9px_20px_rgba(255,255,255,0.95),inset_0_1px_0_rgba(255,255,255,0.7)]
                  active:translate-y-0 active:scale-100
                  active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.45),inset_-5px_-5px_10px_rgba(255,255,255,0.7)]
                "
              >
                {/* subtle top highlight for extra depth */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-white/50 to-transparent" />

                <span
                  className="
                    relative z-10 flex h-9 w-9 items-center justify-center overflow-hidden rounded-md
                    bg-white
                    shadow-[3px_3px_7px_rgba(163,177,198,0.45),-3px_-3px_7px_rgba(255,255,255,0.95),inset_0_1px_1px_rgba(255,255,255,0.8)]
                    transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3
                  "
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <BookOpen className="h-4 w-4 text-[#0B7A6E]" strokeWidth={1.75} />
                  )}
                </span>

                <span className="relative z-10 px-1 text-center text-[12px] font-bold leading-tight text-[#0A0E2A] line-clamp-1">
                  {category.name}
                </span>

                <span
                  className="
                    relative z-10 rounded-sm border border-[#E1E5E8]/70 bg-white/80 px-1.5 py-[1px]
                    text-[9px] font-semibold text-[#6B7280] shadow-[1px_1px_2px_rgba(163,177,198,0.3)]
                  "
                >
                  {category.booksCount} টি বই
                </span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= pageCount - 1}
          aria-label="পরবর্তী ক্যাটাগরি"
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0A0E2A]
            bg-[#F2F4F5] shadow-[4px_4px_10px_rgba(163,177,198,0.4),-4px_-4px_10px_rgba(255,255,255,0.9)]
            transition-all duration-200 hover:-translate-y-0.5
            active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.7)]
            disabled:opacity-30 disabled:hover:translate-y-0
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>
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