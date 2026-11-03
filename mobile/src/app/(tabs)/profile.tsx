import React from "react";
import { Alert, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { Button, Card, Empty, Loading, Screen, Txt } from "@/components/ui";
import { ThemeSettings } from "@/components/theme-settings";
import { SITE_URL } from "@/lib/config";
import { avatarUri } from "@/lib/avatar";

function Row({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 13 }}
    >
      <Ionicons name={icon} size={21} color={danger ? c.dangerInk : c.brand} />
      <Txt style={{ flex: 1 }} color={danger ? "dangerInk" : "ink"}>
        {label}
      </Txt>
      {!danger && <Ionicons name="chevron-forward" size={17} color={c.subtle} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { c } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const open = (path: string) => WebBrowser.openBrowserAsync(`${SITE_URL}${path}`);

  if (isLoading) return <Screen><Loading /></Screen>;

  const policies = (
    <Card style={{ paddingVertical: 4 }}>
      <Row icon="help-buoy-outline" label="সাপোর্ট সেন্টার" onPress={() => open("/support")} />
      <Row icon="shield-checkmark-outline" label="প্রাইভেসি পলিসি" onPress={() => open("/privacy")} />
      <Row icon="document-text-outline" label="শর্তাবলী" onPress={() => open("/terms")} />
      <Row icon="return-down-back-outline" label="রিটার্ন ও রিফান্ড পলিসি" onPress={() => open("/refund-policy")} />
      <Row icon="information-circle-outline" label="আমাদের সম্পর্কে" onPress={() => open("/about")} />
    </Card>
  );

  if (!isAuthenticated) {
    return (
      <Screen scroll>
        <Empty
          icon="person-outline"
          title="আপনি লগইন করেননি"
          hint="অর্ডার, লাইব্রেরি ও উইশলিস্ট ব্যবহার করতে লগইন করুন।"
          action={
            <View style={{ gap: 10, alignSelf: "stretch" }}>
              <Button title="লগইন" onPress={() => router.push("/login")} />
              <Button title="নতুন অ্যাকাউন্ট" variant="outline" onPress={() => router.push("/register")} />
            </View>
          }
        />
        <View style={{ gap: 14, marginTop: 16 }}>
          <ThemeSettings />
          {policies}
        </View>
      </Screen>
    );
  }

  const uri = avatarUri(user?.avatar);

  return (
    <Screen scroll>
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.navy, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
          {uri ? (
            <Image source={{ uri }} style={{ width: 64, height: 64 }} contentFit="cover" />
          ) : (
            <Txt size={26} bold style={{ color: "#fff" }}>
              {(user?.name ?? "?").trim().charAt(0).toUpperCase()}
            </Txt>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Txt bold size={17} numberOfLines={1}>
            {user?.name}
          </Txt>
          <Txt size={13} color="muted" numberOfLines={1}>
            {user?.email}
          </Txt>
        </View>
      </Card>

      <View style={{ gap: 14, marginTop: 14 }}>
        <Card style={{ paddingVertical: 4 }}>
          <Row icon="receipt-outline" label="আমার অর্ডার" onPress={() => router.push("/orders")} />
          <Row icon="heart-outline" label="উইশলিস্ট" onPress={() => router.push("/wishlist")} />
          <Row icon="create-outline" label="প্রোফাইল এডিট" onPress={() => router.push("/edit-profile")} />
          <Row icon="key-outline" label="পাসওয়ার্ড পরিবর্তন" onPress={() => router.push("/change-password")} />
        </Card>

        <ThemeSettings />
        {policies}

        <Card style={{ paddingVertical: 4 }}>
          <Row
            icon="log-out-outline"
            label="লগআউট"
            danger
            onPress={() =>
              Alert.alert("লগআউট", "আপনি কি লগআউট করতে চান?", [
                { text: "না", style: "cancel" },
                { text: "হ্যাঁ", style: "destructive", onPress: () => void logout() },
              ])
            }
          />
        </Card>
      </View>
    </Screen>
  );
}
