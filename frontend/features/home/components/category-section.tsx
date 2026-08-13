"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SectionHeader from "./section-header";
import type { Category } from "../types/home.types";

interface CategorySectionProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "উপন্যাস": "📖",
  "ধর্মীয়": "🕌",
  "বিজ্ঞান": "🔬",
  "ব্যবসা": "💼",
  "সাহিত্য": "🎨",
  "শিক্ষা": "📚",
  "ইসলামিক বই": "🕌",
  "কর্ম ও জীবিকা": "💼",
  "সেলফ লার্নিং": "💡",
  "সিরিজ": "📚",
};

export default function CategorySection({ categories }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <section className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
      <SectionHeader title="ক্যাটাগরি সমূহ" href="/books" />

      <div className="group/row relative">
        <button
          onClick={() => scrollBy(-1)}
          className="
            absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
            rounded-full border border-[#E1E5E8] bg-white text-[#0A0E2A] opacity-0 shadow-md
            transition-all duration-200 hover:border-[#2DBDB6] hover:text-[#2DBDB6]
            group-hover/row:opacity-100 lg:flex
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => scrollBy(1)}
          className="
            absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
            rounded-full border border-[#E1E5E8] bg-white text-[#0A0E2A] opacity-0 shadow-md
            transition-all duration-200 hover:border-[#2DBDB6] hover:text-[#2DBDB6]
            group-hover/row:opacity-100 lg:flex
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name)}`}
              style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
              className="
                group flex h-[112px] w-[104px] shrink-0 animate-in fade-in zoom-in-95 flex-col
                items-center justify-center gap-2 rounded-2xl border border-[#E1E5E8] bg-white
                duration-500 fill-mode-both transition-all
                hover:-translate-y-1 hover:border-[#2DBDB6] hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)]
              "
            >
              <span
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F7F6] text-lg
                  transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
                "
              >
                {CATEGORY_ICONS[category.name] ?? "📚"}
              </span>

              <span className="px-1 text-center text-[11.5px] font-bold leading-tight text-[#0A0E2A]">
                {category.name}
              </span>

              <span className="rounded-full bg-[#F7F9FA] px-2 py-0.5 text-[10px] font-semibold text-[#9AA3AF]">
                {category.booksCount} টি বই
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
