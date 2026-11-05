"use client";

import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { setAccessToken } from "@/services/api/token";

import { getProfile, googleLogin } from "../api/auth.api";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GIS_SRC = "https://accounts.google.com/gsi/client";

interface GoogleId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
  }) => void;
  renderButton: (
    el: HTMLElement,
    options: Record<string, string | number>,
  ) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

// Loads Google Identity Services once, however many buttons mount.
let gisPromise: Promise<void> | null = null;
function loadGis(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gisPromise = null;
        reject(new Error("Could not load Google sign-in"));
      };
      document.head.appendChild(script);
    });
  }
  return gisPromise;
}

export default function GoogleButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();
  const holder = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  // Keep the latest handlers in a ref so the Google button is rendered once
  // (re-rendering it on every auth/context change would stack duplicate buttons).
  const handleCredential = useRef<(credential: string) => Promise<void>>(
    async () => {},
  );
  useEffect(() => {
    handleCredential.current = async (credential: string) => {
    try {
      const data = await googleLogin(credential);
      setAccessToken(data.accessToken);
      await refreshAuth();
      await queryClient.fetchQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
      });
      toast.success(data.message);
      router.replace(data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(
        isAxiosError<{ message: string }>(error)
          ? (error.response?.data?.message ?? "Google sign-in failed")
          : "Google sign-in failed",
      );
    }
    };
  });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGis()
      .then(() => {
        if (cancelled || !holder.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => {
            if (credential) void handleCredential.current(credential);
          },
        });

        const width = Math.min(holder.current.clientWidth || 320, 400);
        window.google.accounts.id.renderButton(holder.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "center",
          width,
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
    };
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="w-full">
      <div ref={holder} className="flex min-h-[44px] w-full justify-center" />
      {failed && (
        <p className="mt-1 text-center text-xs text-muted-ink">
          Google sign-in is unavailable right now.
        </p>
      )}
    </div>
  );
}
