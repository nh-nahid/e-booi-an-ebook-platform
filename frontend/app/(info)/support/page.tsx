import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { CONTACT, LegalPage, Section } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "সাপোর্ট সেন্টার | ই-বই",
  description: "ই-বই-এ কেনাকাটা, পেমেন্ট ও বই পড়া নিয়ে সাধারণ প্রশ্নের উত্তর এবং যোগাযোগের মাধ্যম।",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "বই কেনার পর কীভাবে পড়ব?",
    a: "পেমেন্ট সফল হলে বইটি আপনার 'লাইব্রেরি' পেজে যোগ হয়। লগইন করে লাইব্রেরিতে গিয়ে বইটি খুলে পড়তে পারবেন।",
  },
  {
    q: "কোন কোন মাধ্যমে পেমেন্ট করা যায়?",
    a: "বিকাশ, নগদ, রকেট এবং ভিসা/মাস্টারকার্ডসহ বিভিন্ন কার্ডে নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট করা যায়। সব মূল্য বাংলাদেশি টাকায় (BDT)।",
  },
  {
    q: "পেমেন্ট করেছি, কিন্তু বই লাইব্রেরিতে আসেনি। কী করব?",
    a: "কয়েক মিনিট অপেক্ষা করে পেজটি রিফ্রেশ করুন। তারপরও না এলে অর্ডার আইডি বা ট্রানজ্যাকশন আইডিসহ আমাদের ইমেইল বা হোয়াটসঅ্যাপে জানান। আমরা দ্রুত যাচাই করে সমাধান করে দেব।",
  },
  {
    q: "টাকা কেটে নিয়েছে, কিন্তু অর্ডার ব্যর্থ দেখাচ্ছে।",
    a: "এমন হলে সাধারণত গেটওয়ে কয়েক কর্মদিবসের মধ্যে টাকা ফেরত দেয়। না এলে অর্ডার ও পেমেন্টের তথ্যসহ আমাদের জানান।",
  },
  {
    q: "পাসওয়ার্ড ভুলে গেছি।",
    a: "লগইন পেজে 'পাসওয়ার্ড ভুলে গেছেন' অপশন ব্যবহার করে ইমেইলে রিসেট লিংক নিন।",
  },
  {
    q: "রিফান্ড পাব কি?",
    a: "ডিজিটাল পণ্যের জন্য নির্দিষ্ট কিছু ক্ষেত্রে রিফান্ড দেওয়া হয়। বিস্তারিত রিটার্ন ও রিফান্ড পলিসি পেজে দেখুন।",
  },
];

export default function SupportPage() {
  return (
    <LegalPage
      title="সাপোর্ট সেন্টার"
      showUpdated={false}
      intro="কেনাকাটা, পেমেন্ট বা বই পড়া নিয়ে সমস্যা হলে নিচের সাধারণ প্রশ্নগুলো দেখুন। উত্তর না পেলে সরাসরি আমাদের সাথে যোগাযোগ করুন।"
    >
      <Section title="সরাসরি যোগাযোগ">
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted-ink">ইমেইল</span>
              <span className="block truncate text-sm font-semibold text-ink">
                {CONTACT.email}
              </span>
            </span>
          </a>
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <FaWhatsapp className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted-ink">হোয়াটসঅ্যাপ</span>
              <span className="block text-sm font-semibold text-ink">
                {CONTACT.phoneDisplay}
              </span>
            </span>
          </a>
        </div>
      </Section>

      <Section title="সাধারণ প্রশ্ন ও উত্তর">
        <div className="divide-y divide-line rounded-xl border border-line">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
                {q}
              </summary>
              <p className="mt-2 text-sm leading-7 text-body">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </LegalPage>
  );
}
