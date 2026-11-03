import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { applyCoupon, createOrder, useBook, useCart } from "@/hooks/queries";
import { payWithEps } from "@/lib/payment";
import { Cover } from "@/components/book";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Card, Empty, ErrorState, Input, Loading, Screen, Txt } from "@/components/ui";
import { bn, errorMessage, taka } from "@/lib/format";

interface Line {
  id: string;
  title: string;
  author: string;
  cover: { coverImage?: string; coverUrl?: string };
  price: number;
  quantity: number;
}

export default function CheckoutScreen() {
  const { c } = useTheme();
  const qc = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookId } = useLocalSearchParams<{ bookId?: string }>();
  const buyNow = !!bookId;

  const cart = useCart();
  const book = useBook(bookId);

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);

  if (authLoading) return <Screen><Loading /></Screen>;
  if (!isAuthenticated) return <LoginPrompt title="চেকআউট" hint="অর্ডার করতে আগে লগইন করুন।" />;

  const loading = buyNow ? book.isLoading : cart.isLoading;
  const failed = buyNow ? book.isError : cart.isError;
  if (loading) return <Screen><Loading /></Screen>;
  if (failed) return <Screen><ErrorState onRetry={() => (buyNow ? book.refetch() : cart.refetch())} /></Screen>;

  const lines: Line[] = buyNow
    ? book.data
      ? [{ id: book.data._id, title: book.data.title, author: book.data.author, cover: book.data, price: book.data.price, quantity: 1 }]
      : []
    : (cart.data ?? []).map((i) => ({
        id: i._id,
        title: i.book!.title,
        author: i.book!.author,
        cover: i.book!,
        price: i.book!.price,
        quantity: i.quantity,
      }));

  if (!lines.length)
    return (
      <Screen>
        <Empty icon="cart-outline" title="চেকআউটে কিছু নেই" action={<Button title="বই দেখুন" onPress={() => router.replace("/books")} />} />
      </Screen>
    );

  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const discount = coupon?.discount ?? 0;
  const payable = Math.max(total - discount, 0);

  const onApply = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const r = await applyCoupon(code.trim().toUpperCase(), total);
      setCoupon({ code: r.coupon.code, discount: r.discount });
    } catch (e) {
      setCoupon(null);
      Alert.alert("কুপন প্রযোজ্য নয়", errorMessage(e));
    } finally {
      setApplying(false);
    }
  };

  const onPay = async () => {
    setPaying(true);
    try {
      const order = await createOrder({
        couponCode: coupon?.code,
        items: buyNow ? [{ bookId: bookId as string, quantity: 1 }] : undefined,
      });
      qc.invalidateQueries({ queryKey: ["orders"] });
      await payWithEps(order._id);
    } catch (e) {
      Alert.alert("পেমেন্ট শুরু করা যায়নি", errorMessage(e));
    } finally {
      setPaying(false);
    }
  };

  return (
    <Screen
      scroll
      edges={["bottom"]}
      footer={
        <View style={{ backgroundColor: c.surface, borderTopColor: c.line, borderTopWidth: 1, padding: 14, gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt color="muted">পরিশোধযোগ্য</Txt>
            <Txt bold size={20} color="price">
              {taka(payable)}
            </Txt>
          </View>
          <Button title={payable > 0 ? "পেমেন্ট করুন" : "অর্ডার নিশ্চিত করুন"} icon="lock-closed" loading={paying} onPress={onPay} />
        </View>
      }
    >
      <Txt bold size={16} style={{ marginBottom: 10 }}>
        অর্ডারের বইসমূহ
      </Txt>
      <View style={{ gap: 10 }}>
        {lines.map((l) => (
          <Card key={l.id} style={{ flexDirection: "row", gap: 12 }}>
            <Cover book={l.cover} width={52} radius={6} />
            <View style={{ flex: 1 }}>
              <Txt bold numberOfLines={2}>
                {l.title}
              </Txt>
              <Txt size={12} color="muted">
                {l.author}
              </Txt>
              <Txt size={12} color="muted" style={{ marginTop: 4 }}>
                {taka(l.price)} × {bn(l.quantity)}
              </Txt>
            </View>
            <Txt bold color="price">
              {taka(l.price * l.quantity)}
            </Txt>
          </Card>
        ))}
      </View>

      <Txt bold size={16} style={{ marginTop: 20, marginBottom: 10 }}>
        কুপন কোড
      </Txt>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Input value={code} onChangeText={setCode} placeholder="কুপন কোড লিখুন" autoCapitalize="characters" icon="pricetag-outline" />
        </View>
        <Button title="প্রয়োগ" variant="dark" loading={applying} onPress={onApply} style={{ marginTop: 1 }} />
      </View>
      {coupon && (
        <Txt color="successInk" size={13} style={{ marginTop: -6 }}>
          কুপন {coupon.code} প্রয়োগ হয়েছে — ছাড় {taka(coupon.discount)}
        </Txt>
      )}

      <Txt bold size={16} style={{ marginTop: 20, marginBottom: 10 }}>
        পেমেন্ট পদ্ধতি
      </Txt>
      <Card style={{ borderColor: c.brand, backgroundColor: c.brandSoft, flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Ionicons name="radio-button-on" size={22} color={c.brand} />
        <View style={{ flex: 1 }}>
          <Txt bold>অনলাইন পেমেন্ট</Txt>
          <Txt size={12} color="muted">
            bKash, Nagad, Rocket, Visa, Mastercard — EPS-এর মাধ্যমে নিরাপদ পেমেন্ট
          </Txt>
        </View>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Txt color="muted">সাবটোটাল</Txt>
          <Txt>{taka(total)}</Txt>
        </View>
        {discount > 0 && (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Txt color="muted">কুপন ছাড়</Txt>
            <Txt color="successInk">-{taka(discount)}</Txt>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopColor: c.line, borderTopWidth: 1, paddingTop: 8 }}>
          <Txt bold>মোট</Txt>
          <Txt bold color="price">
            {taka(payable)}
          </Txt>
        </View>
      </Card>
      <Txt size={11} color="subtle" center style={{ marginTop: 12 }}>
        ডিজিটাল পণ্য — পেমেন্ট সফল হলেই বই আপনার লাইব্রেরিতে যোগ হবে।
      </Txt>
    </Screen>
  );
}
