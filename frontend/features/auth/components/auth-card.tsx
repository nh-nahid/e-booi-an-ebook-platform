import type { ReactNode } from "react";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Shared shell for the auth screens that sit beside the login form
// (forgot / reset password). Mirrors the login card's look.
export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex min-h-[560px] w-full items-center justify-center p-3 sm:p-6"
      style={{ background: "var(--canvas)" }}
    >
      <Card
        className="relative w-full max-w-md overflow-hidden rounded-3xl border shadow-lg"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface)",
          boxShadow: "0 20px 45px rgba(10,14,42,0.08)",
        }}
      >
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{ width: 160, height: 160, top: -60, right: -60, background: "var(--brand)" }}
        />
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{ width: 140, height: 140, bottom: -50, left: -50, background: "var(--brand)" }}
        />

        <CardHeader className="pb-2 pt-8">
          <div className="mb-4 flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              width={36}
              height={36}
              alt="ebooi logo"
              className="rounded-md"
            />
            <span className="text-lg font-bold" style={{ color: "var(--ink)" }}>
              ebooi
            </span>
          </div>

          <CardTitle className="text-3xl font-bold" style={{ color: "var(--ink)" }}>
            {title}
          </CardTitle>

          {subtitle && <p className="text-sm text-muted-ink">{subtitle}</p>}
        </CardHeader>

        <CardContent className="relative">{children}</CardContent>
      </Card>
    </div>
  );
}
