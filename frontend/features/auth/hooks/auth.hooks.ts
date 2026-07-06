"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { login, logout, register, getProfile } from "../api/auth.api";

import type {
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types";

import type {
  LoginPayload,
  RegisterPayload,
} from "../schemas/auth.schema";

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
    mutationFn: register,
  });
};


export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,

    retry: false,

    staleTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
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