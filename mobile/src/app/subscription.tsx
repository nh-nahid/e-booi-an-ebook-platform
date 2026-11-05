import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";
import { payWithEps } from "@/lib/payment";
import { bn, errorMessage, taka } from "@/lib/format";
import { useTheme } from "@/theme/ThemeProvider";
import { Button, Card, Empty, ErrorState, Loading, Screen, Txt } from "@/components/ui";

interface Plan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  scope: "all" | "categories";
  categories: string[];
}
interface MySub {
  planId: string;
  planName: string;
  expiresAt: string;
}

export default function SubscriptionScreen() {
  const { c } = useTheme();
  const { isAuthenticated } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: async () => (await api.get<{ data: Plan[] }>("/store/plans")).data.data,
  });
  const mine = useQuery({
    queryKey: ["my-subscription"],
    enabled: isAuthenticated,
    queryFn: async () => (await api.get<{ data: MySub[] }>("/store/subscription")).data.data,
  });

  const buy = async (plan: Plan) => {
    if (!isAuthenticated) return router.push("/login");
    setBusy(plan._id);
    try {
      const { data } = await api.post<{ order: { _id: string } }>(`/store/plans/${plan._id}/order`);
      await payWithEps(data.order._id);
    } catch (e) {
      Alert.alert("পেমেন্ট শুরু করা যায়নি", errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  if (plans.isLoading) return <Screen><Loading /></Screen>;
  if (plans.isError) return <Screen><ErrorState onRetry={() => plans.refetch()} /></Screen>;

  return (
    <Screen scroll edges={["bottom"]}>
      <View style={{ gap: 12 }}>
        <Txt color="muted">প্ল্যান নিন, মেয়াদের মধ্যে বই পড়ুন। চাইলে আলাদা করে একক বইও কিনতে পারেন।</Txt>

        {(mine.data ?? []).map((m) => (
          <Card key={m.planId}>
            <Txt bold style={{ color: c.successInk }}>
              {m.planName} চালু আছে — মেয়াদ {new Date(m.expiresAt).toLocaleDateString("bn-BD")} পর্যন্ত
            </Txt>
          </Card>
        ))}

        {!plans.data?.length ? (
          <Empty icon="ribbon-outline" title="এখনো কোনো প্ল্যান নেই" />
        ) : (
          plans.data.map((p) => {
            const active = (mine.data ?? []).some((m) => m.planId === p._id);
            return (
              <Card key={p._id}>
                <View style={{ gap: 6 }}>
                  <Txt size={17} bold>{p.name}</Txt>
                  <Txt size={24} bold style={{ color: c.brand }}>{taka(p.price)}</Txt>
                  <Txt color="muted">{bn(p.durationDays)} দিন</Txt>
                  <Txt size={13} bold>
                    {p.scope === "all" ? "সব বই পড়ুন" : `সিরিজ: ${p.categories.join(", ")}`}
                  </Txt>
                  {!!p.description && <Txt size={13} color="muted">{p.description}</Txt>}
                  <Button
                    title={active ? "মেয়াদ বাড়ান" : "সাবস্ক্রাইব করুন"}
                    loading={busy === p._id}
                    disabled={busy !== null}
                    onPress={() => buy(p)}
                    style={{ marginTop: 8 }}
                  />
                </View>
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}
