import React, { useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { useHome, useNotifications } from "@/hooks/queries";
import { avatarUri } from "@/lib/avatar";
import { BookCard } from "@/components/book";
import { ErrorState, Loading, Screen, Txt } from "@/components/ui";
import { bn } from "@/lib/format";
import type { Book } from "@/types";

const SIDE = 20; // web: px-5
const CATEGORY_IMAGES: Record<string, number> = {
  "ইসলামিক বই": require("../../../assets/categories/religious.webp"),
  "কর্ম ও জীবিকা": require("../../../assets/categories/kormo.webp"),
  "সেলফ লার্নিং": require("../../../assets/categories/self.webp"),
  "সিরিজ": require("../../../assets/categories/series.webp"),
  "বিজ্ঞান": require("../../../assets/categories/biggan.webp"),
  "ব্যবসা": require("../../../assets/categories/business.webp"),
};
const CATEGORY_ORDER = ["ইসলামিক বই", "কর্ম ও জীবিকা", "সেলফ লার্নিং", "সিরিজ"];

/* ----------------------------- Section header ---------------------------- */
// Web: badge title (bg-brand-soft) + "সব দেখুন →", underlined by a line.
function WebSectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: c.line,
        paddingBottom: 6,
        marginBottom: 6,
      }}
    >
      <View style={{ backgroundColor: c.brandSoft, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
        <Txt size={11} bold color="muted">
          {title}
        </Txt>
      </View>
      <Pressable onPress={onMore} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Txt size={12} bold style={{ color: "gray" }}>
          সব দেখুন
        </Txt>
        <Ionicons name="arrow-forward" size={12} color="gray" />
      </Pressable>
    </View>
  );
}

function Dots({ count, index, pill }: { count: number; index: number; pill?: boolean }) {
  const { c } = useTheme();
  if (count <= 1) return null;
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 14 }}>
      {Array.from({ length: count }).map((_, i) => {
        const on = i === index;
        return (
          <View
            key={i}
            style={{
              height: 6,
              width: pill && on ? 12 : 6,
              borderRadius: 3,
              backgroundColor: pill ? (on ? c.brand : c.line) : c.muted,
              opacity: pill ? 1 : on ? 1 : 0.3,
            }}
          />
        );
      })}
    </View>
  );
}

/* ------------------------------- Book section ---------------------------- */
// Web: pages of 6 books, 2 columns, gap 10, page dots below.
function BookSection({ title, books, onMore }: { title: string; books: Book[]; onMore?: () => void }) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  if (!books?.length) return null;
  const inner = width - SIDE * 2;
  const gap = 10;
  const cardW = (inner - gap) / 2;
  const pages: Book[][] = [];
  for (let i = 0; i < books.length; i += 6) pages.push(books.slice(i, i + 6));
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPage(Math.round(e.nativeEvent.contentOffset.x / (inner + SIDE * 2)));
  return (
    <View style={{ paddingTop: 8, paddingBottom: 24 }}>
      <View style={{ paddingHorizontal: SIDE }}>
        <WebSectionHeader title={title} onMore={onMore} />
      </View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={pages}
        keyExtractor={(_, i) => String(i)}
        onScroll={onScroll}
        scrollEventThrottle={32}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              paddingHorizontal: SIDE,
              flexDirection: "row",
              flexWrap: "wrap",
              gap,
              paddingTop: 6,
            }}
          >
            {item.map((b) => (
              <BookCard key={b._id} book={b} width={cardW} />
            ))}
          </View>
        )}
      />
      <Dots count={pages.length} index={page} pill />
    </View>
  );
}

/* --------------------------------- Footer -------------------------------- */
function Footer() {
  const { c } = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const groups: { title: string; items: { label: string; onPress: () => void }[] }[] = [
    {
      title: "দ্রুত লিংক",
      items: [
        { label: "সকল বই", onPress: () => router.push("/books") },
        { label: "লাইব্রেরি", onPress: () => router.push("/library") },
        { label: "কার্ট", onPress: () => router.push("/cart") },
      ],
    },
    {
      title: "যোগাযোগ",
      items: [
        { label: "ফেসবুক", onPress: () => void Linking.openURL("https://www.facebook.com/profile.php?id=61579813011880") },
        { label: "হোয়াটসঅ্যাপ", onPress: () => void Linking.openURL("https://wa.me/8801791148655") },
      ],
    },
  ];
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: c.line, backgroundColor: c.surface, paddingHorizontal: SIDE, paddingTop: 16, paddingBottom: 28 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Image source={require("../../../assets/logo.webp")} style={{ width: 32, height: 32, borderRadius: 7 }} contentFit="cover" />
        <Txt bold size={20}>
          eb<Txt bold size={20} color="brand">oo</Txt>i
        </Txt>
      </View>
      <Txt size={12} color="muted" style={{ marginTop: 6, marginBottom: 10 }}>
        বাংলা ডিজিটাল ই-বুক স্টোর
      </Txt>
      {groups.map((g) => (
        <View key={g.title} style={{ borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
          <Pressable onPress={() => setOpen(open === g.title ? null : g.title)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt bold size={12}>{g.title}</Txt>
            <Ionicons name={open === g.title ? "chevron-up" : "chevron-down"} size={14} color={c.muted} />
          </Pressable>
          {open === g.title &&
            g.items.map((it) => (
              <Pressable key={it.label} onPress={it.onPress} style={{ paddingTop: 8 }}>
                <Txt size={12} color="body">{it.label}</Txt>
              </Pressable>
            ))}
        </View>
      ))}
      <Txt size={11} color="muted" center style={{ marginTop: 16 }}>
        © {bn(new Date().getFullYear())} ebooi. সর্বস্বত্ব সংরক্ষিত।
      </Txt>
    </View>
  );
}

/* ---------------------------------- Screen ------------------------------- */
export default function HomeScreen() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const { user, isAuthenticated } = useAuth();
  const { data: notif } = useNotifications();
  const unread = isAuthenticated ? (notif?.unread ?? 0) : 0;
  const { data, isLoading, isError, refetch, isRefetching } = useHome();
  const [search, setSearch] = useState("");
  const [catPage, setCatPage] = useState(0);

  const avatar = avatarUri(user?.avatar);

  const goBooks = (params?: Record<string, string>) => router.push({ pathname: "/books", params });
  const submit = () => goBooks(search.trim() ? { search: search.trim() } : undefined);

  if (isLoading) return <Screen><Loading /></Screen>;
  if (isError || !data) return <Screen><ErrorState onRetry={refetch} /></Screen>;

  const cats = [...(data.categories ?? [])].sort((a, b) => {
    const p = (n: string) => {
      const i = CATEGORY_ORDER.indexOf(n);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    return p(a.name) - p(b.name);
  });
  const catGap = 8;
  const catInner = width - SIDE * 2 - 8; // px-1 on both sides
  const catW = (catInner - catGap * 2) / 3;
  const catPages = Math.max(1, Math.ceil(cats.length / 3));

  const IconBtn = ({ icon, label, onPress, badge }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; badge?: number }) => (
    <Pressable onPress={onPress} style={{ alignItems: "center", gap: 2 }} accessibilityLabel={label}>
      <View>
        <Ionicons name={icon} size={20} color={c.ink} />
        {!!badge && (
          <View style={{ position: "absolute", right: -8, top: -6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: c.brand, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
            <Txt size={9} bold style={{ color: "#fff" }}>{badge > 9 ? "9+" : bn(badge)}</Txt>
          </View>
        )}
      </View>
      <Txt size={10}>{label}</Txt>
    </Pressable>
  );

  return (
    <Screen padded={false}>
      <ScrollView
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={c.brand} />}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Header — logo + wordmark, library / cart / profile; search beneath */}
        <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.line, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable onPress={() => router.push("/settings")} hitSlop={8} style={{ marginRight: 6 }}>
              <Ionicons name="menu" size={26} color={c.ink} />
            </Pressable>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Image source={require("../../../assets/logo.webp")} style={{ width: 36, height: 36, borderRadius: 8 }} contentFit="cover" />
              <Txt size={20} bold>
                eb<Txt size={20} bold color="brand">oo</Txt>i
              </Txt>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <IconBtn icon="library-outline" label="লাইব্রেরি" onPress={() => router.push("/library")} />
              <IconBtn icon="notifications-outline" label="নোটিফিকেশন" onPress={() => router.push("/notifications")} badge={unread} />
              <Pressable
                onPress={() => router.push(isAuthenticated ? "/profile" : "/login")}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.navy, alignItems: "center", justifyContent: "center", overflow: "hidden" }}
              >
                {avatar ? (
                  <Image source={{ uri: avatar }} style={{ width: 36, height: 36 }} contentFit="cover" />
                ) : (
                  <Ionicons name="person-outline" size={18} color="#fff" />
                )}
              </Pressable>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10, borderWidth: 1, borderColor: c.line, backgroundColor: c.canvas, borderRadius: 4, paddingHorizontal: 14 }}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={submit}
              returnKeyType="search"
              placeholder="কাঙ্ক্ষিত বই খুঁজুন"
              placeholderTextColor={c.subtle}
              style={{ flex: 1, paddingVertical: 9, fontSize: 14, color: c.ink }}
            />
            <Pressable onPress={submit} hitSlop={8}>
              <Ionicons name="search-outline" size={18} color={c.subtle} />
            </Pressable>
          </View>
        </View>

        {/* Hero banner */}
        <Pressable
          onPress={() => goBooks()}
          accessibilityLabel="সব বইয়ে সর্বদা ৬% ছাড় — EB06 কুপন কোড ব্যবহার করুন"
          style={{ alignSelf: "center", width: width - 32, height: (width - 32) / 2.3, marginTop: 14, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}
        >
          <Image source={require("../../../assets/hero-banner.webp")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        </Pressable>

        {/* Categories */}
        {cats.length > 0 && (
          <View style={{ paddingTop: 32, paddingBottom: 12 }}>
            <View style={{ paddingHorizontal: SIDE }}>
              <WebSectionHeader title="ক্যাটাগরি সমূহ" onMore={() => goBooks()} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={(catW + catGap) * 3}
              snapToAlignment="start"
              onScroll={(e) => setCatPage(Math.round(e.nativeEvent.contentOffset.x / ((catW + catGap) * 3)))}
              scrollEventThrottle={32}
              contentContainerStyle={{ paddingHorizontal: SIDE + 4, paddingVertical: 14, gap: catGap }}
            >
              {cats.map((cat) => {
                const img = CATEGORY_IMAGES[cat.name];
                return (
                  <Pressable
                    key={cat.name}
                    onPress={() => goBooks({ category: cat.name })}
                    style={{
                      width: catW,
                      height: 104,
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: c.soft,
                      borderRadius: 12,
                      padding: 6,
                      paddingTop: 8,
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.04)",
                      // web: hard offset shadow 4px 6px
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowOffset: { width: 4, height: 6 },
                      shadowRadius: 0,
                      elevation: 3,
                    }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", backgroundColor: c.surface, alignItems: "center", justifyContent: "center" }}>
                      {img ? (
                        <Image source={img} style={{ width: 40, height: 40 }} contentFit="cover" />
                      ) : (
                        <Ionicons name="book-outline" size={20} color={c.brandStrong} />
                      )}
                    </View>
                    <Txt size={11} bold center numberOfLines={2} style={{ lineHeight: 14 }}>
                      {cat.name}
                    </Txt>
                    <View style={{ marginTop: "auto", borderRadius: 99, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Txt size={9} color="muted" style={{ fontWeight: "600" }}>
                        {bn(cat.booksCount)} টি বই
                      </Txt>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Dots count={catPages} index={catPage} />
          </View>
        )}

        <BookSection title="সকল বই" books={data.featuredBooks} onMore={() => goBooks()} />
        <BookSection title="নতুন প্রকাশিত বই" books={data.latestBooks} onMore={() => goBooks({ sort: "newest" })} />
        <BookSection title="বেস্ট সেলিং বই" books={data.bestSellingBooks} onMore={() => goBooks({ sort: "best-selling" })} />
        <BookSection title="প্রি-অর্ডার" books={data.preOrderBooks} onMore={() => goBooks()} />

        <Footer />
      </ScrollView>
    </Screen>
  );
}
