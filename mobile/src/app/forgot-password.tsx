import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import { api } from "@/lib/api";
import { Button, Card, Input, Screen, Txt } from "@/components/ui";
import { errorMessage } from "@/lib/format";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return Alert.alert("সঠিক ইমেইল দিন");
    setBusy(true);
    try {
      await api.post("/users/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (e) {
      Alert.alert("ত্রুটি", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <Txt color="muted" style={{ marginBottom: 18 }}>
        আপনার ইমেইল দিন। অ্যাকাউন্ট থাকলে পাসওয়ার্ড রিসেটের লিংক পাঠানো হবে।
      </Txt>
      {sent ? (
        <Card>
          <Txt bold>ইমেইল পাঠানো হয়েছে</Txt>
          <Txt color="muted" style={{ marginTop: 6, marginBottom: 14 }}>
            ইনবক্স (এবং স্প্যাম ফোল্ডার) দেখুন। লিংকটি ১৫ মিনিট কার্যকর থাকবে এবং ব্রাউজারে খুলবে।
          </Txt>
          <Button title="লগইনে ফিরুন" variant="outline" onPress={() => router.back()} />
        </Card>
      ) : (
        <>
          <Input label="ইমেইল" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Button title="রিসেট লিংক পাঠান" loading={busy} onPress={submit} />
        </>
      )}
    </Screen>
  );
}
