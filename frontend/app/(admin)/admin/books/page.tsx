"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import BooksFilter from "@/features/admin/components/books/books-filter";
import BooksTable from "@/features/admin/components/books/books-table";
import { useBooks } from "@/features/admin/hooks/admin.hooks";

import BooksLoading from "./loading";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminBooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [bookType, setBookType] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, isError } = useBooks({
    page,
    search: debouncedSearch,
    category,
    bookType,
    status,
  });

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

        <Button className="bg-[#2DBDB6] hover:bg-[#249d97]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
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
