export interface ApplyCouponPayload {
  code: string;
  amount: number;
}

export interface ApplyCouponResponse {
  coupon: {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
  };
  discount: number;
  finalAmount: number;
}
