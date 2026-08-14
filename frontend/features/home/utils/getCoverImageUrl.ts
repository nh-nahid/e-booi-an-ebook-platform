const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, "");

function getCoverImageUrl(coverImage?: string) {
  if (!coverImage) return null;

  if (
    coverImage.startsWith("http://") ||
    coverImage.startsWith("https://")
  ) {
    return coverImage;
  }

  return `${BACKEND_URL}/uploads/books/${coverImage}`;
}

export default getCoverImageUrl;