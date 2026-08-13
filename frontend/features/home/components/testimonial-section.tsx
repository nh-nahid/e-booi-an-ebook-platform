import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
}

// TODO: replace with real reviews (e.g. top-rated recent reviews from your reviews API)
const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "রাফসান আহমেদ",
    comment: "বইটা পড়ে সত্যিই অনেক কিছু শেখা গেছে। লেখার ভাষা সহজ আর গোছানো।",
    rating: 5,
  },
  {
    id: "t2",
    name: "মিতু ইসলাম",
    comment: "প্রিন্ট কোয়ালিটি ভালো, ডেলিভারিও দ্রুত পেয়েছি। আবার অর্ডার করব ইনশাআল্লাহ।",
    rating: 4,
  },
  {
    id: "t3",
    name: "করিম হাসান",
    comment: "eBook গুলো সাথে সাথে লাইব্রেরিতে চলে আসে, খুবই সুবিধাজনক অভিজ্ঞতা।",
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-[#0A0E2A]">
      <div className="container mx-auto px-5 py-12 sm:px-10 lg:px-[60px]">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-bold text-[#2DBDB6]">
            গ্রাহকদের মতামত
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
            পাঠকরা যা বলছেন
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
            return (
              <div
                key={t.id}
                style={{ animationDelay: `${i * 0.08}s` }}
                className="
                  animate-in fade-in slide-in-from-bottom-2 rounded-2xl bg-white/[0.06] p-5
                  duration-500 fill-mode-both transition-colors hover:bg-white/[0.09]
                "
              >
                <Quote className="h-5 w-5 text-[#2DBDB6]" />
                <p className="mt-3 text-sm leading-relaxed text-white/85">{t.comment}</p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2DBDB6] text-xs font-bold text-white">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <div className="mt-0.5 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${
                            idx < t.rating ? "fill-amber-400 text-amber-400" : "fill-white/20 text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
