import { useQuery } from "@tanstack/react-query";
import { getBookReviews } from "../api/review.api";

export const useBookReviews = (bookId?: string) => {
  return useQuery({
    queryKey: ["book-reviews", bookId],
    queryFn: () => getBookReviews(bookId!),
    enabled: !!bookId,
  });
};