"use client";

import { ShieldCheck, Truck, BookOpenCheck, Headphones } from "lucide-react";

import { useInView } from "@/hooks/use-in-view";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "১০০% অরিজিনাল বই",
    desc: "সব বই সরাসরি প্রকাশনী থেকে সংগ্রহ করা",
  },
  {
    icon: Truck,
    title: "দ্রুত ডেলিভারি",
    desc: "সারা দেশে ২৪-৭২ ঘন্টায় পৌঁছে যাবে",
  },
  {
    icon: BookOpenCheck,
    title: "তাৎক্ষণিক eBook",
    desc: "পেমেন্টের সাথে সাথেই লাইব্রেরিতে যোগ হবে",
  },
  {
    icon: Headphones,
    title: "২৪/৭ সাপোর্ট",
    desc: "যেকোনো সমস্যায় আমরা পাশে আছি",
  },
];

export default function TrustSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`
        container mx-auto px-5 py-8 transition-all duration-700 ease-out sm:px-10 lg:px-[60px]
        ${inView ? "opacity-100 translate-y-0" : "translate-y-6 opacity-0"}
      `}
    >
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-surface p-5 sm:gap-6 sm:p-6 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            style={{ animationDelay: inView ? `${i * 0.08}s` : undefined }}
            className={`
              group flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition-colors
              duration-500 fill-mode-both hover:bg-canvas sm:flex-row sm:items-start sm:text-left
              ${inView ? "animate-in fade-in slide-in-from-bottom-1" : "opacity-0"}
            `}
          >
            <span
              className="
                flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft
                transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110
              "
            >
              <Icon className="h-5 w-5 text-brand" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-xs text-muted-ink">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
