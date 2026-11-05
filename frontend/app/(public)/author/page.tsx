"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/api";

type Author = { name: string; tagline?: string; bio?: string; photo?: string; facebook?: string; youtube?: string; website?: string };

export default function AuthorPage() {
  const { data: author, isLoading } = useQuery({
    queryKey: ["author"],
    queryFn: async () => (await api.get("/store/author")).data.data as Author | null,
  });

  if (isLoading) return <p className="p-10 text-center text-muted-ink">লোড হচ্ছে…</p>;
  if (!author) return <p className="p-10 text-center text-muted-ink">লেখকের পরিচিতি শীঘ্রই যোগ হবে।</p>;

  const links = [
    ["Facebook", author.facebook],
    ["YouTube", author.youtube],
    ["ওয়েবসাইট", author.website],
  ].filter(([, u]) => u) as [string, string][];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        {author.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={author.photo} alt={author.name} className="h-32 w-32 rounded-full object-cover" />
        )}
        <h1 className="text-3xl font-extrabold text-ink">{author.name}</h1>
        {author.tagline && <p className="text-muted-ink">{author.tagline}</p>}
      </div>
      {author.bio && <p className="mt-8 whitespace-pre-line leading-8 text-ink">{author.bio}</p>}
      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">
              {label}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
