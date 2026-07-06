export default function Loading() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#2DBDB6]" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Loading...
          </h3>
          <p className="text-sm text-slate-500">
            Please wait while we prepare your page.
          </p>
        </div>
      </div>
    </main>
  );
}