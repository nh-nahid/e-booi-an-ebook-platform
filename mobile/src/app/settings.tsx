import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemeSettings } from "@/components/theme-settings";
import { Card, Screen, Txt } from "@/components/ui";
import { useTheme } from "@/theme/ThemeProvider";

const LINKS = [
  { href: "/subscription", icon: "ribbon-outline", label: "সাবস্ক্রিপশন প্ল্যান" },
  { href: "/author", icon: "person-circle-outline", label: "লেখক পরিচিতি" },
] as const;

export default function SettingsScreen() {
  const { c } = useTheme();
  return (
    <Screen scroll edges={["bottom"]}>
      <View style={{ gap: 12 }}>
        <Card>
          {LINKS.map((l) => (
            <Pressable
              key={l.href}
              onPress={() => router.push(l.href)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}
            >
              <Ionicons name={l.icon} size={22} color={c.brand} />
              <Txt bold style={{ flex: 1 }}>{l.label}</Txt>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Pressable>
          ))}
        </Card>
        <ThemeSettings />
      </View>
    </Screen>
  );
}
