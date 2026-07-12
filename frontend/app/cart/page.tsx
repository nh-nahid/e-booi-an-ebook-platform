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
} from "@/features/cart/hooks/use-cart";

import { useAuth } from "@/hooks/use-auth";

import Loading from "@/app/loading";

export default function CartPage() {
const router = useRouter();

const { user, isLoading: authLoading } = useAuth();

const { data: cart = [], isLoading } = useCart();

const removeMutation = useRemoveCartItem();
const clearMutation = useClearCart();

const [appliedDiscount, setAppliedDiscount] = useState(0);

useEffect(() => {
  if (!authLoading && !user) {
    router.replace("/login");
  }
}, [authLoading, user, router]);

if (authLoading || isLoading) {
  return <Loading />;
}

if (!user) {
  return null;
}


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
  bookType:
    item.book.bookType === "Digital"
      ? "Digital"
      : "Physical",
}));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const originalSubtotal = items.reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );

  const itemDiscount = originalSubtotal - subtotal;

const deliveryFee =
  items.some((item) => item.bookType === "Physical") &&
  subtotal < 1000
    ? 60
    : 0;

  const handleQuantityChange = (
    id: string,
    quantity: number
  ) => {
    // TODO
    console.log(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleClearCart = () => {
    clearMutation.mutate();
  };

  const handleApplyPromo = async (code: string) => {
    if (code.trim().toUpperCase() === "EBOOI10") {
      setAppliedDiscount(Math.round(subtotal * 0.1));
      return true;
    }

    setAppliedDiscount(0);

    return false;
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