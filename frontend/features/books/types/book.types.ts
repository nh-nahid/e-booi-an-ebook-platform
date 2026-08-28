export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;

  price: number;
  originalPrice?: number | null;
  coverImage: string;
  coverUrl?: string;

  bookType: "Digital";

  pdfFile: string | null;

  sold: number;
  // Incremented on every book-detail fetch; used for the "views" stat.
  views?: number;

  averageRating: number;
  reviewCount: number;

  isFeatured: boolean;
  isPreOrder: boolean;
  isPublished: boolean;

  uploadedBy: string;

  createdAt: string;
  updatedAt: string;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;

  search?: string;

  category?: string;

  bookType?: "Digital";

  minPrice?: number;
  maxPrice?: number;

  featured?: boolean;
  preOrder?: boolean;

  sort?:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "title"
    | "latest"
    | "best-selling";
}

export interface BooksData {
  books: Book[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BooksResponse {
  success: boolean;
  message: string;
  data: BooksData;
}

/* ---------- Single Book ---------- */

export interface BookResponse {
  success: boolean;
  message: string;
  data: Book;
}
