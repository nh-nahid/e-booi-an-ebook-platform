"use client";

import Image from "next/image";
import { Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Book } from "@/features/admin/types/admin.types";
import BookDialog, { BookFormValues } from "./BookDialog";
import BookViewDialog from "./BookViewDialog";

interface BooksTableProps {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;

  onUpdate: (id: string, values: BookFormValues) => Promise<void>;

  onDelete: (id: string) => Promise<void>;
}

export default function BooksTable({
  books,
  total,
  page,
  totalPages,
  onPageChange,
  onUpdate,
  onDelete,
}: BooksTableProps) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  const coverSrc = (book: Book) =>
    book.coverImage
      ? `${imageBaseUrl}/uploads/books/${book.coverImage}`
      : "/book-placeholder.jpg";
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1E5E8] bg-white shadow-sm">
      <div className="border-b border-[#E1E5E8] px-4 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-[#0A0E2A]">Books Inventory</h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage all books available in your store.
        </p>
      </div>

      {/* Desktop / tablet: table view */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] lg:min-w-[1100px]">
          <thead className="bg-[#F8FAFB]">
            <tr className="text-left text-sm font-semibold text-[#0A0E2A]">
              <th className="px-4 py-4 lg:px-6">Cover</th>
              <th className="px-4 py-4 lg:px-6">Title</th>
              <th className="px-4 py-4 lg:px-6">Author</th>
              <th className="px-4 py-4 lg:px-6">Category</th>
              <th className="px-4 py-4 lg:px-6">Type</th>
              <th className="px-4 py-4 lg:px-6">Price</th>
              <th className="px-4 py-4 lg:px-6">Stock</th>
              <th className="px-4 py-4 lg:px-6">Rating</th>
              <th className="px-4 py-4 lg:px-6">Status</th>
              <th className="px-4 py-4 text-center lg:px-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                className="border-t border-[#EEF1F2] transition hover:bg-[#FAFCFC]"
              >
                <td className="px-4 py-4 lg:px-6">
                  <Image
                    src={coverSrc(book)}
                    alt={book.title}
                    width={56}
                    height={80}
                    unoptimized
                    className="rounded-lg border object-cover"
                  />
                </td>

                <td className="px-4 py-4 text-sm lg:px-6">
                  <div className="font-semibold text-[#0A0E2A]">
                    {book.title}
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    #{book._id.slice(-6)}
                  </div>
                </td>

                <td className="px-4 text-sm py-4 lg:px-6">{book.author}</td>

                <td className="px-4 py-4 lg:px-6">
                  <span className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-semibold text-[#2DBDB6]">
                    {book.category}
                  </span>
                </td>

                <td className="px-4 py-4 lg:px-6">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      book.bookType === "Digital"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {book.bookType}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-semibold lg:px-6">
                  ৳ {book.price}
                </td>

                <td className="px-4 py-4 text-sm lg:px-6">
                  <span
                    className={`font-semibold ${
                      book.stock > 10
                        ? "text-green-600"
                        : book.stock > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {book.stock}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm lg:px-6">
                  ⭐ {book.averageRating ?? 0}
                  <div className="text-xs inline ml-1 text-gray-500">
                    ({book.reviewCount ?? 0})
                  </div>
                </td>

                <td className="px-4 py-4 lg:px-6">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      book.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.isPublished ? "Published" : "Draft"}
                  </span>
                </td>

                <td className="px-4 py-4 lg:px-6">
                  <div className="flex justify-center gap-2">
                    <BookViewDialog
                      book={book}
                      trigger={
                        <Button size="icon" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      }
                    />

                    <BookDialog
                      mode="edit"
                      initialValues={{
                        title: book.title,
                        author: book.author,
                        category: book.category,
                        publisher: book.publisher,
                        isbn: book.isbn,
                        language: book.language,
                        publicationDate: book.publicationDate,
                        pages: String(book.pages),
                        price: String(book.price),
                        stock: String(book.stock),
                        bookType: book.bookType,
                        status: book.isPublished ? "published" : "draft",
                        description: book.description,
                      }}
                      onSubmit={(values: BookFormValues) =>
                        onUpdate(book._id, values)
                      }
                      trigger={
                        <Button size="icon" variant="outline">
                          <Edit className="h-4 w-4 text-[#2DBDB6]" />
                        </Button>
                      }
                    />

                    <Button
                      size="icon"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50"
                      onClick={() => onDelete(book._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {books.length === 0 && (
              <tr>
                <td colSpan={10} className="py-16 text-center text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked card view */}
      <div className="divide-y divide-[#EEF1F2] md:hidden">
        {books.map((book) => (
          <div key={book._id} className="flex gap-4 px-4 py-4">
            <Image
              src={coverSrc(book)}
              alt={book.title}
              width={56}
              height={80}
              className="h-20 w-14 shrink-0 rounded-lg border object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-[#0A0E2A]">
                    {book.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    #{book._id.slice(-6)}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-600">
                    {book.author}
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    book.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {book.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EEF8F7] px-2.5 py-1 text-xs font-semibold text-[#2DBDB6]">
                  {book.category}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    book.bookType === "Digital"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {book.bookType}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0A0E2A]">
                  ৳ {book.price}
                </span>

                <span
                  className={`font-semibold ${
                    book.stock > 10
                      ? "text-green-600"
                      : book.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  Stock: {book.stock}
                </span>

                <span className="text-gray-500">
                  ⭐ {book.averageRating ?? 0} ({book.reviewCount ?? 0})
                </span>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Button size="icon" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>

                <Button size="icon" variant="outline">
                  <Edit className="h-4 w-4 text-[#2DBDB6]" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="py-16 text-center text-gray-500">No books found.</div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E1E5E8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold">
            {books.length === 0 ? 0 : (page - 1) * books.length + 1}–
            {(page - 1) * books.length + books.length}
          </span>{" "}
          of <span className="font-semibold">{total}</span> books
        </p>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Previous
          </Button>

          <Button size="sm" className="bg-[#2DBDB6] hover:bg-[#249d97]">
            {page}
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
