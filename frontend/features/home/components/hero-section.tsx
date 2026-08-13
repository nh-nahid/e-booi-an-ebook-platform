"use client";

import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import type { Statistics } from "../types/home.types";
import HeroSlider from "./hero-slider";

interface HeroSectionProps {
  statistics: Statistics;
}

export default function HeroSection({ statistics }: HeroSectionProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const isTypingRef = useRef(false);
  const debouncedKeyword = useDebounce(keyword, 500);

  const handleSearch = () => {
    const value = keyword.trim();
    if (!value) return;
    router.push(`/books?search=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;

    const value = debouncedKeyword.trim();
    if (value) {
      router.push(`/books?search=${encodeURIComponent(value)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  return (
    <section className="relative overflow-hidden bg-white">
      <style>{`
        @keyframes heroBlob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(14px, -10px); }
        }
        .hero-blob-a { animation: heroBlob 9s ease-in-out infinite; }
        .hero-blob-b { animation: heroBlob 11s ease-in-out infinite reverse; }
      `}</style>

      <div className="hero-blob-a pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#2DBDB6] opacity-[0.1] blur-3xl" />
      <div className="hero-blob-b pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-[#0A0E2A] opacity-[0.05] blur-3xl" />

      <div className=" relative mx-auto px-5 sm:px-10 ">

        {/* promo slider */}
        <div className="mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:150ms] lg:mt-11">
          <HeroSlider />
        </div>

        {/* stat strip */}
        {/* {(statistics.totalUsers || statistics.totalAuthors || statistics.totalCategories) && (
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[#F1F3F5] pb-8 pt-6 text-center">
            <StatItem label="বই" value={statistics.totalBooks} />
            {typeof statistics.totalUsers === "number" && (
              <StatItem label="পাঠক" value={statistics.totalUsers} />
            )}
            {typeof statistics.totalAuthors === "number" && (
              <StatItem label="লেখক" value={statistics.totalAuthors} />
            )}
            {typeof statistics.totalCategories === "number" && (
              <StatItem label="ক্যাটাগরি" value={statistics.totalCategories} />
            )}
          </div>
        )} */}
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-extrabold text-[#0A0E2A]">{value.toLocaleString()}+</p>
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
    </div>
  );
}
