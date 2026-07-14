import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  CreateOrderPayload,
  CreateOrderResponse,
  InitiatePaymentResponse,
} from "../types/checkout.types";

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const { data } = await api.post<CreateOrderResponse>(
    ENDPOINTS.ORDERS.CREATE,
    payload
  );

  return data;
};

export const initiatePayment = async (
  orderId: string
): Promise<InitiatePaymentResponse> => {
  const { data } = await api.post<InitiatePaymentResponse>(
    ENDPOINTS.PAYMENT.PAY(orderId)
  );

  return data;
};