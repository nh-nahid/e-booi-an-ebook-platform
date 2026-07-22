
import BookSection from "./book-section";
import type { Book } from "../types/home.types";

interface PreOrderSectionProps {
  books: Book[];
}

export default function PreOrderSection({
  books,
}: PreOrderSectionProps) {
  if (!books.length) return null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0A0E2A]/[0.02] to-transparent" />

      <BookSection
        title="Pre-Order"
        href="/books?preOrder=true"
        books={books}
      />
    </div>
  );
}