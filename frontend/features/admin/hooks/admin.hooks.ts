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

  // Admin Users
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminOrderStatus,
  getAdminOrders,
} from "../api/admin.api";
import { AdminOrdersParams, Order } from "../types/admin.types";

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
// Admin Users
// ==============================

export function useAdminUsers(params: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAdminUsers(params),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateAdminUser(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}


// ==============================
// Orders (Admin)
// ==============================

export function useAdminOrders(params: AdminOrdersParams) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAdminOrders(params),
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      orderStatus,
    }: {
      id: string;
      orderStatus: Order["orderStatus"];
    }) => updateAdminOrderStatus(id, orderStatus),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}