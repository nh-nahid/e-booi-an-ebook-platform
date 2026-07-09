import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBook,
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

export function useBooks(params: {
  page: number;
  search?: string;
  category?: string;
  bookType?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
  });
}


export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
}