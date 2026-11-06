import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "অফলাইন | ebooi" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-extrabold text-ink">ইন্টারনেট সংযোগ নেই</h1>
      <p className="max-w-sm text-sm text-muted-ink">
        সংযোগ ফিরে এলে আবার চেষ্টা করুন। ebooi-তে আপনার বইগুলো নিরাপদ আছে।
      </p>
      <Link href="/" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white">
        আবার চেষ্টা করুন
      </Link>
    </main>
  );
}
