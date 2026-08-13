import { ShieldCheck, Truck, BookOpenCheck, Headphones } from "lucide-react";

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
  return (
    <section className="container mx-auto px-5 py-8 sm:px-10 lg:px-[60px]">
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#E1E5E8] bg-white p-5 sm:gap-6 sm:p-6 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            style={{ animationDelay: `${i * 0.06}s` }}
            className="
              flex animate-in fade-in slide-in-from-bottom-1 flex-col items-center gap-2
              rounded-2xl p-3 text-center duration-500 fill-mode-both transition-colors
              hover:bg-[#F7F9FA] sm:flex-row sm:items-start sm:text-left
            "
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F7F6]">
              <Icon className="h-5 w-5 text-[#2DBDB6]" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#0A0E2A]">{title}</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
