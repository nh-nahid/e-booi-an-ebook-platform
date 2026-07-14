"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart, Search, ShoppingCart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

import MobileNav from "./mobile-nav";
import UserMenu from "./user-menu";
import { NAV_LINKS } from "./nav-links";
import { useDebounce } from "@/hooks/use-debounce";
import { useCart } from "@/features/cart/hooks/use-cart";

export default function Navbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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

  return (
    <header className="nb-header">
      <div className="flex items-center gap-8 lg:gap-10">
        <Link href="/" className="nb-logo" onClick={clearSearchState}>
          <div className="nb-logo-mark">
            <Image src="/logo.jpeg" width={32} height={32} alt="logo" className="rounded-lg" />
          </div>
          <span>
            eBoo<span className="text-[#2DBDB6]">i</span>
          </span>
        </Link>

        <nav className="nb-links">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={clearSearchState}
                className={`nb-link ${active ? "active" : ""}`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="nb-search">
        <Search className="h-4 w-4 cursor-pointer" onClick={handleSearch} />

        <Input
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
          placeholder="Search books..."
          className="border-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-1">
        <Link href="/wishlist" className="nb-icon-btn" onClick={clearSearchState}>
          <Heart className="h-[18px] w-[18px]" />
        </Link>
        <Link
          href="/cart"
          className="nb-icon-btn relative"
          onClick={clearSearchState}
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {isAuthenticated && cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2DBDB6] px-1 text-[10px] font-bold leading-none text-white">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="hidden md:block">
            <UserMenu />
          </div>
        ) : (
          <div className="nb-desktop items-center gap-1">
            <Link href="/login" className="nb-cta-ghost" onClick={clearSearchState}>
              Login
            </Link>
            <Link href="/register" className="nb-cta-primary" onClick={clearSearchState}>
              Register
            </Link>
          </div>
        )}

        <div className="nb-mobile-trigger mb-2">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}