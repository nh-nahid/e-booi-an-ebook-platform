import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme, ThemeMode } from "@/theme/ThemeProvider";
import { ACCENTS } from "@/theme/palette";
import { Card, Txt } from "./ui";

const MODES: { id: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "light", label: "লাইট", icon: "sunny-outline" },
  { id: "dark", label: "ডার্ক", icon: "moon-outline" },
  { id: "system", label: "সিস্টেম", icon: "phone-portrait-outline" },
];

export function ThemeSettings() {
  const { c, mode, setMode, accent, setAccent } = useTheme();
  return (
    <Card>
      <Txt bold color="muted" size={12} style={{ marginBottom: 8 }}>
        মোড
      </Txt>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMode(m.id)}
              style={{
                flex: 1,
                alignItems: "center",
                gap: 4,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: on ? c.brand : c.line,
                backgroundColor: on ? c.brandSoft : "transparent",
              }}
            >
              <Ionicons name={m.icon} size={20} color={on ? c.brand : c.body} />
              <Txt size={12} bold color={on ? "brand" : "body"}>
                {m.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      <Txt bold color="muted" size={12} style={{ marginTop: 16, marginBottom: 10 }}>
        থিম কালার
      </Txt>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {ACCENTS.map((a) => {
          const on = accent === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => setAccent(a.id)}
              accessibilityLabel={a.label}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: a.brand,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: on ? 3 : 0,
                borderColor: c.ink,
              }}
            >
              {on && <Ionicons name="checkmark" size={20} color="#fff" />}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
