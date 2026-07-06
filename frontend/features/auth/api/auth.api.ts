import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

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

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>(
    ENDPOINTS.AUTH.PROFILE
  );

  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    ENDPOINTS.AUTH.LOGOUT
  );

  return response.data;
};