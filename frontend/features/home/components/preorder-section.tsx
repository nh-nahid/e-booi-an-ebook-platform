import { Clock } from "lucide-react";

import BookSection from "./book-section";
import type { Book } from "../types/home.types";

interface PreOrderSectionProps {
  books: Book[];
}

export default function PreOrderSection({ books }: PreOrderSectionProps) {
  if (!books.length) return null;

  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes preorderPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        .preorder-glow { animation: preorderPulse 6s ease-in-out infinite; }
      `}</style>

      <div className="preorder-glow pointer-events-none absolute -top-10 right-0 h-56 w-56 rounded-full bg-[#0A0E2A]/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0A0E2A]/[0.02] to-transparent" />

      <div className="container relative mx-auto -mb-2 flex px-5 pt-6 sm:px-10 lg:px-[60px]">
        <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-[#0A0E2A] px-3 py-1 text-[11px] font-bold text-white">
          <Clock className="h-3 w-3" />
          শীঘ্রই আসছে
        </span>
      </div>

      <BookSection title="প্রি-অর্ডার" href="/books?preOrder=true" books={books} />
    </div>
  );
}
