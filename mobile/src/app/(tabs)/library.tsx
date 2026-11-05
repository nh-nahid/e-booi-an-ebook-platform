import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/auth/AuthProvider";
import { setLibraryHidden, useLibrary } from "@/hooks/queries";
import { Cover } from "@/components/book";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Card, Empty, ErrorState, Input, Loading, Screen, Txt } from "@/components/ui";
import { errorMessage } from "@/lib/format";
import { useTheme } from "@/theme/ThemeProvider";

export default function LibraryScreen() {
  const { c } = useTheme();
  const qc = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const q = useLibrary();
  const [search, setSearch] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const all = q.data ?? [];
  const hiddenCount = all.filter((b) => b.isHidden).length;
  const books = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter(
      (b) =>
        !!b.isHidden === showHidden &&
        (!term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)),
    );
  }, [all, search, showHidden]);

  if (authLoading) return <Screen><Loading /></Screen>;
  if (!isAuthenticated)
    return <LoginPrompt title="আপনার লাইব্রেরি" hint="কেনা বইগুলো পড়তে আগে লগইন করুন।" />;
  if (q.isLoading) return <Screen><Loading /></Screen>;
  if (q.isError) return <Screen><ErrorState onRetry={q.refetch} /></Screen>;

  const change = async (id: string, hide: boolean) => {
    try {
      await setLibraryHidden(id, hide);
      qc.invalidateQueries({ queryKey: ["library"] });
    } catch (e) {
      Alert.alert("সম্পন্ন করা যায়নি", errorMessage(e));
    }
  };

  const confirmRemove = (id: string, title: string) =>
    Alert.alert(
      "লাইব্রেরি থেকে সরাবেন?",
      `"${title}" সরানো হবে। পরে "সরানো বই" থেকে ফিরিয়ে আনতে পারবেন।`,
      [
        { text: "বাতিল", style: "cancel" },
        { text: "সরান", style: "destructive", onPress: () => change(id, true) },
      ],
    );

  return (
    <Screen>
      <Txt size={22} bold style={{ marginBottom: 12 }}>
        {showHidden ? "সরানো বই" : "আমার লাইব্রেরি"}
      </Txt>

      {all.length > 0 && (
        <>
          <Input
            icon="search-outline"
            placeholder="বই বা লেখক খুঁজুন"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {(hiddenCount > 0 || showHidden) && (
            <Pressable onPress={() => setShowHidden((v) => !v)} style={{ marginBottom: 10, alignSelf: "flex-start" }}>
              <Txt bold style={{ color: c.brand }}>
                {showHidden ? "← আমার লাইব্রেরি" : `সরানো বই (${hiddenCount})`}
              </Txt>
            </Pressable>
          )}
        </>
      )}

      <FlatList
        data={books}
        keyExtractor={(b) => b._id}
        contentContainerStyle={{ gap: 12, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        ListEmptyComponent={
          all.length > 0 ? (
            <Empty
              icon="search-outline"
              title={showHidden ? "সরানো কোনো বই নেই" : "কোনো বই পাওয়া যায়নি"}
            />
          ) : (
            <Empty
              icon="library-outline"
              title="লাইব্রেরি এখনো খালি"
              hint="বই কিনলেই এখানে পড়ার জন্য পাবেন।"
              action={<Button title="বই দেখুন" onPress={() => router.push("/books")} />}
            />
          )
        }
        renderItem={({ item }) => (
          <Card style={{ flexDirection: "row", gap: 14 }}>
            <Pressable onPress={() => router.push(`/book/${item._id}`)}>
              <Cover book={item} width={70} radius={8} />
            </Pressable>
            <View style={{ flex: 1, justifyContent: "space-between", gap: 8 }}>
              <View>
                <Txt bold numberOfLines={2}>
                  {item.title}
                </Txt>
                <Txt size={12} color="muted">
                  {item.author}
                </Txt>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {!item.isHidden && (
                  <Button
                    title="পড়ুন"
                    icon="book-outline"
                    small
                    style={{ flex: 1 }}
                    onPress={() => router.push({ pathname: "/read/[bookId]", params: { bookId: item._id, title: item.title } })}
                  />
                )}
                {item.isHidden ? (
                  <Button title="ফিরিয়ে আনুন" icon="refresh-outline" variant="outline" small onPress={() => change(item._id, false)} />
                ) : (
                  <Button title="সরান" icon="trash-outline" variant="outline" small onPress={() => confirmRemove(item._id, item.title)} />
                )}
              </View>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
