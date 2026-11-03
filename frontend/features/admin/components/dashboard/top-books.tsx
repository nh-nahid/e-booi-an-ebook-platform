"use client";

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

export interface TopBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  sales: number;
  rating?: number;
}

interface TopBooksProps {
  books: TopBook[];
}

export default function TopBooks({ books }: TopBooksProps) {
  console.log(books);
  
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Top Books</h3>
          <p className="text-xs text-muted-ink">Best sellers this month</p>
        </div>
        <Link
          href="/admin/books"
          className="flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-strong"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {books.map((book, i) => (
          <div
            key={book.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-canvas"
          >
            <span className="w-5 shrink-0 text-center text-xs font-bold text-subtle">
              {i + 1}
            </span>

            <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md border border-line bg-gradient-to-br from-soft to-line">
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{book.title}</p>
              <p className="truncate text-xs text-muted-ink">{book.author}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-bold text-ink">{book.sales} sold</span>
              {typeof book.rating === "number" && (
                <span className="flex items-center gap-0.5 text-[11px] text-subtle">
                  <Star className="h-3 w-3 fill-brand text-brand" />
                  {book.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
