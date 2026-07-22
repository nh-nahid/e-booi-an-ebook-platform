export interface HeroButton {
  text: string;
  link: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  button: HeroButton;
}

export interface Statistics {
  totalBooks: number;
  totalAuthors: number;
  totalCategories: number;
  happyCustomers: number;
}

export interface Category {
  name: string;
  booksCount: number;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  coverImage: string;
  bookType: "Digital" | "Physical";

  averageRating: number;
  reviewCount: number;

  description?: string;
  pdfFile?: string | null;
  stock: number;
  sold?: number;

  isFeatured: boolean;
  isPreOrder: boolean;
  isPublished?: boolean;

  uploadedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface HomeData {
  hero: Hero;
  statistics: Statistics;
  categories: Category[];

  featuredBooks: Book[];
  latestBooks: Book[];
  bestSellingBooks: Book[];
  preOrderBooks: Book[];
}

export interface HomeResponse {
  success: boolean;
  message: string;
  data: HomeData;
}