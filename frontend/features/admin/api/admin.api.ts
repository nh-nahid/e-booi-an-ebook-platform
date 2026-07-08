import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  DashboardResponse,
  SalesResponse,
  TopBooksResponse,
  BooksResponse,
} from "../types/admin.types";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.DASHBOARD);
  return data;
};

export const getSales = async (): Promise<SalesResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.SALES);
  return data;
};

export const getTopBooks = async (): Promise<TopBooksResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.TOP_BOOKS);
  return data;
};

export async function getBooks(params: {
  page: number;
  search?: string;
  category?: string;
  bookType?: string;
  status?: string;
}) {

  const { data } = await api.get(ENDPOINTS.BOOKS.LIST, {
    params,
  });

  return data;
}