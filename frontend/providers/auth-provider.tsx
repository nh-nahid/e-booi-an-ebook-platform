"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useProfile } from "@/features/auth/hooks/auth.hooks";

import type { User } from "@/features/auth/types/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data,
    isLoading,
    refetch,
  } = useProfile();

  const value: AuthContextType = {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading,
    refetch: () => {
      refetch();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}