import React from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { useCart, useRemoveFromCart, useUpdateCart } from "@/hooks/queries";
import { Cover } from "@/components/book";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Card, Empty, ErrorState, Loading, Screen, Txt } from "@/components/ui";
import { bn, errorMessage, taka } from "@/lib/format";

export default function CartScreen() {
  const { c } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const q = useCart();
  const update = useUpdateCart();
  const remove = useRemoveFromCart();

  if (authLoading) return <Screen><Loading /></Screen>;
  if (!isAuthenticated)
    return <LoginPrompt title="আপনার কার্ট" hint="কার্ট দেখতে আগে লগইন করুন।" />;
  if (q.isLoading) return <Screen><Loading /></Screen>;
  if (q.isError) return <Screen><ErrorState onRetry={q.refetch} /></Screen>;

  const items = q.data ?? [];
  const subtotal = items.reduce((s, i) => s + (i.book?.price ?? 0) * i.quantity, 0);

  const change = (id: string, quantity: number) =>
    update.mutate({ id, quantity }, { onError: (e) => Alert.alert("ত্রুটি", errorMessage(e)) });

  return (
    <Screen
      footer={
        items.length > 0 ? (
          <View style={{ backgroundColor: c.surface, borderTopColor: c.line, borderTopWidth: 1, padding: 16, gap: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt color="muted">সাবটোটাল</Txt>
              <Txt bold size={18} color="price">
                {taka(subtotal)}
              </Txt>
            </View>
            <Button title="চেকআউটে যান" icon="arrow-forward" onPress={() => router.push("/checkout")} />
          </View>
        ) : null
      }
    >
      <Txt size={22} bold style={{ marginBottom: 12 }}>
        আমার কার্ট
      </Txt>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        contentContainerStyle={{ gap: 12, flexGrow: 1 }}
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        ListEmptyComponent={
          <Empty
            icon="cart-outline"
            title="কার্ট খালি"
            hint="পছন্দের বই কার্টে যোগ করুন।"
            action={<Button title="বই দেখুন" onPress={() => router.push("/books")} />}
          />
        }
        renderItem={({ item }) => {
          const book = item.book!;
          return (
            <Card style={{ flexDirection: "row", gap: 12 }}>
              <Pressable onPress={() => router.push(`/book/${book._id}`)}>
                <Cover book={book} width={64} radius={8} />
              </Pressable>
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View>
                  <Txt bold numberOfLines={2}>
                    {book.title}
                  </Txt>
                  <Txt size={12} color="muted">
                    {book.author}
                  </Txt>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Txt bold color="price">
                    {taka(book.price * item.quantity)}
                  </Txt>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Pressable
                      onPress={() => (item.quantity > 1 ? change(item._id, item.quantity - 1) : null)}
                      hitSlop={8}
                      style={{ opacity: item.quantity > 1 ? 1 : 0.35 }}
                    >
                      <Ionicons name="remove-circle-outline" size={24} color={c.body} />
                    </Pressable>
                    <Txt bold>{bn(item.quantity)}</Txt>
                    <Pressable onPress={() => change(item._id, item.quantity + 1)} hitSlop={8}>
                      <Ionicons name="add-circle-outline" size={24} color={c.body} />
                    </Pressable>
                    <Pressable onPress={() => remove.mutate(item._id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={21} color={c.dangerInk} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}
