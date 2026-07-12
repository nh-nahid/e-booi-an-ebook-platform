"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";



import type { Book } from "../types/home.types";
import SectionHeader from "./section-header";
import BookCard from "./book-card";

interface BookSectionProps {
  title: string;
  href?: string;
  books: Book[];
}

export default function BookSection({
  title,
  href = "/books",
  books,
}: BookSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({
      left: dir * 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="container relative mx-auto px-5 py-6 sm:px-10 lg:px-[60px]">
      <SectionHeader title={title} href={href} />

      <div className="group/row relative">
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E1E5E8] bg-white text-[#0A0E2A] opacity-0 shadow-md transition-all duration-200 hover:border-[#2DBDB6] hover:text-[#2DBDB6] group-hover/row:opacity-100 lg:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E1E5E8] bg-white text-[#0A0E2A] opacity-0 shadow-md transition-all duration-200 hover:border-[#2DBDB6] hover:text-[#2DBDB6] group-hover/row:opacity-100 lg:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {books.map((book, index) => (
            <BookCard
              key={book._id}
              book={book}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}