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

export type PaymentMethodType = "card" | "bkash" | "nagad" | "cod";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  district: string;
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