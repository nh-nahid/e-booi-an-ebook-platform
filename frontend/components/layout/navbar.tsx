"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Heart, Search, ShoppingCart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

import MobileNav from "./mobile-nav";
import UserMenu from "./user-menu";
import { NAV_LINKS } from "./nav-links";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  const { isAuthenticated } = useAuth();

  return (
    <header className="nb-header">
      {/* Left */}
      <div className="flex items-center gap-8 lg:gap-10">
        <Link href="/" className="nb-logo">
          <div className="nb-logo-mark">
            <Image
              src="/logo.jpeg"
              width={32}
              height={32}
              alt="logo"
              className="rounded-lg"
            />
          </div>
          <span>
            eBoo<span style={{ color: "#2DBDB6" }}>i</span>
          </span>
        </Link>

        <nav className="nb-links">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nb-link ${active ? "active" : ""}`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center */}
      <div className="nb-search">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Search books..."
          className="border-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Link href="/wishlist" className="nb-icon-btn">
          <Heart className="h-[18px] w-[18px]" />
        </Link>

        <Link href="/cart" className="nb-icon-btn">
          <ShoppingCart className="h-[18px] w-[18px]" />
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop only */}
            <div className="hidden md:block">
              <UserMenu />
            </div>
          </>
        ) : (
          <div className="nb-desktop items-center gap-1">
            <Link href="/login" className="nb-cta-ghost">
              Login
            </Link>
            <Link href="/register" className="nb-cta-primary">
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
