import { api } from "@/services/api/api";
import { AddToCartPayload, CartItem, CartResponse } from "../types/cart.types";
import { ENDPOINTS } from "@/services/api/endpoints";

// cart api
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get<CartItem[]>(
    ENDPOINTS.CART.GET_CART
  );

  return data;
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

export const removeFromCart = async (
  id: string
): Promise<CartResponse> => {
  const { data } = await api.delete<CartResponse>(
    ENDPOINTS.CART.REMOVE_FROM_CART(id)
  );

  return data;
};

export const clearCart = async (): Promise<CartResponse> => {
  const { data } = await api.delete<CartResponse>(
    ENDPOINTS.CART.CLEAR_CART
  );

  return data;
};