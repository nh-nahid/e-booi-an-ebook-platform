export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
  phone?: string;
  bio?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  coverImage: string;
  coverUrl?: string;
  bookType?: "Digital";
  averageRating: number;
  reviewCount: number;
  sold?: number;
  isFeatured?: boolean;
  isPreOrder?: boolean;
}

export interface HomeData {
  hero: { title: string; subtitle: string; description: string; image: string };
  statistics: {
    totalBooks: number;
    totalAuthors: number;
    totalCategories: number;
    happyCustomers: number;
  };
  categories: { name: string; booksCount: number }[];
  featuredBooks: Book[];
  latestBooks: Book[];
  bestSellingBooks: Book[];
  preOrderBooks: Book[];
}

export interface BooksPage {
  books: Book[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItem {
  _id: string;
  book: Book | null;
  quantity: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { _id: string; name: string; avatar?: string | null };
}

export interface OrderItem {
  book: Book | null;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: string;
  invoiceNumber?: string;
  createdAt: string;
}

export interface LibraryBook {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  price: number;
}

export interface WishlistEntry {
  _id: string;
  book: Book | null;
}

export type BooksSort =
  | "newest"
  | "price-low"
  | "price-high"
  | "title"
  | "best-selling";
