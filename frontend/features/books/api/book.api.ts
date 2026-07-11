import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
    BooksData,
  BooksResponse,
  GetBooksParams,
} from "../types/book.types";

export const getBooks = async (
  params: GetBooksParams
): Promise<BooksData> => {

  console.log("BOOK QUERY PARAMS:", params);

  const { data } = await api.get<BooksResponse>(
    ENDPOINTS.BOOKS.GET_BOOKS,
    {
      params,
    }
  );


  return data.data;
};