export const ACCENT_STORAGE_KEY = "ebooi-accent";

export const ACCENTS = [
  { id: "teal", label: "টিল", color: "#2dbdb6" },
  { id: "blue", label: "নীল", color: "#3b82f6" },
  { id: "violet", label: "বেগুনি", color: "#8b5cf6" },
  { id: "rose", label: "গোলাপি", color: "#f43f5e" },
  { id: "orange", label: "কমলা", color: "#f97316" },
  { id: "green", label: "সবুজ", color: "#10b981" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

export const DEFAULT_ACCENT: AccentId = "teal";

export function isAccent(v: unknown): v is AccentId {
  return ACCENTS.some((a) => a.id === v);
}

/** Runs before hydration (inline in <head>) so there is no colour flash. */
export const ACCENT_INIT_SCRIPT = `(function(){try{var a=localStorage.getItem("${ACCENT_STORAGE_KEY}");if(a&&a!=="teal"){document.documentElement.setAttribute("data-accent",a)}}catch(e){}})();`;
