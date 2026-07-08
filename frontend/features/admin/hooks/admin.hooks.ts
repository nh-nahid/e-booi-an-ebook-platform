import { useQuery } from "@tanstack/react-query";

import {
    getBooks,
  getDashboard,
  getSales,
  getTopBooks,
} from "../api/admin.api";

export const useDashboard = () =>
  useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
  });

export const useSales = () =>
  useQuery({
    queryKey: ["admin-sales"],
    queryFn: getSales,
  });

export const useTopBooks = () =>
  useQuery({
    queryKey: ["admin-top-books"],
    queryFn: getTopBooks,
  });

export const useBooks = (page: number) =>
  useQuery({
    queryKey: ["books", page],
    queryFn: () => getBooks(page),
  });