import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getDashboard,
  getSales,
  getTopBooks,

  // Books
  getBooks,
  createBook,
  updateBook,
  deleteBook,

  // Users
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/admin.api";

// ==============================
// Dashboard
// ==============================

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

// ==============================
// Books
// ==============================

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

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateBook(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
}

// ==============================
// Users
// ==============================

export function useUsers(params: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateUser(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}