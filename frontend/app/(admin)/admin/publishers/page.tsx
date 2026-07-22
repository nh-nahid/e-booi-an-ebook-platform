"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, Check, Clock } from "lucide-react";
import Image from "next/image";

// Set your real launch date/time here
const LAUNCH_DATE = new Date("2026-09-01T00:00:00");

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(LAUNCH_DATE));
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft(getTimeLeft(LAUNCH_DATE)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // TODO: wire up to your actual notify-me mutation
      // await subscribeToLaunch(email);
      await new Promise((r) => setTimeout(r, 900));
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="relative -m-6 flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F9FA] -mt-15 px-4 py-16">
      <style>{`
        @keyframes csFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(16px, -18px) scale(1.06); }
        }
        @keyframes csFloatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-14px, 14px) scale(1.04); }
        }
        @keyframes csFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes csPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .cs-blob-a { animation: csFloat 8s ease-in-out infinite; }
        .cs-blob-b { animation: csFloatSlow 10s ease-in-out infinite; }
        .cs-fade { animation: csFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      {/* ambient blobs */}
      <div className="cs-blob-a pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2DBDB6] opacity-[0.14] blur-3xl" />
      <div className="cs-blob-b pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#0A0E2A] opacity-[0.08] blur-3xl" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* logo */}
        <div
          className="cs-fade mb-6 flex items-center gap-2"
          style={{ animationDelay: "0s" }}
        >
          <Image
            src="/logo.jpeg"
            alt="eBooi Logo"
            width={32}
            height={32}
          />

          <span className="text-xl font-extrabold text-[#0A0E2A]">
            eBoo<span className="text-[#2DBDB6]">i</span>
          </span>
        </div>

        {/* badge */}
        <span
          className="cs-fade mb-4 flex items-center gap-1.5 rounded-full bg-[#E6F7F6] px-4 py-1.5 text-xs font-bold text-[#0A0E2A]"
          style={{ animationDelay: "0.05s" }}
        >
          <Clock className="h-3.5 w-3.5 text-[#2DBDB6]" />
          Launching Soon
        </span>

        <h1
          className="cs-fade text-3xl font-extrabold leading-tight text-[#0A0E2A] sm:text-4xl"
          style={{ animationDelay: "0.1s" }}
        >
          Something great is
          <br />
          on its way.
        </h1>

        <p
          className="cs-fade mt-3 max-w-sm text-sm text-[#6B7280] sm:text-base"
          style={{ animationDelay: "0.15s" }}
        >
          We&apos;re putting the final touches on this page. Leave your email
          and we&apos;ll let you know the moment it&apos;s live.
        </p>

        {/* countdown */}
        <div
          className="cs-fade mt-8 grid grid-cols-4 gap-2 sm:gap-3"
          style={{ animationDelay: "0.2s" }}
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex w-16 flex-col items-center rounded-2xl border border-[#E1E5E8] bg-white py-3 shadow-[0_8px_20px_rgba(10,14,42,0.05)] sm:w-20"
            >
              <span
                className="text-xl font-extrabold text-[#0A0E2A] sm:text-2xl"
                style={{ animation: "csPulse 2s ease-in-out infinite" }}
              >
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9AA3AF]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* subscribe form */}
        <div
          className="cs-fade mt-9 w-full"
          style={{ animationDelay: "0.25s" }}
        >
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 rounded-full bg-[#E6F7F6] px-5 py-3 text-sm font-semibold text-[#0A0E2A]">
              <Check className="h-4 w-4 text-[#2DBDB6]" />
              You&apos;re on the list — we&apos;ll email you at launch.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                  style={{ color: focused ? "#2DBDB6" : "#9AA3AF" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-full border pl-10 pr-4 text-sm text-[#0A0E2A] outline-none transition-all duration-200 placeholder:text-[#9AA3AF]"
                  style={{
                    borderColor: focused ? "#2DBDB6" : "#E1E5E8",
                    boxShadow: focused
                      ? "0 0 0 4px rgba(45,189,182,0.15)"
                      : "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  group relative flex h-12 shrink-0 items-center justify-center gap-2
                  overflow-hidden rounded-full border-0 bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
                  px-6 text-sm font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]
                  transition-transform duration-150
                  hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
                  active:translate-y-0 active:scale-[0.98]
                  disabled:opacity-70
                "
              >
                <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>

        <Link
          href="/admin"
          className="cs-fade mt-8 text-xs font-semibold text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
          style={{ animationDelay: "0.3s" }}
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
