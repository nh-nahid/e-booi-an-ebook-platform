import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrderById, downloadDigitalBook, getMyOrders, downloadInvoice } from "../api/orders.api";


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
