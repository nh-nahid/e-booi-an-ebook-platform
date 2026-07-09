// features/admin/types/admin.types.ts

export interface DashboardStatistics {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  _id: string;
  book: string;
  quantity: number;
  price: number;
  bookType: "Digital" | "Physical";
}

export interface RecentOrder {
  _id: string;
  user: string | null;

  shippingAddress: ShippingAddress;

  items: OrderItem[];

  totalAmount: number;
  discountAmount: number;
  finalAmount: number;

  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  paymentStatus: "pending" | "paid" | "failed";

  paymentMethod: string;

  transactionId: string | null;

  coupon: string | null;

  invoiceNumber?: string;
  invoiceUrl?: string;

  paidAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  statistics: DashboardStatistics;
  recentOrders: RecentOrder[];
}


export interface SalesItem {
  _id: {
    month: number;
    year: number;
  };

  totalSales: number;
  totalOrders: number;
}

export type SalesResponse = SalesItem[];


export interface TopBook {
  _id: string;
  sold: number;
}


export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;

  category: string;
  publisher: string;
  isbn: string;
  language: string;
  publicationDate: string;
  pages: number;

  price: number;
  stock: number;

  coverImage: string;
  pdfFile: string;

  bookType: "Digital" | "Physical";
  isPublished: boolean;

  uploadedBy: string;

  averageRating: number;
  reviewCount: number;

  createdAt: string;
  updatedAt: string;
}
export interface BooksResponse {
  total: number;
  page: number;
  totalPages: number;
  books: Book[];
}

export type TopBooksResponse = TopBook[];