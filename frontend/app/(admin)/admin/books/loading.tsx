export default function BooksLoading() {
  const shimmer =
    "relative overflow-hidden bg-[#EEF1F2] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className={`h-8 w-52 rounded-lg ${shimmer}`} />
          <div className={`mt-3 h-4 w-80 rounded-lg ${shimmer}`} />
        </div>

        <div className={`h-11 w-40 rounded-xl ${shimmer}`} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className={`h-11 flex-1 rounded-xl ${shimmer}`} />
        <div className={`h-11 w-full rounded-xl md:w-48 ${shimmer}`} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E1E5E8] bg-white">
        {/* Table Header */}
        <div className="border-b border-[#E1E5E8] px-6 py-5">
          <div className={`h-5 w-40 rounded ${shimmer}`} />
          <div className={`mt-2 h-4 w-64 rounded ${shimmer}`} />
        </div>

        {/* Column Headings */}
        <div className="grid grid-cols-10 gap-4 border-b border-[#E1E5E8] bg-[#F8FAFB] px-6 py-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded ${shimmer}`}
            />
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#EEF1F2]">
          {Array.from({ length: 6 }).map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-10 items-center gap-4 px-6 py-5"
            >
              {/* Cover */}
              <div className={`h-20 w-14 rounded-lg ${shimmer}`} />

              {/* Title */}
              <div>
                <div className={`h-4 w-36 rounded ${shimmer}`} />
                <div className={`mt-2 h-3 w-20 rounded ${shimmer}`} />
              </div>

              {/* Author */}
              <div className={`h-4 w-28 rounded ${shimmer}`} />

              {/* Category */}
              <div className={`h-7 w-24 rounded-full ${shimmer}`} />

              {/* Type */}
              <div className={`h-7 w-20 rounded-full ${shimmer}`} />

              {/* Price */}
              <div className={`h-4 w-16 rounded ${shimmer}`} />

              {/* Stock */}
              <div className={`h-4 w-10 rounded ${shimmer}`} />

              {/* Rating */}
              <div>
                <div className={`h-4 w-12 rounded ${shimmer}`} />
                <div className={`mt-2 h-3 w-10 rounded ${shimmer}`} />
              </div>

              {/* Status */}
              <div className={`h-7 w-24 rounded-full ${shimmer}`} />

              {/* Actions */}
              <div className="flex gap-2">
                <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#E1E5E8] px-6 py-4">
          <div className={`h-4 w-44 rounded ${shimmer}`} />

          <div className="flex gap-2">
            <div className={`h-9 w-20 rounded-lg ${shimmer}`} />
            <div className={`h-9 w-10 rounded-lg ${shimmer}`} />
            <div className={`h-9 w-20 rounded-lg ${shimmer}`} />
          </div>
        </div>
      </div>
    </div>
  );
}