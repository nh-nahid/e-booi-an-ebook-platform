// utils/get-book-image.ts

export function getBookImage(image?: string) {
  if (!image) return "/placeholder-book.png";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  return `${base}/uploads/books/${image}`;
}