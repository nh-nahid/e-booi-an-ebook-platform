import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-[#2DBDB6]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-[#0A0E2A]" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 text-[#9AA3AF]" />}
          </span>
        );
      })}
    </nav>
  );
}
