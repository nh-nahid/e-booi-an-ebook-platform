import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { Button, Screen, Txt } from "@/components/ui";

export default function PaymentCancel() {
  const { c } = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  return (
    <Screen edges={["top", "bottom"]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.warnSoft, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="alert-circle" size={64} color={c.warnInk} />
        </View>
        <Txt size={22} bold style={{ marginTop: 8 }}>
          পেমেন্ট বাতিল করা হয়েছে
        </Txt>
        <Txt color="muted" center>
          অর্ডারটি সংরক্ষিত আছে। চাইলে অর্ডার পেজ থেকে পরে পেমেন্ট সম্পন্ন করতে পারবেন।
        </Txt>
      </View>
      <View style={{ gap: 10 }}>
        {!!orderId && (
          <Button title="অর্ডারে যান" onPress={() => router.replace({ pathname: "/orders/[id]", params: { id: orderId } })} />
        )}
        <Button title="হোমে ফিরুন" variant="ghost" onPress={() => router.replace("/")} />
      </View>
    </Screen>
  );
}
