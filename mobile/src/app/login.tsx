import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { Image } from "expo-image";
import { Link, router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { Button, Input, Screen, Txt } from "@/components/ui";
import { errorMessage } from "@/lib/format";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = async () => {
    const e: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "সঠিক ইমেইল দিন";
    if (password.length < 6) e.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      await login(email, password);
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (err) {
      Alert.alert("লগইন ব্যর্থ", errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          <Image source={require("../../assets/logo.webp")} style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 8 }} contentFit="cover" />
          <Txt size={34} bold>
            eb<Txt size={34} bold color="brand">oo</Txt>i
          </Txt>
          <Txt size={22} bold style={{ marginTop: 14 }}>
            স্বাগতম!
          </Txt>
          <Txt color="muted">প্রিয় বইগুলো পড়তে লগইন করুন</Txt>
        </View>

        <Input label="ইমেইল" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
        <Input label="পাসওয়ার্ড" icon="lock-closed-outline" secure value={password} onChangeText={setPassword} placeholder="••••••" autoCapitalize="none" autoComplete="password" error={errors.password} />

        <View style={{ alignItems: "flex-end", marginBottom: 16, marginTop: -6 }}>
          <Link href="/forgot-password">
            <Txt color="brand" bold size={13}>
              পাসওয়ার্ড ভুলে গেছেন?
            </Txt>
          </Link>
        </View>

        <Button title="লগইন" loading={busy} onPress={submit} />

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18, gap: 6 }}>
          <Txt color="muted">অ্যাকাউন্ট নেই?</Txt>
          <Link href="/register" replace>
            <Txt color="brand" bold>
              নতুন অ্যাকাউন্ট খুলুন
            </Txt>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
