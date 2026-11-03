import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";
import { avatarUri } from "@/lib/avatar";
import { errorMessage } from "@/lib/format";
import { LoginPrompt } from "@/components/login-prompt";
import { Button, Input, Screen, Txt } from "@/components/ui";

export default function EditProfile() {
  const { c } = useTheme();
  const { user, isAuthenticated, reloadProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);

  if (!isAuthenticated) return <LoginPrompt title="প্রোফাইল" hint="লগইন করুন।" />;

  const uri = avatarUri(user?.avatar);

  const save = async () => {
    if (name.trim().length < 3) return Alert.alert("নাম কমপক্ষে ৩ অক্ষর হতে হবে");
    setBusy(true);
    try {
      await api.patch("/users/profile", { name: name.trim(), phone: phone.trim(), bio: bio.trim() });
      await reloadProfile();
      Alert.alert("সংরক্ষিত", "প্রোফাইল আপডেট হয়েছে।", [{ text: "ঠিক আছে", onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert("ত্রুটি", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (res.canceled || !res.assets[0]) return;
    const asset = res.assets[0];

    const form = new FormData();
    form.append("avatar", {
      uri: asset.uri,
      name: asset.fileName ?? "avatar.jpg",
      type: asset.mimeType ?? "image/jpeg",
    } as unknown as Blob);

    setAvatarBusy(true);
    try {
      await api.patch("/users/profile/avatar", form, { headers: { "Content-Type": "multipart/form-data" } });
      await reloadProfile();
    } catch (e) {
      Alert.alert("ছবি আপলোড হয়নি", errorMessage(e));
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={pickAvatar} style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.navy, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
          {uri ? (
            <Image source={{ uri }} style={{ width: 96, height: 96 }} contentFit="cover" />
          ) : (
            <Txt size={36} bold style={{ color: "#fff" }}>
              {(user?.name ?? "?").trim().charAt(0).toUpperCase()}
            </Txt>
          )}
        </Pressable>
        <Button title="ছবি পরিবর্তন" variant="ghost" small loading={avatarBusy} onPress={pickAvatar} />
      </View>

      <Input label="নাম" icon="person-outline" value={name} onChangeText={setName} />
      <Input label="ইমেইল" icon="mail-outline" value={user?.email} editable={false} style={{ opacity: 0.6 }} />
      <Input label="মোবাইল নম্বর" icon="call-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="সংক্ষিপ্ত পরিচিতি" value={bio} onChangeText={setBio} multiline style={{ minHeight: 70, textAlignVertical: "top" }} />
      <Button title="সংরক্ষণ করুন" loading={busy} onPress={save} />
    </Screen>
  );
}
