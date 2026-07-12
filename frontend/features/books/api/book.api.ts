import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  Book,
  BookResponse,
    BooksData,
  BooksResponse,
  GetBooksParams,
  Review,
  ReviewResponse,
} from "../types/book.types";

export const getBooks = async (
  params: GetBooksParams
): Promise<BooksData> => {

  const { data } = await api.get<BooksResponse>(
    ENDPOINTS.BOOKS.GET_BOOKS,
    {
      params,
    }
  );


  return data.data;
};

export const getBook = async (id: string): Promise<Book> => {
  const { data } = await api.get<BookResponse>(
    `${ENDPOINTS.BOOKS.GET_BOOKS}/${id}`
  );

  return data.data;
};

export const getRelatedBooks = async (
  category: string,
  currentBookId: string
): Promise<Book[]> => {
  const { data } = await api.get<BooksResponse>(
    ENDPOINTS.BOOKS.GET_BOOKS,
    {
      params: {
        category,
        limit: 5,
      },
    }
  );

  return data.data.books.filter(
    (book) => book._id !== currentBookId
  );
};

export const getBookReviews = async (
  bookId: string
): Promise<Review[]> => {
  const { data } = await api.get<ReviewResponse>(
    ENDPOINTS.REVIEWS.GET_REVIEWS(bookId)
  );

  return data.data;
};