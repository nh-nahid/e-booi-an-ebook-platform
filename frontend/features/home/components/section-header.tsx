import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href = "#" }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <span className="inline-block rounded-2xl bg-[#E6F7F6] px-4 py-1.5 text-base font-bold text-[#0A0E2A] sm:text-lg">
        {title}
      </span>

      <Link
        href={href}
        className="group flex items-center gap-1 text-sm font-semibold text-[#2DBDB6] transition-colors hover:text-[#1f9d97]"
      >
        সব দেখুন
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
