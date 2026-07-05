import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { LoginPayload, RegisterPayload } from "../schemas/auth.schema";

import type { LoginResponse, RegisterResponse } from "../types/auth.types";

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

export const register = (data: RegisterPayload) => {
  return api.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data);
};

export const logout = () => {
  return api.post(ENDPOINTS.AUTH.LOGOUT);
};
