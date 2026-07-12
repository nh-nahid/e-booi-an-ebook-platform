"use client";

import { useQuery } from "@tanstack/react-query";

import { getBook, getBookReviews, getBooks, getRelatedBooks } from "../api/book.api";
import type { GetBooksParams } from "../types/book.types";

export const useBooks = (params: GetBooksParams) => {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });
};

export const useRelatedBooks = (
  category?: string,
  currentBookId?: string
) => {
  return useQuery({
    queryKey: ["related-books", category, currentBookId],
    queryFn: () =>
      getRelatedBooks(category!, currentBookId!),
    enabled: !!category && !!currentBookId,
  });
};

export const useBookReviews = (bookId?: string) => {
  return useQuery({
    queryKey: ["book-reviews", bookId],
    queryFn: () => getBookReviews(bookId!),
    enabled: !!bookId,
  });
};