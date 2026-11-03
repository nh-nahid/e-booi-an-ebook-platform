"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface PromoSlide {
  id: string;
  /** Path relative to /public, e.g. "/images/hero/banner-1.png" */
  image: string;
  /** Optional mobile-only override, sized for the 2.3:1 mobile crop (e.g. 800x348) */
  mobileImage?: string;
  /** Accessible alt text describing the banner's offer */
  alt: string;
  ctaHref: string;
}

// TODO: wire this up to real promo/campaign data (from your CMS or homeData) instead of hardcoding
// Single-banner setup: only one promo slide right now (EB06 coupon), with
// separate desktop/mobile crops. When more promos are ready, add more
// entries here — the slider's dots/autoplay/swipe logic already only
// activates once slides.length > 1.
const DEFAULT_SLIDES: PromoSlide[] = [
  {
    id: "slide-1",
    image: "/images/hero/banner-1.png",
    mobileImage: "/images/hero/banner-1-mobile.png",
    alt: "সব বইয়ে সর্বদা ৬% ছাড় — EB06 কুপন কোড ব্যবহার করুন",
    ctaHref: "/books?offer=true",
  },
];

// Design canvas: 1323.7 x 323px (~4.1:1) — export @2x as 2647x646 for retina.
// That ratio is used from sm: up; mobile uses a taller 2:1 crop instead
// (see the banner's className below) so the banner doesn't shrink to a
// thin strip on small screens.

interface HeroSliderProps {
  slides?: PromoSlide[];
  autoPlayMs?: number;
}

export default function HeroSlider({ slides = DEFAULT_SLIDES, autoPlayMs = 8000 }: HeroSliderProps) {
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
          className="relative aspect-[2.3/1] overflow-hidden rounded border border-line shadow-[0_10px_30px_rgba(10,14,42,0.06)] sm:aspect-[1323.7/323] sm:rounded-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="relative h-full w-full shrink-0"
                aria-label={slide.alt}
              >
                {slide.mobileImage ? (
                  <>
                    <Image
                      src={slide.mobileImage}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover sm:hidden"
                    />
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="hidden object-cover sm:block"
                    />
                  </>
                ) : (
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-1.5 flex items-center justify-center gap-1.5 sm:mt-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full bg-muted-ink transition-all duration-300 ${
                i === active ? "opacity-100" : "opacity-30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
