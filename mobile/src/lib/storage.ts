import * as SecureStore from "expo-secure-store";

// Every call is wrapped: SecureStore can throw (corrupted keystore, restore
// from backup) and the app must still start.
export async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    /* ignore */
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  refreshToken: "ebooi.refreshToken",
  themeMode: "ebooi.themeMode",
  accent: "ebooi.accent",
} as const;
