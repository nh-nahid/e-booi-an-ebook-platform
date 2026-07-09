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
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0A0E2A]">Top Books</h3>
          <p className="text-xs text-[#6B7280]">Best sellers this month</p>
        </div>
        <Link
          href="/admin/books"
          className="flex items-center gap-1 text-xs font-bold text-[#2DBDB6] transition-colors hover:text-[#1f9d97]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {books.map((book, i) => (
          <div
            key={book.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F7F9FA]"
          >
            <span className="w-5 shrink-0 text-center text-xs font-bold text-[#9AA3AF]">
              {i + 1}
            </span>

            <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0A0E2A]">{book.title}</p>
              <p className="truncate text-xs text-[#6B7280]">{book.author}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-bold text-[#0A0E2A]">{book.sales} sold</span>
              {typeof book.rating === "number" && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#9AA3AF]">
                  <Star className="h-3 w-3 fill-[#2DBDB6] text-[#2DBDB6]" />
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
