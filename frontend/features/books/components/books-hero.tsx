import { BookOpen } from "lucide-react";

interface BooksHeroProps {
  totalCount?: number;
}

export default function BooksHero({ totalCount }: BooksHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0A0E2A]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2DBDB6] opacity-[0.15] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-[#2DBDB6] opacity-[0.08] blur-3xl" />

      <div className="container relative mx-auto px-5 py-10 sm:px-10 lg:px-[60px] lg:py-14">
        <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#2DBDB6]">
            <BookOpen className="h-3.5 w-3.5" />
            লাইব্রেরি
          </span>

          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            সব বই ঘুরে দেখুন
          </h1>

          <p className="text-sm text-[#A7B0C8] sm:text-base">
            {typeof totalCount === "number"
              ? `${totalCount.toLocaleString()}+ বই আপনার জন্য অপেক্ষা করছে`
              : "আপনার পছন্দের বইটি খুঁজে নিন"}
          </p>
        </div>
      </div>
    </section>
  );
}
