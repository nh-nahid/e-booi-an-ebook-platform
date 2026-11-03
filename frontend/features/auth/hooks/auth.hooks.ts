"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  login,
  logout,
  register,
  getProfile,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from "../api/auth.api";

import type {
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types";

import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from "../schemas/auth.schema";
import { getAccessToken } from "@/services/api/token";

interface ApiError {
  message: string;
}

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    AxiosError<ApiError>,
    LoginPayload
  >({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation<
    RegisterResponse,
    AxiosError<ApiError>,
    RegisterPayload
  >({
    mutationKey: ["register"],
    mutationFn: register,
  });
};

export const useProfile = (enabled: boolean) => {
  const hasToken = !!getAccessToken();

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: enabled && hasToken,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useLogout = () => {
  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    void
  >({
    mutationFn: logout,
  });
};

export const useForgotPassword = () => {
  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    ForgotPasswordPayload
  >({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    { token: string; password: string }
  >({
    mutationFn: resetPassword,
  });
};
