import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Share, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import {
  useAddToCart,
  useCart,
  useLibrary,
  useToggleWishlist,
  useWishlist,
} from "@/hooks/queries";
import { downloadAuthed } from "@/lib/files";
import { SITE_URL } from "@/lib/config";
import { taka, bn, errorMessage } from "@/lib/format";
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

function Action({
  icon,
  label,
  onPress,
  kind = "plain",
  loading,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  kind?: "plain" | "brand" | "active" | "danger";
  loading?: boolean;
  last?: boolean;
}) {
  const { c } = useTheme();
  const bg = { plain: c.surface, brand: c.brand, active: c.brandSoft, danger: c.dangerSoft }[kind];
  const fg = { plain: c.muted, brand: "#ffffff", active: c.brand, danger: c.dangerInk }[kind];
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityLabel={label}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        backgroundColor: bg,
        borderRightWidth: last ? 0 : 1,
        borderRightColor: c.line,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : <Ionicons name={icon} size={17} color={fg} />}
    </Pressable>
  );
}

/**
 * Same card as the website's home BookCard: padded cover, centred text and a
 * grouped action bar — wishlist / cart / details until the book is bought,
 * then download / read / share.
 */
export function BookCard({ book, width }: { book: Book; width: number }) {
  const { c } = useTheme();
  const { isAuthenticated } = useAuth();
  const library = useLibrary();
  const cart = useCart();
  const wishlist = useWishlist();
  const addToCart = useAddToCart();
  const toggleWish = useToggleWishlist();
  const [downloading, setDownloading] = useState(false);

  const purchased = !!library.data?.some((b) => b._id === book._id);
  const inCart = !!cart.data?.some((i) => i.book?._id === book._id);
  const wished = !!wishlist.data?.some((w) => w.book?._id === book._id);
  const hasDiscount = !!book.originalPrice && book.originalPrice > book.price;

  const openDetails = () => router.push(`/book/${book._id}`);
  const needLogin = () => router.push("/login");

  const onWish = () => {
    if (!isAuthenticated) return needLogin();
    toggleWish.mutate({ bookId: book._id, inWishlist: wished });
  };

  const onCart = () => {
    if (!isAuthenticated) return needLogin();
    if (inCart) return router.push("/cart");
    addToCart.mutate(book._id, { onError: (e) => Alert.alert("কার্টে যোগ করা যায়নি", errorMessage(e)) });
  };

  const onRead = () =>
    router.push({ pathname: "/read/[bookId]", params: { bookId: book._id, title: book.title } });

  const onDownload = async () => {
    setDownloading(true);
    try {
      const uri = await downloadAuthed(`/orders/download/${book._id}`, `book-${book._id}.pdf`);
      if (await Sharing.isAvailableAsync())
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: `${book.title} সংরক্ষণ করুন` });
      else Alert.alert("ডাউনলোড হয়েছে", uri);
    } catch (e) {
      Alert.alert("ডাউনলোড করা যায়নি", errorMessage(e));
    } finally {
      setDownloading(false);
    }
  };

  const onShare = () =>
    void Share.share({ message: `${book.title}\n${SITE_URL}/books/${book._id}` }).catch(() => {});

  return (
    <Pressable
      onPress={openDetails}
      style={{
        width,
        backgroundColor: c.surface,
        borderColor: c.line,
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <View style={{ margin: 8 }}>
        <Cover book={book} width={width - 18} radius={6} />
        {book.isPreOrder && (
          <View style={{ position: "absolute", top: 6, left: 6, backgroundColor: c.navy, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Txt size={10} bold style={{ color: "#fff" }}>
              প্রি-অর্ডার
            </Txt>
          </View>
        )}
      </View>

      <View style={{ alignItems: "center", paddingHorizontal: 10, paddingBottom: 10, paddingTop: 2, gap: 2 }}>
        <Txt bold size={13} numberOfLines={1} center>
          {book.title}
        </Txt>
        <Txt size={11} color="subtle" numberOfLines={1} center>
          {book.author}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <Txt bold color="price" size={15}>
            {taka(book.price)}
          </Txt>
          {hasDiscount && (
            <Txt size={11} color="subtle" style={{ textDecorationLine: "line-through" }}>
              {taka(book.originalPrice as number)}
            </Txt>
          )}
        </View>
        {book.reviewCount > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Stars value={book.averageRating || 0} size={10} />
            <Txt size={10} color="muted">
              ({bn(book.reviewCount)})
            </Txt>
          </View>
        )}

        <View style={{ flexDirection: "row", alignSelf: "stretch", marginTop: 8, borderWidth: 1, borderColor: c.line, borderRadius: 6, overflow: "hidden" }}>
          {purchased ? (
            <>
              <Action icon="download-outline" label="ডাউনলোড" onPress={onDownload} loading={downloading} />
              <Action icon="book-outline" label="পড়ুন" onPress={onRead} kind="brand" />
              <Action icon="share-social-outline" label="শেয়ার করুন" onPress={onShare} last />
            </>
          ) : (
            <>
              <Action
                icon={wished ? "heart" : "heart-outline"}
                label="উইশলিস্ট"
                onPress={onWish}
                kind={wished ? "danger" : "plain"}
              />
              <Action
                icon={inCart ? "checkmark" : "cart-outline"}
                label={inCart ? "কার্টে যান" : "কার্টে যোগ করুন"}
                onPress={onCart}
                kind={inCart ? "active" : "plain"}
                loading={addToCart.isPending}
              />
              <Action icon="book-outline" label="বিবরণ" onPress={openDetails} kind="brand" last />
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
