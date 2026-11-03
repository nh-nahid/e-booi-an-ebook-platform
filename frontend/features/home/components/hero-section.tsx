"use client";

import {
  ArrowRight,
  BookOpen,
  LayoutGrid,
  PenSquare,
  Smile,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { useCountUp } from "@/hooks/use-count-up";
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

  const stats: { label: string; value: number; icon: React.ElementType }[] = [
    { label: "বই", value: statistics.totalBooks, icon: BookOpen },
    ...(typeof statistics.totalUsers === "number"
      ? [{ label: "পাঠক", value: statistics.totalUsers, icon: Users }]
      : []),
    { label: "লেখক", value: statistics.totalAuthors, icon: PenSquare },
    { label: "ক্যাটাগরি", value: statistics.totalCategories, icon: LayoutGrid },
    ...(typeof statistics.happyCustomers === "number" && statistics.happyCustomers > 0
      ? [{ label: "সন্তুষ্ট গ্রাহক", value: statistics.happyCustomers, icon: Smile }]
      : []),
  ].filter((s) => typeof s.value === "number" && s.value > 0);

  return (
    <section className="relative overflow-hidden bg-surface">
      <style>{`
        @keyframes heroBlob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(14px, -10px); }
        }
        .hero-blob-a { animation: heroBlob 9s ease-in-out infinite; }
        .hero-blob-b { animation: heroBlob 11s ease-in-out infinite reverse; }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .hero-float { animation: heroFloat 3.2s ease-in-out infinite; }
      `}</style>

      <div className="hero-blob-a pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand opacity-[0.1] blur-3xl" />
      <div className="hero-blob-b pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-navy opacity-[0.05] blur-3xl" />

      <div className="relative mx-auto px-5 sm:px-10">
        {/* eyebrow badge */}
        

        {/* promo slider */}
        <div
          className="
            mx-auto mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500
            [animation-delay:150ms] fill-mode-both lg:mt-6
          "
        >
          <HeroSlider />
        </div>

        
      </div>
    </section>
  );
}

function StatItem({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  delay?: number;
}) {
  const count = useCountUp(value, { duration: 1100 });

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="flex animate-in fade-in slide-in-from-bottom-1 flex-col items-center gap-1.5 duration-500 fill-mode-both"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-xl font-extrabold text-ink">
        {count.toLocaleString()}+
      </p>
      <p className="text-xs font-medium text-muted-ink">{label}</p>
    </div>
  );
}
