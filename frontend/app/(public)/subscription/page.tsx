"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/services/api/api";
import { initiatePayment } from "@/features/checkout/api/checkout.api";

type Plan = { _id: string; name: string; description?: string; price: number; durationDays: number };
type Sub = { planName: string; expiresAt: string } | null;

export default function SubscriptionPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => (await api.get("/store/plans")).data.data as Plan[],
  });
  const { data: mine } = useQuery({
    queryKey: ["my-subscription"],
    retry: false,
    queryFn: async () => (await api.get("/store/subscription")).data.data as Sub,
  });

  const buy = async (plan: Plan) => {
    setBusy(plan._id);
    try {
      const { data } = await api.post(`/store/plans/${plan._id}/order`);
      const payment = await initiatePayment(data.order._id);
      window.location.href = payment.gatewayURL;
    } catch (e) {
      const status = (e as AxiosError).response?.status;
      if (status === 401) return router.push("/login");
      toast.error((e as AxiosError<{ message: string }>).response?.data?.message ?? "পেমেন্ট শুরু করা যায়নি");
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-center text-3xl font-extrabold text-ink">সাবস্ক্রিপশন</h1>
      <p className="mt-2 text-center text-muted-ink">একটি প্ল্যান নিন, মেয়াদের মধ্যে সব বই পড়ুন।</p>

      {mine && (
        <p className="mx-auto mt-6 w-fit rounded-full bg-success-soft px-4 py-2 text-sm font-bold text-success-ink">
          আপনার {mine.planName} প্ল্যান চালু আছে — মেয়াদ {new Date(mine.expiresAt).toLocaleDateString("bn-BD")} পর্যন্ত
        </p>
      )}

      {isLoading ? (
        <p className="mt-10 text-center text-muted-ink">লোড হচ্ছে…</p>
      ) : plans.length === 0 ? (
        <p className="mt-10 text-center text-muted-ink">এখনো কোনো প্ল্যান নেই।</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p._id} className="flex flex-col rounded-2xl border border-line bg-surface p-6 text-center">
              <h2 className="text-lg font-bold text-ink">{p.name}</h2>
              <p className="mt-3 text-3xl font-extrabold text-brand">৳{p.price}</p>
              <p className="text-sm text-muted-ink">{p.durationDays} দিন</p>
              {p.description && <p className="mt-3 text-sm text-ink">{p.description}</p>}
              <button
                onClick={() => buy(p)}
                disabled={busy !== null}
                className="mt-auto rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                style={{ marginTop: 20 }}
              >
                {busy === p._id ? "অপেক্ষা করুন…" : mine ? "মেয়াদ বাড়ান" : "সাবস্ক্রাইব করুন"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
