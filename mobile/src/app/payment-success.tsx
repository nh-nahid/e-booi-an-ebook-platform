import React, { useEffect } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { Button, Screen, Txt } from "@/components/ui";

export default function PaymentSuccess() {
  const { c } = useTheme();
  const qc = useQueryClient();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  // The purchase changes the cart, library and orders.
  useEffect(() => {
    qc.invalidateQueries({ queryKey: ["cart"] });
    qc.invalidateQueries({ queryKey: ["library"] });
    qc.invalidateQueries({ queryKey: ["orders"] });
    qc.invalidateQueries({ queryKey: ["my-subscription"] });
  }, [qc]);

  return (
    <Screen edges={["top", "bottom"]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.successSoft, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark-circle" size={64} color={c.successInk} />
        </View>
        <Txt size={22} bold style={{ marginTop: 8 }}>
          পেমেন্ট সফল হয়েছে!
        </Txt>
        <Txt color="muted" center>
          আপনার বই লাইব্রেরিতে যোগ হয়েছে। ইনভয়েস ইমেইলেও পাঠানো হয়েছে।
        </Txt>
      </View>
      <View style={{ gap: 10 }}>
        <Button title="লাইব্রেরিতে যান" icon="library-outline" onPress={() => router.replace("/library")} />
        {!!orderId && (
          <Button title="অর্ডার দেখুন" variant="outline" onPress={() => router.replace({ pathname: "/orders/[id]", params: { id: orderId } })} />
        )}
        <Button title="হোমে ফিরুন" variant="ghost" onPress={() => router.replace("/")} />
      </View>
    </Screen>
  );
}
