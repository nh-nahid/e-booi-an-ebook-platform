import React from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useHome } from "@/hooks/queries";
import { BookCard } from "@/components/book";
import { Card, ErrorState, Loading, Screen, SectionHeader, Txt } from "@/components/ui";
import { bn } from "@/lib/format";
import type { Book } from "@/types";

function Shelf({ title, books, onMore }: { title: string; books: Book[]; onMore?: () => void }) {
  if (!books?.length) return null;
  return (
    <View>
      <View style={{ paddingHorizontal: 16 }}>
        <SectionHeader title={title} onMore={onMore} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={books}
        keyExtractor={(b) => b._id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
        renderItem={({ item }) => <BookCard book={item} width={132} />}
      />
    </View>
  );
}

export default function HomeScreen() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const { data, isLoading, isError, refetch, isRefetching } = useHome();

  const goBooks = (params?: Record<string, string>) =>
    router.push({ pathname: "/books", params });

  if (isLoading) return <Screen><Loading /></Screen>;
  if (isError || !data) return <Screen><ErrorState onRetry={refetch} /></Screen>;

  const stats = [
    { label: "বই", value: data.statistics.totalBooks },
    { label: "লেখক", value: data.statistics.totalAuthors },
    { label: "ক্যাটাগরি", value: data.statistics.totalCategories },
  ];

  return (
    <Screen padded={false}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={c.brand} />}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6 }}>
          <Txt size={24} bold>
            eb<Txt size={24} bold color="brand">oo</Txt>i
          </Txt>
          <Pressable onPress={() => goBooks()} hitSlop={8}>
            <Ionicons name="search" size={22} color={c.ink} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => goBooks()}
          style={{ marginHorizontal: 16, marginTop: 14, borderRadius: 18, padding: 20, backgroundColor: c.navy, overflow: "hidden" }}
        >
          <View style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: c.brand, opacity: 0.25 }} />
          <Txt size={12} bold style={{ color: c.brand }}>
            {data.hero?.subtitle || "ডিজিটাল বইয়ের সংগ্রহশালা"}
          </Txt>
          <Txt size={22} bold style={{ color: "#fff", marginTop: 6, maxWidth: width * 0.7 }}>
            {data.hero?.title || "আপনার প্রিয় বই, হাতের মুঠোয়"}
          </Txt>
          {!!data.hero?.description && (
            <Txt size={13} numberOfLines={3} style={{ color: "#c3cce0", marginTop: 8 }}>
              {data.hero.description}
            </Txt>
          )}
          <View style={{ marginTop: 14, alignSelf: "flex-start", backgroundColor: c.brand, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Txt size={13} bold style={{ color: "#fff" }}>
              বই দেখুন
            </Txt>
          </View>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 14 }}>
          {stats.map((s) => (
            <Card key={s.label} style={{ flex: 1, alignItems: "center", paddingVertical: 12 }}>
              <Txt bold size={18} color="brand">
                {bn(s.value)}+
              </Txt>
              <Txt size={11} color="muted">
                {s.label}
              </Txt>
            </Card>
          ))}
        </View>

        {data.categories?.length > 0 && (
          <View>
            <View style={{ paddingHorizontal: 16 }}>
              <SectionHeader title="ক্যাটাগরি" onMore={() => goBooks()} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
              {data.categories.map((cat) => (
                <Pressable
                  key={cat.name}
                  onPress={() => goBooks({ category: cat.name })}
                  style={{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 }}
                >
                  <Txt bold>{cat.name}</Txt>
                  <Txt size={11} color="muted">
                    {bn(cat.booksCount)}টি বই
                  </Txt>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Shelf title="ফিচার্ড বই" books={data.featuredBooks} onMore={() => goBooks()} />
        <Shelf title="নতুন বই" books={data.latestBooks} onMore={() => goBooks({ sort: "newest" })} />
        <Shelf title="বেস্ট সেলার" books={data.bestSellingBooks} onMore={() => goBooks({ sort: "best-selling" })} />
        <Shelf title="প্রি-অর্ডার" books={data.preOrderBooks} />
      </ScrollView>
    </Screen>
  );
}
