import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBookReview, getBookReviews } from "../api/review.api";

export const useBookReviews = (bookId?: string) => {
  return useQuery({
    queryKey: ["book-reviews", bookId],
    queryFn: () => getBookReviews(bookId!),
    enabled: !!bookId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      rating,
      comment,
    }: {
      bookId: string;
      rating: number;
      comment: string;
    }) => addBookReview(bookId, { rating, comment }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["book-reviews", variables.bookId],
      });
      // rating/reviewCount live on the Book doc — refresh it too.
      queryClient.invalidateQueries({
        queryKey: ["book", variables.bookId],
      });
    },
  });
};
