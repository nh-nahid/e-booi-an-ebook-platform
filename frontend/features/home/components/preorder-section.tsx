"use client";

import BookSection from "./book-section";
import type { Book } from "./book-card";

const PREORDER_BOOKS: Book[] = [
  { id: "11", title: "বইয়ের নাম ১১", badge: "pre-order" },
  { id: "12", title: "বইয়ের নাম ১২", badge: "pre-order" },
  { id: "13", title: "বইয়ের নাম ১৩", badge: "pre-order" },
  { id: "14", title: "বইয়ের নাম ১৪", badge: "pre-order" },
];

export default function PreOrderSection() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0A0E2A]/[0.02] to-transparent" />
      <BookSection title="Pre-Order" href="/pre-order" books={PREORDER_BOOKS} />
    </div>
  );
}
