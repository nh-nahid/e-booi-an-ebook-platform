interface BookAboutProps {
  description: string;
}

export default function BookAbout({ description }: BookAboutProps) {
  if (!description) return null;

  return (
    <section className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:80ms]">
      <h2 className="mb-3 text-lg font-extrabold text-[#0A0E2A]">বই সম্পর্কে</h2>
      <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-[#6B7280]">
        {description}
      </p>
    </section>
  );
}
