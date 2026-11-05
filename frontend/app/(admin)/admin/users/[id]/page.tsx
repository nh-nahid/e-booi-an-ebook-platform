"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/services/api/api";
import { subsApi, userContentApi } from "@/features/admin/content/api";

const VIA = { purchase: "কেনা", grant: "অ্যাডমিন দিয়েছে", subscription: "সাবস্ক্রিপশন" } as const;
const fmt = (d: string) => new Date(d).toLocaleDateString("bn-BD");

export default function AdminUserContentPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const key = ["admin", "user-content", id];
  const { data, isLoading, isError } = useQuery({ queryKey: key, queryFn: () => userContentApi.get(id) });
  const { data: allBooks = [] } = useQuery({
    queryKey: ["admin", "all-books"],
    queryFn: async () => {
      const { data } = await api.get("/books", { params: { limit: 500 } });
      return data.data.books as { _id: string; title: string }[];
    },
  });
  const [bookId, setBookId] = useState("");

  const run = (fn: () => Promise<unknown>, ok: string) =>
    fn()
      .then(() => { toast.success(ok); qc.invalidateQueries({ queryKey: key }); })
      .catch((e) => toast.error((e as AxiosError<{ message: string }>).response?.data?.message ?? "সমস্যা হয়েছে"));

  if (isLoading) return <p className="text-sm text-muted-ink">লোড হচ্ছে…</p>;
  if (isError || !data) return <p className="text-sm text-danger-ink">লোড করা যায়নি।</p>;

  const owned = new Set(data.books.map((b) => b._id));

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-ink hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> ইউজার তালিকা
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{data.user.name} — কন্টেন্ট</h1>
        <p className="text-sm text-muted-ink">{data.user.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-bold text-ink">লাইব্রেরির বই ({data.books.length})</h2>
        <div className="rounded-2xl border border-line bg-surface">
          {data.books.length === 0 && <p className="p-5 text-sm text-muted-ink">কোনো বই নেই।</p>}
          {data.books.map((b) => (
            <div key={b._id} className="flex items-center gap-3 border-b border-soft px-4 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{b.title}</p>
                <p className="text-xs text-muted-ink">{VIA[b.via]}</p>
              </div>
              <button
                onClick={() => confirm(`"${b.title}" ইউজারের লাইব্রেরি থেকে সরাবেন?`) && run(() => userContentApi.revoke(id, b._id), "অ্যাক্সেস সরানো হয়েছে")}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-danger-ink hover:bg-danger-soft"
              >
                অ্যাক্সেস সরান
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 rounded-2xl border border-line bg-surface p-4">
          <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink">
            <option value="">বই বাছাই করে অ্যাক্সেস দিন</option>
            {allBooks.filter((b) => !owned.has(b._id)).map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
          </select>
          <button
            disabled={!bookId}
            onClick={() => run(() => userContentApi.grant(id, bookId), "অ্যাক্সেস দেওয়া হয়েছে").then(() => setBookId(""))}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            অ্যাক্সেস দিন
          </button>
        </div>
      </section>

      {data.revokedBooks.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-ink">সরানো বই</h2>
          <div className="rounded-2xl border border-line bg-surface">
            {data.revokedBooks.map((b) => (
              <div key={b._id} className="flex items-center gap-3 border-b border-soft px-4 py-3 last:border-0">
                <p className="min-w-0 flex-1 truncate text-ink">{b.title}</p>
                <button onClick={() => run(() => userContentApi.grant(id, b._id), "ফিরিয়ে দেওয়া হয়েছে")} className="text-xs font-bold text-brand">ফিরিয়ে দিন</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-bold text-ink">সাবস্ক্রিপশন</h2>
        <div className="rounded-2xl border border-line bg-surface">
          {data.subscriptions.length === 0 && <p className="p-5 text-sm text-muted-ink">কোনো সাবস্ক্রিপশন নেই।</p>}
          {data.subscriptions.map((s) => {
            const live = s.status === "active" && new Date(s.expiresAt) > new Date();
            return (
              <div key={s._id} className="flex items-center gap-3 border-b border-soft px-4 py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{s.planName}</p>
                  <p className="text-xs text-muted-ink">{fmt(s.startsAt)} → {fmt(s.expiresAt)} · {live ? "সক্রিয়" : s.status === "revoked" ? "বাতিল" : "মেয়াদ শেষ"}</p>
                </div>
                {live && (
                  <button onClick={() => confirm("সাবস্ক্রিপশন বাতিল করবেন?") && run(() => subsApi.revoke(s._id), "বাতিল হয়েছে")} className="text-xs font-bold text-danger-ink">
                    বাতিল করুন
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
