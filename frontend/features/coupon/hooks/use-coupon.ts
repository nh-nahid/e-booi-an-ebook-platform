import { useMutation } from "@tanstack/react-query";
import { applyCoupon } from "../api/coupon.api";

export const useApplyCoupon = () =>
  useMutation({
    mutationFn: applyCoupon,
  });