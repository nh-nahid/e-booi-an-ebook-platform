import { api } from "@/services/api/api";
import { AddToCartPayload, CartItem, CartResponse, } from "../types/cart.types";
import { ENDPOINTS } from "@/services/api/endpoints";

// cart api
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get<CartResponse>(
    ENDPOINTS.CART.GET_CART
  );

  return data.data;
};

export const addToCart = async (
  payload: AddToCartPayload
): Promise<CartResponse> => {
  const { data } = await api.post<CartResponse>(
    ENDPOINTS.CART.ADD_TO_CART,
    payload
  );

  return data;
};

export const removeCartItem = async (id: string) => {
  await api.delete(`${ENDPOINTS.CART.REMOVE_FROM_CART}/${id}`);
};

export const clearCart = async () => {
  await api.delete(ENDPOINTS.CART.CLEAR_CART);
};