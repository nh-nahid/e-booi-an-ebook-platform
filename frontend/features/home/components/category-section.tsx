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
            bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]
            active:translate-y-0
            disabled:opacity-30 disabled:hover:translate-y-0
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="
            flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 py-4
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
                  group relative flex h-[168px] w-[calc(20%-16px)] min-w-[140px] shrink-0 snap-start
                  flex-col items-center justify-start gap-2 rounded-xl bg-[#F5F5F4] p-3 pt-4
                  shadow-[6px_8px_0px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]
                  ring-1 ring-black/[0.04]
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5
                  hover:shadow-[8px_12px_0px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
                  active:translate-y-0
                  active:shadow-[3px_4px_0px_rgba(0,0,0,0.1)]
                "
              >
                <span
                  className="
                    relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg
                    bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                    transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105
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
                    <BookOpen className="h-8 w-8 text-[#0B7A6E]" strokeWidth={1.75} />
                  )}
                </span>

                <span className="px-1 text-center text-[13px] font-bold leading-tight text-[#0A0E2A] line-clamp-2">
                  {category.name}
                </span>

                <span
                  className="
                    mt-auto rounded-full border border-[#DADFE2] bg-white px-2 py-0.5
                    text-[10px] font-semibold text-[#6B7280]
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
            bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]
            active:translate-y-0
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