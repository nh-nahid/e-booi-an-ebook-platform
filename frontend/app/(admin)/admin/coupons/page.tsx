"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/services/api/api";

interface Coupon {
  _id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minimumAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  allowedEmails: string[];
}

interface FormState {
  code: string;
  type: "fixed" | "percentage";
  value: string;
  minimumAmount: string;
  usageLimit: string;
  expiryDate: string; // yyyy-mm-dd
  isActive: boolean;
  allowedEmails: string; // comma / newline separated
}

const oneYear = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};
const blank = (): FormState => ({
  code: "", type: "percentage", value: "", minimumAmount: "0", usageLimit: "0",
  expiryDate: oneYear(), isActive: true, allowedEmails: "",
});

const errMsg = (e: unknown) =>
  (e as AxiosError<{ message: string }>).response?.data?.message ?? "কিছু একটা সমস্যা হয়েছে";
const input = "w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand";

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => (await api.get<Coupon[]>("/coupons")).data,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] });

  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(blank());

  const open = (c?: Coupon) => {
    setEditing(c ? c._id : "new");
    setForm(
      c
        ? {
            code: c.code, type: c.type, value: String(c.value), minimumAmount: String(c.minimumAmount),
            usageLimit: String(c.usageLimit), expiryDate: c.expiryDate.slice(0, 10), isActive: c.isActive,
            allowedEmails: c.allowedEmails.join("\n"),
          }
        : blank(),
    );
  };

  const save = useMutation({
    mutationFn: () => {
      const body = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minimumAmount: Number(form.minimumAmount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        expiryDate: new Date(`${form.expiryDate}T23:59:59`).toISOString(),
        isActive: form.isActive,
        allowedEmails: form.allowedEmails,
      };
      return editing === "new" ? api.post("/coupons", body) : api.put(`/coupons/${editing}`, body);
    },
    onSuccess: () => { toast.success("কুপন সেভ হয়েছে"); setEditing(null); refresh(); },
    onError: (e) => toast.error(errMsg(e)),
  });

  const toggle = (c: Coupon) =>
    api.put(`/coupons/${c._id}`, { isActive: !c.isActive }).then(refresh).catch((e) => toast.error(errMsg(e)));
  const remove = (c: Coupon) =>
    confirm(`"${c.code}" কুপন ডিলিট করবেন?`) &&
    api.delete(`/coupons/${c._id}`).then(() => { toast.success("ডিলিট হয়েছে"); refresh(); }).catch((e) => toast.error(errMsg(e)));

  const valid = form.code.trim() && form.value !== "" && Number(form.value) > 0 &&
    (form.type !== "percentage" || Number(form.value) <= 100) && form.expiryDate;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">কুপন</h1>
          <p className="text-sm text-muted-ink">
            কুপন কোড বানান, মেয়াদ ও ব্যবহারের সীমা ঠিক করুন। “অনুমোদিত ইমেইল” দিলে শুধু সেই ইমেইলের ইউজার কুপনটি ব্যবহার করতে পারবে।
          </p>
        </div>
        <button onClick={() => open()} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> নতুন কুপন
        </button>
      </div>

      {editing && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) save.mutate(); }}
          className="space-y-3 rounded-2xl border border-line bg-surface p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editing === "new" ? "নতুন কুপন" : "কুপন এডিট"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-muted-ink"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">কোড</span>
              <input className={`${input} uppercase`} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="EB100" /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">ধরন</span>
              <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FormState["type"] })}>
                <option value="percentage">শতাংশ (%)</option><option value="fixed">নির্দিষ্ট টাকা (৳)</option>
              </select></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">মান {form.type === "percentage" ? "(১–১০০)" : "(৳)"}</span>
              <input className={input} type="number" min={1} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">ন্যূনতম অর্ডার (৳)</span>
              <input className={input} type="number" min={0} value={form.minimumAmount} onChange={(e) => setForm({ ...form, minimumAmount: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">ব্যবহারের সীমা (০ = সীমাহীন)</span>
              <input className={input} type="number" min={0} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-muted-ink">মেয়াদ শেষ</span>
              <input className={input} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-muted-ink">অনুমোদিত ইমেইল (প্রতি লাইনে একটি, ফাঁকা = সবার জন্য)</span>
            <textarea rows={3} className={input} value={form.allowedEmails} onChange={(e) => setForm({ ...form, allowedEmails: e.target.value })} placeholder="user@example.com" />
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> সক্রিয়
          </label>

          <button disabled={!valid || save.isPending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {save.isPending ? "সেভ হচ্ছে…" : "সেভ করুন"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted-ink">
            <tr>
              <th className="p-3">কোড</th><th className="p-3">ছাড়</th><th className="p-3">ন্যূনতম</th>
              <th className="p-3">ব্যবহার</th><th className="p-3">মেয়াদ</th><th className="p-3">অবস্থা</th><th className="p-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="p-5 text-muted-ink">লোড হচ্ছে…</td></tr>}
            {!isLoading && coupons.length === 0 && <tr><td colSpan={7} className="p-5 text-muted-ink">কোনো কুপন নেই।</td></tr>}
            {coupons.map((c) => {
              const expired = new Date(c.expiryDate) < new Date();
              const exhausted = c.usageLimit > 0 && c.usedCount >= c.usageLimit;
              const state = !c.isActive ? "নিষ্ক্রিয়" : expired ? "মেয়াদ শেষ" : exhausted ? "সীমা শেষ" : "সক্রিয়";
              return (
                <tr key={c._id} className="border-t border-soft align-top">
                  <td className="p-3">
                    <p className="font-bold text-ink">{c.code}</p>
                    {c.allowedEmails.length > 0 && (
                      <p className="mt-1 flex items-start gap-1 text-xs text-muted-ink" title={c.allowedEmails.join(", ")}>
                        <Lock className="mt-0.5 h-3 w-3 shrink-0" />
                        {c.allowedEmails.length <= 2 ? c.allowedEmails.join(", ") : `${c.allowedEmails.slice(0, 2).join(", ")} +${c.allowedEmails.length - 2}`}
                      </p>
                    )}
                  </td>
                  <td className="p-3">{c.type === "percentage" ? `${c.value}%` : `৳${c.value}`}</td>
                  <td className="p-3">৳{c.minimumAmount}</td>
                  <td className="p-3">{c.usedCount}{c.usageLimit > 0 ? ` / ${c.usageLimit}` : " / ∞"}</td>
                  <td className="p-3 text-xs">{new Date(c.expiryDate).toLocaleDateString("bn-BD")}</td>
                  <td className="p-3">
                    <button onClick={() => toggle(c)} title="চাপলে সক্রিয়/নিষ্ক্রিয় হবে"
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${state === "সক্রিয়" ? "bg-success-soft text-success-ink" : "bg-danger-soft text-danger-ink"}`}>
                      {state}
                    </button>
                  </td>
                  <td className="space-x-1 p-3 text-right">
                    <button onClick={() => open(c)} className="rounded-lg p-2 text-muted-ink hover:bg-canvas" aria-label="এডিট"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(c)} className="rounded-lg p-2 text-danger-ink hover:bg-danger-soft" aria-label="ডিলিট"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
