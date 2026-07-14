import type { PaymentMethodType } from "@/features/checkout/types/checkout.types";

export interface OrderBook {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  bookType: "Physical" | "Digital";
}

export interface OrderItem {
  book: OrderBook;
  quantity: number;
  price: number;
  bookType: "Physical" | "Digital";
}

export interface ShippingAddressInOrder {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethodType | "sslcommerz" | "cod" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: ShippingAddressInOrder;
  invoiceNumber?: string;
  invoiceUrl?: string;
  createdAt: string;
}