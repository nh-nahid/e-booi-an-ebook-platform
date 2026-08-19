import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href = "/books" }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <span
        className="
          inline-block rounded-md bg-gradient-to-r from-[#2DBDB6] to-[#1f9d97] px-3 py-1 text-sm
          font-bold text-white shadow-[0_4px_12px_rgba(45,189,182,0.3)]
          transition-transform duration-300 hover:-translate-y-0.5 sm:text-base
        "
      >
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
