export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  bookType: "Digital" | "Physical";

  pdfFile: string | null;
  stock: number;
  sold: number;

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
  bookType?: "Digital" | "Physical";

  minPrice?: number;
  maxPrice?: number;

  status?: "published" | "draft";

  sort?:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "title";
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