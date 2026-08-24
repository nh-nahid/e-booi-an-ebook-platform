import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrderById,
  downloadDigitalBook,
  getMyOrders,
  downloadInvoice,
  getBookFile,
} from "../api/orders.api";


export const useOrder = (orderId: string | null) =>
  useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId as string),
    enabled: Boolean(orderId),
  });

  export const useMyOrders = () =>
  useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: getMyOrders,
  });

export const useDownloadBook = () =>
  useMutation({
    mutationFn: ({ bookId, title }: { bookId: string; title: string }) =>
      downloadDigitalBook(bookId, title),
  });

// Purchased book's PDF bytes, cached by bookId — the in-platform reader
// only ever needs to fetch this once per session.
export const useBookFile = (bookId: string | null) =>
  useQuery({
    queryKey: ["order", "book-file", bookId],
    queryFn: () => getBookFile(bookId as string),
    enabled: Boolean(bookId),
    staleTime: Infinity,
    retry: false,
  });

export const useDownloadInvoice = () =>
  useMutation({
    mutationFn: ({
      orderId,
      invoiceNumber,
    }: {
      orderId: string;
      invoiceNumber: string;
    }) => downloadInvoice(orderId, invoiceNumber),
  });
