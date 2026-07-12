"use client";

import { useParams } from "next/navigation";

import SiteFooter from "@/components/layout/site-footer";

import { useBook, useBookReviews, useRelatedBooks } from "@/features/books/hooks/use-book";

import Breadcrumb from "@/features/books/components/book-details/breadcrumb";
import BookGallery from "@/features/books/components/book-details/book-gallery";
import BookInfo from "@/features/books/components/book-details/book-info";
import BookTabs from "@/features/books/components/book-details/book-tabs";
import ReviewList from "@/features/books/components/book-details/review-list";
import RelatedBooks from "@/features/books/components/book-details/related-books";
import Loading from "@/app/loading";

export default function BookDetailPage() {
  const params = useParams();

  const { data: book, isLoading } = useBook(params.id as string);
  const { data: relatedBooks = [] } = useRelatedBooks(
  book?.category,
  book?._id
);
const { data: reviews = [] } = useBookReviews(book?._id);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Book not found.
      </div>
    );
  }

  const galleryImages = [book.coverImage];

  const bookDetails = [
    {
      label: "Author",
      value: book.author,
    },
    {
      label: "Category",
      value: book.category,
    },
    {
      label: "Format",
      value: book.bookType,
    },
    {
      label: "Stock",
      value: String(book.stock),
    },
    {
      label: "Sold",
      value: String(book.sold),
    },
    {
      label: "Published",
      value: book.isPublished ? "Yes" : "No",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="container mx-auto px-5 py-5 sm:px-10 lg:px-[60px]">
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

      <div className="container mx-auto px-5 pb-10 sm:px-10 lg:px-[60px]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <BookGallery
              title={book.title}
              images={galleryImages}
              badge={
                book.isPreOrder
                  ? "pre-order"
                  : book.isFeatured
                    ? "popular"
                    : undefined
              }
            />
          </div>

          <BookInfo
            book={{
              id: book._id,
              title: book.title,
              author: book.author,
              category: book.category,
              price: book.price,
              originalPrice: undefined,
              rating: book.averageRating,
              reviewCount: book.reviewCount,
              stock: book.stock,
              description: book.description,
              bookType: book.bookType === "Digital" ? "digital" : "physical",
              status: book.isPreOrder ? "pre-order" : "published",
            }}
            onAddToCart={async (qty) => {
              console.log("Add to cart", book._id, qty);
            }}
            onBuyNow={async (qty) => {
              console.log("Buy now", book._id, qty);
            }}
          />
        </div>

        <BookTabs
          description={book.description}
          details={bookDetails}
          reviewsSlot={
    <ReviewList
      reviews={reviews}
      averageRating={book.averageRating}
    />
  }
        />
      </div>

      <RelatedBooks books={relatedBooks} />

      <SiteFooter />
    </div>
  );
}
