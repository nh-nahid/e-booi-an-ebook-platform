export default function AdminLoading() {
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

      {/* stat cards row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-[#E1E5E8] bg-white p-5"
          >
            <div className={`h-3 w-20 rounded-full ${shimmer}`} />
            <div className={`mt-3 h-6 w-14 rounded-full ${shimmer}`} />
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className={`h-80 rounded-2xl border border-[#E1E5E8] ${shimmer}`} />
        <div className={`h-80 rounded-2xl border border-[#E1E5E8] ${shimmer}`} />
      </div>

      {/* widgets row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`h-72 rounded-2xl border border-[#E1E5E8] ${shimmer}`}
          />
        ))}
      </div>
    </div>
  );
}
