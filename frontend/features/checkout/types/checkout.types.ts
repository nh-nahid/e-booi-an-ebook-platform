export type BookFormat = "physical" | "digital";

export interface CheckoutItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
  format: BookFormat;
}

export type PaymentMethodType =
  | "card"
  | "bkash"
  | "nagad"
  | "cod";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  district: string;
  notes?: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

/* ==========================
   API Types
========================== */

export interface BuyNowItem {
  bookId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shippingAddress?: ShippingAddress;
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