"use client";

import {
  BookOpen,
  Camera,
  Loader2,
  Pencil,
  ShoppingBag,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useDeleteAvatar, useUploadAvatar } from "../hooks/profile.hooks";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(avatarUrl);
  const [dragging, setDragging] = useState(false);

  const { mutateAsync: uploadAvatar, isPending: uploading } = useUploadAvatar();

  const { mutateAsync: deleteAvatar, isPending: deleting } = useDeleteAvatar();

  const loading = uploading || deleting;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    const formData = new FormData();

    formData.append("avatar", file);

    try {
      await uploadAvatar(formData);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragging(false);

    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = async () => {
    setPreview("");

    await deleteAvatar();
  };

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
      {/* Ambient blob */}
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#2DBDB6] opacity-[0.12] blur-3xl" />

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="
            absolute right-5 top-5 flex h-9 w-9
            items-center justify-center rounded-full
            border border-[#E1E5E8] bg-white
            text-[#0A0E2A]
            transition-all duration-200
            hover:-translate-y-0.5
            hover:border-[#2DBDB6]
            hover:bg-[#E6F7F6]
            hover:text-[#2DBDB6]
          "
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Avatar Upload */}
        <div
          className={`
            group relative flex h-32 w-32 cursor-pointer
            items-center justify-center rounded-full
            transition-all duration-300

            ${dragging ? "ring-4 ring-[#2DBDB6]/30" : "ring-4 ring-[#E6F7F6]"}
          `}
          onClick={() => {
            if (!loading) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Avatar className="h-32 w-32">
            <AvatarImage src={preview} alt={name} className="object-cover" />

            <AvatarFallback
              className="
                bg-[#0A0E2A]
                text-2xl
                font-bold
                text-white
              "
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Hover Overlay */}
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              rounded-full
              bg-[#0A0E2A]/0
              opacity-0
              transition-all duration-200

              group-hover:bg-[#0A0E2A]/50
              group-hover:opacity-100
            "
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            ) : (
              <Camera className="h-7 w-7 text-white" />
            )}
          </div>

          {/* Drag Ring */}
          {dragging && (
            <div
              className="
                absolute -inset-1.5
                rounded-full
                border-2
                border-dashed
                border-[#2DBDB6]
              "
            />
          )}

          {/* Camera Badge */}
          <span
            className="
              absolute bottom-1 right-1
              flex h-9 w-9
              items-center justify-center
              rounded-full
              border-2 border-white
              bg-[#2DBDB6]
              text-white
            "
          >
            <Camera className="h-4 w-4" />
          </span>

          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Upload / Remove Buttons */}
        <div className="mt-5 flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="
              rounded-full
              bg-gradient-to-br
              from-[#2DBDB6]
              to-[#1f9d97]
            "
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Photo
          </Button>

          {preview && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={handleRemove}
              className="rounded-full"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove
            </Button>
          )}
        </div>

        <p className="mt-4 text-xs text-[#9AA3AF]">
          Drag & drop an image, or click upload. JPG/PNG, up to 5MB.
        </p>

        {/* User Info */}
        <h3 className="mt-5 text-lg font-bold text-[#0A0E2A]">{name}</h3>

        <p className="mt-1 text-sm text-[#6B7280]">{email}</p>

        {role === "admin" && (
          <span
            className="
              mt-3 rounded-full
              bg-[#E6F7F6]
              px-3 py-1
              text-[11px]
              font-bold
              tracking-wide
              text-[#0A0E2A]
            "
          >
            ADMIN
          </span>
        )}

        {memberSince && (
          <p className="mt-2 text-xs text-[#9AA3AF]">
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* Stats */}
      <div
        className="
          relative mt-6
          grid grid-cols-2
          divide-x divide-[#E1E5E8]
          rounded-2xl
          bg-[#F7F9FA]
          py-4
        "
      >
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[#2DBDB6]">
            <BookOpen className="h-4 w-4" />

            <span className="text-lg font-bold text-[#0A0E2A]">
              {booksOwned}
            </span>
          </div>

          <span className="text-xs font-medium text-[#6B7280]">My Library</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-[#2DBDB6]">
            <ShoppingBag className="h-4 w-4" />

            <span className="text-lg font-bold text-[#0A0E2A]">
              {ordersCount}
            </span>
          </div>

          <span className="text-xs font-medium text-[#6B7280]">Orders</span>
        </div>
      </div>
    </div>
  );
}
