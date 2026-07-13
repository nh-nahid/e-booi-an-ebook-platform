import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function EmptyCheckout() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E1E5E8] bg-white py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F7F6]">
        <BookOpen className="h-7 w-7 text-[#2DBDB6]" />
      </div>
      <h2 className="mt-4 text-lg font-extrabold text-[#0A0E2A]">
        Your cart is empty
      </h2>
      <p className="mt-1 max-w-xs text-sm text-[#6B7280]">
        Looks like you haven&apos;t added any books yet. Browse our collection
        to find your next read.
      </p>
      <Link
        href="/books"
        className="mt-6 rounded-full bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Browse Books
      </Link>
    </div>
  );
}