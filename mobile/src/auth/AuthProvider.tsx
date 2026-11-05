import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";

import {
  api,
  clearSession,
  refreshAccessToken,
  saveSession,
  setAuthLostHandler,
} from "@/lib/api";
import { API_URL, DEEP_LINK_PREFIX } from "@/lib/config";
import { KEYS, getItem } from "@/lib/storage";
import type { User } from "@/types";

interface AuthValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Opens Google sign-in; resolves true when signed in, false if cancelled. */
  loginWithGoogle: () => Promise<boolean>;
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

  const loginWithGoogle = useCallback(async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      `${API_URL}/users/google/mobile`,
      `${DEEP_LINK_PREFIX}google-auth`,
    );
    if (result.type !== "success" || !result.url) return false;

    const query = result.url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    const error = params.get("error");
    if (error === "cancelled") return false;
    if (error === "suspended") throw new Error("আপনার অ্যাকাউন্টটি সাময়িকভাবে বন্ধ আছে");
    const code = params.get("code");
    if (error || !code) throw new Error("গুগল দিয়ে সাইন-ইন করা যায়নি। আবার চেষ্টা করুন।");

    const { data } = await api.post<{
      accessToken: string;
      refreshToken?: string;
      user: ProfileUser;
    }>("/users/google/exchange", { code });
    await saveSession(data.accessToken, data.refreshToken);
    setUser(toUser(data.user));
    qc.invalidateQueries();
    return true;
  }, [qc]);

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
      loginWithGoogle,
      register,
      logout,
      reloadProfile: loadProfile,
    }),
    [user, isLoading, login, loginWithGoogle, register, logout, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
