"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PromoSlide {
  id: string;
  /** Path relative to /public, e.g. "/images/hero/banner-1.png" */
  image: string;
  /** Accessible alt text describing the banner's offer */
  alt: string;
  ctaHref: string;
}

// TODO: wire this up to real promo/campaign data (from your CMS or homeData) instead of hardcoding
const DEFAULT_SLIDES: PromoSlide[] = [
  {
    id: "slide-1",
    image: "/images/hero/banner-1.png",
    alt: "সব বইয়ে সর্বনিম্ন ৬০% ছাড় — EBO6 কুপন কোড ব্যবহার করুন",
    ctaHref: "/books?offer=true",
  },
  {
    id: "slide-2",
    image: "/images/hero/banner-2.png",
    alt: "এই সপ্তাহের নতুন বইগুলো দেখুন",
    ctaHref: "/books?sort=latest",
  },
  {
    id: "slide-3",
    image: "/images/hero/banner-3.png",
    alt: "এখনই পড়ুন, ডাউনলোডের ঝামেলা নেই — eBook রিডার",
    ctaHref: "/books?type=ebook",
  },
];

// Design canvas: 1323.7 x 323px (~4.1:1) — export @2x as 2647x646 for retina
const BANNER_ASPECT_RATIO = "1323.7 / 323";

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
      style={{ aspectRatio: BANNER_ASPECT_RATIO }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative h-full w-full shrink-0"
            aria-label={slide.alt}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
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
