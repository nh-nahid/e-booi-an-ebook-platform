"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import ContactDetailsForm from "@/features/checkout/components/contact-details";
import ShippingAddressForm from "@/features/checkout/components/shipping-address";
import PaymentMethod from "@/features/checkout/components/payment-method";
import OrderSummary from "@/features/checkout/components/order-summary";
import EmptyCheckout from "@/features/checkout/components/empty-checkout";

import {
  CheckoutItem,
  ContactDetails,
  PaymentMethodType,
  ShippingAddress,
} from "@/features/checkout/types/checkout.types";
import Navbar from "@/components/layout/navbar";

// TODO: replace with your real cart source, e.g. useCart() from a store/query
const MOCK_ITEMS: CheckoutItem[] = [
  {
    id: "1",
    bookId: "b1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "/books/midnight-library.jpg",
    price: 450,
    quantity: 1,
    format: "digital",
  },
  {
    id: "2",
    bookId: "b2",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "/books/atomic-habits.jpg",
    price: 650,
    quantity: 2,
    format: "physical",
  },
];

const SHIPPING_FEE = 80;

export default function CheckoutPage() {
  const router = useRouter();

  const [items] = useState<CheckoutItem[]>(MOCK_ITEMS);
  const hasPhysical = items.some((item) => item.format === "physical");

  const [contact, setContact] = useState<ContactDetails>({
    email: "",
    phone: "",
  });

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    district: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("bkash");

  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<
  "idle" | "applied" | "invalid"
>("idle");
  const [discount, setDiscount] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = hasPhysical ? SHIPPING_FEE : 0;
    const total = Math.max(subtotal + shippingFee - discount, 0);

    return { subtotal, shippingFee, discount, total };
  }, [items, hasPhysical, discount]);

  const handleApplyPromo = () => {
    // TODO: replace with a real promo-validation API call
    if (promoCode.trim().toUpperCase() === "READ10") {
      setDiscount(Math.round(summary.subtotal * 0.1));
      setPromoStatus("applied");
    } else {
      setDiscount(0);
      setPromoStatus("invalid");
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!contact.email.trim()) nextErrors.email = "Email is required";
    if (!contact.phone.trim()) nextErrors.phone = "Phone is required";

    if (hasPhysical) {
      if (!shipping.fullName.trim())
        nextErrors.fullName = "Full name is required";
      if (!shipping.address.trim())
        nextErrors.address = "Address is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // TODO: replace with your real order-creation mutation, e.g.:
      // await createOrder({ items, contact, shipping: hasPhysical ? shipping : undefined, paymentMethod, summary });
      await new Promise((resolve) => setTimeout(resolve, 1200));

      router.push("/orders/confirmation");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
          <EmptyCheckout />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />

      <div className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
        <div className="mb-6 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#2DBDB6]" />
          <h1 className="text-xl font-extrabold text-[#0A0E2A] sm:text-2xl">
            Checkout
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-5">
            <ContactDetailsForm
              values={contact}
              onChange={setContact}
              errors={errors}
            />

            {hasPhysical && (
              <ShippingAddressForm
                values={shipping}
                onChange={setShipping}
                errors={errors}
              />
            )}

            <PaymentMethod
              value={paymentMethod}
              onChange={setPaymentMethod}
              allowCod={hasPhysical}
            />
          </div>

          <OrderSummary
            items={items}
            summary={summary}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            promoStatus={promoStatus}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}