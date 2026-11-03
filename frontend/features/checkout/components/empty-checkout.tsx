import Link from "next/link";
import { PackageOpen, ArrowRight, ShoppingCart } from "lucide-react";

export default function EmptyCheckout() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface px-6 py-20 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft">
        <PackageOpen className="h-9 w-9 text-brand" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-ink">চেকআউট করার মতো কিছু নেই</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-ink">
        আপনার কার্টে এখনও কোনো বই যোগ করা হয়নি। অর্ডার সম্পন্ন করার আগে কিছু বই আপনার
        কার্টে যোগ করুন।
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/books"
          className="
            group relative flex items-center gap-2 overflow-hidden rounded-full border-0
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

        <Link
          href="/cart"
          className="
            flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm
            font-bold text-ink transition-all duration-200
            hover:-translate-y-0.5 hover:border-brand hover:text-brand
          "
        >
          <ShoppingCart className="h-4 w-4" />
          কার্ট দেখুন
        </Link>
      </div>
    </div>
  );
}
