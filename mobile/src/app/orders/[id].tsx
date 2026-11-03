import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";

import { useTheme } from "@/theme/ThemeProvider";
import { useOrder } from "@/hooks/queries";
import { Cover } from "@/components/book";
import { Button, Card, ErrorState, Loading, Screen, StatusBadge, Txt } from "@/components/ui";
import { bn, errorMessage, formatDate, taka } from "@/lib/format";
import { paymentTone } from "@/lib/order-status";
import { payWithEps } from "@/lib/payment";
import { downloadAuthed } from "@/lib/files";

export default function OrderDetails() {
  const { c } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useOrder(id);
  const [paying, setPaying] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  if (q.isLoading) return <Screen edges={[]}><Loading /></Screen>;
  if (q.isError || !q.data) return <Screen edges={[]}><ErrorState onRetry={q.refetch} /></Screen>;

  const o = q.data;
  const p = paymentTone(o.paymentStatus);

  const pay = async () => {
    setPaying(true);
    try {
      await payWithEps(o._id);
    } catch (e) {
      Alert.alert("পেমেন্ট শুরু করা যায়নি", errorMessage(e));
    } finally {
      setPaying(false);
    }
  };

  const invoice = async () => {
    setInvoiceLoading(true);
    try {
      const uri = await downloadAuthed(`/orders/${o._id}/invoice`, `invoice-${o.invoiceNumber ?? o._id}.pdf`);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "ইনভয়েস" });
      else Alert.alert("ইনভয়েস সংরক্ষিত হয়েছে", uri);
    } catch (e) {
      Alert.alert("ইনভয়েস পাওয়া যায়নি", errorMessage(e));
    } finally {
      setInvoiceLoading(false);
    }
  };

  const row = (label: string, value: string, tone?: "successInk") => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
      <Txt color="muted">{label}</Txt>
      <Txt color={tone}>{value}</Txt>
    </View>
  );

  return (
    <Screen scroll edges={["bottom"]}>
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Txt bold>অর্ডার #{o._id.slice(-6).toUpperCase()}</Txt>
          <StatusBadge label={p.label} tone={p.tone} />
        </View>
        <Txt size={12} color="muted">
          {formatDate(o.createdAt)}
        </Txt>
      </Card>

      <Txt bold size={16} style={{ marginTop: 18, marginBottom: 10 }}>
        বইসমূহ
      </Txt>
      <View style={{ gap: 10 }}>
        {o.items.map((i, idx) => (
          <Card key={`${i.book?._id}-${idx}`} style={{ flexDirection: "row", gap: 12 }}>
            <Cover book={i.book!} width={52} radius={6} />
            <View style={{ flex: 1 }}>
              <Txt bold numberOfLines={2}>
                {i.book!.title}
              </Txt>
              <Txt size={12} color="muted">
                {i.book!.author}
              </Txt>
              <Txt size={12} color="muted" style={{ marginTop: 4 }}>
                {taka(i.price)} × {bn(i.quantity)}
              </Txt>
            </View>
            {o.paymentStatus === "paid" && (
              <Button
                title="পড়ুন"
                small
                onPress={() => router.push({ pathname: "/read/[bookId]", params: { bookId: i.book!._id, title: i.book!.title } })}
              />
            )}
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: 18 }}>
        {row("সাবটোটাল", taka(o.totalAmount))}
        {o.discountAmount > 0 && row("ছাড়", `-${taka(o.discountAmount)}`, "successInk")}
        <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopColor: c.line, borderTopWidth: 1, paddingTop: 8 }}>
          <Txt bold>মোট</Txt>
          <Txt bold color="price">
            {taka(o.finalAmount ?? o.totalAmount)}
          </Txt>
        </View>
      </Card>

      <View style={{ gap: 10, marginTop: 18 }}>
        {o.paymentStatus !== "paid" && <Button title="পেমেন্ট করুন" icon="lock-closed" loading={paying} onPress={pay} />}
        {o.paymentStatus === "paid" && (
          <Button title="ইনভয়েস ডাউনলোড" variant="outline" icon="download-outline" loading={invoiceLoading} onPress={invoice} />
        )}
      </View>
    </Screen>
  );
}
