"use client";

import Link from "next/link";
import { Search, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -16px) rotate(3deg); }
        }
        @keyframes heroFloatSlow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-14px, 12px) rotate(-2deg); }
        }
        @keyframes heroBlob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(14px, -10px); }
        }
        .hero-blob-a { animation: heroBlob 9s ease-in-out infinite; }
        .hero-blob-b { animation: heroBlob 11s ease-in-out infinite reverse; }
        .hero-float-a { animation: heroFloat 6s ease-in-out infinite; }
        .hero-float-b { animation: heroFloatSlow 7s ease-in-out infinite; }
      `}</style>

      {/* ambient blobs */}
      <div className="hero-blob-a pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#2DBDB6] opacity-[0.12] blur-3xl" />
      <div className="hero-blob-b pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-[#0A0E2A] opacity-[0.06] blur-3xl" />

      <div className="container relative mx-auto px-5 py-14 sm:px-10 lg:px-[60px] lg:py-15">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-flex animate-in fade-in slide-in-from-bottom-1 items-center gap-1.5 rounded-full bg-[#E6F7F6] px-4 py-1.5 text-xs font-bold text-[#0A0E2A] duration-500">
              <Sparkles className="h-3.5 w-3.5 text-[#2DBDB6]" />
              ১০,০০০+ বই আপনার অপেক্ষায়
            </span>

            <h1 className="mt-5 animate-in fade-in slide-in-from-bottom-2 text-3xl font-extrabold leading-tight text-[#0A0E2A] duration-500 [animation-delay:100ms] sm:text-4xl lg:text-5xl">
              আপনার পরবর্তী
              <br />
              <span className="text-[#2DBDB6]">প্রিয় বইটি</span> খুঁজুন
            </h1>

            <p className="mx-auto mt-4 max-w-md animate-in fade-in slide-in-from-bottom-2 text-sm text-[#6B7280] duration-500 [animation-delay:150ms] sm:text-base lg:mx-0">
              উপন্যাস থেকে শুরু করে বিজ্ঞান, ব্যবসা কিংবা ধর্মীয় বই — সব ধরনের
              বইয়ের বিশাল সংগ্রহ এখন আপনার হাতের মুঠোয়।
            </p>

            {/* search */}
            <div className="mx-auto mt-7 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:200ms] lg:mx-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3AF]" />
                <input
                  placeholder="বইয়ের নাম বা লেখক খুঁজুন..."
                  className="
                    h-13 w-full rounded-full border border-[#E1E5E8] bg-white py-3.5 pl-11 pr-32
                    text-sm text-[#0A0E2A] shadow-[0_10px_25px_rgba(10,14,42,0.06)] outline-none
                    transition-all duration-200 placeholder:text-[#9AA3AF]
                    focus:border-[#2DBDB6] focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]
                  "
                />
                <button
                  className="
                    group absolute right-1.5 top-1/2 flex h-10 -translate-y-1/2 items-center gap-1.5
                    overflow-hidden rounded-full bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] px-4
                    text-xs font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]
                    transition-transform duration-150 hover:-translate-y-1/2 hover:scale-105 active:scale-95
                  "
                >
                  খুঁজুন
                </button>
              </div>
            </div>

            <div className="mt-7 flex animate-in fade-in slide-in-from-bottom-2 flex-wrap items-center justify-center gap-3 duration-500 [animation-delay:250ms] lg:justify-start">
              <Link
                href="/books"
                className="
                  group relative flex items-center gap-2 overflow-hidden rounded-full border-0
                  bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] px-6 py-3 text-sm font-bold text-white
                  shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform duration-150
                  hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
                  active:translate-y-0 active:scale-[0.98]
                "
              >
                <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
                <span className="relative flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  সব বই দেখুন
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <Link
                href="/offers"
                className="
                  rounded-full border border-[#E1E5E8] bg-white px-6 py-3 text-sm font-bold
                  text-[#0A0E2A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2DBDB6]
                  hover:text-[#2DBDB6]
                "
              >
                🎁 অফার দেখুন
              </Link>
            </div>
          </div>

          {/* Right: floating book stack illustration */}
          <div className="relative hidden h-80 items-center justify-center lg:flex">
            <div className="hero-float-a absolute left-8 top-4 h-40 w-28 rotate-[-8deg] rounded-2xl border border-[#E1E5E8] bg-gradient-to-br from-white to-[#F7F9FA] shadow-[0_20px_40px_rgba(10,14,42,0.12)]">
              <div className="m-4 h-2 w-3/4 rounded-full bg-[#E6F7F6]" />
              <div className="mx-4 mt-2 h-2 w-1/2 rounded-full bg-[#F1F3F5]" />
            </div>

            <div className="hero-float-b relative z-10 h-56 w-40 rounded-2xl border border-[#E1E5E8] bg-gradient-to-br from-[#0A0E2A] to-[#1a2050] shadow-[0_25px_50px_rgba(10,14,42,0.2)]">
              <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                <BookOpen className="h-9 w-9 text-[#2DBDB6]" />
                <div className="h-1.5 w-16 rounded-full bg-white/20" />
                <div className="h-1.5 w-10 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="hero-float-a absolute right-4 top-16 h-36 w-24 rotate-[10deg] rounded-2xl border border-[#E1E5E8] bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] shadow-[0_20px_40px_rgba(45,189,182,0.25)] [animation-delay:1s]" />
          </div>
        </div>
      </div>
    </section>
  );
}
