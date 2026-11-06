"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, Library, Search, ShoppingCart, User as UserIcon } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import { useCart } from "@/features/cart/hooks/use-cart";

import MobileNav from "./mobile-nav";
import NotificationBell from "./notification-bell";

export default function Navbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const { data: cart = [] } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 500);

  // Ref, not state: this flag is only read inside effects to decide
  // whether to act — it never drives a render, so it must not be
  // React state (avoids the setState-in-effect cascading-render issue).
  const isTypingRef = useRef(false);
  const lastPushedRef = useRef(searchParams.get("search") ?? "");

  const buildBooksUrl = (value: string) => {
    const params =
      pathname === "/books"
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    const qs = params.toString();
    return qs ? `/books?${qs}` : "/books";
  };

  const navigateSearch = (value: string) => {
    lastPushedRef.current = value;

    if (pathname === "/books") {
      router.replace(buildBooksUrl(value), { scroll: false });
    } else {
      router.push(buildBooksUrl(value), { scroll: false });
    }
  };

  const handleSearch = () => {
    const keyword = search.trim();
    navigateSearch(keyword);
  };

  // Real-time debounced search.
  useEffect(() => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false; // reset the flag — plain ref mutation, not setState

    const value = debouncedSearch.trim();

    if (!value && pathname !== "/books") return;

    navigateSearch(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync input from URL (back/forward nav, shared link, nav-link clear).
  useEffect(() => {
    const urlValue = searchParams.get("search") ?? "";
    if (urlValue !== lastPushedRef.current) {
      setSearch(urlValue);
      lastPushedRef.current = urlValue;
    }
  }, [searchParams]);

  const clearSearchState = () => {
    isTypingRef.current = false;
    lastPushedRef.current = "";
    setSearch("");
  };

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_URL?.replace(
          "/api/v1",
          "",
        )}/uploads/avatars/${user.avatar}`
    : null;

  return (
    <header className="app-header sticky top-0 z-40 border-b border-white/30 bg-surface/65 px-4 shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3.5 sm:px-25 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        <div className="flex shrink-0 items-center gap-2">
          <MobileNav />

          <Link
            href="/"
            onClick={clearSearchState}
            className="flex items-center gap-1.5"
          >
            <Image
              src="/logo.jpeg"
              alt="ebooi Logo"
              width={36}
              height={36}
              priority
              className="rounded-lg"
            />
            <span className="text-xl font-extrabold tracking-tight text-ink">
              eb<span className="text-brand">oo</span>i
            </span>
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded border border-line bg-canvas px-4 py-2.5 transition-colors focus-within:border-brand sm:flex sm:max-w-md md:max-w-lg">
          <input
            value={search}
            onChange={(e) => {
              isTypingRef.current = true;
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="কাঙ্ক্ষিত বই খুঁজুন"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
          />
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="shrink-0 text-subtle transition-colors hover:text-brand"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="app-header-actions flex shrink-0 items-center gap-3 sm:gap-6">
          <NotificationBell onClick={clearSearchState} />

          <Link
            href="/library"
            onClick={clearSearchState}
            className="flex flex-col items-center gap-0.5 text-ink transition-colors hover:text-brand"
            aria-label="লাইব্রেরি"
          >
            <Library className="h-5 w-5" />
            <span className="text-[10px] font-normal leading-none">লাইব্রেরি</span>
          </Link>

          <Link
            href="/cart"
            onClick={clearSearchState}
            className="flex flex-col items-center gap-0.5 text-ink transition-colors hover:text-brand"
            aria-label="কার্ট"
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold leading-none text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-normal leading-none">কার্ট</span>
          </Link>

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            onClick={clearSearchState}
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-white transition-opacity hover:opacity-90"
            aria-label={isAuthenticated ? "My Profile" : "Login"}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user?.name ?? "Profile"}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-[18px] w-[18px]" />
            )}
          </Link>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-canvas px-4 py-2.5 transition-colors focus-within:border-brand sm:hidden">
        <input
          value={search}
          onChange={(e) => {
            isTypingRef.current = true;
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="কাঙ্ক্ষিত বই খুঁজুন"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
        />
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search"
          className="shrink-0 text-subtle transition-colors hover:text-brand"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
