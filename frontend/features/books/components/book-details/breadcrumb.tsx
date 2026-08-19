import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 overflow-hidden text-xs text-[#6B7280]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-1.5 ${isLast ? "min-w-0" : ""}`}
          >
            {item.href && !isLast ? (
              <Link href={item.href} className="shrink-0 transition-colors hover:text-[#2DBDB6]">
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "truncate font-semibold text-[#0A0E2A]"
                    : "shrink-0"
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 shrink-0 text-[#9AA3AF]" />}
          </span>
        );
      })}
    </nav>
  );
}
