import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { useLibrary } from "@/hooks/queries";
import { Cover } from "@/components/book";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Card, Empty, ErrorState, Loading, Screen, Txt } from "@/components/ui";

export default function LibraryScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const q = useLibrary();

  if (authLoading) return <Screen><Loading /></Screen>;
  if (!isAuthenticated)
    return <LoginPrompt title="আপনার লাইব্রেরি" hint="কেনা বইগুলো পড়তে আগে লগইন করুন।" />;
  if (q.isLoading) return <Screen><Loading /></Screen>;
  if (q.isError) return <Screen><ErrorState onRetry={q.refetch} /></Screen>;

  const books = q.data ?? [];

  return (
    <Screen>
      <Txt size={22} bold style={{ marginBottom: 12 }}>
        আমার লাইব্রেরি
      </Txt>
      <FlatList
        data={books}
        keyExtractor={(b) => b._id}
        contentContainerStyle={{ gap: 12, flexGrow: 1 }}
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        ListEmptyComponent={
          <Empty
            icon="library-outline"
            title="লাইব্রেরি এখনো খালি"
            hint="বই কিনলেই এখানে পড়ার জন্য পাবেন।"
            action={<Button title="বই দেখুন" onPress={() => router.push("/books")} />}
          />
        }
        renderItem={({ item }) => (
          <Card style={{ flexDirection: "row", gap: 14 }}>
            <Pressable onPress={() => router.push(`/book/${item._id}`)}>
              <Cover book={item} width={70} radius={8} />
            </Pressable>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                <Txt bold numberOfLines={2}>
                  {item.title}
                </Txt>
                <Txt size={12} color="muted">
                  {item.author}
                </Txt>
              </View>
              <Button
                title="পড়ুন"
                icon="book-outline"
                small
                onPress={() => router.push({ pathname: "/read/[bookId]", params: { bookId: item._id, title: item.title } })}
              />
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
