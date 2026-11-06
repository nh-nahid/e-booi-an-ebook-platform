"use client";

import { BookOpen, Heart, Home, Library, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useCart } from "@/features/cart/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

// Same five tabs, order and labels as the native app's tab bar.
const TABS = [
  { href: "/", label: "হোম", Icon: Home },
  { href: "/books", label: "বই", Icon: BookOpen },
  { href: "/library", label: "লাইব্রেরি", Icon: Library },
  { href: "/cart", label: "কার্ট", Icon: ShoppingCart },
  { href: "/wishlist", label: "উইশলিস্ট", Icon: Heart },
] as const;

/**
 * Native-style bottom tab bar. It only appears when the site runs as an
 * installed app (display-mode: standalone — PWA / Android TWA) on a phone-sized
 * screen, and only on the five tab screens, exactly like the native app.
 * Visibility is pure CSS (see .pwa-tabbar in globals.css), so browsers and
 * desktop are untouched.
 */
export default function BottomTabs() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { data } = useCart();

  const isTabScreen = TABS.some((t) =>
    t.href === "/" ? pathname === "/" : pathname === t.href,
  );

  useEffect(() => {
    document.body.classList.toggle("has-tabbar", isTabScreen);
    return () => document.body.classList.remove("has-tabbar");
  }, [isTabScreen]);

  if (!isTabScreen) return null;

  const items = Array.isArray(data) ? data : ((data as { items?: { quantity?: number }[] } | undefined)?.items ?? []);
  const count = isAuthenticated ? items.reduce((n, i) => n + (i.quantity ?? 1), 0) : 0;

  return (
    <nav className="pwa-tabbar" aria-label="প্রধান মেনু">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname === href;
        return (
          <Link key={href} href={href} className={active ? "pwa-tab active" : "pwa-tab"} aria-current={active ? "page" : undefined}>
            <span className="pwa-tab-icon">
              <Icon strokeWidth={active ? 2.4 : 1.8} fill={active && href !== "/" ? "currentColor" : "none"} fillOpacity={0.15} />
              {href === "/cart" && count > 0 && <span className="pwa-badge">{count > 9 ? "9+" : count}</span>}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
