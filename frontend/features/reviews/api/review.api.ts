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

export interface AddReviewPayload {
  rating: number;
  comment: string;
}

export const addBookReview = async (
  bookId: string,
  payload: AddReviewPayload
): Promise<Review> => {
  const { data } = await api.post<{ message: string; review: Review }>(
    ENDPOINTS.REVIEWS.ADD_REVIEW(bookId),
    payload
  );

  return data.review;
};
