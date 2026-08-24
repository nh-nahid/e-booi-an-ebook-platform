"use client";

import { ChevronDown, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    Icon: FaFacebook,
    href: "https://www.facebook.com/profile.php?id=61579813011880",
  },
  { Icon: FaWhatsapp, href: "https://wa.me/8801791148655" },
];

// A footer menu column. On mobile it behaves as a tap-to-expand accordion
// (closed by default, to keep the footer short); on desktop (sm+) the
// sm: classes below force it permanently open and the chevron/click affordance
// disappears, so it renders as a normal always-visible column like before.
function FooterAccordionItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-2.5 sm:border-0 sm:py-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left sm:pointer-events-none sm:cursor-default"
      >
        <h4 className="text-xs font-bold text-white sm:text-sm">{title}</h4>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#A7B0C8] transition-transform duration-300 sm:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } mt-2 sm:mt-3 sm:grid-rows-[1fr] sm:opacity-100`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-[#0A0E2A] px-5 pb-5 pt-7 text-[#cfd6e8] sm:mt-0 sm:px-10 sm:pb-4 sm:pt-10 lg:px-[60px]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2DBDB6] opacity-[0.08] blur-3xl" />

      <div className="container relative mx-auto grid gap-0 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        <div className="border-b border-white/10 pb-3 sm:border-0 sm:pb-0">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="ebooi Logo"
              width={26}
              height={26}
              className="h-[26px] w-[26px] sm:h-8 sm:w-8"
            />

            <span className="text-base font-extrabold text-white sm:text-lg">
              eb<span className="text-[#2DBDB6]">oo</span>i
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#A7B0C8] sm:mt-3 sm:text-sm">
            আপনার প্রিয় বইয়ের সংগ্রহশালা, হাতের মুঠোয়।
          </p>

          <div className="mt-2.5 flex gap-2 sm:mt-4">
            {SOCIAL_LINKS.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#A7B0C8]
                  transition-all duration-200 hover:-translate-y-1 hover:bg-[#2DBDB6] hover:text-white
                  sm:h-9 sm:w-9
                "
              >
                <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterAccordionItem title="কুইক লিংক">
          <div className="flex flex-col gap-2 pb-2.5 text-xs sm:gap-2.5 sm:pb-0 sm:text-sm">
            <Link
              href="/categories"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              সব ক্যাটাগরি
            </Link>
            <Link
              href="/books"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              টপ বুকস
            </Link>
            <Link
              href="/pre-order"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              প্রি-অর্ডার
            </Link>
            <Link
              href="/offers"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              অফার
            </Link>
          </div>
        </FooterAccordionItem>

        <FooterAccordionItem title="সহায়তা">
          <div className="flex flex-col gap-2 pb-2.5 text-xs sm:gap-2.5 sm:pb-0 sm:text-sm">
            <Link
              href="/support"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              সাপোর্ট সেন্টার
            </Link>
            <Link
              href="/privacy"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              প্রাইভেসি পলিসি
            </Link>
            <Link
              href="/terms"
              className="w-fit text-[#A7B0C8] transition-colors hover:text-[#2DBDB6]"
            >
              শর্তাবলী
            </Link>
          </div>
        </FooterAccordionItem>

        <FooterAccordionItem title="যোগাযোগের তথ্য">
          <div className="flex flex-col gap-2 pb-1 text-xs text-[#A7B0C8] sm:gap-3 sm:pb-0 sm:text-sm">
            <a
              href="mailto:ebooi.bd@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-[#2DBDB6]"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#2DBDB6] sm:h-4 sm:w-4" />
              ebooi.bd@gmail.com
            </a>
            <a
              href="https://wa.me/8801791148655"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-[#2DBDB6]"
            >
              <FaWhatsapp className="h-3.5 w-3.5 shrink-0 text-[#2DBDB6] sm:h-4 sm:w-4" />
              +880 1791148655
            </a>
          </div>
        </FooterAccordionItem>
      </div>

      <div className="container relative mx-auto mt-4 border-t border-white/10 pt-3 text-center text-[10px] text-[#7c86a3] sm:mt-4 sm:pt-5 sm:text-[11.5px]">
        © ২০২৬ ebooi. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
