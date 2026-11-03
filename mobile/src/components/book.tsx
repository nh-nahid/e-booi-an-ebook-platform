import React from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { taka, bn } from "@/lib/format";
import type { Book } from "@/types";
import { Stars, Txt } from "./ui";

export const coverOf = (b: { coverImage?: string; coverUrl?: string }) =>
  b.coverUrl || b.coverImage || undefined;

export function Cover({
  book,
  width,
  radius = 10,
}: {
  book: { coverImage?: string; coverUrl?: string };
  width: number;
  radius?: number;
}) {
  const { c } = useTheme();
  const uri = coverOf(book);
  return (
    <View
      style={{
        width,
        height: width * 1.45,
        borderRadius: radius,
        backgroundColor: c.soft,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={150} />
      ) : (
        <Ionicons name="book-outline" size={width / 3} color={c.subtle} />
      )}
    </View>
  );
}

export function BookCard({ book, width }: { book: Book; width: number }) {
  const { c } = useTheme();
  const hasDiscount = !!book.originalPrice && book.originalPrice > book.price;
  return (
    <Pressable
      onPress={() => router.push(`/book/${book._id}`)}
      style={{ width }}
    >
      <View>
        <Cover book={book} width={width} />
        {book.isPreOrder && (
          <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: c.navy, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Txt size={10} bold style={{ color: "#fff" }}>
              প্রি-অর্ডার
            </Txt>
          </View>
        )}
      </View>
      <Txt bold numberOfLines={2} style={{ marginTop: 8, minHeight: 36 }}>
        {book.title}
      </Txt>
      <Txt size={12} color="muted" numberOfLines={1}>
        {book.author}
      </Txt>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
        <Stars value={book.averageRating || 0} size={11} />
        <Txt size={11} color="muted">
          ({bn(book.reviewCount || 0)})
        </Txt>
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 3 }}>
        <Txt bold color="price" size={15}>
          {taka(book.price)}
        </Txt>
        {hasDiscount && (
          <Txt size={11} color="subtle" style={{ textDecorationLine: "line-through" }}>
            {taka(book.originalPrice as number)}
          </Txt>
        )}
      </View>
    </Pressable>
  );
}
