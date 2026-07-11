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

export interface CategoryAnalytics {
  name: string;
  value: number;
}

export interface LatestUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface DashboardResponse {
  statistics: {
    totalUsers: number;
    totalBooks: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  };

  recentOrders: Order[];

  categoryAnalytics: CategoryAnalytics[];

  latestUsers: LatestUser[];
}


export interface Order {
  _id: string;

  user?: {
    _id: string;
    name: string;
    email: string;
  } | null;

  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  items: {
    book: string;
    quantity: number;
    price: number;
    bookType: "Digital" | "Physical";
  }[];

  totalAmount: number;
  finalAmount: number;

  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  paymentMethod: string;

  createdAt: string;
  updatedAt: string;
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

  title: string;
  author: string;
  coverImage?: string;
  price: number;
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


export interface User {
  _id: string;

  name: string;
  email: string;

  avatar?: string;
  bio?: string;
  phone?: string;

  role: "user" | "admin";

  isVerified: boolean;
  isBlocked: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  status: "active" | "suspended";
  ordersCount?: number;
  booksOwned?: number;
  joinedAt: string;
}

export interface UsersResponse {
  message: string;
  data: User[];
}

export interface NewUserValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
}

export interface UpdateUserValues {
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  password: string;
  avatar: File | null;
}