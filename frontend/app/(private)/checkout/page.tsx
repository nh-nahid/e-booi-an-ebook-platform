"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";

import ShippingAddressForm from "@/features/checkout/components/shipping-address-form";
import PaymentMethods from "@/features/checkout/components/payment-methods";
import CheckoutItemsSummary from "@/features/checkout/components/checkout-items-summary";
import OrderTotalCard from "@/features/checkout/components/order-total-card";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/features/cart/hooks/use-cart";

import {
  useCreateOrder,
  useInitiatePayment,
} from "@/features/checkout/hooks/use-checkout";

import type {
  CheckoutItem,
  PaymentMethodType,
  ShippingAddress,
} from "@/features/checkout/types/checkout.types";
import EmptyCheckout from "@/features/checkout/components/empty-checkout";
import { useApplyCoupon } from "@/features/coupon/hooks/use-coupon";

const initialAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: cart = [], isLoading } = useCart();
  const createOrderMutation = useCreateOrder();
  const paymentMutation = useInitiatePayment();
  const applyCouponMutation = useApplyCoupon();

  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const cartItems: CheckoutItem[] = cart.map((item) => ({
    id: item._id,
    bookId: item.book._id,
    title: item.book.title,
    author: item.book.author,
    coverImage: item.book.coverImage,
    price: item.book.price,
    quantity: item.quantity,
    format: item.book.bookType === "Digital" ? "digital" : "physical",
  }));

  const hasPhysicalItems = cartItems.some((item) => item.format === "physical");
  const hasOnlyDigitalItems = !hasPhysicalItems;

  const [shipping, setShipping] = useState<ShippingAddress>(initialAddress);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    () => (hasOnlyDigitalItems ? "bkash" : "cod"),
  );

  const [prevHasOnlyDigitalItems, setPrevHasOnlyDigitalItems] =
    useState(hasOnlyDigitalItems);

  if (hasOnlyDigitalItems !== prevHasOnlyDigitalItems) {
    setPrevHasOnlyDigitalItems(hasOnlyDigitalItems);
    setPaymentMethod(hasOnlyDigitalItems ? "bkash" : "cod");
  }

  const [error, setError] = useState<string | null>(null);

  // subtotal must be computed here — before any early return — since
  // the coupon effect below depends on it and all hooks must run
  // unconditionally on every render
  const subtotal = cartItems.reduce(
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
          setDiscount(response.discount);
          setCouponCode(savedCode);
        },
        onError: () => {
          sessionStorage.removeItem("appliedCouponCode");
          setDiscount(0);
          setCouponCode(null);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // ---- everything below here is early-return territory ----

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
          <EmptyCheckout />
        </div>
        <SiteFooter />
      </div>
    );
  }

  const deliveryFee = hasPhysicalItems && subtotal < 1000 ? 60 : 0;

  const isShippingValid =
    hasOnlyDigitalItems ||
    Boolean(
      shipping.fullName.trim() &&
      shipping.phone.trim() &&
      shipping.address.trim() &&
      shipping.city.trim(),
    );

  const handlePlaceOrder = async () => {
    setError(null);

    if (!isShippingValid) {
      setError("অনুগ্রহ করে সম্পূর্ণ শিপিং ঠিকানা পূরণ করুন।");
      return;
    }

    try {
      const response = await createOrderMutation.mutateAsync({
  shippingAddress: hasPhysicalItems ? shipping : undefined,
  paymentMethod,
  couponCode: couponCode ?? undefined,
});

      const order = response.order;

      if (paymentMethod === "cod") {
        toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে");
        router.push("/orders");
        return;
      }

      const payment = await paymentMutation.mutateAsync(order._id);

      window.location.href = payment.gatewayURL;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "অর্ডার সম্পন্ন করা যায়নি",
        );
      } else {
        toast.error("অর্ডার সম্পন্ন করা যায়নি");
      }
    }
  };

  

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <Link
          href="/cart"
          className="mb-2 flex w-fit items-center gap-1 text-xs font-semibold text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          কার্টে ফিরে যান
        </Link>

        <h1 className="mb-6 text-2xl font-extrabold text-[#0A0E2A] sm:text-3xl">
          চেকআউট
        </h1>

        {hasOnlyDigitalItems && (
          <div className="mb-6 flex items-start gap-2.5 rounded-2xl bg-[#E6F7F6] p-4 text-sm text-[#0A0E2A] animate-in fade-in slide-in-from-bottom-1 duration-500">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#2DBDB6]" />
            আপনার অর্ডারে শুধু eBook রয়েছে, তাই কোনো শিপিং ঠিকানার প্রয়োজন
            নেই। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই বইগুলো আপনার লাইব্রেরিতে যোগ
            হয়ে যাবে।
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {hasPhysicalItems && (
              <ShippingAddressForm value={shipping} onChange={setShipping} />
            )}

            <PaymentMethods
              value={paymentMethod}
              onChange={setPaymentMethod}
              codAvailable={hasPhysicalItems}
            />

            <CheckoutItemsSummary items={cartItems} />
          </div>

          <div className="space-y-3">
            {error && (
              <p className="rounded-xl bg-[#FDEDEC] px-4 py-2.5 text-xs font-medium text-red-600 animate-in fade-in duration-200">
                {error}
              </p>
            )}

            <OrderTotalCard
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              hasPhysicalItems={hasPhysicalItems}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={
                createOrderMutation.isPending || paymentMutation.isPending
              }
            />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
