"use client";

import Link from "next/link";
import SectionHeader from "../components/section-header";
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
};

export default function CategorySection({
  categories,
}: CategorySectionProps) {
  return (
    <section className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
      <SectionHeader title="All Category" href="/categories" />

      <div className="flex gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            href={`/books?category=${encodeURIComponent(category.name)}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="
              group flex h-[92px] w-[92px] shrink-0 animate-in fade-in zoom-in-95
              flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#E1E5E8]
              bg-white duration-500 fill-mode-both
              transition-all hover:-translate-y-1 hover:border-[#2DBDB6]
              hover:shadow-[0_10px_24px_rgba(10,14,42,0.08)]
            "
          >
            <span
              className="
                flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F7F6]
                text-base transition-transform duration-300
                group-hover:scale-110 group-hover:rotate-6
              "
            >
              {CATEGORY_ICONS[category.name] ?? "📚"}
            </span>

            <span className="text-center text-[11px] font-semibold text-[#6B7280] transition-colors group-hover:text-[#0A0E2A]">
              {category.name}
            </span>

            <span className="text-[10px] text-gray-400">
              {category.booksCount} বই
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}