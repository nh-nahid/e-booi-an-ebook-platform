export default function AdminLoading() {
  const shimmer =
    "relative overflow-hidden rounded-md bg-[#EEF1F2] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent";

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#E1E5E8] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className={`h-3 w-24 ${shimmer}`} />
                <div className={`h-8 w-20 ${shimmer}`} />
              </div>

              <div
                className={`h-11 w-11 rounded-xl bg-[#EEF1F2] ${shimmer}`}
              />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className={`h-5 w-14 rounded-full ${shimmer}`} />
              <div className={`h-3 w-20 ${shimmer}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Sales Chart */}
        <div className="rounded-2xl border border-[#E1E5E8] bg-white p-6">
          <div className={`mb-6 h-5 w-36 ${shimmer}`} />

          <div className="flex h-64 items-end justify-between gap-3">
            {[40, 65, 50, 90, 75, 110, 70].map((height, index) => (
              <div
                key={index}
                className={`w-full rounded-t-lg ${shimmer}`}
                style={{ height }}
              />
            ))}
          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-2xl border border-[#E1E5E8] bg-white p-6">
          <div className={`mb-6 h-5 w-28 ${shimmer}`} />

          <div className="mx-auto mt-4 h-44 w-44 rounded-full border-[18px] border-[#EEF1F2]" />

          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <div className={`h-3 w-24 ${shimmer}`} />
                <div className={`h-3 w-10 ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Latest Users */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E1E5E8] bg-white p-6 lg:col-span-2">
          <div className={`mb-6 h-5 w-40 ${shimmer}`} />

          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <div className="space-y-2">
                  <div className={`h-4 w-40 ${shimmer}`} />
                  <div className={`h-3 w-28 ${shimmer}`} />
                </div>

                <div className={`h-6 w-20 rounded-full ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E1E5E8] bg-white p-6">
          <div className={`mb-6 h-5 w-28 ${shimmer}`} />

          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <div
                  className={`h-10 w-10 rounded-full bg-[#EEF1F2] ${shimmer}`}
                />

                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-28 ${shimmer}`} />
                  <div className={`h-3 w-36 ${shimmer}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Books */}
      <div className="rounded-2xl border border-[#E1E5E8] bg-white p-6">
        <div className={`mb-6 h-5 w-36 ${shimmer}`} />

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className={`h-4 w-44 ${shimmer}`} />
                <div className={`h-3 w-24 ${shimmer}`} />
              </div>

              <div className={`h-5 w-12 ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}