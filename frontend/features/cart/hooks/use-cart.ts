import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, clearCart, getCart, removeCartItem, updateCartQuantity } from "../api/cart.api";
import { CartItem } from "../types/cart.types";

export const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
    }: {
      id: string;
      quantity: number;
    }) => updateCartQuantity(id, quantity),

    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        ["cart"]
      );

      queryClient.setQueryData<CartItem[]>(
        ["cart"],
        (old) => {
          if (!old) return [];

          return old.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity,
                }
              : item
          );
        }
      );

      return {
        previousCart,
      };
    },


    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart"],
          context.previousCart
        );
      }
    },


    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};