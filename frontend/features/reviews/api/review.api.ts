import { ENDPOINTS } from "@/services/api/endpoints";
import { Review, ReviewResponse } from "../types/review.type";
import { api } from "@/services/api/api";

export const getBookReviews = async (
  bookId: string
): Promise<Review[]> => {
  const { data } = await api.get<ReviewResponse>(
    ENDPOINTS.REVIEWS.GET_REVIEWS(bookId)
  );

  return data.data;
};