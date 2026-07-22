"use client";

import Image from "next/image";
import { FileText, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { Book } from "@/features/admin/types/admin.types";

interface BookViewDialogProps {
  book: Book;
  trigger?: React.ReactElement;
}

export default function BookViewDialog({
  book,
  trigger,
}: BookViewDialogProps) {
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  const coverSrc = book.coverImage
    ? `${imageBaseUrl}/uploads/books/${book.coverImage}`
    : "/book-placeholder.jpg";

  const pdfUrl = book.pdfFile
    ? `${imageBaseUrl}/uploads/pdfs/${book.pdfFile}`
    : null;

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="icon" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          )
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#E1E5E8] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A0E2A]">
            Book Details
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            View complete information about this book.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Section */}
          <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
            {/* Cover */}
            <div className="overflow-hidden rounded-2xl border bg-gray-50">
              <Image
                src={coverSrc}
                alt={book.title}
                width={180}
                height={250}
                className="h-[250px] w-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0E2A]">
                  {book.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  By {book.author}
                </p>
              </div>


              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem
                  label="Category"
                  value={book.category}
                />

                <InfoItem
                  label="Book Type"
                  value={book.bookType}
                />

                <InfoItem
                  label="Price"
                  value={`৳ ${book.price}`}
                />

                <InfoItem
                  label="Stock"
                  value={String(book.stock)}
                />

                <InfoItem
                  label="Rating"
                  value={`⭐ ${book.averageRating ?? 0} (${book.reviewCount ?? 0})`}
                />

                <InfoItem
                  label="Status"
                  value={
                    book.isPublished
                      ? "Published"
                      : "Draft"
                  }
                />
              </div>
            </div>
          </div>


          {/* Description */}
          <div className="rounded-2xl border border-[#E1E5E8] p-4">
            <h3 className="mb-2 text-sm font-bold text-[#0A0E2A]">
              Description
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              {book.description || "No description available."}
            </p>
          </div>


          {/* Files */}
          {book.pdfFile && (
            <div className="rounded-2xl border border-[#E1E5E8] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#0A0E2A]">
                Digital File
              </h3>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#2DBDB6]" />

                  <span className="text-sm text-gray-600">
                    {book.pdfFile}
                  </span>
                </div>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#2DBDB6] hover:underline"
                  >
                    View PDF
                  </a>
                )}
              </div>
            </div>
          )}


          {/* Metadata */}
          <div className="grid gap-4 rounded-2xl border border-[#E1E5E8] p-4 sm:grid-cols-2">
            <InfoItem
              label="Created At"
              value={new Date(
                book.createdAt
              ).toLocaleDateString()}
            />

            <InfoItem
              label="Updated At"
              value={new Date(
                book.updatedAt
              ).toLocaleDateString()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#0A0E2A]">
        {value}
      </p>
    </div>
  );
}