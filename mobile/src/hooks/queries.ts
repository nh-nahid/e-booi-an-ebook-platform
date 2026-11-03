import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";
import { useAuth } from "@/auth/AuthProvider";
import type {
  Book,
  BooksPage,
  BooksSort,
  CartItem,
  HomeData,
  LibraryBook,
  Order,
  Review,
  WishlistEntry,
} from "@/types";

export const useHome = () =>
  useQuery({
    queryKey: ["home"],
    queryFn: async () => (await api.get<{ data: HomeData }>("/home")).data.data,
  });

export interface BooksFilter {
  search?: string;
  category?: string;
  sort?: BooksSort;
}

export const useBooks = (f: BooksFilter) =>
  useInfiniteQuery({
    queryKey: ["books", f],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      (
        await api.get<{ data: BooksPage }>("/books", {
          params: {
            page: pageParam,
            limit: 12,
            search: f.search || undefined,
            category: f.category || undefined,
            sort: f.sort || undefined,
          },
        })
      ).data.data,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  });

export const useBook = (id?: string) =>
  useQuery({
    queryKey: ["book", id],
    enabled: !!id,
    queryFn: async () => (await api.get<{ data: Book }>(`/books/${id}`)).data.data,
  });

export const useReviews = (bookId?: string) =>
  useQuery({
    queryKey: ["reviews", bookId],
    enabled: !!bookId,
    queryFn: async () =>
      (await api.get<{ data: Review[] }>(`/reviews/book/${bookId}`)).data.data,
  });

export function useAddReview(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { rating: number; comment: string }) =>
      (await api.post(`/reviews/book/${bookId}`, p)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
      qc.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });
}

/* ---------------------------------- cart --------------------------------- */

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["cart"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const { data } = await api.get<{ data: CartItem[] }>("/cart");
      // A book can be deleted by an admin while it sits in someone's cart.
      return data.data.filter((i) => i.book);
    },
  });
};

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) =>
      (await api.post("/cart", { bookId, quantity: 1 })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { id: string; quantity: number }) =>
      (await api.put(`/cart/${p.id}`, { quantity: p.quantity })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/cart/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

/* -------------------------------- wishlist ------------------------------- */

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["wishlist"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const { data } = await api.get<{ data: WishlistEntry[] }>("/wishlist");
      return data.data.filter((w) => w.book);
    },
  });
};

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { bookId: string; inWishlist: boolean }) =>
      p.inWishlist
        ? (await api.delete(`/wishlist/${p.bookId}`)).data
        : (await api.post("/wishlist", { bookId: p.bookId })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

/* --------------------------- library and orders -------------------------- */

export const useLibrary = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["library"],
    enabled: isAuthenticated,
    queryFn: async () => (await api.get<LibraryBook[]>("/orders/library")).data,
  });
};

const dropRemoved = (o: Order): Order => ({
  ...o,
  items: (o.items ?? []).filter((i) => i.book),
});

export const useOrders = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["orders"],
    enabled: isAuthenticated,
    queryFn: async () =>
      (await api.get<Order[]>("/orders/my-orders")).data.map(dropRemoved),
  });
};

export const useOrder = (id?: string) =>
  useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => dropRemoved((await api.get<Order>(`/orders/${id}`)).data),
  });

export interface CouponResult {
  coupon: { code: string };
  discount: number;
  finalAmount: number;
}

export const applyCoupon = async (code: string, amount: number) =>
  (await api.post<CouponResult>("/coupons/apply", { code, amount })).data;

export const createOrder = async (p: {
  couponCode?: string;
  items?: { bookId: string; quantity: number }[];
}) =>
  (
    await api.post<{ order: Order }>("/orders", {
      paymentMethod: "eps",
      ...p,
    })
  ).data.order;

/** Returns the EPS checkout URL (or the app deep link for a free order). */
export const startPayment = async (orderId: string) =>
  (await api.post<{ gatewayURL: string }>(`/payment/pay/${orderId}`, { source: "mobile" }))
    .data.gatewayURL;
