import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";
import axios from "axios";

import type {
  LoginPayload,
  RegisterPayload,
} from "../schemas/auth.schema";

import type {
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
} from "../types/auth.types";

export const login = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    ENDPOINTS.AUTH.REGISTER,
    data
  );

  return response.data;
};

export const getProfile = async () => {
  try {
    const response = await api.get(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      return null;
    }

    throw error;
  }
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    ENDPOINTS.AUTH.LOGOUT
  );

  return response.data;
};

export const refreshAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await api.post(ENDPOINTS.AUTH.REFRESH_TOKEN);
  return response.data;
};

