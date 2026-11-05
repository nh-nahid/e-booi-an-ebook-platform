"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categoriesApi, type Category } from "@/features/admin/content/api";

const errMsg = (e: unknown) =>
  (e as AxiosError<{ message: string }>).response?.data?.message ?? "কিছু একটা সমস্যা হয়েছে";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: cats = [], isLoading, isError, error: loadError } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: categoriesApi.list,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });

  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const run = (fn: () => Promise<unknown>, ok: string) =>
    fn().then(() => { toast.success(ok); refresh(); }).catch((e) => toast.error(errMsg(e)));

  const add = useMutation({
    mutationFn: () => categoriesApi.create({ name }),
    onSuccess: () => { setName(""); toast.success("ক্যাটেগরি যোগ হয়েছে"); refresh(); },
    onError: (e) => toast.error(errMsg(e)),
  });

  const move = (i: number, dir: -1 | 1) => {
    const ids = cats.map((c) => c._id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    run(() => categoriesApi.reorder(ids), "ক্রম সেভ হয়েছে");
  };

  const remove = (c: Category) => {
    if (!confirm(`"${c.name}" ক্যাটেগরি ডিলিট করবেন?`)) return;
    run(() => categoriesApi.remove(c._id), "ডিলিট হয়েছে");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">ক্যাটেগরি</h1>
        <p className="text-sm text-muted-ink">
          এখানে যোগ করা ক্যাটেগরিই বই যোগ/এডিট করার সময় ও স্টোরের ফিল্টারে দেখা যাবে। নাম বদলালে সব বইয়ে আপডেট হবে।
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) add.mutate(); }}
        className="flex gap-2 rounded-2xl border border-line bg-surface p-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="নতুন ক্যাটেগরির নাম"
          className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          disabled={add.isPending || !name.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> যোগ করুন
        </button>
      </form>

      <div className="rounded-2xl border border-line bg-surface">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-ink">লোড হচ্ছে…</p>
        ) : isError ? (
          <p className="p-6 text-sm text-danger-ink">ক্যাটেগরি লোড করা যায়নি: {errMsg(loadError)}</p>
        ) : cats.length === 0 ? (
          <p className="p-6 text-sm text-muted-ink">কোনো ক্যাটেগরি নেই।</p>
        ) : (
          cats.map((c, i) => (
            <div key={c._id} className="flex items-center gap-3 border-b border-soft px-4 py-3 last:border-0">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-ink disabled:opacity-30" aria-label="উপরে">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === cats.length - 1} className="text-muted-ink disabled:opacity-30" aria-label="নিচে">
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                {editing === c._id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-line bg-canvas px-2 py-1 text-sm text-ink outline-none focus:border-brand"
                  />
                ) : (
                  <p className="truncate font-semibold text-ink">{c.name}</p>
                )}
                <p className="text-xs text-muted-ink">{c.booksCount}টি বই</p>
              </div>

              {editing === c._id ? (
                <>
                  <button
                    onClick={() =>
                      run(() => categoriesApi.update(c._id, { name: editName }), "নাম বদলানো হয়েছে").then(() => setEditing(null))
                    }
                    className="rounded-lg p-2 text-success-ink hover:bg-success-soft"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted-ink hover:bg-canvas">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setEditing(c._id); setEditName(c.name); }}
                    className="rounded-lg p-2 text-muted-ink hover:bg-canvas"
                    aria-label="এডিট"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(c)} className="rounded-lg p-2 text-danger-ink hover:bg-danger-soft" aria-label="ডিলিট">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
