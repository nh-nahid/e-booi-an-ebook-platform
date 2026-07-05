export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    LOGOUT: "/users/logout",
    FORGOT_PASSWORD: "/users/forgot-password",
    RESET_PASSWORD: "/users/reset-password",
    USERS: "/users",
    USER_BY_ID: (id: string) => `/users/${id}`,
  },

  BOOKS: {
    LIST: "/books",
    DETAILS: (id: string) => `/books/${id}`,
    CREATE: "/books",
    UPDATE: (id: string) => `/books/${id}`,
    DELETE: (id: string) => `/books/${id}`,
  },

  CART: {
    GET: "/cart",
    ADD: "/cart",
    REMOVE: (id: string) => `/cart/${id}`,
    CLEAR: "/cart",
  },

  ORDERS: {
    CREATE: "/orders",
    MY_ORDERS: "/orders/my-orders",
    LIBRARY: "/orders/library",
    DOWNLOAD: (bookId: string) => `/orders/download/${bookId}`,
    INVOICE: (id: string) => `/orders/${id}/invoice`,
    LIST: "/orders",
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    UPDATE_PAYMENT: (id: string) => `/orders/${id}/payment`,
  },

  PAYMENT: {
    PAY: (orderId: string) => `/payment/pay/${orderId}`,
    SUCCESS: "/payment/success",
    FAIL: "/payment/fail",
    CANCEL: "/payment/cancel",
  },

  COUPONS: {
    LIST: "/coupons",
    CREATE: "/coupons",
    DELETE: (id: string) => `/coupons/${id}`,
    APPLY: "/coupons/apply",
  },

  REVIEWS: {
    LIST: (bookId: string) => `/reviews/book/${bookId}`,
    CREATE: (bookId: string) => `/reviews/book/${bookId}`,
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },

  WISHLIST: {
    GET: "/wishlist",
    ADD: "/wishlist",
    REMOVE: (bookId: string) => `/wishlist/${bookId}`,
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SALES: "/admin/sales",
    TOP_BOOKS: "/admin/top-books",
  },
} as const;