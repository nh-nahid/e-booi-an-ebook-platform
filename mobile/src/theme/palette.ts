export type AccentId = "teal" | "blue" | "violet" | "rose" | "orange" | "green";

export const ACCENTS: { id: AccentId; label: string; brand: string; strong: string }[] = [
  { id: "teal", label: "টিল", brand: "#2dbdb6", strong: "#1f9d97" },
  { id: "blue", label: "নীল", brand: "#3b82f6", strong: "#2563eb" },
  { id: "violet", label: "বেগুনি", brand: "#8b5cf6", strong: "#7c3aed" },
  { id: "rose", label: "গোলাপি", brand: "#f43f5e", strong: "#e11d48" },
  { id: "orange", label: "কমলা", brand: "#f97316", strong: "#ea580c" },
  { id: "green", label: "সবুজ", brand: "#10b981", strong: "#059669" },
];

export interface Colors {
  canvas: string;
  surface: string;
  soft: string;
  line: string;
  ink: string;
  body: string;
  muted: string;
  subtle: string;
  price: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  onBrand: string;
  navy: string;
  warnSoft: string;
  warnInk: string;
  infoSoft: string;
  infoInk: string;
  successSoft: string;
  successInk: string;
  dangerSoft: string;
  dangerInk: string;
  overlay: string;
}

// Mirrors the website's CSS tokens (frontend/app/globals.css).
const light: Omit<Colors, "brand" | "brandStrong" | "brandSoft"> = {
  canvas: "#f7f9fa",
  surface: "#ffffff",
  soft: "#f1f3f5",
  line: "#e1e5e8",
  ink: "#0a0e2a",
  body: "#374151",
  muted: "#6b7280",
  subtle: "#9aa3af",
  price: "#3368a0",
  onBrand: "#ffffff",
  navy: "#0a0e2a",
  warnSoft: "#fef3c7",
  warnInk: "#92400e",
  infoSoft: "#dbeafe",
  infoInk: "#1e40af",
  successSoft: "#dcfce7",
  successInk: "#166534",
  dangerSoft: "#fee2e2",
  dangerInk: "#991b1b",
  overlay: "rgba(0,0,0,0.4)",
};

const dark: typeof light = {
  canvas: "#0b1020",
  surface: "#121a2e",
  soft: "#1a2440",
  line: "#28334f",
  ink: "#e8edf8",
  body: "#c3cce0",
  muted: "#94a0ba",
  subtle: "#6f7c97",
  price: "#7fb0e6",
  onBrand: "#ffffff",
  navy: "#070b18",
  warnSoft: "#3a2d0c",
  warnInk: "#fcd34d",
  infoSoft: "#14284d",
  infoInk: "#93c5fd",
  successSoft: "#0f2f1c",
  successInk: "#86efac",
  dangerSoft: "#3b1518",
  dangerInk: "#fca5a5",
  overlay: "rgba(0,0,0,0.6)",
};

/** Blend `fg` over `bg` at `alpha` (0..1) — used for the soft brand tint. */
function mix(fg: string, bg: string, alpha: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(fg);
  const [r2, g2, b2] = p(bg);
  const m = (a: number, b: number) => Math.round(a * alpha + b * (1 - alpha));
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(m(r1, r2))}${hex(m(g1, g2))}${hex(m(b1, b2))}`;
}

export function buildColors(isDark: boolean, accent: AccentId): Colors {
  const base = isDark ? dark : light;
  const a = ACCENTS.find((x) => x.id === accent) ?? ACCENTS[0];
  return {
    ...base,
    brand: a.brand,
    brandStrong: a.strong,
    brandSoft: mix(a.brand, base.surface, isDark ? 0.18 : 0.12),
  };
}
