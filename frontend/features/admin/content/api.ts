import { api } from "@/services/api/api";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  booksCount: number;
};

export type Author = {
  name: string;
  tagline?: string;
  bio?: string;
  photo?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
};

export type Plan = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  activeSubscribers?: number;
};

export type SubscriptionRow = {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  planName: string;
  startsAt: string;
  expiresAt: string;
  status: "active" | "revoked";
  source: "purchase" | "admin";
};

export type UserContent = {
  user: { _id: string; name: string; email: string };
  books: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    via: "purchase" | "grant" | "subscription";
  }[];
  revokedBooks: { _id: string; title: string; author: string }[];
  subscriptions: SubscriptionRow[];
};

const d = <T>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);

export const categoriesApi = {
  list: () => d<Category[]>(api.get("/admin/categories")),
  create: (v: { name: string; description?: string }) => api.post("/admin/categories", v),
  update: (id: string, v: Partial<Category>) => api.put(`/admin/categories/${id}`, v),
  remove: (id: string) => api.delete(`/admin/categories/${id}`),
  reorder: (ids: string[]) => api.put("/admin/categories/reorder", { ids }),
};

export const authorApi = {
  get: () => d<Author | null>(api.get("/admin/author")),
  save: (v: Author) => api.put("/admin/author", v),
};

export const plansApi = {
  list: () => d<Plan[]>(api.get("/admin/plans")),
  create: (v: Partial<Plan>) => api.post("/admin/plans", v),
  update: (id: string, v: Partial<Plan>) => api.put(`/admin/plans/${id}`, v),
  remove: (id: string) => api.delete(`/admin/plans/${id}`),
};

export const subsApi = {
  list: () => d<SubscriptionRow[]>(api.get("/admin/subscriptions")),
  grant: (v: { userId: string; planId: string; days?: number }) => api.post("/admin/subscriptions", v),
  revoke: (id: string) => api.patch(`/admin/subscriptions/${id}/revoke`),
  extend: (id: string, days: number) => api.patch(`/admin/subscriptions/${id}/extend`, { days }),
};

export const userContentApi = {
  get: (id: string) => d<UserContent>(api.get(`/admin/users/${id}/content`)),
  revoke: (id: string, bookId: string) => api.delete(`/admin/users/${id}/content/${bookId}`),
  grant: (id: string, bookId: string) => api.post(`/admin/users/${id}/content/${bookId}`),
};
