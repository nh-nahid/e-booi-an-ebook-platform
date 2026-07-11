import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-[#0A0E2A] px-5 pb-8 pt-14 text-[#cfd6e8] sm:px-10 lg:px-[60px]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2DBDB6] opacity-[0.08] blur-3xl" />

      <div className="container relative mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" width={32} height={32} alt="Logo" />
            <span className="text-lg font-extrabold text-white">
              eBoo<span className="text-[#2DBDB6]">i</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#A7B0C8]">
            আপনার প্রিয় বইয়ের সংগ্রহশালা, হাতের মুঠোয়।
          </p>

          <div className="mt-4 flex gap-2">
            {[FaFacebook, FaInstagram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#A7B0C8]
                  transition-all duration-200 hover:-translate-y-1 hover:bg-[#2DBDB6] hover:text-white
                "
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">কুইক লিংক</h4>
          <div className="flex flex-col gap-2.5 text-sm">
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
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">যোগাযোগ</h4>
          <div className="flex flex-col gap-2.5 text-sm">
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
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">যোগাযোগের তথ্য</h4>
          <div className="flex flex-col gap-3 text-sm text-[#A7B0C8]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[#2DBDB6]" />
              support@e-booi.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#2DBDB6]" />
              +880 1728171519
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#2DBDB6]" />
              মেহেরপুর, খুলনা, বাংলাদেশ
            </div>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto mt-10 border-t border-white/10 pt-5 text-center text-[11.5px] text-[#7c86a3]">
        © ২০২৬ eBooi. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
