import type { ReactNode } from "react";

// Contact details shown on every policy page. Keep in sync with the footer.
export const CONTACT = {
  siteName: "ই-বই (ebooi)",
  domain: "ebooi.bd",
  email: "ebooi.bd@gmail.com",
  phoneDisplay: "+880 1791148655",
  whatsappUrl: "https://wa.me/8801791148655",
};

export const LAST_UPDATED = "৩০ অক্টোবর ২০২৬";

export function LegalPage({
  title,
  intro,
  showUpdated = true,
  children,
}: {
  title: string;
  intro?: string;
  showUpdated?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[60vh] bg-canvas py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-9">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h1>
          {showUpdated && (
            <p className="mt-1.5 text-xs text-muted-ink">
              সর্বশেষ হালনাগাদ: {LAST_UPDATED}
            </p>
          )}
          {intro && (
            <p className="mt-4 text-sm leading-7 text-body sm:text-[15px]">
              {intro}
            </p>
          )}
          <div className="mt-6 space-y-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2.5 border-l-4 border-brand pl-3 text-base font-bold text-ink sm:text-lg">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-body sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function Points({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-brand">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ContactBlock() {
  return (
    <div className="rounded-xl bg-brand-soft p-4 text-sm leading-7 text-ink">
      <p>
        ইমেইল:{" "}
        <a className="font-semibold underline" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
      </p>
      <p>
        হোয়াটসঅ্যাপ:{" "}
        <a
          className="font-semibold underline"
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONTACT.phoneDisplay}
        </a>
      </p>
      <p>ওয়েবসাইট: {CONTACT.domain}</p>
    </div>
  );
}
