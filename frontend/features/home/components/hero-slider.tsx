"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <div>
      <div className="relative">
        <div
          className="relative overflow-hidden rounded border border-[#E1E5E8] shadow-[0_10px_30px_rgba(10,14,42,0.06)] sm:rounded-lg"
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
        </div>

        {slides.length > 1 && (
          <>
            {/* Positioned so ~40% of the button sits outside the banner's
                left edge and ~60% overlaps it — translateX is relative to
                the button's own width, so -40%/40% is what places the seam
                there regardless of button size. */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="
                absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-[40%] -translate-y-1/2
                items-center justify-center rounded-full bg-white text-[#0A0E2A] shadow-md
                transition-all duration-200 hover:bg-[#F7F9FA]
                sm:flex
              "
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="
                absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-[40%] -translate-y-1/2
                items-center justify-center rounded-full bg-white text-[#0A0E2A] shadow-md
                transition-all duration-200 hover:bg-[#F7F9FA]
                sm:flex
              "
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#2DBDB6]" : "w-1.5 bg-[#E1E5E8]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
