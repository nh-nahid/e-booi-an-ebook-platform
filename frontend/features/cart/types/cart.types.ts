export interface CartBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  bookType: "Digital" | "Physical";
  stock: number;
  isPreOrder: boolean;
}

export interface CartItem {
  _id: string;
  user: string;
  book: CartBook;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  bookId: string;
}

export interface CartResponse {
  message: string;
}

export type GetCartResponse = CartItem[];