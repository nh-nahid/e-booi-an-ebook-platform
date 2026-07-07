"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/features/auth/types/api-error";
import {
  LogOut,
  User,
  Library,
  ShoppingBag,
  Shield,
  ChevronsUpDown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/auth.hooks";
import { clearAccessToken } from "@/services/api/token";

export default function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  // 🔥 SAFE LOADING STATE (prevents crash)
  if (isLoading) {
    return <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />;
  }

  // If no user, just hide menu safely (NO crash)
  if (!user) return null;

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
    console.log("logout clicked");

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
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border px-2 py-1">
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <ChevronsUpDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* USER INFO */}
        <div className="p-2">
          <p className="font-bold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* NAV ITEMS (FIXED - NO LINK WRAP) */}
        <DropdownMenuItem
          onClick={() => {
            router.push("/profile");
          }}
        >
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push("/library");
          }}
        >
          <Library className="mr-2 h-4 w-4" />
          My Library
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            router.push("/orders");
          }}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Orders
        </DropdownMenuItem>

        {user.role === "admin" && (
          <DropdownMenuItem onSelect={() => router.push("/admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
