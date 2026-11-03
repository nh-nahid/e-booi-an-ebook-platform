import * as FileSystem from "expo-file-system/legacy";

import { API_URL } from "./config";
import { api, getAccessToken } from "./api";

/**
 * Downloads an authenticated file (purchased PDF / invoice) into the app cache
 * and returns its local URI. A cheap authed call first makes sure the access
 * token is fresh — the native downloader can't retry after a 401 itself.
 */
export async function downloadAuthed(path: string, fileName: string): Promise<string> {
  await api.get("/users/profile");
  const dest = `${FileSystem.cacheDirectory}${fileName}`;
  const res = await FileSystem.downloadAsync(`${API_URL}${path}`, dest, {
    headers: { Authorization: `Bearer ${getAccessToken() ?? ""}`, "x-client": "mobile" },
  });
  if (res.status !== 200) throw new Error(`download-${res.status}`);
  return res.uri;
}

export async function downloadPublic(path: string, fileName: string): Promise<string> {
  const dest = `${FileSystem.cacheDirectory}${fileName}`;
  const res = await FileSystem.downloadAsync(`${API_URL}${path}`, dest);
  if (res.status !== 200) throw new Error(`download-${res.status}`);
  return res.uri;
}
