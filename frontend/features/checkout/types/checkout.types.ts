export interface CheckoutItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
}

// ebooi is Digital-only — "cod" (Cash on Delivery) was only ever for
// Physical book shipping and has been removed.
export type PaymentMethodType = "card" | "bkash" | "nagad";

export interface ContactDetails {
  email: string;
  phone: string;
}

/* ==========================
   API Types
========================== */

export interface BuyNowItem {
  bookId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  // When set, the order is created straight from these books instead of
  // the user's cart — used for the "buy now" flow (no add-to-cart step).
  items?: BuyNowItem[];
}

export interface Order {
  _id: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: string;
  orderStatus: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface InitiatePaymentResponse {
  gatewayURL: string;
}
