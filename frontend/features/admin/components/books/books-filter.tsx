"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface BooksFilterProps {
  search: string;
  category: string;
  bookType: string;
  status: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBookTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function BooksFilter({
  search,
  category,
  bookType,
  status,
  onSearchChange,
  onCategoryChange,
  onBookTypeChange,
  onStatusChange,
}: BooksFilterProps) {
  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category */}

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 rounded-md border border-[#E1E5E8] px-3"
        >
          <option value="">All Categories</option>

          <option value="Novel">Novel</option>

          <option value="Science">Science</option>

          <option value="Business">Business</option>

          <option value="Education">Education</option>

          <option value="Religious">Religious</option>

          <option value="Programming">Programming</option>

          <option value="Self Development">Self Development</option>
        </select>

        {/* Type */}

        <select
          value={bookType}
          onChange={(e) => onBookTypeChange(e.target.value)}
          className="h-10 rounded-md border border-[#E1E5E8] px-3"
        >
          <option value="">All Types</option>

          <option value="digital">Digital</option>

          <option value="physical">Physical</option>
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-md border border-[#E1E5E8] px-3"
        >
          <option value="">All Status</option>

          <option value="published">Published</option>

          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
