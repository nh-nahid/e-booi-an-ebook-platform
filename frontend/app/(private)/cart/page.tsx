"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";

import EmptyCart from "@/features/cart/components/empty-cart";
import CartItem, {
  CartItemData,
} from "@/features/cart/components/cart-item";
import OrderSummary from "@/features/cart/components/order-summary";

import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartQuantity,
} from "@/features/cart/hooks/use-cart";

import { useAuth } from "@/hooks/use-auth";

import Loading from "@/app/loading";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useApplyCoupon } from "@/features/coupon/hooks/use-coupon";

export default function CartPage() {
const router = useRouter();

  const { user, isLoading: authLoading } = useAuth();

  const { data: cart = [], isLoading } = useCart();

  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const updateMutation = useUpdateCartQuantity();
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const applyCouponMutation = useApplyCoupon();

  // items and subtotal must be computed here — before any early return —
  // since the coupon effect below depends on subtotal, and all hooks
  // must run unconditionally on every render
  const items: CartItemData[] = cart.map((item) => ({
    id: item._id,
    bookId: item.book._id,
    title: item.book.title,
    author: item.book.author,
    price: item.book.price,
    originalPrice: undefined,
    coverUrl: item.book.coverImage,
    quantity: item.quantity ?? 1,
    stock: item.book.stock,
    bookType: item.book.bookType === "Digital" ? "Digital" : "Physical",
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const savedCode = sessionStorage.getItem("appliedCouponCode");
    if (!savedCode || subtotal <= 0) return;

    applyCouponMutation.mutate(
      { code: savedCode, amount: subtotal },
      {
        onSuccess: (response) => {
          setAppliedDiscount(response.discount);
        },
        onError: () => {
          sessionStorage.removeItem("appliedCouponCode");
          setAppliedDiscount(0);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // ---- early returns start here ----

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const originalSubtotal = items.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0,
  );

  const itemDiscount = originalSubtotal - subtotal;

  const deliveryFee =
    items.some((item) => item.bookType === "Physical") && subtotal < 1000
      ? 60
      : 0;

const handleQuantityChange = (
  id: string,
  quantity: number
) => {
  updateMutation.mutate(
    {
      id,
      quantity,
    },
    {
      onSuccess: () => {
        toast.success("কার্ট আপডেট হয়েছে");
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ||
              "কার্ট আপডেট করা যায়নি"
          );
        } else {
          toast.error("কার্ট আপডেট করা যায়নি");
        }
      },
    }
  );
};


const handleRemove = (id: string) => {
  removeMutation.mutate(id, {
    onSuccess: () => {
      toast.success("বইটি কার্ট থেকে সরানো হয়েছে");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "বই সরানো যায়নি"
        );
      } else {
        toast.error("বই সরানো যায়নি");
      }
    },
  });
};


const handleClearCart = () => {
  clearMutation.mutate(undefined, {
    onSuccess: () => {
      setAppliedDiscount(0);
      sessionStorage.removeItem("appliedCouponCode");
      toast.success("কার্ট খালি করা হয়েছে");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "কার্ট খালি করা যায়নি"
        );
      } else {
        toast.error("কার্ট খালি করা যায়নি");
      }
    },
  });
};

const handleApplyPromo = async (code: string) => {
  try {
    const response = await applyCouponMutation.mutateAsync({
      code,
      amount: subtotal,
    });

    setAppliedDiscount(response.discount);
    sessionStorage.setItem("appliedCouponCode", code);

    toast.success("কুপন সফলভাবে প্রয়োগ হয়েছে");
    return true;
  } catch (error) {
    setAppliedDiscount(0);
    sessionStorage.removeItem("appliedCouponCode");

    if (isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ??
          "কুপন প্রয়োগ করা যায়নি"
      );
    } else {
      toast.error("কুপন প্রয়োগ করা যায়নি");
    }

    return false;
  }
};

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/books"
              className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#2DBDB6]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              শপিং চালিয়ে যান
            </Link>

            <h1 className="text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
              আপনার কার্ট
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearMutation.isPending}
              className="flex items-center gap-1.5 rounded-full border border-[#E1E5E8] px-3.5 py-2 text-xs font-bold text-[#6B7280] hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              কার্ট খালি করুন
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {items.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  index={index}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  updating={updateMutation.isPending}
                />
              ))}
            </div>

            <OrderSummary
              subtotal={subtotal}
              discount={itemDiscount + appliedDiscount}
              deliveryFee={deliveryFee}
              itemCount={items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
              onApplyPromo={handleApplyPromo}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
}