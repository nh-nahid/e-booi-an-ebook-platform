"use client";

import { Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks/auth.hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/lib/query-client";
import { clearAccessToken } from "@/services/api/token";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/books": "Books",
  "/admin/users": "Users",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
  "/admin/authors": "Authors",
  "/admin/publishers": "Publishers",
};

interface AdminHeaderProps {
  adminName?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

export default function AdminHeader({
  adminName = "Admin",
  avatarUrl = "",
  notificationCount = 0,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const title = PAGE_TITLES[pathname] ?? "Admin";

  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();

        queryClient.setQueryData(["profile"], {
          user: null,
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
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#E6F7F6]">
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
              {adminName}
            </span>

            <ChevronsUpDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="font-semibold">{adminName}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
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
