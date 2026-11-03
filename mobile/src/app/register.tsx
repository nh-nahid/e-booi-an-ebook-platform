import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { Button, Input, Screen, Txt } from "@/components/ui";
import { errorMessage } from "@/lib/format";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "নাম কমপক্ষে ৩ অক্ষর";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "সঠিক ইমেইল দিন";
    if (password.length < 6) e.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর";
    if (confirm !== password) e.confirm = "পাসওয়ার্ড মিলছে না";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      await register(name, email, password);
      router.replace("/");
    } catch (err) {
      Alert.alert("রেজিস্ট্রেশন ব্যর্থ", errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <Txt size={22} bold style={{ marginTop: 8 }}>
        নতুন অ্যাকাউন্ট
      </Txt>
      <Txt color="muted" style={{ marginBottom: 20 }}>
        কয়েক সেকেন্ডেই শুরু করুন
      </Txt>
      <Input label="পুরো নাম" icon="person-outline" value={name} onChangeText={setName} error={errors.name} />
      <Input label="ইমেইল" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
      <Input label="পাসওয়ার্ড" icon="lock-closed-outline" secure value={password} onChangeText={setPassword} autoCapitalize="none" error={errors.password} />
      <Input label="পাসওয়ার্ড আবার দিন" icon="lock-closed-outline" secure value={confirm} onChangeText={setConfirm} autoCapitalize="none" error={errors.confirm} />
      <Button title="অ্যাকাউন্ট খুলুন" loading={busy} onPress={submit} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18, gap: 6 }}>
        <Txt color="muted">আগে থেকেই অ্যাকাউন্ট আছে?</Txt>
        <Link href="/login" replace>
          <Txt color="brand" bold>
            লগইন
          </Txt>
        </Link>
      </View>
    </Screen>
  );
}
