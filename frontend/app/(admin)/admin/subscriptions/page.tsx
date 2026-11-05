"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categoriesApi, plansApi, subsApi, type Plan } from "@/features/admin/content/api";

const errMsg = (e: unknown) =>
  (e as AxiosError<{ message: string }>).response?.data?.message ?? "কিছু একটা সমস্যা হয়েছে";
const fmt = (d: string) => new Date(d).toLocaleDateString("bn-BD");
const input = "w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand";

export default function AdminSubscriptionsPage() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const { data: plans = [] } = useQuery({ queryKey: ["admin", "plans"], queryFn: plansApi.list });
  const { data: cats = [] } = useQuery({ queryKey: ["admin", "categories"], queryFn: categoriesApi.list });
  const { data: subs = [] } = useQuery({ queryKey: ["admin", "subs"], queryFn: subsApi.list });

  const blank = { name: "", price: "", durationDays: "30", description: "", scope: "all" as "all" | "categories", categories: [] as string[] };
  const [form, setForm] = useState(blank);
  const create = useMutation({
    mutationFn: () =>
      plansApi.create({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        scope: form.scope,
        categories: form.scope === "categories" ? form.categories : [],
      }),
    onSuccess: () => {
      setForm(blank);
      toast.success("প্ল্যান তৈরি হয়েছে");
      refresh();
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  const run = (fn: () => Promise<unknown>, ok: string) =>
    fn().then(() => { toast.success(ok); refresh(); }).catch((e) => toast.error(errMsg(e)));

  const [grant, setGrant] = useState({ email: "", planId: "", days: "" });
  const grantSub = async () => {
    try {
      const { api } = await import("@/services/api/api");
      const { data } = await api.get("/admin/users", { params: { search: grant.email, limit: 5 } });
      const user = (data.data as { _id: string; email: string }[]).find(
        (u) => u.email.toLowerCase() === grant.email.trim().toLowerCase(),
      );
      if (!user) return toast.error("এই ইমেইলে কোনো ইউজার নেই");
      await subsApi.grant({ userId: user._id, planId: grant.planId, days: grant.days ? Number(grant.days) : undefined });
      toast.success("সাবস্ক্রিপশন দেওয়া হয়েছে");
      setGrant({ email: "", planId: "", days: "" });
      refresh();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  const togglePlan = (p: Plan) => run(() => plansApi.update(p._id, { isActive: !p.isActive }), p.isActive ? "নিষ্ক্রিয় করা হয়েছে" : "সক্রিয় করা হয়েছে");
  const removePlan = (p: Plan) => confirm(`"${p.name}" ডিলিট করবেন?`) && run(() => plansApi.remove(p._id), "ডিলিট হয়েছে");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">সাবস্ক্রিপশন</h1>
        <p className="text-sm text-muted-ink">প্ল্যান অনুযায়ী ইউজার সব বই অথবা নির্বাচিত সিরিজের বই পড়তে পারবে। আলাদা করে একক বইও কেনা যায়।</p>
      </div>

      {/* Plans */}
      <section className="space-y-3">
        <h2 className="font-bold text-ink">প্ল্যান</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
          className="grid gap-2 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <input className={input} placeholder="প্ল্যানের নাম (যেমন: মাসিক)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={input} type="number" min={0} placeholder="দাম (৳)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className={input} type="number" min={1} placeholder="মেয়াদ (দিন)" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
          <button
            disabled={create.isPending || !form.name.trim() || form.price === "" || (form.scope === "categories" && form.categories.length === 0)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> যোগ
          </button>
          <input className={`${input} sm:col-span-4`} placeholder="বিবরণ (ঐচ্ছিক)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="space-y-2 sm:col-span-4">
            <select className={input} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as "all" | "categories" })}>
              <option value="all">সব বই আনলক করবে</option>
              <option value="categories">শুধু নির্বাচিত সিরিজ/ক্যাটেগরির বই</option>
            </select>
            {form.scope === "categories" && (
              <div className="flex flex-wrap gap-2">
                {cats.map((c) => {
                  const on = form.categories.includes(c.name);
                  return (
                    <button
                      type="button"
                      key={c._id}
                      onClick={() => setForm({ ...form, categories: on ? form.categories.filter((n) => n !== c.name) : [...form.categories, c.name] })}
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${on ? "border-brand bg-brand-soft text-ink" : "border-line text-muted-ink"}`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        <div className="rounded-2xl border border-line bg-surface">
          {plans.length === 0 && <p className="p-5 text-sm text-muted-ink">কোনো প্ল্যান নেই।</p>}
          {plans.map((p) => (
            <div key={p._id} className="flex items-center gap-3 border-b border-soft px-4 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {p.name} — ৳{p.price} / {p.durationDays} দিন
                </p>
                <p className="text-xs text-muted-ink">{p.scope === "all" ? "সব বই" : p.categories.join(", ")}</p>
                <p className="text-xs text-muted-ink">সক্রিয় সাবস্ক্রাইবার: {p.activeSubscribers ?? 0}</p>
              </div>
              <button
                onClick={() => togglePlan(p)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${p.isActive ? "bg-success-soft text-success-ink" : "bg-canvas text-muted-ink"}`}
              >
                {p.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </button>
              <button onClick={() => removePlan(p)} className="rounded-lg p-2 text-danger-ink hover:bg-danger-soft" aria-label="ডিলিট">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Manual grant */}
      <section className="space-y-3">
        <h2 className="font-bold text-ink">ইউজারকে সাবস্ক্রিপশন দিন</h2>
        <div className="grid gap-2 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[2fr_2fr_1fr_auto]">
          <input className={input} placeholder="ইউজারের ইমেইল" value={grant.email} onChange={(e) => setGrant({ ...grant, email: e.target.value })} />
          <select className={input} value={grant.planId} onChange={(e) => setGrant({ ...grant, planId: e.target.value })}>
            <option value="">প্ল্যান বাছাই করুন</option>
            {plans.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input className={input} type="number" min={1} placeholder="দিন (ঐচ্ছিক)" value={grant.days} onChange={(e) => setGrant({ ...grant, days: e.target.value })} />
          <button onClick={grantSub} disabled={!grant.email || !grant.planId} className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            দিন
          </button>
        </div>
      </section>

      {/* All subscriptions */}
      <section className="space-y-3">
        <h2 className="font-bold text-ink">সব সাবস্ক্রিপশন</h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-ink">
              <tr>
                <th className="p-3">ইউজার</th><th className="p-3">প্ল্যান</th><th className="p-3">মেয়াদ</th><th className="p-3">অবস্থা</th><th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 && <tr><td colSpan={5} className="p-5 text-muted-ink">কোনো সাবস্ক্রিপশন নেই।</td></tr>}
              {subs.map((s) => {
                const expired = new Date(s.expiresAt) < new Date();
                const state = s.status === "revoked" ? "বাতিল" : expired ? "মেয়াদ শেষ" : "সক্রিয়";
                return (
                  <tr key={s._id} className="border-t border-soft">
                    <td className="p-3"><p className="font-semibold text-ink">{s.user?.name ?? "—"}</p><p className="text-xs text-muted-ink">{s.user?.email}</p></td>
                    <td className="p-3">{s.planName} <span className="text-xs text-muted-ink">({s.source === "admin" ? "অ্যাডমিন" : "কেনা"})</span></td>
                    <td className="p-3 text-xs">{fmt(s.startsAt)} → {fmt(s.expiresAt)}</td>
                    <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${state === "সক্রিয়" ? "bg-success-soft text-success-ink" : "bg-danger-soft text-danger-ink"}`}>{state}</span></td>
                    <td className="space-x-2 p-3 text-right">
                      <button onClick={() => { const d = prompt("কত দিন বাড়াবেন?", "30"); if (d) run(() => subsApi.extend(s._id, Number(d)), "মেয়াদ বাড়ানো হয়েছে"); }} className="text-xs font-bold text-brand">মেয়াদ বাড়ান</button>
                      {s.status === "active" && !expired && (
                        <button onClick={() => confirm("সাবস্ক্রিপশন বাতিল করবেন?") && run(() => subsApi.revoke(s._id), "বাতিল হয়েছে")} className="text-xs font-bold text-danger-ink">বাতিল</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
