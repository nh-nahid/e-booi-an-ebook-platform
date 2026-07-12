import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";
import { ApplyCouponPayload, ApplyCouponResponse } from "../types/coupon.types";

export const applyCoupon = async (
  payload: ApplyCouponPayload
): Promise<ApplyCouponResponse> => {
  const { data } = await api.post(
    ENDPOINTS.COUPON.APPLY,
    payload
  );

  return data;
};