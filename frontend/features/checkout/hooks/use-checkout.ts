import { useMutation } from "@tanstack/react-query";

import {
  createOrder,
  initiatePayment,
} from "../api/checkout.api";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: initiatePayment,
  });
};