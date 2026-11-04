import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/queries";
import { LoginPrompt } from "@/components/login-prompt";
import { Empty, ErrorState, Loading, Screen, Txt } from "@/components/ui";
import { bn } from "@/lib/format";
import type { AppNotification } from "@/types";

const ICONS: Record<AppNotification["type"], keyof typeof Ionicons.glyphMap> = {
  order: "cube-outline",
  payment: "card-outline",
  announcement: "megaphone-outline",
};

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "এইমাত্র";
  const m = Math.floor(s / 60);
  if (m < 60) return `${bn(m)} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${bn(h)} ঘণ্টা আগে`;
  return `${bn(Math.floor(h / 24))} দিন আগে`;
}

export default function NotificationsScreen() {
  const { c } = useTheme();
  const { isAuthenticated } = useAuth();
  const q = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();

  if (!isAuthenticated) return <LoginPrompt title="নোটিফিকেশন" hint="নোটিফিকেশন দেখতে লগইন করুন।" />;
  if (q.isLoading) return <Screen edges={[]}><Loading /></Screen>;
  if (q.isError) return <Screen edges={[]}><ErrorState onRetry={q.refetch} /></Screen>;

  const items = q.data?.data ?? [];
  const unread = q.data?.unread ?? 0;

  const open = (n: AppNotification) => {
    if (!n.isRead) markRead.mutate(n._id);
    if (n.link) router.push(n.link.replace(/^\/books\//, "/book/") as never);
  };

  return (
    <Screen edges={[]} padded={false}>
      {unread > 0 && (
        <Pressable onPress={() => markAll.mutate()} style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "center", gap: 4, padding: 12 }}>
          <Ionicons name="checkmark-done" size={16} color={c.brandStrong} />
          <Txt size={12} bold color="brandStrong">সব পড়া হয়েছে</Txt>
        </Pressable>
      )}
      <FlatList
        data={items}
        keyExtractor={(n) => n._id}
        refreshing={q.isRefetching}
        onRefresh={q.refetch}
        contentContainerStyle={{ padding: 16, paddingTop: unread > 0 ? 0 : 16, gap: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <Empty icon="notifications-outline" title="কোনো নোটিফিকেশন নেই" hint="নতুন অফার ও অর্ডারের আপডেট এখানে দেখা যাবে।" />
        }
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: c.line, backgroundColor: item.isRead ? c.surface : c.brandSoft }}>
            <Pressable onPress={() => open(item)} style={{ flex: 1, flexDirection: "row", gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.surface, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={ICONS[item.type] ?? "notifications-outline"} size={16} color={c.brandStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Txt bold size={14} style={{ flexShrink: 1 }}>{item.title}</Txt>
                  {!item.isRead && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.brand }} />}
                </View>
                {!!item.message && <Txt size={12} color="body" style={{ marginTop: 2 }}>{item.message}</Txt>}
                <Txt size={11} color="subtle" style={{ marginTop: 4 }}>{timeAgo(item.createdAt)}</Txt>
              </View>
            </Pressable>
            <Pressable onPress={() => remove.mutate(item._id)} hitSlop={8} accessibilityLabel="মুছুন">
              <Ionicons name="trash-outline" size={16} color={c.subtle} />
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
