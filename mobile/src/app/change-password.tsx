import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/format";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Input, Screen } from "@/components/ui";

export default function ChangePassword() {
  const { isAuthenticated } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isAuthenticated) return <LoginPrompt title="পাসওয়ার্ড" hint="লগইন করুন।" />;

  const submit = async () => {
    if (!current) return Alert.alert("বর্তমান পাসওয়ার্ড দিন");
    if (next.length < 6) return Alert.alert("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
    if (next !== confirm) return Alert.alert("নতুন পাসওয়ার্ড দুটি মিলছে না");
    setBusy(true);
    try {
      await api.patch("/users/change-password", { currentPassword: current, newPassword: next });
      Alert.alert("সফল", "পাসওয়ার্ড বদলানো হয়েছে।", [{ text: "ঠিক আছে", onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert("ত্রুটি", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <Input label="বর্তমান পাসওয়ার্ড" icon="lock-closed-outline" secure value={current} onChangeText={setCurrent} autoCapitalize="none" />
      <Input label="নতুন পাসওয়ার্ড" icon="key-outline" secure value={next} onChangeText={setNext} autoCapitalize="none" />
      <Input label="নতুন পাসওয়ার্ড আবার দিন" icon="key-outline" secure value={confirm} onChangeText={setConfirm} autoCapitalize="none" />
      <Button title="পাসওয়ার্ড বদলান" loading={busy} onPress={submit} />
    </Screen>
  );
}
