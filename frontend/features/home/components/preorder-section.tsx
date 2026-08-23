import { Clock } from "lucide-react";

import BookSection from "./book-section";
import type { Book } from "../types/home.types";

interface PreOrderSectionProps {
  books: Book[];
}

export default function PreOrderSection({ books }: PreOrderSectionProps) {
  if (!books.length) return null;

  return (
    <div className="relative sm:pb-10 overflow-hidden">
      <style>{`
        @keyframes preorderPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        .preorder-glow { animation: preorderPulse 6s ease-in-out infinite; }
      `}</style>

      <div className="preorder-glow pointer-events-none absolute -top-10 right-0 h-56 w-56 rounded-full bg-[#0A0E2A]/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0A0E2A]/[0.02] to-transparent" />


      <BookSection title="প্রি-অর্ডার" href="/books?preOrder=true" books={books} />
    </div>
  );
}
