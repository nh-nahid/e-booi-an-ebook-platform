export interface LibraryBook {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  bookType: "Digital";
  price: number;
}