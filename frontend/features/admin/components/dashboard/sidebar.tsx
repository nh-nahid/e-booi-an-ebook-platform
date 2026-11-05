"use client";

import {
  BookOpen,
  Crown,
  Ticket,
  FolderTree,
  LayoutDashboard,
  LogOut,
  PenSquare,
  ShoppingBag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useLogout } from "@/features/auth/hooks/auth.hooks";
import { clearAccessToken } from "@/services/api/token";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Crown },
  { href: "/admin/authors", label: "Author Profile", icon: PenSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();
        queryClient.setQueryData(["profile"], { user: null });
        router.replace("/login");
      },
      onError: () => toast.error("লগআউট করা যায়নি"),
    });

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <Image src="/logo.jpeg" alt="ebooi Admin Logo" width={32} height={32} />

        <span className="text-lg font-extrabold text-ink">
          eboo<span className="text-brand">i</span>
        </span>

        <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-ink">
          ADMIN
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold
                transition-all duration-200
                ${
                  active
                    ? "bg-brand-soft text-ink"
                    : "text-muted-ink hover:bg-canvas hover:text-ink"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
              )}
              <Icon
                className="h-[18px] w-[18px] transition-colors"
                style={{ color: active ? "#2DBDB6" : "#9AA3AF" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="
            flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold
            text-muted-ink transition-all duration-200
            hover:bg-danger-soft hover:text-danger-ink
          "
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
