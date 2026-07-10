export default function UsersLoading() {
  const shimmer =
    "relative overflow-hidden bg-[#EEF1F2] before:absolute before:inset-0 " +
    "before:-translate-x-full before:animate-[shimmer_1.5s_infinite] " +
    "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <div className={`h-7 w-56 rounded-full ${shimmer}`} />
          <div className={`h-4 w-72 rounded-full ${shimmer}`} />
        </div>
        <div className={`h-10 w-40 rounded-full ${shimmer}`} />
      </div>

      <div className={`h-16 rounded-2xl border border-[#E1E5E8] ${shimmer}`} />

      <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`h-12 rounded-xl ${shimmer}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
