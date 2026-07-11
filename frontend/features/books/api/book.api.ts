import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  BooksResponse,
  GetBooksParams,
} from "../types/book.types";

export const getBooks = async (
  params: GetBooksParams
): Promise<BooksResponse> => {
  const { data } = await api.get<BooksResponse>(
    ENDPOINTS.BOOKS.GET_BOOKS,
    {
      params,
    }
  );

  return data;
};