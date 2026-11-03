import React from "react";
import { router } from "expo-router";

import { Button, Empty, Screen } from "./ui";

export function LoginPrompt({ title, hint }: { title: string; hint: string }) {
  return (
    <Screen>
      <Empty
        icon="lock-closed-outline"
        title={title}
        hint={hint}
        action={<Button title="লগইন করুন" onPress={() => router.push("/login")} />}
      />
    </Screen>
  );
}
