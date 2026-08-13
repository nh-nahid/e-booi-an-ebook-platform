"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";

export interface PromoSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  couponCode?: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string; // tailwind gradient classes
  imageSrc: string; // real book photo, ideally a transparent-bg cut-out PNG
  imageAlt: string;
}

// TODO: wire this up to real promo/campaign data (from your CMS or homeData) instead of hardcoding
const DEFAULT_SLIDES: PromoSlide[] = [
  {
    id: "slide-1",
    eyebrow: "বিশেষ নির্দেশনা!",
    title: "সব বইয়ে সর্বনিম্ন ৬০% ছাড়",
    description: 'যেকোনো বই ক্রয়ের সময় "EBO6" কুপন কোডটি ব্যবহার করুন।',
    couponCode: "EBO6",
    ctaLabel: "এখনই কিনুন",
    ctaHref: "/books?offer=true",
    gradient: "from-[#E6F7F6] to-[#CFF0EE]",
    imageSrc: "/images/hero/flash-sale-books.png",
    imageAlt: "Stack of discounted books",
  },
  {
    id: "slide-2",
    eyebrow: "নতুন সংযোজন",
    title: "এই সপ্তাহের নতুন বইগুলো দেখুন",
    description: "প্রতি সপ্তাহে যোগ হচ্ছে নতুন নতুন শিরোনাম, সব ক্যাটাগরিতে।",
    ctaLabel: "নতুন বই দেখুন",
    ctaHref: "/books?sort=latest",
    gradient: "from-[#0A0E2A] to-[#1a2050]",
    imageSrc: "/images/hero/new-arrivals-books.png",
    imageAlt: "Stack of newly arrived books",
  },
  {
    id: "slide-3",
    eyebrow: "eBook রিডার",
    title: "এখনই পড়ুন, ডাউনলোডের ঝামেলা নেই",
    description: "হাজারো eBook সরাসরি ব্রাউজারে পড়ুন — যেকোনো ডিভাইসে, যেকোনো সময়।",
    ctaLabel: "eBook ব্রাউজ করুন",
    ctaHref: "/books?type=ebook",
    gradient: "from-[#2DBDB6] to-[#1f9d97]",
    imageSrc: "/images/hero/ebook-reader-books.png",
    imageAlt: "Open book being read on a tablet",
  },
];

interface HeroSliderProps {
  slides?: PromoSlide[];
  autoPlayMs?: number;
}

export default function HeroSlider({ slides = DEFAULT_SLIDES, autoPlayMs = 5000 }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => setActive(((index % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayMs, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    if (delta < -40) next();
    touchStartX.current = null;
  };

  return (
    <div
      className="group/slider relative overflow-hidden rounded-3xl border border-[#E1E5E8] shadow-[0_10px_30px_rgba(10,14,42,0.06)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isDark = slide.gradient.includes("0A0E2A") || slide.gradient.includes("1f9d97");
          return (
            <div key={slide.id} className={`w-full shrink-0 bg-gradient-to-br ${slide.gradient} px-6 py-8 sm:px-10 sm:py-10`}>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-lg">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      isDark ? "bg-white/15 text-white" : "bg-white/70 text-[#0A0E2A]"
                    }`}
                  >
                    {slide.eyebrow}
                  </span>

                  <h2
                    className={`mt-3 text-xl font-extrabold leading-snug sm:text-2xl ${
                      isDark ? "text-white" : "text-[#0A0E2A]"
                    }`}
                  >
                    {slide.title}
                  </h2>

                  <p className={`mt-2 text-sm ${isDark ? "text-white/80" : "text-[#0A0E2A]/70"}`}>
                    {slide.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.ctaHref}
                      className={`
                        rounded-full px-5 py-2.5 text-xs font-bold transition-transform duration-150
                        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                        ${
                          isDark
                            ? "bg-white text-[#0A0E2A] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                            : "bg-[#0A0E2A] text-white shadow-[0_4px_12px_rgba(10,14,42,0.25)]"
                        }
                      `}
                    >
                      {slide.ctaLabel}
                    </Link>

                    {slide.couponCode && (
                      <span
                        className={`
                          flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5
                          text-xs font-bold
                          ${isDark ? "border-white/40 text-white" : "border-[#0A0E2A]/30 text-[#0A0E2A]"}
                        `}
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        {slide.couponCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* real book photo, replacing the old decorative CSS bars */}
                <div className="relative hidden h-40 w-40 shrink-0 sm:block sm:h-48 sm:w-48">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes="192px"
                    priority={index === 0}
                    className="object-contain drop-shadow-[0_12px_20px_rgba(10,14,42,0.25)]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="
              absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center
              rounded-full bg-white/80 text-[#0A0E2A] opacity-0 shadow-md backdrop-blur transition-all
              duration-200 hover:bg-white group-hover/slider:opacity-100
            "
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="
              absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center
              rounded-full bg-white/80 text-[#0A0E2A] opacity-0 shadow-md backdrop-blur transition-all
              duration-200 hover:bg-white group-hover/slider:opacity-100
            "
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
