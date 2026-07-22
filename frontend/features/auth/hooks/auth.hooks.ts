"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { login, logout, register, getProfile, refreshAccessToken } from "../api/auth.api";

import type {
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types";

import type {
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

