import BookSection from "@/features/home/components/book-section";
import { Book } from "../../types/book.types";


interface RelatedBooksProps {
  books: Book[];
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
  if (books.length === 0) return null;

  return <BookSection title="Related Books" href="/books" books={books} />;
}
