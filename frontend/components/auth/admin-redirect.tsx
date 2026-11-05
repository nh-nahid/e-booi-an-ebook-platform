"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

/**
 * Admins only work inside /admin. If a signed-in admin lands on any
 * user-side page (store, login, profile…), send them back to the panel and
 * cover the page so nothing from the user side is shown.
 */
export default function AdminRedirect() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = !isLoading && user?.role === "admin";
  const outside = isAdmin && !pathname.startsWith("/admin");

  useEffect(() => {
    if (outside) router.replace("/admin");
  }, [outside, router]);

  if (!outside) return null;
  return <div className="fixed inset-0 z-[100] bg-canvas" aria-hidden />;
}
