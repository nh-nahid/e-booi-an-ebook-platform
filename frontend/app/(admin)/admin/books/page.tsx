"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import BooksFilter from "@/features/admin/components/books/books-filter";
import BooksTable from "@/features/admin/components/books/books-table";
import AddBookDialog, {
  BookFormValues,
} from "@/features/admin/components/books/BookDialog";
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from "@/features/admin/hooks/admin.hooks";

import BooksLoading from "./loading";
import { useDebounce } from "@/hooks/use-debounce";
import BookDialog from "@/features/admin/components/books/BookDialog";

export default function AdminBooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [bookType, setBookType] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

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

    formData.append("isPublished", String(values.status === "published"));

    if (values.cover) {
      formData.append("coverImage", values.cover);
    }

    if (values.pdf) {
      formData.append("pdfFile", values.pdf);
    }

    try {
      await createBookMutation.mutateAsync(formData);

      toast.success("Book added successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to create book.");
      } else {
        toast.error("Something went wrong.");
      }

      throw error;
    }
  };

const handleUpdateBook = async (
  id: string,
  values: BookFormValues
) => {
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

  // Optional during update
  if (values.cover) {
    formData.append("coverImage", values.cover);
  }

  if (values.pdf) {
    formData.append("pdfFile", values.pdf);
  }

  try {
    await updateBookMutation.mutateAsync({
      id,
      formData,
    });

    toast.success("Book updated successfully.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ??
          "Failed to update book."
      );
    } else {
      toast.error("Something went wrong.");
    }

    throw error;
  }
};

const handleDeleteBook = async (id: string) => {
  try {
    await deleteBookMutation.mutateAsync(id);

    toast.success("Book deleted successfully.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ??
          "Failed to delete book."
      );
    } else {
      toast.error("Something went wrong.");
    }
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
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0E2A]">
            Books Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all books available in your bookstore.
          </p>
        </div>

        <BookDialog mode="create" onSubmit={handleCreateBook} />
      </div>

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

      <BooksTable
        books={data.books}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
      />
    </div>
  );
}
