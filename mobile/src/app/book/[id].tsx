import React, { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import {
  useAddReview,
  useAddToCart,
  useBook,
  useLibrary,
  useReviews,
  useToggleWishlist,
  useWishlist,
} from "@/hooks/queries";
import { Cover } from "@/components/book";
import { Button, Card, ErrorState, Input, Loading, Screen, SectionHeader, Stars, Txt } from "@/components/ui";
import { bn, errorMessage, formatDate, taka } from "@/lib/format";

function ReviewForm({ bookId }: { bookId: string }) {
  const { c } = useTheme();
  const add = useAddReview(bookId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submit = () => {
    if (!rating) return Alert.alert("রেটিং দিন", "১ থেকে ৫ তারা বেছে নিন।");
    if (comment.trim().length < 3) return Alert.alert("মন্তব্য লিখুন", "অন্তত কয়েকটি শব্দ লিখুন।");
    add.mutate(
      { rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
        onError: (e) => Alert.alert("ত্রুটি", errorMessage(e)),
      },
    );
  };

  return (
    <Card style={{ marginTop: 10 }}>
      <Txt bold style={{ marginBottom: 8 }}>
        আপনার রিভিউ লিখুন
      </Txt>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable key={i} onPress={() => setRating(i)} hitSlop={6}>
            <Ionicons name={rating >= i ? "star" : "star-outline"} size={28} color="#f59e0b" />
          </Pressable>
        ))}
      </View>
      <Input value={comment} onChangeText={setComment} placeholder="বইটি কেমন লেগেছে?" multiline style={{ minHeight: 70, textAlignVertical: "top" }} />
      <Button title="রিভিউ জমা দিন" small loading={add.isPending} onPress={submit} />
      <Txt size={11} color="subtle" style={{ marginTop: 6 }}>
        রিভিউ দিতে বইটি কেনা থাকতে হতে পারে।
      </Txt>
    </Card>
  );
}

export default function BookDetails() {
  const { c } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const q = useBook(id);
  const reviews = useReviews(id);
  const library = useLibrary();
  const wishlist = useWishlist();
  const addToCart = useAddToCart();
  const toggleWish = useToggleWishlist();
  const [expanded, setExpanded] = useState(false);

  if (q.isLoading) return <Screen edges={[]}><Loading /></Screen>;
  if (q.isError || !q.data) return <Screen edges={[]}><ErrorState onRetry={q.refetch} /></Screen>;

  const book = q.data;
  const owned = !!library.data?.some((b) => b._id === book._id);
  const inWishlist = !!wishlist.data?.some((w) => w.book?._id === book._id);
  const hasDiscount = !!book.originalPrice && book.originalPrice > book.price;

  const needLogin = () => {
    router.push("/login");
  };

  const onAddToCart = () => {
    if (!isAuthenticated) return needLogin();
    addToCart.mutate(book._id, {
      onSuccess: () =>
        Alert.alert("কার্টে যোগ হয়েছে", book.title, [
          { text: "কেনাকাটা চালিয়ে যান", style: "cancel" },
          { text: "কার্ট দেখুন", onPress: () => router.push("/cart") },
        ]),
      onError: (e) => Alert.alert("ত্রুটি", errorMessage(e)),
    });
  };

  const onBuyNow = () => {
    if (!isAuthenticated) return needLogin();
    router.push({ pathname: "/checkout", params: { bookId: book._id } });
  };

  const onWish = () => {
    if (!isAuthenticated) return needLogin();
    toggleWish.mutate({ bookId: book._id, inWishlist });
  };

  const desc = book.description ?? "";

  return (
    <Screen
      edges={["bottom"]}
      padded={false}
      footer={
        <View style={{ flexDirection: "row", gap: 10, padding: 14, backgroundColor: c.surface, borderTopColor: c.line, borderTopWidth: 1 }}>
          {owned ? (
            <Button
              title="পড়ুন"
              icon="book-outline"
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: "/read/[bookId]", params: { bookId: book._id, title: book.title } })}
            />
          ) : (
            <>
              <Button title="কার্টে যোগ করুন" variant="outline" icon="cart-outline" style={{ flex: 1 }} loading={addToCart.isPending} onPress={onAddToCart} />
              <Button title="এখনই কিনুন" style={{ flex: 1 }} onPress={onBuyNow} />
            </>
          )}
        </View>
      }
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <Cover book={book} width={170} radius={14} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 12 }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Txt size={22} bold>
              {book.title}
            </Txt>
            <Txt color="muted" style={{ marginTop: 2 }}>
              {book.author}
            </Txt>
          </View>
          <Pressable onPress={onWish} hitSlop={10}>
            <Ionicons name={inWishlist ? "heart" : "heart-outline"} size={28} color={inWishlist ? "#f43f5e" : c.muted} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
          <Stars value={book.averageRating || 0} size={16} />
          <Txt size={12} color="muted">
            {bn((book.averageRating || 0).toFixed(1))} ({bn(book.reviewCount || 0)} রিভিউ)
          </Txt>
        </View>

        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: 10 }}>
          <Txt size={26} bold color="price">
            {taka(book.price)}
          </Txt>
          {hasDiscount && (
            <Txt color="subtle" style={{ textDecorationLine: "line-through" }}>
              {taka(book.originalPrice as number)}
            </Txt>
          )}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          <View style={{ backgroundColor: c.brandSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
            <Txt size={12} bold color="brand">
              {book.category}
            </Txt>
          </View>
          <View style={{ backgroundColor: c.soft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
            <Txt size={12} bold color="body">
              ডিজিটাল ই-বুক (PDF)
            </Txt>
          </View>
          {book.isPreOrder && (
            <View style={{ backgroundColor: c.warnSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
              <Txt size={12} bold color="warnInk">
                প্রি-অর্ডার
              </Txt>
            </View>
          )}
        </View>

        {!owned && (
          <View style={{ marginTop: 14 }}>
            <Button
              title="নমুনা পড়ুন (প্রিভিউ)"
              variant="outline"
              icon="eye-outline"
              onPress={() => router.push({ pathname: "/read/[bookId]", params: { bookId: book._id, title: book.title, preview: "1" } })}
            />
          </View>
        )}

        {!!desc && (
          <View>
            <SectionHeader title="বইটি সম্পর্কে" />
            <Txt color="body" numberOfLines={expanded ? undefined : 6} style={{ lineHeight: 22 }}>
              {desc}
            </Txt>
            {desc.length > 220 && (
              <Txt color="brand" bold style={{ marginTop: 6 }} onPress={() => setExpanded((e) => !e)}>
                {expanded ? "কম দেখুন" : "আরও পড়ুন"}
              </Txt>
            )}
          </View>
        )}

        <SectionHeader title={`রিভিউ (${bn(reviews.data?.length ?? 0)})`} />
        {reviews.isLoading ? (
          <Loading />
        ) : (reviews.data ?? []).length === 0 ? (
          <Txt color="muted">এখনো কোনো রিভিউ নেই।</Txt>
        ) : (
          <View style={{ gap: 10 }}>
            {(reviews.data ?? []).map((r) => (
              <Card key={r._id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Txt bold>{r.user?.name ?? "ব্যবহারকারী"}</Txt>
                  <Stars value={r.rating} size={12} />
                </View>
                <Txt color="body" style={{ marginTop: 6 }}>
                  {r.comment}
                </Txt>
                <Txt size={11} color="subtle" style={{ marginTop: 6 }}>
                  {formatDate(r.createdAt)}
                </Txt>
              </Card>
            ))}
          </View>
        )}

        {isAuthenticated ? (
          <ReviewForm bookId={book._id} />
        ) : (
          <Button title="রিভিউ দিতে লগইন করুন" variant="ghost" onPress={needLogin} />
        )}
      </ScrollView>
    </Screen>
  );
}
