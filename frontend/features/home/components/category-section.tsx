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

/* ---------------------------------------------------------------------- */
/* Category images — served from /public/images/categories/               */
/* Map each category name to its image file. Add new entries here as      */
/* new categories/images are introduced.                                  */
/* ---------------------------------------------------------------------- */

const CATEGORY_IMAGES: Record<string, string> = {
  "ইসলামিক বই": "/images/categories/religious.jpeg",
  "কর্ম ও জীবিকা": "/images/categories/kormo.jpeg",
  "সেলফ লার্নিং": "/images/categories/self.jpeg",
  "সিরিজ": "/images/categories/series.jpeg",
  "বিজ্ঞান": "/images/categories/biggan.jpeg",
  "ব্যবসা": "/images/categories/business.png",
};

const ICON_BG: Record<string, string> = {
  "ইসলামিক বই": "bg-[#E6F7F6]",
  "সেলফ লার্নিং": "bg-[#FEF6E4]",
  "কর্ম ও জীবিকা": "bg-[#FBF2DC]",
  "সিরিজ": "bg-[#E9F0F8]",
  "বিজ্ঞান": "bg-[#E9F0F8]",
};

const VISIBLE_COUNT = 4;

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
            transition-colors duration-200 hover:bg-[#F0F3F4] disabled:opacity-30
            disabled:hover:bg-transparent
          "
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="
            flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {categories.map((category) => {
            const imageSrc = CATEGORY_IMAGES[category.name];
            const iconBg = ICON_BG[category.name] ?? "bg-[#E6F7F6]";
            return (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="
                  group flex h-[150px] w-[calc(25%-12px)] min-w-[220px] shrink-0 snap-start
                  flex-col items-center justify-center gap-3 rounded-2xl border border-[#E1E5E8]
                  bg-white transition-all duration-300
                  hover:-translate-y-1 hover:border-[#2DBDB6] hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)]
                "
              >
                <span
                  className={`
                    relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl
                    ${iconBg} transition-transform duration-300 group-hover:scale-110
                  `}
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
                    <BookOpen className="h-7 w-7 text-[#0B7A6E]" strokeWidth={1.75} />
                  )}
                </span>

                <span className="px-2 text-center text-[15px] font-bold leading-tight text-[#0A0E2A]">
                  {category.name}
                </span>

                <span className="text-xs font-medium text-[#9AA3AF]">
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
            transition-colors duration-200 hover:bg-[#F0F3F4] disabled:opacity-30
            disabled:hover:bg-transparent
          "
        >
          <ChevronRight className="h-5 w-5" />
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
