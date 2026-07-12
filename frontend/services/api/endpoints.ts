export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    LOGOUT: "/users/logout",
    PROFILE: "/users/profile",
    FORGOT_PASSWORD: "/users/forgot-password",
    RESET_PASSWORD: "/users/reset-password",
    REFRESH_TOKEN: "/users/refresh-token",
  },

  USER: {
    PROFILE: "/users/profile",
    PROFILE_AVATAR: "/users/profile/avatar",
    CHANGE_PASSWORD: "/users/change-password",
  },

  USERS: {
    LIST: "/users",
    REGISTER: "/users/register",
    DETAILS: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  BOOKS: {
    GET_BOOKS: "/books",
    LIST: "/books",
    DETAILS: (id: string) => `/books/${id}`,
    CREATE: "/books",
    UPDATE: (id: string) => `/books/${id}`,
    DELETE: (id: string) => `/books/${id}`,
  },
  HOME: {
    GET_HOME: "/home",
  },
  
CART: {
  GET_CART: "/cart",
  ADD_TO_CART: "/cart",
  REMOVE_FROM_CART: (id: string) => `/cart/${id}`,
  CLEAR_CART: "/cart",
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

COUPON: {
  CREATE: "/coupons",
  GET_ALL: "/coupons",
  DELETE: (id: string) => `/coupons/${id}`,
  APPLY: "/coupons/apply",
},

REVIEWS: {
  GET_REVIEWS: (bookId: string) => `/reviews/book/${bookId}`,
  ADD_REVIEW: (bookId: string) => `/reviews/book/${bookId}`,
  UPDATE_REVIEW: (id: string) => `/reviews/${id}`,
  DELETE_REVIEW: (id: string) => `/reviews/${id}`,
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
    USERS: "/admin/users",
  },
} as const;
