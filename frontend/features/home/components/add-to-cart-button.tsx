"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { useAddToCart, useCart } from "@/features/cart/hooks/use-cart";

interface AddToCartButtonProps {
  bookId: string;
  stock: number;
}

interface ApiError {
  message: string;
}

export default function AddToCartButton({
  bookId,
  stock,
}: AddToCartButtonProps) {
  const router = useRouter();

  const { data: cartItems } = useCart();
  const addToCartMutation = useAddToCart();

  const added =
    cartItems?.some((item) =>
      typeof item.book === "string"
        ? item.book === bookId
        : item.book?._id === bookId
    ) ?? false;

  const adding = addToCartMutation.isPending;

  const handleAddToCart = async () => {
    if (added) {
      router.push("/cart");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        bookId,
        quantity: 1,
      });

      toast.success("বইটি কার্টে যোগ করা হয়েছে");
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        if (error.response?.status === 401) {
          toast.error("প্রথমে লগইন করুন");
          router.push("/login");
          return;
        }

        toast.error(
          error.response?.data?.message ?? "কার্টে যোগ করা যায়নি"
        );

        return;
      }

      toast.error("কার্টে যোগ করা যায়নি");
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart();
      }}
      disabled={adding || (!added && stock === 0)}
      className={`
        mt-2 flex w-full items-center justify-center gap-1.5
        rounded-full px-3 py-2
        text-[11px] font-bold transition-all duration-200
        active:scale-95
        ${
          added
            ? "bg-[#0A0E2A] text-white hover:bg-[#1E293B]"
            : "bg-[#2DBDB6] text-white hover:bg-[#1f9d97]"
        }
        ${adding ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
    >
      <ShoppingCart className="h-3.5 w-3.5" />

      {added
        ? "কার্টে যান"
        : adding
          ? "যোগ করা হচ্ছে..."
          : "কার্টে যোগ করুন"}
    </button>
  );
}