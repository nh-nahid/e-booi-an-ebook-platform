"use client";

import { Bell, User, Settings, LogOut, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/auth.hooks";
import { clearAccessToken } from "@/services/api/token";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/books": "Books",
  "/admin/users": "Users",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
  "/admin/authors": "Authors",
  "/admin/publishers": "Publishers",
};

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E1E5E8] bg-white/90 px-6 backdrop-blur">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </header>
    );
  }

  if (!user) return null;

  const title = PAGE_TITLES[pathname] ?? "Admin";
  const notificationCount = 0;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarUrl = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(
        "/api/v1",
        "",
      )}/uploads/avatars/${user.avatar}`
    : "";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();

        queryClient.removeQueries({
          queryKey: ["profile"],
        });

        toast.success("Logged out successfully");

        router.replace("/login");
      },

      onError: (error) => {
        toast.error(error.response?.data?.message ?? "Logout failed");
      },
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-[#E1E5E8] bg-white/90 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-bold text-[#0A0E2A]">{title}</h1>
      </div>

      <div className="hidden max-w-sm flex-1 items-center md:flex">
        <div className="relative w-full">
          <input
            placeholder="Search books, users, orders..."
            className="h-10 w-full rounded-full border border-[#E1E5E8] bg-[#F7F9FA] px-4 text-sm outline-none focus:border-[#2DBDB6]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#E6F7F6]">
          <Bell className="h-5 w-5" />

          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2DBDB6] text-[9px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-[#E1E5E8] py-1 pl-1 pr-3 outline-none transition hover:border-[#2DBDB6]">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <span className="hidden text-sm font-semibold sm:block">
              {user.name}
            </span>

            <ChevronsUpDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}