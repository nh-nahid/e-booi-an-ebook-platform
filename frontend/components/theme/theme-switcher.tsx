"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ACCENTS,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  isAccent,
  type AccentId,
} from "./accent";

const listeners = new Set<() => void>();

function readAccent(): AccentId {
  try {
    const v = localStorage.getItem(ACCENT_STORAGE_KEY);
    return isAccent(v) ? v : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

function writeAccent(id: AccentId) {
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, id);
  } catch {
    /* storage unavailable — still apply for this session */
  }
  if (id === DEFAULT_ACCENT) {
    document.documentElement.removeAttribute("data-accent");
  } else {
    document.documentElement.setAttribute("data-accent", id);
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const MODES = [
  { id: "light", label: "লাইট", Icon: Sun },
  { id: "dark", label: "ডার্ক", Icon: Moon },
  { id: "system", label: "সিস্টেম", Icon: Monitor },
] as const;

export default function ThemeSwitcher({
  align = "right",
  className,
}: {
  align?: "left" | "right";
  className?: string;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const accent = useSyncExternalStore(subscribe, readAccent, () => DEFAULT_ACCENT);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = mounted ? theme : undefined;
  const TriggerIcon = mounted && resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="থিম পরিবর্তন করুন"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand hover:text-brand"
      >
        <TriggerIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="থিম সেটিংস"
          className={cn(
            "absolute top-full z-50 mt-2 w-64 rounded-xl border border-line bg-surface p-3 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-ink">
            মোড
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-semibold transition-colors",
                  active === id
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line text-body hover:border-brand",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-ink">
            <Palette className="h-3.5 w-3.5" />
            থিম কালার
          </p>
          <div className="grid grid-cols-6 gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                title={a.label}
                aria-label={a.label}
                aria-pressed={accent === a.id}
                onClick={() => writeAccent(a.id)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                  accent === a.id && "ring-2 ring-ink",
                )}
                style={{ background: a.color }}
              >
                {accent === a.id && <Check className="h-4 w-4 text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
