"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../loading";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loading />
  }

  if (user?.role === "admin") {
    return null;
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to E-Booi 📚</h1>
    </main>
  );
}
