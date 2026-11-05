import React from "react";
import { Image, Linking, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Button, Empty, ErrorState, Loading, Screen, Txt } from "@/components/ui";

interface Author {
  name: string;
  tagline?: string;
  bio?: string;
  photo?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
}

export default function AuthorScreen() {
  const q = useQuery({
    queryKey: ["author"],
    queryFn: async () => (await api.get<{ data: Author | null }>("/store/author")).data.data,
  });

  if (q.isLoading) return <Screen><Loading /></Screen>;
  if (q.isError) return <Screen><ErrorState onRetry={() => q.refetch()} /></Screen>;
  const a = q.data;
  if (!a) return <Screen><Empty icon="person-outline" title="লেখকের পরিচিতি শীঘ্রই যোগ হবে" /></Screen>;

  const links = [
    ["Facebook", a.facebook],
    ["YouTube", a.youtube],
    ["ওয়েবসাইট", a.website],
  ].filter(([, u]) => !!u) as [string, string][];

  return (
    <Screen scroll edges={["bottom"]}>
      <View style={{ alignItems: "center", gap: 10, paddingVertical: 8 }}>
        {!!a.photo && <Image source={{ uri: a.photo }} style={{ width: 120, height: 120, borderRadius: 60 }} />}
        <Txt size={24} bold center>{a.name}</Txt>
        {!!a.tagline && <Txt color="muted" center>{a.tagline}</Txt>}
      </View>
      {!!a.bio && <Txt style={{ lineHeight: 24, marginTop: 8 }}>{a.bio}</Txt>}
      <View style={{ gap: 8, marginTop: 16 }}>
        {links.map(([label, url]) => (
          <Button key={label} title={label} variant="outline" onPress={() => Linking.openURL(url)} />
        ))}
      </View>
    </Screen>
  );
}
