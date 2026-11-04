"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export default function NotificationBell({ onClick }: { onClick?: () => void }) {
  const { isAuthenticated } = useAuth();
  const { data } = useNotifications(isAuthenticated);
  const unread = isAuthenticated ? (data?.unread ?? 0) : 0;

  return (
    <Link
      href={isAuthenticated ? "/notifications" : "/login"}
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 text-ink transition-colors hover:text-brand"
      aria-label="নোটিফিকেশন"
    >
      <span className="relative">
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </span>
      <span className="text-[10px] font-normal leading-none">নোটিফিকেশন</span>
    </Link>
  );
}
