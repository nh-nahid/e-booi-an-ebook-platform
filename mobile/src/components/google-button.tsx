import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/auth/AuthProvider";
import { Button, Txt } from "@/components/ui";
import { errorMessage } from "@/lib/format";

/** "Or" divider + Continue with Google, shared by the login and register screens. */
export function GoogleButton() {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);

  const onPress = async () => {
    setBusy(true);
    try {
      const ok = await loginWithGoogle();
      if (!ok) return;
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (err) {
      Alert.alert("গুগল সাইন-ইন ব্যর্থ", errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ marginTop: 18 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "rgba(128,128,128,0.3)" }} />
        <Txt size={12} color="muted">অথবা</Txt>
        <View style={{ flex: 1, height: 1, backgroundColor: "rgba(128,128,128,0.3)" }} />
      </View>
      <Button title="গুগল দিয়ে চালিয়ে যান" variant="outline" icon="logo-google" loading={busy} onPress={onPress} />
    </View>
  );
}
