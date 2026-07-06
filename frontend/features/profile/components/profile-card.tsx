"use client";

import Image from "next/image";
import { BadgeCheck, BookOpen, ShoppingBag, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "user" | "admin";
  booksOwned?: number;
  ordersCount?: number;
  memberSince?: string;
  onEdit?: () => void;
}

export default function ProfileCard({
  name,
  email,
  avatarUrl = "",
  role = "user",
  booksOwned = 0,
  ordersCount = 0,
  memberSince,
  onEdit,
}: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="
        relative w-full max-w-md overflow-hidden rounded-3xl
        border border-[#E1E5E8] bg-white p-6
        shadow-[0_10px_30px_rgba(10,14,42,0.06)]
        transition-shadow duration-300
        hover:shadow-[0_16px_40px_rgba(10,14,42,0.1)]
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >
      {/* ambient teal blob */}
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#2DBDB6] opacity-[0.12] blur-3xl" />

      {onEdit && (
        <button
          onClick={onEdit}
          className="
            absolute right-5 top-5 flex h-9 w-9 items-center justify-center
            rounded-full border border-[#E1E5E8] bg-white text-[#0A0E2A]
            transition-all duration-200
            hover:-translate-y-0.5 hover:border-[#2DBDB6] hover:bg-[#E6F7F6] hover:text-[#2DBDB6]
          "
          aria-label="Edit profile"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-24 w-24 ring-4 ring-[#E6F7F6] transition-shadow duration-300">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-[#0A0E2A] text-xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          {role === "admin" && (
            <span
              className="
                absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                rounded-full border-2 border-white bg-[#2DBDB6] text-white
              "
              title="Admin"
            >
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold text-[#0A0E2A]">{name}</h3>
        <p className="text-sm text-[#6B7280]">{email}</p>

        {role === "admin" && (
          <span
            className="
              mt-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-[11px] font-bold
              tracking-wide text-[#0A0E2A]
            "
          >
            ADMIN
          </span>
        )}

        {memberSince && (
          <p className="mt-2 text-xs text-[#9AA3AF]">Member since {memberSince}</p>
        )}
      </div>

      <div className="relative mt-6 grid grid-cols-2 divide-x divide-[#E1E5E8] rounded-2xl bg-[#F7F9FA] py-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[#2DBDB6]">
            <BookOpen className="h-4 w-4" />
            <span className="text-lg font-bold text-[#0A0E2A]">{booksOwned}</span>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">My Library</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[#2DBDB6]">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-lg font-bold text-[#0A0E2A]">{ordersCount}</span>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">Orders</span>
        </div>
      </div>
    </div>
  );
}
