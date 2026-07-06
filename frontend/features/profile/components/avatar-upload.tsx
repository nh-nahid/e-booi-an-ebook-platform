"use client";

import { useRef, useState, type DragEvent } from "react";
import { Camera, Upload, Trash2, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  name: string;
  avatarUrl?: string;
  onUpload?: (file: File) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
}

export default function AvatarUpload({
  name,
  avatarUrl = "",
  onUpload,
  onRemove,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>(avatarUrl);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setLoading(true);
    try {
      await onUpload?.(file);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = async () => {
    setPreview("");
    await onRemove?.();
  };


  

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          group relative flex h-32 w-32 cursor-pointer items-center justify-center
          rounded-full transition-all duration-300
          ${dragging ? "ring-4 ring-[#2DBDB6]/30" : "ring-4 ring-[#E6F7F6]"}
        `}
      >
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview} alt={name} className="object-cover" />
          <AvatarFallback className="bg-[#0A0E2A] text-2xl font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* hover overlay */}
        <div
          className="
            absolute inset-0 flex items-center justify-center rounded-full
            bg-[#0A0E2A]/0 text-white opacity-0 backdrop-blur-0
            transition-all duration-200
            group-hover:bg-[#0A0E2A]/50 group-hover:opacity-100 group-hover:backdrop-blur-[1px]
          "
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
        </div>

        {/* dashed ring shown while dragging */}
        {dragging && (
          <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#2DBDB6]" />
        )}

        {/* camera badge */}
        <span
          className="
            absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center
            rounded-full border-2 border-white bg-[#2DBDB6] text-white
            transition-transform duration-200 group-hover:scale-110
          "
        >
          <Camera className="h-4 w-4" />
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
            px-4 py-2 text-xs font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]
            transition-all duration-150
            hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
            active:translate-y-0 active:scale-[0.98]
          "
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Photo
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="
              flex items-center gap-1.5 rounded-full border border-[#E1E5E8]
              bg-white px-4 py-2 text-xs font-bold text-[#6B7280]
              transition-all duration-150
              hover:-translate-y-0.5 hover:border-red-300 hover:text-red-600
            "
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>

      <p className="text-center text-xs text-[#9AA3AF]">
        Drag & drop an image, or click to browse. JPG/PNG, up to 5MB.
      </p>
    </div>
  );
}
