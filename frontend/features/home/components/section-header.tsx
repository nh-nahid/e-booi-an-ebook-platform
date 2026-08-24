import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href = "/books" }: SectionHeaderProps) {
  return (
    <div className="mb-1.5 flex items-center justify-between border-b border-[#B7BEC4] pb-1.5 sm:mb-5 sm:pb-3">
      <span
        className="
          inline-block rounded bg-[#DAF3F0] px-2 py-0.5 text-[11px]
          font-bold text-[#5B6570]
          transition-transform duration-300 hover:-translate-y-0.5 sm:rounded-md sm:px-3 sm:py-1 sm:text-base
        "
      >
        {title}
      </span>

      <Link
        href={href}
        className="group flex items-center gap-0.5 text-xs font-semibold text-[gray] transition-colors hover:text-[#1f9d97] sm:gap-1 sm:text-sm"
      >
        সব দেখুন
        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
      </Link>
    </div>
  );
}
