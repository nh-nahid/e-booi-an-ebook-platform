"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import BooksFilter from "@/features/admin/components/books/books-filter";
import BooksTable from "@/features/admin/components/books/books-table";
import { useBooks, useCreateBook } from "@/features/admin/hooks/admin.hooks";

import BooksLoading from "./loading";
import { useDebounce } from "@/hooks/use-debounce";
import AddBookDialog, { BookFormValues } from "@/features/admin/components/books/add-book-dialog";
import { createBook } from "@/features/admin/api/admin.api";
import { toast } from "sonner";

export default function AdminBooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [bookType, setBookType] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const createBookMutation = useCreateBook();
  const { data, isLoading, isError } = useBooks({
    page,
    search: debouncedSearch,
    category,
    bookType,
    status,
  });


const handleCreateBook = async (values: BookFormValues) => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("author", values.author);
  formData.append("category", values.category);
  formData.append("publisher", values.publisher);
  formData.append("isbn", values.isbn);
  formData.append("language", values.language);
  formData.append("publicationDate", values.publicationDate);
  formData.append("pages", values.pages);
  formData.append("price", values.price);
  formData.append("stock", values.stock);
  formData.append("bookType", values.bookType);
  formData.append("description", values.description);

  formData.append(
    "isPublished",
    String(values.status === "published")
  );

if (values.cover) {
  formData.append("coverImage", values.cover);
}

if (values.pdf) {
  formData.append("pdfFile", values.pdf);
}

  try {
    await createBookMutation.mutateAsync(formData);

    toast.success("Book added successfully.");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ??
        "Failed to create book."
    );

    throw error;
  }
};



  if (isLoading) {
    return <BooksLoading />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Failed to load books
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0E2A]">
            Books Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all books available in your bookstore.
          </p>
        </div>

        <AddBookDialog onCreate={handleCreateBook} />
      </div>

      {/* Filters */}
      <BooksFilter
        search={search}
        category={category}
        bookType={bookType}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        onBookTypeChange={(value) => {
          setBookType(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {/* Table */}
      <BooksTable
        books={data.books}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
