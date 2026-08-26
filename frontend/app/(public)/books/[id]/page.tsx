"use client";

import { useParams } from "next/navigation";

import SiteFooter from "@/components/layout/site-footer";

import { useBook, useRelatedBooks } from "@/features/books/hooks/use-book";
import { useBookReviews } from "@/features/reviews/hooks/use-review";

import Breadcrumb from "@/features/books/components/book-details/breadcrumb";
import BookHero from "@/features/books/components/book-details/book-hero";
import BookAbout from "@/features/books/components/book-details/book-about";
import ReviewSection from "@/features/books/components/book-details/review-section";
import RelatedBooksGrid from "@/features/books/components/book-details/related-books-grid";
import Loading from "@/app/loading";

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const { data: book, isLoading } = useBook(bookId);
  const { data: relatedBooks = [] } = useRelatedBooks(
    book?.category,
    book?._id,
  );
  const { data: reviews = [] } = useBookReviews(book?._id);

  if (isLoading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Book not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: book.category,
              href: `/books?category=${encodeURIComponent(book.category)}`,
            },
            {
              label: book.title,
            },
          ]}
        />
      </div>

      <div className="container mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <BookHero
          book={{
            id: book._id,
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            // No `originalPrice` field exists on the Book model yet, so
            // there's nothing real to show here — keeping this undefined
            // (rather than inventing a number) means the strikethrough /
            // discount badge only ever appears once that field is real.
            originalPrice: undefined,
            coverImage: book.coverImage,
            bookType: book.bookType,
            pdfFile: book.pdfFile,
            stock: book.stock,
            sold: book.sold,
            views: book.views ?? 0,
            isPreOrder: book.isPreOrder,
            isFeatured: book.isFeatured,
            averageRating: book.averageRating,
            reviewCount: book.reviewCount,
          }}
        />

        <BookAbout description={book.description} />

        <ReviewSection bookId={book._id} reviews={reviews} />

        <RelatedBooksGrid books={relatedBooks} />
      </div>

      <SiteFooter />
    </div>
  );
}
