import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, TextInput, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useBooks } from "@/hooks/queries";
import { BookCard } from "@/components/book";
import { Empty, ErrorState, Loading, Pill, Screen, Txt } from "@/components/ui";
import type { BooksSort } from "@/types";

const SORTS: { id: BooksSort; label: string }[] = [
  { id: "newest", label: "নতুন" },
  { id: "best-selling", label: "বেস্ট সেলার" },
  { id: "price-low", label: "দাম কম" },
  { id: "price-high", label: "দাম বেশি" },
  { id: "title", label: "নাম (অ-হ)" },
];

export default function BooksScreen() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ category?: string; sort?: string; search?: string }>();

  const [text, setText] = useState(params.search ?? "");
  const [search, setSearch] = useState(params.search ?? "");
  const [category, setCategory] = useState<string | undefined>(params.category);
  const [sort, setSort] = useState<BooksSort>((params.sort as BooksSort) || "newest");

  // Links from the home screen (category / sort) land here with new params.
  useEffect(() => {
    if (params.category !== undefined) setCategory(params.category || undefined);
    if (params.sort) setSort(params.sort as BooksSort);
  }, [params.category, params.sort]);

  // Debounce typing so every keystroke doesn't hit the API.
  useEffect(() => {
    const t = setTimeout(() => setSearch(text.trim()), 450);
    return () => clearTimeout(t);
  }, [text]);

  const q = useBooks({ search, category, sort });
  const books = useMemo(() => q.data?.pages.flatMap((p) => p.books) ?? [], [q.data]);
  const categories = q.data?.pages[0]?.categories ?? [];

  const gap = 14;
  const cardW = (width - 32 - gap) / 2;

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: c.surface,
            borderColor: c.line,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="search" size={18} color={c.subtle} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="কাঙ্ক্ষিত বই খুঁজুন"
            placeholderTextColor={c.subtle}
            returnKeyType="search"
            style={{ flex: 1, color: c.ink, paddingVertical: 11, fontSize: 15 }}
          />
          {!!text && <Ionicons name="close-circle" size={18} color={c.subtle} onPress={() => setText("")} />}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 8 }}>
          <Pill label="সব" active={!category} onPress={() => setCategory(undefined)} />
          {categories.map((cat) => (
            <Pill key={cat} label={cat} active={category === cat} onPress={() => setCategory(cat)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginBottom: 6 }} contentContainerStyle={{ gap: 8 }}>
          {SORTS.map((s) => (
            <Pill key={s.id} label={s.label} active={sort === s.id} onPress={() => setSort(s.id)} />
          ))}
        </ScrollView>
      </View>

      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState onRetry={q.refetch} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b._id}
          numColumns={2}
          columnWrapperStyle={{ gap, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 24, gap: 18, flexGrow: 1 }}
          renderItem={({ item }) => <BookCard book={item} width={cardW} />}
          onEndReachedThreshold={0.4}
          onEndReached={() => q.hasNextPage && !q.isFetchingNextPage && q.fetchNextPage()}
          ListEmptyComponent={<Empty icon="book-outline" title="কোনো বই পাওয়া যায়নি" hint="অন্য শব্দ বা ক্যাটাগরি দিয়ে চেষ্টা করুন।" />}
          ListFooterComponent={q.isFetchingNextPage ? <ActivityIndicator color={c.brand} style={{ margin: 12 }} /> : undefined}
          refreshing={q.isRefetching && !q.isFetchingNextPage}
          onRefresh={q.refetch}
        />
      )}
      {!q.isLoading && !q.isError && books.length > 0 && (
        <Txt size={11} color="subtle" center style={{ paddingBottom: 4 }}>
          {" "}
        </Txt>
      )}
    </Screen>
  );
}
