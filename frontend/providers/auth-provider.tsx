"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { UseQueryResult } from "@tanstack/react-query";

import { useProfile } from "@/features/auth/hooks/auth.hooks";

import {
  refreshAccessToken,
} from "@/features/auth/api/auth.api";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/services/api/token";

import type { User } from "@/features/auth/types/auth.types";
import Loading from "@/app/loading";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: UseQueryResult["refetch"];
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);



export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
  const bootstrap = async () => {

    try {
      if (getAccessToken()) {
        
        setInitialized(true);
        return;
      }

      const response = await refreshAccessToken();

      setAccessToken(response.accessToken);
    } catch (error) {
      console.log("Refresh failed:", error);

      clearAccessToken();
    } finally {
      setInitialized(true);
    }
  };

  bootstrap();
}, []);

  const {
    data,
    isLoading,
    refetch,
  } = useProfile(initialized);

  const refreshAuth = async () => {
  await refetch();
};

const value: AuthContextType = {
  user: data?.user ?? null,
  isAuthenticated: !!data?.user,
  isLoading: !initialized || isLoading,
  refetch,
  refreshAuth,
};

if (!initialized) {
  return <Loading/>; 
}

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