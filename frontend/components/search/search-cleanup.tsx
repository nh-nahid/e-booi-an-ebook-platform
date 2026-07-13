// components/search-cleanup.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSearchStore } from "@/stores/search-store";

export default function SearchCleanup() {
  const pathname = usePathname();
  const clearSearch = useSearchStore((s) => s.clearSearch);

  useEffect(() => {
    if (!pathname.startsWith("/books")) {
      clearSearch();
    }
  }, [pathname, clearSearch]);

  return null;
}