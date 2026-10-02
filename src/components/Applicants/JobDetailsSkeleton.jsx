

export function Bar({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
}

function JobDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <main className="w-full px-5 py-7 sm:px-8 lg:px-10">
        <Bar className="h-5 w-28" />

        <div className="mt-6 grid gap-7 lg:grid-cols-[2fr_1fr]">
          {/* Left card */}
          <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <Bar className="h-16 w-16 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Bar className="h-8 w-2/3" />
                <Bar className="h-4 w-1/3" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-6">
              <Bar className="h-4 w-24" />
              <Bar className="h-4 w-20" />
              <Bar className="h-4 w-32" />
              <Bar className="h-4 w-20" />
              <Bar className="h-4 w-24" />
            </div>

            <div className="mt-8 flex gap-8 border-b border-slate-200 pb-4">
              <Bar className="h-4 w-20" />
              <Bar className="h-4 w-24" />
              <Bar className="h-4 w-16" />
            </div>

            <div className="mt-8 space-y-3">
              <Bar className="h-5 w-40" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-3/4" />
            </div>

            <div className="mt-8 space-y-4">
              <Bar className="h-5 w-24" />
              <div className="flex flex-wrap gap-3">
                {[...Array(5)].map((_, i) => (
                  <Bar key={i} className="h-10 w-24" />
                ))}
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <Bar className="h-5 w-40" />
              <Bar className="mt-5 h-12 w-full rounded-xl" />
              <Bar className="mt-3 h-12 w-full rounded-xl" />
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <Bar className="h-5 w-24" />
              <div className="mt-4 flex items-center gap-3">
                <Bar className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Bar className="h-4 w-1/2" />
                  <Bar className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default JobDetailsSkeleton
