export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:5000/api/v1"
).replace(/\/$/, "");

/** Backend origin without /api/v1 — used for locally stored uploads (avatars). */
export const API_ORIGIN = API_URL.replace(/\/api\/v1$/, "");

export const SITE_URL = (
  process.env.EXPO_PUBLIC_SITE_URL ?? "https://ebooi.bd"
).replace(/\/$/, "");

export const DEEP_LINK_PREFIX = "ebooi://";
