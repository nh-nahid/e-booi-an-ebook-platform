"use client";

import Link from "next/link";
import SectionHeader from "./section-header";

export interface Category {
  slug: string;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { slug: "novel", name: "উপন্যাস", icon: "📖" },
  { slug: "religious", name: "ধর্মীয়", icon: "🕌" },
  { slug: "science", name: "বিজ্ঞান", icon: "🔬" },
  { slug: "business", name: "ব্যবসা", icon: "💼" },
  { slug: "literature", name: "সাহিত্য", icon: "🎨" },
  { slug: "education", name: "শিক্ষা", icon: "📚" },
];

export default function CategorySection() {
  return (
    <section className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
      <SectionHeader title="All Category" href="/categories" />

      <div className="flex gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            style={{ animationDelay: `${i * 0.05}s` }}
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
                flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F7F6] text-base
                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
              "
            >
              {cat.icon}
            </span>
            <span className="text-[11px] font-semibold text-[#6B7280] transition-colors group-hover:text-[#0A0E2A]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
