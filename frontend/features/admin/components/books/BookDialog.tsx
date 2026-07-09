"use client";

import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const CATEGORIES = [
  "উপন্যাস",
  "ধর্মীয়",
  "বিজ্ঞান",
  "ব্যবসা",
  "সাহিত্য",
  "শিক্ষা",
];

export interface BookFormValues {
  title: string;
  author: string;
  category: string;
  publisher: string;
  isbn: string;
  language: string;
  publicationDate: string;
  pages: string;
  price: string;
  stock: string;
  bookType: "Physical" | "Digital";
  status: "published" | "draft";
  description: string;

  cover: File | null;
  pdf: File | null;
}

const initialValues: BookFormValues = {
  title: "",
  author: "",
  category: "",
  publisher: "",
  isbn: "",
  price: "",
  stock: "",
  bookType: "Physical",
  status: "draft",
  description: "",
  cover: null,
  language: "",
  publicationDate: "",
  pages: "",
  pdf: null,
};

interface BookDialogProps {
  mode?: "create" | "edit";
  initialValues?: Partial<BookFormValues>;
  trigger?: ReactElement;
  onSubmit: (values: BookFormValues) => Promise<void>;
}

export default function BookDialog({
  mode = "create",
  initialValues: defaultValues,
  trigger,
  onSubmit,
}: BookDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<BookFormValues>({
    ...initialValues,
    ...defaultValues,
  });
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof BookFormValues>(
    key: K,
    value: BookFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setValues({
      ...initialValues,
      ...defaultValues,
    });

    setCoverPreview("");
    setError(null);
  };

  const handleCoverChange = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    update("cover", file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.title.trim() || !values.author.trim()) {
      setError("Title and author are required.");
      return;
    }
    if (mode === "create" && !values.cover) {
      setError("Cover image is required.");
      return;
    }

    if (mode === "create" && values.bookType === "Digital" && !values.pdf) {
      setError("Please upload the PDF for a digital book.");
      return;
    }

    setLoading(true);

    try {
      await onSubmit(values);
      setOpen(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-white" />
          )
        }
      >
        {!trigger && (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#E1E5E8] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A0E2A]">
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            {mode === "create"
              ? "Fill in the details below to add a new book to your catalog."
              : "Update the book information below and save your changes."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
            {/* Cover upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#0A0E2A]">
                Cover
              </Label>
              <div
                onClick={() => fileRef.current?.click()}
                className="
                  group relative flex h-48 w-full cursor-pointer flex-col items-center
                  justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed
                  border-[#E1E5E8] bg-[#F7F9FA] transition-colors duration-200
                  hover:border-[#2DBDB6] sm:h-[180px]
                "
              >
                {coverPreview ? (
                  <>
                    <Image
                      width={32}
                      height={32}
                      src={coverPreview}
                      alt="Cover preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverPreview("");
                        update("cover", null);
                      }}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 text-[#9AA3AF] transition-colors group-hover:text-[#2DBDB6]" />
                    <span className="px-2 text-center text-[11px] text-[#9AA3AF]">
                      Click to upload cover
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverChange(e.target.files?.[0])}
              />
            </div>

            {/* Title / Author / Publisher */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold text-[#0A0E2A]"
                >
                  Book Title
                </Label>
                <Input
                  id="title"
                  value={values.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. The Silent Ocean"
                  className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="author"
                    className="text-xs font-semibold text-[#0A0E2A]"
                  >
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={values.author}
                    onChange={(e) => update("author", e.target.value)}
                    placeholder="Author name"
                    className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="publisher"
                    className="text-xs font-semibold text-[#0A0E2A]"
                  >
                    Publisher
                  </Label>
                  <Input
                    id="publisher"
                    value={values.publisher}
                    onChange={(e) => update("publisher", e.target.value)}
                    placeholder="Publisher name"
                    className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#0A0E2A]">
                Category
              </Label>
              <Select
                value={values.category}
                onValueChange={(v) => {
                  if (v) {
                    update("category", v);
                  }
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-[#E1E5E8] focus:ring-4 focus:ring-[#2DBDB6]/15">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="isbn"
                className="text-xs font-semibold text-[#0A0E2A]"
              >
                ISBN
              </Label>
              <Input
                id="isbn"
                value={values.isbn}
                onChange={(e) => update("isbn", e.target.value)}
                placeholder="978-XXXXXXXXXX"
                className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="text-xs font-semibold text-[#0A0E2A]"
              >
                Price (৳)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={values.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="0.00"
                className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="stock"
                className="text-xs font-semibold text-[#0A0E2A]"
              >
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={values.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder="0"
                className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#0A0E2A]">
                Book Type
              </Label>
              <Select
                value={values.bookType}
                onValueChange={(value) =>
                  update("bookType", value as BookFormValues["bookType"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Physical">Physical</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {values.bookType === "Digital" && (
              <div className="space-y-2">
                <Label>PDF File</Label>

                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => update("pdf", e.target.files?.[0] ?? null)}
                />

                {values.pdf && (
                  <p className="text-sm text-green-600">{values.pdf.name}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#0A0E2A]">
              Status
            </Label>
            <Select
              value={values.status}
              onValueChange={(v) =>
                update("status", v as BookFormValues["status"])
              }
            >
              <SelectTrigger className="h-11 rounded-xl border-[#E1E5E8] focus:ring-4 focus:ring-[#2DBDB6]/15">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pre-order">Pre-Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-[#0A0E2A]"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short description of the book..."
              rows={3}
              className="resize-none rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-[#FDEDEC] px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full border-[#E1E5E8] font-semibold text-[#0A0E2A] hover:border-[#2DBDB6] hover:text-[#2DBDB6]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="
                group relative min-w-[140px] overflow-hidden rounded-full border-0
                font-semibold text-white bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
                shadow-[0_4px_12px_rgba(45,189,182,0.35)]
                transition-transform duration-150
                hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
                active:translate-y-0 active:scale-[0.98]
                disabled:opacity-70
              "
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Book"
                )}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
