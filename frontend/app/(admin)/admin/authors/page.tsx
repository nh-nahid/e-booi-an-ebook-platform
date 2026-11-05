"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authorApi, type Author } from "@/features/admin/content/api";

const empty: Author = { name: "", tagline: "", bio: "", photo: "", facebook: "", youtube: "", website: "" };

export default function AdminAuthorPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "author"], queryFn: authorApi.get });
  const [form, setForm] = useState<Author>(empty);

  useEffect(() => {
    if (data) setForm({ ...empty, ...data });
  }, [data]);

  const save = useMutation({
    mutationFn: () => authorApi.save(form),
    onSuccess: () => { toast.success("লেখক প্রোফাইল সেভ হয়েছে"); qc.invalidateQueries({ queryKey: ["admin", "author"] }); },
    onError: (e) => toast.error((e as AxiosError<{ message: string }>).response?.data?.message ?? "সেভ হয়নি"),
  });

  const field = (key: keyof Author, label: string, multiline = false) => (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {multiline ? (
        <textarea
          rows={6}
          value={form[key] ?? ""}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
      ) : (
        <input
          value={form[key] ?? ""}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
      )}
    </label>
  );

  if (isLoading) return <p className="text-sm text-muted-ink">লোড হচ্ছে…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">লেখক প্রোফাইল</h1>
        <p className="text-sm text-muted-ink">eBooi-তে একজন লেখকের বই বিক্রি হয় — তাঁর পরিচিতি এখানে সম্পাদনা করুন।</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5"
      >
        {field("name", "লেখকের নাম")}
        {field("tagline", "সংক্ষিপ্ত পরিচয় (যেমন: লেখক ও বক্তা)")}
        {field("bio", "জীবনী", true)}
        {field("photo", "ছবির লিংক (URL)")}
        {form.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.photo} alt="" className="h-24 w-24 rounded-full object-cover" />
        )}
        {field("facebook", "Facebook লিংক")}
        {field("youtube", "YouTube লিংক")}
        {field("website", "ওয়েবসাইট")}
        <button
          disabled={save.isPending || !form.name.trim()}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {save.isPending ? "সেভ হচ্ছে…" : "সেভ করুন"}
        </button>
      </form>
    </div>
  );
}
