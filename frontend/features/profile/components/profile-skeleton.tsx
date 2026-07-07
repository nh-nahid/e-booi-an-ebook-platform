export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">

      <div className="container mx-auto px-4 py-6 lg:px-[60px]">

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">


          {/* Profile Card Skeleton */}
          <div
            className="
              rounded-3xl border border-[#E1E5E8]
              bg-white p-6
              shadow-[0_10px_30px_rgba(10,14,42,0.06)]
            "
          >

            <div className="flex flex-col items-center">

              <div className="h-24 w-24 animate-pulse rounded-full bg-[#E1E5E8]" />

              <div className="mt-5 h-5 w-32 animate-pulse rounded bg-[#E1E5E8]" />

              <div className="mt-2 h-4 w-44 animate-pulse rounded bg-[#E1E5E8]" />

            </div>


            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="h-20 animate-pulse rounded-2xl bg-[#F1F3F5]" />

              <div className="h-20 animate-pulse rounded-2xl bg-[#F1F3F5]" />

            </div>


          </div>



          {/* Forms Skeleton */}
          <div className="space-y-6">


            <div
              className="
                rounded-3xl border border-[#E1E5E8]
                bg-white p-6
              "
            >

              <div className="h-6 w-36 animate-pulse rounded bg-[#E1E5E8]" />


              <div className="mt-6 space-y-4">

                <div className="h-11 animate-pulse rounded-xl bg-[#F1F3F5]" />

                <div className="h-11 animate-pulse rounded-xl bg-[#F1F3F5]" />

                <div className="h-24 animate-pulse rounded-xl bg-[#F1F3F5]" />

                <div className="h-11 animate-pulse rounded-full bg-[#E1E5E8]" />

              </div>

            </div>



            <div
              className="
                h-64 rounded-3xl
                border border-[#E1E5E8]
                bg-white
              "
            />

          </div>


        </div>

      </div>

    </div>
  );
}