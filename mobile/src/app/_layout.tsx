import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

void SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

function Shell() {
  const { c, isDark } = useTheme();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) void SplashScreen.hideAsync().catch(() => {});
  }, [isLoading]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.ink,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: c.canvas },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ title: "বইয়ের বিবরণ" }} />
        <Stack.Screen name="checkout" options={{ title: "চেকআউট" }} />
        <Stack.Screen name="orders/index" options={{ title: "আমার অর্ডার" }} />
        <Stack.Screen name="orders/[id]" options={{ title: "অর্ডারের বিবরণ" }} />
        <Stack.Screen name="settings" options={{ title: "থিম ও সেটিংস" }} />
        <Stack.Screen name="notifications" options={{ title: "নোটিফিকেশন" }} />
        <Stack.Screen name="edit-profile" options={{ title: "প্রোফাইল এডিট" }} />
        <Stack.Screen name="change-password" options={{ title: "পাসওয়ার্ড পরিবর্তন" }} />
        <Stack.Screen name="login" options={{ title: "লগইন", presentation: "modal" }} />
        <Stack.Screen name="register" options={{ title: "নতুন অ্যাকাউন্ট" }} />
        <Stack.Screen name="forgot-password" options={{ title: "পাসওয়ার্ড ভুলে গেছেন?" }} />
        <Stack.Screen name="read/[bookId]" options={{ headerShown: false }} />
        <Stack.Screen name="payment-success" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="payment-failed" options={{ headerShown: false }} />
        <Stack.Screen name="payment-cancel" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Shell />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
