"use client";

import { useState } from "react";

import SiteFooter from "@/components/layout/site-footer";

import { useBooks } from "@/features/books/hooks/use-book";

import BooksFilters, {
  BooksFilterState,
} from "@/features/books/components/books-filters";
import BooksGrid from "@/features/books/components/books-grid";
import BooksToolbar from "@/features/books/components/books-toolbar";
import MobileFiltersSheet from "@/features/books/components/mobile-filters-sheet";
import Pagination from "@/features/books/components/pagination";

const initialFilters: BooksFilterState = {
  categories: [],
  bookType: "",
  minPrice: 0,
  maxPrice: 0,
};

const PAGE_SIZE = 12;

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState(initialFilters);

  const [page, setPage] = useState(1);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading } = useBooks({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    category:
      filters.categories.length > 0 ? filters.categories.join(",") : undefined,
    bookType: filters.bookType || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sort: sort as "newest" | "oldest" | "price-low" | "price-high" | "title",
  });

  const handleFilterChange = (next: typeof initialFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BooksFilters
                categories={data?.categories ?? []}
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <BooksToolbar
              sort={sort}
              onSortChange={(value) => {
                setSort(value);
                setPage(1);
              }}
              view={view}
              onViewChange={setView}
              resultCount={data?.total ?? 0}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <BooksGrid
              books={data?.books ?? []}
              view={view}
              loading={isLoading}
            />

            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <SiteFooter />

      <MobileFiltersSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
