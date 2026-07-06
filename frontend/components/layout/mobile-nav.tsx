"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAuth } from "@/hooks/use-auth";

import UserMenu from "./user-menu";
import { NAV_LINKS } from "./nav-links";

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <Sheet>

      {/* trigger button (no asChild) — matches the HTML's 3-bar menu icon */}
      <SheetTrigger>
        <div className="mn-menu-icon lg:hidden">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px]" style={{ background: "#FFFFFF" }}>
        <SheetHeader>
          <SheetTitle
            className="inline-flex w-fit items-center gap-1 rounded-2xl px-4 py-1.5 text-lg font-extrabold"
            style={{ background: "#E6F7F6", color: "#0A0E2A" }}
          >
            eBoo<span style={{ color: "#2DBDB6" }}>i</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-1">
          {/* NAV LINKS (now plain Links, NOT Buttons) */}
          {NAV_LINKS.map((link, i) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ animationDelay: `${i * 0.05}s` }}
                className={[
                  "mn-item flex items-center rounded-2xl px-3 py-2.5",
                  active ? "active" : "",
                ].join(" ")}
              >
                {Icon && <Icon className="mn-icon mr-2 h-4 w-4" />}
                {link.title}
              </Link>
            );
          })}

          {/* Wishlist */}
          <Link
            href="/wishlist"
            style={{ animationDelay: `${NAV_LINKS.length * 0.05}s` }}
            className="mn-item flex items-center rounded-2xl px-3 py-2.5"
          >
            <Heart className="mn-icon mr-2 h-4 w-4" />
            Wishlist
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            style={{ animationDelay: `${(NAV_LINKS.length + 1) * 0.05}s` }}
            className="mn-item flex items-center rounded-2xl px-3 py-2.5"
          >
            <ShoppingCart className="mn-icon mr-2 h-4 w-4" />
            Cart
          </Link>

          {/* Auth section stays buttons (no link wrapping button) */}
          {isAuthenticated ? (
            <div className="mt-4">
              <UserMenu mobile />
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => (window.location.href = "/login")}
                className="mn-cta-primary rounded-full border-0 font-bold text-white"
                style={{ background: "linear-gradient(135deg, #2DBDB6, #1f9d97)" }}
              >
                Login
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/register")}
                className="mn-cta-outline rounded-full font-bold"
                style={{ borderColor: "#E1E5E8", color: "#0A0E2A" }}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
