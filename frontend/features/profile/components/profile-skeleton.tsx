export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-canvas">

      <div className="container mx-auto px-4 py-6 lg:px-[60px]">

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">


          {/* Profile Card Skeleton */}
          <div
            className="
              rounded-3xl border border-line
              bg-surface p-6
              shadow-[0_10px_30px_rgba(10,14,42,0.06)]
            "
          >

            <div className="flex flex-col items-center">

              <div className="h-24 w-24 animate-pulse rounded-full bg-line" />

              <div className="mt-5 h-5 w-32 animate-pulse rounded bg-line" />

              <div className="mt-2 h-4 w-44 animate-pulse rounded bg-line" />

            </div>


            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="h-20 animate-pulse rounded-2xl bg-soft" />

              <div className="h-20 animate-pulse rounded-2xl bg-soft" />

            </div>


          </div>



          {/* Forms Skeleton */}
          <div className="space-y-6">


            <div
              className="
                rounded-3xl border border-line
                bg-surface p-6
              "
            >

              <div className="h-6 w-36 animate-pulse rounded bg-line" />


              <div className="mt-6 space-y-4">

                <div className="h-11 animate-pulse rounded-xl bg-soft" />

                <div className="h-11 animate-pulse rounded-xl bg-soft" />

                <div className="h-24 animate-pulse rounded-xl bg-soft" />

                <div className="h-11 animate-pulse rounded-full bg-line" />

              </div>

            </div>



            <div
              className="
                h-64 rounded-3xl
                border border-line
                bg-surface
              "
            />

          </div>


        </div>

      </div>

    </div>
  );
}