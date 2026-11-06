"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Footer "app download" button that installs the PWA (one tap on Android/desktop Chrome,
 *  short instructions on iPhone/Safari). Hidden once the site already runs as an installed app. */
export default function InstallAppButton({ apkUrl }: { apkUrl?: string }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const install = async () => {
    if (!evt) return setHelp((v) => !v);
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setEvt(null);
  };

  return (
    <div className="mt-1 flex flex-col gap-1.5">
      <button
        type="button"
        onClick={install}
        className="flex w-fit items-center gap-2.5 rounded-lg border border-line bg-soft px-3 py-2 text-left font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand"
      >
        <Image src="/logo.jpeg" alt="ebooi অ্যাপ" width={32} height={32} className="h-8 w-8 shrink-0 rounded-md" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-normal text-muted-ink">আমাদের অ্যাপ নামান</span>
          অ্যাপ ইনস্টল করুন
        </span>
      </button>

      {help && (
        <p className="max-w-[260px] text-[11px] leading-snug text-muted-ink">
          {ios
            ? "Safari-তে Share (⬆︎) বাটনে চাপুন → \"Add to Home Screen\" বেছে নিন।"
            : "ব্রাউজারের মেনু (⋮) থেকে \"Install app\" বা \"Add to Home screen\" বেছে নিন।"}
        </p>
      )}

      {apkUrl && (
        <a href={apkUrl} target="_blank" rel="noopener noreferrer" className="w-fit text-[11px] text-muted-ink underline-offset-2 hover:text-brand hover:underline">
          অথবা Android APK ডাউনলোড করুন
        </a>
      )}
    </div>
  );
}
