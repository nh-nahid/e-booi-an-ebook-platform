"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  /** Skip the observer and report `true` immediately (e.g. above-the-fold content). */
  disabled?: boolean;
}

/**
 * Tracks whether an element has scrolled into the viewport at least once.
 * Used to trigger scroll-reveal animations without pulling in a library —
 * once true it stays true (no re-hide on scroll-away, avoids flicker).
 */
export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(!!options?.disabled);

  useEffect(() => {
    if (options?.disabled) return;

    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, options?.disabled]);

  return { ref, inView } as const;
}
