export interface CartBook {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  bookType: "Digital" | "Physical";
  stock: number;
  isPreOrder: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  _id: string;
  user: string;
  book: CartBook;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  bookId: string;
  quantity: number;
}

export interface UpdateCartQuantityPayload {
  cartItemId: string;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: CartItem[];
}

export interface CartActionResponse {
  success: boolean;
  message: string;
}