import React from "react";

import { ThemeSettings } from "@/components/theme-settings";
import { Screen } from "@/components/ui";

export default function SettingsScreen() {
  return (
    <Screen scroll edges={["bottom"]}>
      <ThemeSettings />
    </Screen>
  );
}
