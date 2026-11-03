import React from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { useWishlist } from "@/hooks/queries";
import { BookCard } from "@/components/book";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Empty, ErrorState, Loading, Screen } from "@/components/ui";

export default function WishlistScreen() {
  const { isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();
  const q = useWishlist();
  const gap = 14;
  const cardW = (width - 32 - gap) / 2;

  if (!isAuthenticated) return <LoginPrompt title="উইশলিস্ট" hint="উইশলিস্ট দেখতে লগইন করুন।" />;
  if (q.isLoading) return <Screen edges={[]}><Loading /></Screen>;
  if (q.isError) return <Screen edges={[]}><ErrorState onRetry={q.refetch} /></Screen>;

  return (
    <Screen edges={[]} padded={false}>
      <FlatList
        data={q.data ?? []}
        keyExtractor={(w) => w._id}
        numColumns={2}
        columnWrapperStyle={{ gap, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16, gap: 18, flexGrow: 1 }}
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        ListEmptyComponent={
          <Empty icon="heart-outline" title="উইশলিস্ট খালি" hint="পছন্দের বইয়ে ❤ চেপে এখানে রাখুন।" action={<Button title="বই দেখুন" onPress={() => router.push("/books")} />} />
        }
        renderItem={({ item }) => (item.book ? <BookCard book={item.book} width={cardW} /> : <View />)}
      />
    </Screen>
  );
}
