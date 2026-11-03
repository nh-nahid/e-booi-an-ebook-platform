import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_URL } from "./config";
import { KEYS, getItem, removeItem, setItem } from "./storage";

let accessToken: string | null = null;
let onAuthLost: (() => void) | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;
export const setAuthLostHandler = (fn: (() => void) | null) => {
  onAuthLost = fn;
};

export async function saveSession(access: string, refresh?: string | null) {
  accessToken = access;
  if (refresh) await setItem(KEYS.refreshToken, refresh);
}

export async function clearSession() {
  accessToken = null;
  await removeItem(KEYS.refreshToken);
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    // Tells the backend to also return the refresh token in the response
    // body, since a native app can't rely on the httpOnly cookie.
    "x-client": "mobile",
  },
});

// A bare client for the refresh call itself (no interceptors → no loops).
const bare = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json", "x-client": "mobile" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});

let refreshing: Promise<string> | null = null;

/** Exchanges the stored refresh token for a new access token (single flight). */
export function refreshAccessToken(): Promise<string> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = await getItem(KEYS.refreshToken);
      if (!refreshToken) throw new Error("no-refresh-token");
      const { data } = await bare.post<{
        accessToken: string;
        refreshToken?: string;
      }>("/users/refresh-token", { refreshToken });
      await saveSession(data.accessToken, data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

interface Retryable extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as Retryable | undefined;
    const status = error.response?.status;

    const isAuthCall =
      original?.url?.includes("/users/login") ||
      original?.url?.includes("/users/register") ||
      original?.url?.includes("/users/refresh-token");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.set("Authorization", `Bearer ${token}`);
        return api(original);
      } catch {
        await clearSession();
        onAuthLost?.();
      }
    }
    return Promise.reject(error);
  },
);
