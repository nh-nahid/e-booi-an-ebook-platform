import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-line bg-surface px-6 py-16 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded bg-brand-soft">
        <ShoppingCart className="h-9 w-9 text-brand" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-ink">আপনার কার্ট খালি</h2>
      <p className="mt-1.5 max-w-xs text-sm text-muted-ink">
        মনে হচ্ছে আপনি এখনও কোনো বই যোগ করেননি। চলুন কিছু ভালো বই খুঁজে দেখি।
      </p>

      <Link
        href="/books"
        className="
          group relative mt-6 flex items-center gap-2 overflow-hidden rounded border-0
          bg-gradient-to-br from-brand to-brand-strong px-6 py-3 text-sm font-bold text-white
          shadow-[0_4px_12px_rgba(45,189,182,0.35)] transition-transform duration-150
          hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
          active:translate-y-0 active:scale-[0.98]
        "
      >
        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
        <span className="relative flex items-center gap-2">
          বই ব্রাউজ করুন
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
