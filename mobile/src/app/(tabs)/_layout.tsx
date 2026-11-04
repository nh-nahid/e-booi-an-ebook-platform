import React from "react";
import { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { useCart } from "@/hooks/queries";

type Icon = keyof typeof Ionicons.glyphMap;

const tab = (name: string, title: string, icon: Icon, iconOn: Icon) => ({
  name,
  options: {
    title,
    tabBarIcon: ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
      <Ionicons name={focused ? iconOn : icon} size={size} color={color as string} />
    ),
  },
});

export default function TabsLayout() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { data: cart } = useCart();
  const count = isAuthenticated ? (cart ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0) : 0;

  const screens = [
    tab("index", "হোম", "home-outline", "home"),
    tab("books", "বই", "book-outline", "book"),
    tab("library", "লাইব্রেরি", "library-outline", "library"),
    tab("cart", "কার্ট", "cart-outline", "cart"),
    tab("wishlist", "উইশলিস্ট", "heart-outline", "heart"),
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.brand,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.line,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      {screens.map((s) => (
        <Tabs.Screen
          key={s.name}
          name={s.name}
          options={
            s.name === "cart"
              ? {
                  ...s.options,
                  tabBarBadge: count > 0 ? (count > 9 ? "9+" : count) : undefined,
                  tabBarBadgeStyle: { backgroundColor: c.brand, color: "#fff" },
                }
              : s.options
          }
        />
      ))}
      {/* Profile stays reachable from the header avatar; hidden from the tab bar. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
