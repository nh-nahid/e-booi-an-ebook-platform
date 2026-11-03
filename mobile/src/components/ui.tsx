import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

import { useTheme } from "@/theme/ThemeProvider";
import type { Colors } from "@/theme/palette";

/* --------------------------------- Text --------------------------------- */

interface TxtProps {
  children?: React.ReactNode;
  size?: number;
  bold?: boolean;
  color?: keyof Colors;
  center?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export function Txt({ children, size = 14, bold, color = "ink", center, style, ...rest }: TxtProps) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { fontSize: size, color: c[color], fontWeight: bold ? "700" : "400" },
        center && { textAlign: "center" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/* -------------------------------- Screens ------------------------------- */

export function Screen({
  children,
  scroll,
  edges = ["top"],
  padded = true,
  refreshControl,
  footer,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  padded?: boolean;
  refreshControl?: React.ReactElement<any>;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const pad = padded ? { padding: 16 } : null;
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.canvas }}>
      {scroll ? (
        <ScrollView
          refreshControl={refreshControl}
          contentContainerStyle={[pad, { paddingBottom: 32 }, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: c.surface,
          borderColor: c.line,
          borderWidth: 1,
          borderRadius: 14,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* -------------------------------- Buttons ------------------------------- */

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  small,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger" | "dark";
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const palette = {
    primary: { bg: c.brand, fg: c.onBrand, border: c.brand },
    dark: { bg: c.navy, fg: "#ffffff", border: c.navy },
    outline: { bg: "transparent", fg: c.ink, border: c.line },
    ghost: { bg: "transparent", fg: c.brand, border: "transparent" },
    danger: { bg: c.dangerSoft, fg: c.dangerInk, border: c.dangerSoft },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: off ? 0.55 : pressed ? 0.85 : 1,
          paddingVertical: small ? 8 : 13,
          paddingHorizontal: small ? 14 : 18,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={small ? 15 : 18} color={palette.fg} />}
          <Text style={{ color: palette.fg, fontWeight: "700", fontSize: small ? 13 : 15 }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  color,
  size = 22,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  size?: number;
  badge?: number;
}) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ padding: 6 }}>
      <Ionicons name={name} size={size} color={color ?? c.ink} />
      {!!badge && (
        <View style={[styles.badge, { backgroundColor: c.brand }]}>
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
            {badge > 9 ? "9+" : badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/* --------------------------------- Input -------------------------------- */

export function Input({
  label,
  error,
  icon,
  secure,
  ...rest
}: TextInputProps & {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
}) {
  const { c } = useTheme();
  const [hidden, setHidden] = useState(!!secure);
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      {label && (
        <Text style={{ color: c.body, fontWeight: "600", fontSize: 13, marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: c.surface,
            borderColor: error ? c.dangerInk : focus ? c.brand : c.line,
          },
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={c.subtle} />}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={c.subtle}
          onFocus={(e) => {
            setFocus(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            rest.onBlur?.(e);
          }}
          style={[{ flex: 1, color: c.ink, fontSize: 15, paddingVertical: 12 }, rest.style]}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={18} color={c.subtle} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={{ color: c.dangerInk, fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
}

/* ------------------------------- Feedback ------------------------------- */

export function Loading() {
  const { c } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={c.brand} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={44} color="#9aa3af" />
      <Txt color="muted" center style={{ marginVertical: 10 }}>
        {message ?? "ডেটা আনতে সমস্যা হয়েছে।"}
      </Txt>
      {onRetry && <Button title="আবার চেষ্টা করুন" variant="outline" small onPress={onRetry} />}
    </View>
  );
}

export function Empty({
  icon,
  title,
  hint,
  action,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.emptyIcon, { backgroundColor: c.brandSoft }]}>
        <Ionicons name={icon} size={34} color={c.brand} />
      </View>
      <Txt bold size={16} center style={{ marginTop: 12 }}>
        {title}
      </Txt>
      {!!hint && (
        <Txt color="muted" center style={{ marginTop: 4, marginBottom: 14 }}>
          {hint}
        </Txt>
      )}
      {action}
    </View>
  );
}

export function SectionHeader({
  title,
  onMore,
}: {
  title: string;
  onMore?: () => void;
}) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: c.brand }} />
        <Txt bold size={17}>
          {title}
        </Txt>
      </View>
      {onMore && (
        <Pressable onPress={onMore} hitSlop={8}>
          <Txt color="brand" bold size={13}>
            সব দেখুন
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={value >= i ? "star" : value >= i - 0.5 ? "star-half" : "star-outline"}
          size={size}
          color="#f59e0b"
        />
      ))}
    </View>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? c.brand : c.line,
        backgroundColor: active ? c.brandSoft : c.surface,
      }}
    >
      <Text style={{ color: active ? c.brand : c.body, fontWeight: "600", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warn" | "danger" | "info";
}) {
  const { c } = useTheme();
  const map = {
    success: [c.successSoft, c.successInk],
    warn: [c.warnSoft, c.warnInk],
    danger: [c.dangerSoft, c.dangerInk],
    info: [c.infoSoft, c.infoInk],
  }[tone];
  return (
    <View style={{ backgroundColor: map[0], paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 }}>
      <Text style={{ color: map[1], fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
});
