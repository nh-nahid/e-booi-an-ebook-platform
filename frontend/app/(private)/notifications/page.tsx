"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, CreditCard, Megaphone, Package, Trash2 } from "lucide-react";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/use-auth";
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications";
import type { AppNotification } from "@/features/notifications/types/notification.types";

const ICONS = { order: Package, payment: CreditCard, announcement: Megaphone };

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "এইমাত্র";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m.toLocaleString("bn-BD")} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h.toLocaleString("bn-BD")} ঘণ্টা আগে`;
  const d = Math.floor(h / 24);
  return `${d.toLocaleString("bn-BD")} দিন আগে`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useNotifications(!!user);
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const remove = useDeleteNotification();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loading />;

  const items = data?.data ?? [];
  const unread = data?.unread ?? 0;

  const open = (n: AppNotification) => {
    if (!n.isRead) markRead.mutate(n._id);
    if (n.link) router.push(n.link);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-6 sm:py-10">
        <div className="mb-4 flex items-center justify-between border-b border-line-strong pb-3">
          <h1 className="text-lg font-bold text-ink">নোটিফিকেশন</h1>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              className="flex items-center gap-1 text-xs font-semibold text-brand-strong hover:underline"
            >
              <CheckCheck className="h-4 w-4" /> সব পড়া হয়েছে
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center text-muted-ink">
            <Bell className="h-10 w-10" />
            <p className="font-semibold text-ink">কোনো নোটিফিকেশন নেই</p>
            <p className="text-sm">নতুন অফার ও অর্ডারের আপডেট এখানে দেখা যাবে।</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => {
              const Icon = ICONS[n.type] ?? Bell;
              return (
                <li
                  key={n._id}
                  className={`flex items-start gap-3 rounded border border-line p-3 ${
                    n.isRead ? "bg-surface" : "bg-brand-soft"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => open(n)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-brand-strong">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink">{n.title}</span>
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand" />}
                      </span>
                      {n.message && <span className="block text-xs text-body">{n.message}</span>}
                      <span className="mt-1 block text-[11px] text-subtle">{timeAgo(n.createdAt)}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove.mutate(n._id)}
                    aria-label="মুছুন"
                    className="shrink-0 text-subtle hover:text-danger-ink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
