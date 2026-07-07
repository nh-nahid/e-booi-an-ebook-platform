import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./token";

interface ApiError {
  message: string;
  code?: string;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                             Request Interceptor                            */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  }
);

/* -------------------------------------------------------------------------- */
/*                              Refresh Handling                              */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (
  error: unknown,
  token?: string
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                            Response Interceptor                            */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as
      | RetryRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "TOKEN_EXPIRED"
    ) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Wait while another request refreshes the token
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${token}`
          );

          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{
          accessToken: string;
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = data.accessToken;

        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        clearAccessToken();

        // TODO:
        // queryClient.clear();
        // router.replace("/login");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;