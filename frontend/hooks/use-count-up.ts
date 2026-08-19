"use client";

import { useEffect, useState } from "react";

/**
 * Animates a number from 0 up to `target` using requestAnimationFrame
 * with an ease-out curve. Set `start: false` to hold at 0 until a
 * scroll-reveal (or other trigger) flips it to true.
 */
export function useCountUp(
  target: number,
  options?: { duration?: number; start?: boolean },
) {
  const { duration = 1200, start = true } = options ?? {};
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || !target) return;

    let raf: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
