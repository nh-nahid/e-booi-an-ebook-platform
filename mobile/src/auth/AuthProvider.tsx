import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  api,
  clearSession,
  refreshAccessToken,
  saveSession,
  setAuthLostHandler,
} from "@/lib/api";
import { KEYS, getItem } from "@/lib/storage";
import type { User } from "@/types";

interface AuthValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

interface ProfileUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
  phone?: string;
  bio?: string;
}

const toUser = (u: ProfileUser): User => ({
  id: (u._id ?? u.id) as string,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar ?? null,
  phone: u.phone,
  bio: u.bio,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const { data } = await api.get<{ user: ProfileUser }>("/users/profile");
    setUser(toUser(data.user));
  }, []);

  // Restore the session on launch from the stored refresh token.
  useEffect(() => {
    setAuthLostHandler(() => {
      setUser(null);
      qc.clear();
    });
    (async () => {
      try {
        const stored = await getItem(KEYS.refreshToken);
        if (stored) {
          await refreshAccessToken();
          await loadProfile();
        }
      } catch {
        await clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => setAuthLostHandler(null);
  }, [loadProfile, qc]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{
        accessToken: string;
        refreshToken?: string;
        user: ProfileUser;
      }>("/users/login", { email: email.trim(), password });
      await saveSession(data.accessToken, data.refreshToken);
      setUser(toUser(data.user));
      qc.invalidateQueries();
    },
    [qc],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "user",
      });
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch {
      /* server-side logout is best effort */
    }
    await clearSession();
    setUser(null);
    qc.clear();
  }, [qc]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      reloadProfile: loadProfile,
    }),
    [user, isLoading, login, register, logout, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
