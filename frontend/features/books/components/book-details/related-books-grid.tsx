"use client";

import Link from "next/link";
import Image from "next/image";

import getCoverImageUrl from "@/features/home/utils/getCoverImageUrl";
import { bn } from "@/features/books/utils/bn-number";
import type { Book } from "@/features/books/types/book.types";

interface RelatedBooksGridProps {
  books: Book[];
}

// cycling gradient palette so related-book cards look distinct even
// without a real cover image, same idea as the homepage's book cards.
const GRADIENTS = [
  "from-[#1f6b5c] to-[#0d3b34]",
  "from-[#2b4a7d] to-[#12213d]",
  "from-[#2f7d5c] to-[#12141f]",
  "from-[#6b4a8a] to-[#3a2555]",
  "from-[#a5445c] to-[#5c2030]",
  "from-[#4a3a2a] to-[#1c150e]",
];

export default function RelatedBooksGrid({ books }: RelatedBooksGridProps) {
  if (books.length === 0) return null;

  return (
    <section className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:160ms]">
      <h2 className="mb-4 text-lg font-extrabold text-[#0A0E2A]">
        আরও পছন্দ হতে পারে
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book, i) => {
          const cover = getCoverImageUrl(book.coverImage);

          return (
            <Link
              key={book._id}
              href={`/books/${book._id}`}
              style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
              className="group block animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
            >
              <div
                className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br p-3 text-center shadow-[0_4px_14px_rgba(10,14,42,0.1)] transition-transform duration-300 group-hover:-translate-y-1 ${
                  GRADIENTS[i % GRADIENTS.length]
                }`}
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={book.title}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 200px, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-bold leading-snug text-white">
                    {book.title}
                  </span>
                )}
              </div>

              <p className="mt-2 line-clamp-1 text-sm font-bold text-[#0A0E2A]">
                {book.title}
              </p>
              <p className="text-sm font-extrabold text-[#2DBDB6]">
                ৳{bn(book.price)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
