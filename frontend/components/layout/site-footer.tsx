"use client";

import { ChevronDown, Mail, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";

// Android app (EAS build page). Override with NEXT_PUBLIC_APP_DOWNLOAD_URL
// when a newer build or a Play Store link is available.
const APP_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL ||
  "https://expo.dev/accounts/ebooi.bd/projects/ebooi/builds/add930e5-d545-44c3-8258-1598c073f678";

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
    <div className="border-b border-line py-2.5 sm:border-0 sm:py-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left sm:pointer-events-none sm:cursor-default"
      >
        <h4 className="text-xs font-bold text-ink sm:text-sm">{title}</h4>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-ink transition-transform duration-300 sm:hidden ${
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

const EPS_ALT =
  "Pay with Visa, Mastercard, American Express, DBBL Nexus, UnionPay, bKash, Nagad, Rocket, Upay, Cellfin and more. Verified by EPS (Easy Payment System).";

const DESKTOP = "mx-auto h-auto w-full max-w-3xl rounded-lg";
const MOBILE = "mx-auto h-auto w-full max-w-[280px] rounded-lg";

const EPS_STRIPS = [
  {
    src: "/eps/footer-desktop-light.webp",
    width: 2400,
    height: 123,
    sizes: "768px",
    className: `${DESKTOP} hidden sm:block dark:hidden`,
  },
  {
    src: "/eps/footer-desktop-dark.webp",
    width: 2400,
    height: 123,
    sizes: "768px",
    className: `${DESKTOP} hidden dark:sm:block`,
  },
  {
    src: "/eps/footer-mobile-light.webp",
    width: 1200,
    height: 216,
    sizes: "280px",
    className: `${MOBILE} block sm:hidden dark:hidden`,
  },
  {
    src: "/eps/footer-mobile-dark.webp",
    width: 1200,
    height: 211,
    sizes: "280px",
    className: `${MOBILE} hidden dark:block dark:sm:hidden`,
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line bg-surface px-5 pb-5 pt-7 text-body sm:mt-0 sm:px-10 sm:pb-4 sm:pt-10 lg:px-[60px]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand opacity-[0.10] blur-3xl" />

      <div className="container relative mx-auto grid gap-0 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        <div className="border-b border-line pb-3 sm:border-0 sm:pb-0">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="ebooi Logo"
              width={26}
              height={26}
              className="h-[26px] w-[26px] sm:h-8 sm:w-8"
            />

            <span className="text-base font-extrabold text-ink sm:text-lg">
              eb<span className="text-brand">oo</span>i
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-ink sm:mt-3 sm:text-sm">
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
                  flex h-9 w-9 items-center justify-center rounded-full bg-soft text-muted-ink
                  transition-all duration-200 hover:-translate-y-1 hover:bg-brand hover:text-white
                  sm:h-9 sm:w-9
                "
              >
                <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
              </a>
            ))}
          </div>

          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-fit items-center gap-2 rounded-lg border border-line bg-soft px-3 py-2 text-xs font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand sm:text-sm"
          >
            <Smartphone className="h-4 w-4 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-normal text-muted-ink">
                আমাদের অ্যাপ নামান
              </span>
              Android অ্যাপ ডাউনলোড
            </span>
          </a>
        </div>

        <FooterAccordionItem title="কুইক লিংক">
          <div className="flex flex-col gap-2 pb-2.5 text-xs sm:gap-2.5 sm:pb-0 sm:text-sm">
            <Link
              href="/categories"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              সব ক্যাটাগরি
            </Link>
            <Link
              href="/books"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              টপ বুকস
            </Link>
            <Link
              href="/pre-order"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              প্রি-অর্ডার
            </Link>
            <Link
              href="/offers"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              অফার
            </Link>
          </div>
        </FooterAccordionItem>

        <FooterAccordionItem title="সহায়তা">
          <div className="flex flex-col gap-2 pb-2.5 text-xs sm:gap-2.5 sm:pb-0 sm:text-sm">
            <Link
              href="/support"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              সাপোর্ট সেন্টার
            </Link>
            <Link
              href="/privacy"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              প্রাইভেসি পলিসি
            </Link>
            <Link
              href="/terms"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              শর্তাবলী
            </Link>
            <Link
              href="/refund-policy"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              রিটার্ন ও রিফান্ড পলিসি
            </Link>
            <Link
              href="/about"
              className="w-fit text-muted-ink transition-colors hover:text-brand"
            >
              আমাদের সম্পর্কে
            </Link>
          </div>
        </FooterAccordionItem>

        <FooterAccordionItem title="যোগাযোগের তথ্য">
          <div className="flex flex-col gap-2 pb-1 text-xs text-muted-ink sm:gap-3 sm:pb-0 sm:text-sm">
            <a
              href="mailto:ebooi.bd@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-brand"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-brand sm:h-4 sm:w-4" />
              ebooi.bd@gmail.com
            </a>
            <a
              href="https://wa.me/8801791148655"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-brand"
            >
              <FaWhatsapp className="h-3.5 w-3.5 shrink-0 text-brand sm:h-4 sm:w-4" />
              +880 1791148655
            </a>
          </div>
        </FooterAccordionItem>
      </div>

      {/* EPS payment-gateway badge strip (supplied by EPS for merchant websites).
          EPS ships separate light/dark and desktop/mobile artwork; the variant
          follows the site theme. Only one of the four is displayed at a time
          (the rest are display:none and lazy, so they are not fetched). */}
      <div className="container relative mx-auto mt-4 sm:mt-5">
        {EPS_STRIPS.map((v) => (
          <Image
            key={v.src}
            src={v.src}
            alt={EPS_ALT}
            width={v.width}
            height={v.height}
            sizes={v.sizes}
            loading="lazy"
            className={v.className}
          />
        ))}
      </div>

      <div className="container relative mx-auto mt-4 border-t border-line pt-3 text-center text-[10px] text-subtle sm:mt-4 sm:pt-5 sm:text-[11.5px]">
        © ২০২৬ ebooi. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
