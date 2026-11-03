import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";

import { KEYS, getItem, setItem } from "@/lib/storage";
import { ACCENTS, AccentId, Colors, buildColors } from "./palette";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeValue {
  c: Colors;
  isDark: boolean;
  mode: ThemeMode;
  accent: AccentId;
  setMode: (m: ThemeMode) => void;
  setAccent: (a: AccentId) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<AccentId>("teal");

  useEffect(() => {
    (async () => {
      const m = await getItem(KEYS.themeMode);
      const a = await getItem(KEYS.accent);
      if (m === "light" || m === "dark" || m === "system") setModeState(m);
      if (ACCENTS.some((x) => x.id === a)) setAccentState(a as AccentId);
    })();
  }, []);

  const isDark = mode === "system" ? system === "dark" : mode === "dark";

  const value = useMemo<ThemeValue>(
    () => ({
      c: buildColors(isDark, accent),
      isDark,
      mode,
      accent,
      setMode: (m) => {
        setModeState(m);
        void setItem(KEYS.themeMode, m);
      },
      setAccent: (a) => {
        setAccentState(a);
        void setItem(KEYS.accent, a);
      },
    }),
    [isDark, mode, accent],
  );

  useEffect(() => {
    // Avoids a white flash behind the app on dark mode.
    void SystemUI.setBackgroundColorAsync(value.c.canvas).catch(() => {});
  }, [value.c.canvas]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(ThemeContext);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
