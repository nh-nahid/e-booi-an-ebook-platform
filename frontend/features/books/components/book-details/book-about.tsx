"use client";

import { useState } from "react";

interface BookAboutProps {
  description: string;
}

export default function BookAbout({ description }: BookAboutProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <section className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:80ms]">
      <h2 className="mb-3 text-lg font-extrabold text-ink">বই সম্পর্কে</h2>
      <p
        className={`max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-ink ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 text-xs font-bold text-brand transition-colors hover:text-brand-strong"
      >
        {expanded ? "সংক্ষেপে দেখুন" : "আরও পড়ুন"}
      </button>
    </section>
  );
}
