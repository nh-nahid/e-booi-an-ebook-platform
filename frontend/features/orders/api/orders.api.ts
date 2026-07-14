
import { api } from "@/services/api/api";
import type { Order } from "../types/orders.types";
import { ENDPOINTS } from "@/services/api/endpoints";

export const getOrderById = async (orderId: string): Promise<Order> => {
  const { data } = await api.get<Order>(ENDPOINTS.ORDERS.DETAILS(orderId));
  return data;
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

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>(ENDPOINTS.ORDERS.MY_ORDERS);
  return data;
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