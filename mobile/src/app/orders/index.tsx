import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { useOrders } from "@/hooks/queries";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Card, Empty, ErrorState, Loading, Screen, StatusBadge, Txt } from "@/components/ui";
import { bn, formatDate, taka } from "@/lib/format";
import { paymentTone } from "@/lib/order-status";

export default function OrdersScreen() {
  const { isAuthenticated } = useAuth();
  const q = useOrders();

  if (!isAuthenticated) return <LoginPrompt title="আমার অর্ডার" hint="অর্ডার দেখতে লগইন করুন।" />;
  if (q.isLoading) return <Screen edges={[]}><Loading /></Screen>;
  if (q.isError) return <Screen edges={[]}><ErrorState onRetry={q.refetch} /></Screen>;

  return (
    <Screen edges={[]}>
      <FlatList
        data={q.data ?? []}
        keyExtractor={(o) => o._id}
        contentContainerStyle={{ gap: 12, flexGrow: 1 }}
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        ListEmptyComponent={
          <Empty icon="receipt-outline" title="কোনো অর্ডার নেই" action={<Button title="বই দেখুন" onPress={() => router.push("/books")} />} />
        }
        renderItem={({ item }) => {
          const p = paymentTone(item.paymentStatus);
          return (
            <Pressable onPress={() => router.push({ pathname: "/orders/[id]", params: { id: item._id } })}>
              <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Txt size={12} color="muted">
                    #{item._id.slice(-6).toUpperCase()} · {formatDate(item.createdAt)}
                  </Txt>
                  <StatusBadge label={p.label} tone={p.tone} />
                </View>
                <Txt bold numberOfLines={2} style={{ marginTop: 8 }}>
                  {item.items.map((i) => i.book?.title).filter(Boolean).join("، ")}
                </Txt>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                  <Txt size={12} color="muted">
                    {bn(item.items.length)}টি বই
                  </Txt>
                  <Txt bold color="price">
                    {taka(item.finalAmount ?? item.totalAmount)}
                  </Txt>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
