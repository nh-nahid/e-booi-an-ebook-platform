import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { Button, Screen, Txt } from "@/components/ui";

export default function PaymentFailed() {
  const { c } = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  return (
    <Screen edges={["top", "bottom"]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.dangerSoft, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="close-circle" size={64} color={c.dangerInk} />
        </View>
        <Txt size={22} bold style={{ marginTop: 8 }}>
          পেমেন্ট সম্পন্ন হয়নি
        </Txt>
        <Txt color="muted" center>
          আপনার অ্যাকাউন্ট থেকে টাকা কাটা হয়ে থাকলে কিছুক্ষণ অপেক্ষা করুন বা সাপোর্টে যোগাযোগ করুন।
        </Txt>
      </View>
      <View style={{ gap: 10 }}>
        {!!orderId && (
          <Button title="আবার পেমেন্ট করুন" onPress={() => router.replace({ pathname: "/orders/[id]", params: { id: orderId } })} />
        )}
        <Button title="হোমে ফিরুন" variant="ghost" onPress={() => router.replace("/")} />
      </View>
    </Screen>
  );
}
