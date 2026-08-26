"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

// Renders nothing — just bounces a logged-in admin away from the storefront
// homepage straight to the admin panel, so admins never land on "/" itself.
export default function AdminRedirectGuard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, user, router]);

  return null;
}
