import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/theme/ThemeProvider";
import { Button, Txt } from "@/components/ui";
import { downloadAuthed, downloadPublic } from "@/lib/files";
import { bn, errorMessage } from "@/lib/format";

// react-native-pdf is a native module: it exists in a development / release
// build but NOT in Expo Go. Load it defensively so the screen can still fall
// back to "open in another app" instead of crashing.
let PdfView: React.ComponentType<any> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PdfView = require("react-native-pdf").default;
} catch {
  PdfView = null;
}

export default function Reader() {
  const { c } = useTheme();
  const { bookId, title, preview } = useLocalSearchParams<{ bookId: string; title?: string; preview?: string }>();
  const isPreview = preview === "1";

  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const file = isPreview
          ? await downloadPublic(`/books/${bookId}/preview`, `preview-${bookId}.pdf`)
          : await downloadAuthed(`/orders/download/${bookId}`, `book-${bookId}.pdf`);
        if (alive) setUri(file);
      } catch (e) {
        if (alive) setError(errorMessage(e, "বইটি লোড করা যায়নি।"));
      }
    })();
    return () => {
      alive = false;
    };
  }, [bookId, isPreview]);

  const openExternal = async () => {
    if (uri && (await Sharing.isAvailableAsync()))
      await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: title ?? "বই" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.navy }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Txt bold numberOfLines={1} style={{ color: "#fff" }}>
            {title ?? "বই"}
          </Txt>
          {isPreview && (
            <Txt size={11} style={{ color: "#94a0ba" }}>
              নমুনা প্রিভিউ
            </Txt>
          )}
        </View>
        {pages > 0 && (
          <Txt size={12} style={{ color: "#c3cce0" }}>
            {bn(page)} / {bn(pages)}
          </Txt>
        )}
        {uri && (
          <Pressable onPress={openExternal} hitSlop={10}>
            <Ionicons name="share-outline" size={22} color="#fff" />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1, backgroundColor: c.canvas }}>
        {error ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
            <Ionicons name="alert-circle-outline" size={44} color={c.dangerInk} />
            <Txt center color="muted">
              {error}
            </Txt>
            <Button title="ফিরে যান" variant="outline" small onPress={() => router.back()} />
          </View>
        ) : !uri ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
            <ActivityIndicator size="large" color={c.brand} />
            <Txt color="muted">বই লোড হচ্ছে…</Txt>
          </View>
        ) : PdfView ? (
          <PdfView
            source={{ uri, cache: true }}
            style={{ flex: 1, backgroundColor: c.canvas }}
            enablePaging={false}
            horizontal={false}
            trustAllCerts={false}
            onLoadComplete={(n: number) => setPages(n)}
            onPageChanged={(p: number, n: number) => {
              setPage(p);
              setPages(n);
            }}
            onError={() => setError("PDF দেখানো যায়নি।")}
            renderActivityIndicator={() => <ActivityIndicator size="large" color={c.brand} />}
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
            <Ionicons name="document-text-outline" size={48} color={c.brand} />
            <Txt center color="muted">
              এই বিল্ডে অ্যাপের ভেতরের PDF রিডার নেই (Expo Go)। বইটি অন্য PDF অ্যাপে খুলুন।
            </Txt>
            <Button title="অন্য অ্যাপে খুলুন" icon="open-outline" onPress={openExternal} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
