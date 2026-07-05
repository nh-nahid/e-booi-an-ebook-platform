"use client";

import { useMutation } from "@tanstack/react-query";

import { login, logout, register } from "../api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};
