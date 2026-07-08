"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import BooksTable from "@/features/admin/components/books/books-table";
import BooksFilter from "@/features/admin/components/books/books-filter";

export default function AdminBooksPage() {
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

      <BooksFilter />

      <BooksTable />
    </div>
  );
}