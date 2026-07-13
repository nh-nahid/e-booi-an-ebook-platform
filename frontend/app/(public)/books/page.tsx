"use client";

import { useState } from "react";

import SiteFooter from "@/components/layout/site-footer";
import { useSearchParams } from "next/navigation";
import { useBooks } from "@/features/books/hooks/use-book";

import BooksFilters, {
  BooksFilterState,
} from "@/features/books/components/books-filters";
import BooksGrid from "@/features/books/components/books-grid";
import BooksToolbar from "@/features/books/components/books-toolbar";
import MobileFiltersSheet from "@/features/books/components/mobile-filters-sheet";
import Pagination from "@/features/books/components/pagination";
import { useSearchStore } from "@/stores/search-store";
import { useDebounce } from "@/hooks/use-debounce";

const initialFilters: BooksFilterState = {
  categories: [],
  bookType: "",
  minPrice: 0,
  maxPrice: 0,
};

const PAGE_SIZE = 12;

export default function BooksPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();

  const featured = searchParams.get("featured") === "true";
  const preOrder = searchParams.get("preOrder") === "true";
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const SORT_OPTIONS = [
    "newest",
    "oldest",
    "price-low",
    "price-high",
    "title",
    "latest",
    "best-selling",
  ] as const;

  type SortType = (typeof SORT_OPTIONS)[number];

  const urlSort = searchParams.get("sort");

  const initialSort: SortType =
    urlSort && SORT_OPTIONS.includes(urlSort as SortType)
      ? (urlSort as SortType)
      : "newest";

  const [sort, setSort] = useState<SortType>(initialSort);

  const [filters, setFilters] = useState(initialFilters);

  const [page, setPage] = useState(1);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


const bookParams = {
  page,
  limit: PAGE_SIZE,

  search: debouncedSearch || undefined,

  category:
    filters.categories.length > 0
      ? filters.categories.join(",")
      : undefined,

  bookType: filters.bookType || undefined,

  minPrice:
    filters.minPrice > 0
      ? filters.minPrice
      : undefined,

  maxPrice:
    filters.maxPrice > 0
      ? filters.maxPrice
      : undefined,

  featured: featured || undefined,

  preOrder: preOrder || undefined,

  sort,
};

  const { data, isLoading } = useBooks(bookParams);

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
                setSort(value as typeof sort);
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
        categories={data?.categories ?? []}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
