"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
  role?: "user" | "admin";
}

interface LatestUsersProps {
  users: RecentUser[];
}

export default function LatestUsers({ users }: LatestUsersProps) {
  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0A0E2A]">Latest Users</h3>
          <p className="text-xs text-[#6B7280]">Newest sign-ups</p>
        </div>
        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-xs font-bold text-[#2DBDB6] transition-colors hover:text-[#1f9d97]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-1">
        {users.map((user) => {
          const initials = user.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F7F9FA]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0A0E2A] text-xs font-bold text-white">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0A0E2A]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-[#6B7280]">{user.email}</p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                {user.role === "admin" && (
                  <span className="rounded-full bg-[#E6F7F6] px-2 py-0.5 text-[10px] font-bold text-[#0A0E2A]">
                    ADMIN
                  </span>
                )}
                <span className="text-[11px] text-[#9AA3AF]">{user.joinedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
