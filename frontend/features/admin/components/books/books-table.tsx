"use client";

import Image from "next/image";
import { Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Book } from "@/features/admin/types/admin.types";

interface BooksTableProps {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function BooksTable({
  books,
  total,
  page,
  totalPages,
  onPageChange,
}: BooksTableProps) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1E5E8] bg-white shadow-sm">
      <div className="border-b border-[#E1E5E8] px-6 py-5">
        <h2 className="text-lg font-bold text-[#0A0E2A]">
          Books Inventory
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage all books available in your store.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[#F8FAFB]">
            <tr className="text-left text-sm font-semibold text-[#0A0E2A]">
              <th className="px-6 py-4">Cover</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                className="border-t border-[#EEF1F2] transition hover:bg-[#FAFCFC]"
              >
                <td className="px-6 py-4">
                  <Image
                    src={
                      book.coverImage
                        ? `${imageBaseUrl}/uploads/covers/${book.coverImage}`
                        : "/book-placeholder.png"
                    }
                    alt={book.title}
                    width={56}
                    height={80}
                    className="rounded-lg border object-cover"
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-[#0A0E2A]">
                    {book.title}
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    #{book._id.slice(-6)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {book.author}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-semibold text-[#2DBDB6]">
                    {book.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      book.bookType === "digital"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {book.bookType}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold">
                  ৳ {book.price}
                </td>

                <td className="px-6 py-4">
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

                <td className="px-6 py-4">
                  ⭐ {book.averageRating ?? 0}
                  <div className="text-xs text-gray-500">
                    ({book.reviewCount ?? 0})
                  </div>
                </td>

                <td className="px-6 py-4">
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

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                    >
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
                </td>
              </tr>
            ))}

            {books.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="py-16 text-center text-gray-500"
                >
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#E1E5E8] px-6 py-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold">
            {books.length === 0 ? 0 : (page - 1) * books.length + 1}–
            {(page - 1) * books.length + books.length}
          </span>{" "}
          of <span className="font-semibold">{total}</span> books
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Previous
          </Button>

          <Button
            size="sm"
            className="bg-[#2DBDB6] hover:bg-[#249d97]"
          >
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