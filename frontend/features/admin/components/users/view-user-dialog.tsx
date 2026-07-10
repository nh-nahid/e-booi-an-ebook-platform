"use client";

import { useState } from "react";
import { Eye, Mail, Calendar, ShoppingBag, BookOpen, Phone } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { AdminUser } from "../../types/admin.types";

interface ViewUserDialogProps {
  user: AdminUser;
}

export default function ViewUserDialog({ user }: ViewUserDialogProps) {
  const [open, setOpen] = useState(false);

  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  const avatarSrc = user.avatar
    ? `${imageBaseUrl}/uploads/avatars/${user.avatar}`
    : undefined;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="
          flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280]
          transition-all duration-200 hover:bg-[#E6F7F6] hover:text-[#2DBDB6]
        "
        aria-label="View user"
      >
        <Eye className="h-4 w-4" />
      </button>

      <DialogContent className="rounded-3xl border-[#E1E5E8] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{user.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Details for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#0A0E2A] text-xl font-bold text-white ring-4 ring-[#E6F7F6]">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-[#0A0E2A]">
            {user.name}
          </h2>

          <p className="text-sm text-[#6B7280]">{user.email}</p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                user.role === "admin"
                  ? "bg-[#0A0E2A] text-white"
                  : "bg-[#E6F7F6] text-[#0A0E2A]"
              }`}
            >
              {user.role}
            </span>

            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                user.status === "active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.status === "active"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              {user.status}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#F7F9FA] p-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#2DBDB6]" />

            <div>
              <p className="text-[11px] text-[#9AA3AF]">Orders</p>
              <p className="text-sm font-semibold text-[#0A0E2A]">
                {user.ordersCount ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#2DBDB6]" />

            <div>
              <p className="text-[11px] text-[#9AA3AF]">Library</p>
              <p className="text-sm font-semibold text-[#0A0E2A]">
                {user.booksOwned ?? 0} books
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#2DBDB6]" />

            <div>
              <p className="text-[11px] text-[#9AA3AF]">Phone</p>
              <p className="truncate text-sm font-semibold text-[#0A0E2A]">
                {user.phone || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#2DBDB6]" />

            <div>
              <p className="text-[11px] text-[#9AA3AF]">Joined</p>
              <p className="text-sm font-semibold text-[#0A0E2A]">
                {user.joinedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#E1E5E8] px-4 py-3">
          <Mail className="h-4 w-4 shrink-0 text-[#9AA3AF]" />

          <p className="truncate text-sm text-[#6B7280]">
            {user.email}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}