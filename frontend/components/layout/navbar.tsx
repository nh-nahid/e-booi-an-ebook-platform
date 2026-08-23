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
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(
        "/api/v1",
        "",
      )}/uploads/avatars/${user.avatar}`
    : null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E1E5E8] bg-white px-4 py-2 sm:px-25 sm:py-3">
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
              alt="eBooi Logo"
              width={36}
              height={36}
              priority
              className="rounded-lg"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#0A0E2A]">
              eB<span className="text-[#2DBDB6]">oo</span>i
            </span>
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded border border-[#E1E5E8] bg-[#F7F9FA] px-4 py-2.5 transition-colors focus-within:border-[#2DBDB6] sm:flex sm:max-w-md md:max-w-lg">
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
            className="min-w-0 flex-1 bg-transparent text-sm text-[#0A0E2A] outline-none placeholder:text-[#9AA3AF]"
          />
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="shrink-0 text-[#9AA3AF] transition-colors hover:text-[#2DBDB6]"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-6">

          <Link
            href="/library"
            onClick={clearSearchState}
            className="flex flex-col items-center gap-0.5 text-[#0A0E2A] transition-colors hover:text-[#2DBDB6]"
            aria-label="লাইব্রেরি"
          >
            <Library className="h-5 w-5" />
            <span className="text-[10px] font-normal leading-none">লাইব্রেরি</span>
          </Link>

          <Link
            href="/cart"
            onClick={clearSearchState}
            className="flex flex-col items-center gap-0.5 text-[#0A0E2A] transition-colors hover:text-[#2DBDB6]"
            aria-label="কার্ট"
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2DBDB6] px-1 text-[9px] font-bold leading-none text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-normal leading-none">কার্ট</span>
          </Link>

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            onClick={clearSearchState}
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0A0E2A] text-white transition-opacity hover:opacity-90"
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
            ) : isAuthenticated ? (
              <span className="text-xs font-bold">{initials}</span>
            ) : (
              <UserIcon className="h-[18px] w-[18px]" />
            )}
          </Link>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-md border border-[#E1E5E8] bg-[#F7F9FA] px-2.5 py-1.5 transition-colors focus-within:border-[#2DBDB6] sm:hidden">
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
          className="min-w-0 flex-1 bg-transparent text-xs text-[#0A0E2A] outline-none placeholder:text-[#9AA3AF]"
        />
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search"
          className="shrink-0 text-[#9AA3AF] transition-colors hover:text-[#2DBDB6]"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
