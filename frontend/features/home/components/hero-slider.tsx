"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  artwork: "discount" | "new-arrivals" | "ebook-reader";
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
    artwork: "discount",
  },
  {
    id: "slide-2",
    eyebrow: "নতুন সংযোজন",
    title: "এই সপ্তাহের নতুন বইগুলো দেখুন",
    description: "প্রতি সপ্তাহে যোগ হচ্ছে নতুন নতুন শিরোনাম, সব ক্যাটাগরিতে।",
    ctaLabel: "নতুন বই দেখুন",
    ctaHref: "/books?sort=latest",
    gradient: "from-[#0A0E2A] to-[#1a2050]",
    artwork: "new-arrivals",
  },
  {
    id: "slide-3",
    eyebrow: "eBook রিডার",
    title: "এখনই পড়ুন, ডাউনলোডের ঝামেলা নেই",
    description: "হাজারো eBook সরাসরি ব্রাউজারে পড়ুন — যেকোনো ডিভাইসে, যেকোনো সময়।",
    ctaLabel: "eBook ব্রাউজ করুন",
    ctaHref: "/books?type=ebook",
    gradient: "from-[#2DBDB6] to-[#1f9d97]",
    artwork: "ebook-reader",
  },
];

/* Realistic-ish 3D book mockups rendered as inline SVG — no external image files needed. */

function DiscountBooksArtwork() {
  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" role="img" aria-label="Stack of discounted books">
      <defs>
        <linearGradient id="hs-pageA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF8EF" />
          <stop offset="1" stopColor="#E9E2CC" />
        </linearGradient>
        <linearGradient id="hs-coverA1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B7A6E" />
          <stop offset="1" stopColor="#0F9384" />
        </linearGradient>
        <linearGradient id="hs-coverA2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B5471F" />
          <stop offset="1" stopColor="#D9622F" />
        </linearGradient>
        <linearGradient id="hs-coverA3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#183E63" />
          <stop offset="1" stopColor="#215486" />
        </linearGradient>
      </defs>
      <g transform="translate(130,165)">
        <ellipse cx="0" cy="8" rx="115" ry="14" fill="#0A0E2A" opacity="0.08" />
        <g transform="translate(-100,-40)">
          <rect x="0" y="30" width="150" height="16" fill="url(#hs-pageA)" />
          <rect x="0" y="30" width="150" height="16" fill="none" stroke="#0A0E2A" strokeWidth="0.5" opacity="0.15" />
          <rect x="-4" y="14" width="158" height="18" rx="2" fill="url(#hs-coverA1)" />
          <rect x="-4" y="14" width="10" height="18" fill="#085041" />
        </g>
        <g transform="translate(-70,-58)">
          <rect x="0" y="30" width="140" height="16" fill="url(#hs-pageA)" />
          <rect x="0" y="30" width="140" height="16" fill="none" stroke="#0A0E2A" strokeWidth="0.5" opacity="0.15" />
          <rect x="-4" y="14" width="148" height="18" rx="2" fill="url(#hs-coverA2)" />
          <rect x="-4" y="14" width="10" height="18" fill="#8C3416" />
        </g>
        <g transform="translate(-55,-90) rotate(-4)">
          <rect x="0" y="30" width="110" height="42" fill="url(#hs-pageA)" />
          <rect x="0" y="30" width="110" height="42" fill="none" stroke="#0A0E2A" strokeWidth="0.5" opacity="0.15" />
          <rect x="-5" y="-3" width="120" height="35" rx="3" fill="url(#hs-coverA3)" />
          <rect x="-5" y="-3" width="12" height="35" fill="#112D49" />
          <line x1="35" y1="8" x2="95" y2="8" stroke="#8FB3D8" strokeWidth="2" opacity="0.6" />
          <line x1="35" y1="16" x2="80" y2="16" stroke="#8FB3D8" strokeWidth="2" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
}

function NewArrivalsBooksArtwork() {
  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" role="img" aria-label="Row of new arrival books">
      <defs>
        <linearGradient id="hs-spineB1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9622F" />
          <stop offset="1" stopColor="#B5471F" />
        </linearGradient>
        <linearGradient id="hs-spineB2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3FB8AC" />
          <stop offset="1" stopColor="#0F9384" />
        </linearGradient>
        <linearGradient id="hs-spineB3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F0C24A" />
          <stop offset="1" stopColor="#D9A32B" />
        </linearGradient>
        <linearGradient id="hs-spineB4" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E0578B" />
          <stop offset="1" stopColor="#C13D6E" />
        </linearGradient>
      </defs>
      <g transform="translate(130,190)">
        <ellipse cx="0" cy="8" rx="120" ry="12" fill="#000000" opacity="0.25" />
        <g transform="translate(-100,0)">
          <rect x="0" y="-118" width="36" height="118" rx="2" fill="url(#hs-spineB1)" />
          <rect x="4" y="-108" width="28" height="2" fill="#FBEFE5" opacity="0.7" />
          <rect x="4" y="-100" width="20" height="2" fill="#FBEFE5" opacity="0.5" />
        </g>
        <g transform="translate(-58,0)">
          <rect x="0" y="-150" width="36" height="150" rx="2" fill="url(#hs-spineB2)" />
          <rect x="4" y="-138" width="28" height="2" fill="#E7FBF6" opacity="0.7" />
          <rect x="4" y="-130" width="20" height="2" fill="#E7FBF6" opacity="0.5" />
        </g>
        <g transform="translate(-16,0)">
          <rect x="0" y="-100" width="36" height="100" rx="2" fill="url(#hs-spineB3)" />
          <rect x="4" y="-90" width="28" height="2" fill="#4A3200" opacity="0.5" />
          <rect x="4" y="-82" width="20" height="2" fill="#4A3200" opacity="0.35" />
        </g>
        <g transform="translate(26,0) rotate(6)">
          <rect x="0" y="-132" width="36" height="132" rx="2" fill="url(#hs-spineB4)" />
          <rect x="4" y="-120" width="28" height="2" fill="#FCE7F0" opacity="0.7" />
          <rect x="4" y="-112" width="20" height="2" fill="#FCE7F0" opacity="0.5" />
        </g>
        <g transform="translate(-100,4)">
          <rect x="-4" y="0" width="176" height="10" rx="2" fill="#EDE6D0" />
        </g>
      </g>
    </svg>
  );
}

function EbookReaderArtwork() {
  return (
    <svg viewBox="0 0 260 220" className="h-full w-full" role="img" aria-label="Open book next to a reading tablet">
      <defs>
        <linearGradient id="hs-pageC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDE9DA" />
        </linearGradient>
      </defs>
      <g transform="translate(150,60)">
        <rect x="-2" y="-2" width="130" height="130" rx="14" fill="#0A0E2A" />
        <rect x="4" y="4" width="118" height="118" rx="8" fill="#F4FBFA" />
        <rect x="14" y="18" width="98" height="6" rx="2" fill="#0A0E2A" opacity="0.7" />
        <rect x="14" y="32" width="98" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="40" width="98" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="48" width="70" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="64" width="98" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="72" width="98" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="80" width="56" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="96" width="98" height="3" rx="1.5" fill="#8C93A8" />
        <rect x="14" y="104" width="78" height="3" rx="1.5" fill="#8C93A8" />
      </g>
      <g transform="translate(105,180)">
        <ellipse cx="0" cy="6" rx="100" ry="9" fill="#0A0E2A" opacity="0.15" />
        <path d="M-92,-6 Q-92,-20 -77,-22 L-6,-13 L-6,18 L-77,9 Q-92,7 -92,-6 Z" fill="url(#hs-pageC)" />
        <path d="M92,-6 Q92,-20 77,-22 L6,-13 L6,18 L77,9 Q92,7 92,-6 Z" fill="url(#hs-pageC)" />
        <path d="M-87,-13 L-14,-7" stroke="#B9C2C0" strokeWidth="1.3" fill="none" />
        <path d="M-87,-4 L-18,2" stroke="#B9C2C0" strokeWidth="1.3" fill="none" />
        <path d="M87,-13 L14,-7" stroke="#B9C2C0" strokeWidth="1.3" fill="none" />
        <path d="M87,-4 L18,2" stroke="#B9C2C0" strokeWidth="1.3" fill="none" />
        <path d="M-6,-13 L-6,18 L6,18 L6,-13 Z" fill="#0A0E2A" opacity="0.12" />
      </g>
    </svg>
  );
}

function SlideArtwork({ artwork }: { artwork: PromoSlide["artwork"] }) {
  if (artwork === "discount") return <DiscountBooksArtwork />;
  if (artwork === "new-arrivals") return <NewArrivalsBooksArtwork />;
  return <EbookReaderArtwork />;
}

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
        {slides.map((slide) => {
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

                {/* realistic-ish 3D book mockup, rendered as inline SVG (no external image files) */}
                <div className="hidden h-40 w-40 shrink-0 sm:block sm:h-48 sm:w-48">
                  <SlideArtwork artwork={slide.artwork} />
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
