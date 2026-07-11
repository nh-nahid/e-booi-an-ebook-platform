"use client";

import { useQuery } from "@tanstack/react-query";

import { getBooks } from "../api/book.api";
import type { GetBooksParams } from "../types/book.types";

export const useBooks = (params: GetBooksParams) => {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
    placeholderData: (previousData) => previousData,
  });
};