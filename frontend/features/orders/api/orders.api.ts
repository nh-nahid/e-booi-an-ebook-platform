
import { api } from "@/services/api/api";
import type { Order } from "../types/orders.types";
import { ENDPOINTS } from "@/services/api/endpoints";

// If a book is deleted after it was ordered (admin removal, or the
// physical-books cleanup script), the API returns that order item with
// `book: null`. The UI reads item.book.* everywhere, so drop those orphaned
// items here, once, instead of crashing every order screen.
const dropRemovedBooks = (order: Order): Order => ({
  ...order,
  items: (order.items ?? []).filter((item) => item.book),
});

export const getOrderById = async (orderId: string): Promise<Order> => {
  const { data } = await api.get<Order>(ENDPOINTS.ORDERS.DETAILS(orderId));
  return dropRemovedBooks(data);
};

export const downloadDigitalBook = async (
  bookId: string,
  title: string,
): Promise<void> => {
  const response = await api.get(ENDPOINTS.ORDERS.DOWNLOAD(bookId), {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${title}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Fetches the raw bytes of a purchased Digital book's PDF, for rendering
// in the in-platform reader (features/library/components/book-reader.tsx)
// instead of saving it to disk. Reuses the same purchase-gated backend
// route as downloadDigitalBook — the "Content-Disposition: attachment"
// header it sends only matters for a browser-native download/navigation,
// not for a plain XHR/axios read of the response bytes, so no separate
// backend endpoint is needed.
export const getBookFile = async (bookId: string): Promise<Uint8Array> => {
  const response = await api.get(ENDPOINTS.ORDERS.DOWNLOAD(bookId), {
    responseType: "arraybuffer",
  });

  return new Uint8Array(response.data as ArrayBuffer);
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>(ENDPOINTS.ORDERS.MY_ORDERS);
  return data.map(dropRemovedBooks);
};

export const downloadInvoice = async (
  orderId: string,
  invoiceNumber: string,
): Promise<void> => {
  const response = await api.get(ENDPOINTS.ORDERS.INVOICE(orderId), {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice-${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};