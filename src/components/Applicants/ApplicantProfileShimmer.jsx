function ApplicantProfileShimmer() {
  return (
    <main
      className="min-h-screen bg-[#edf4ff]"
      aria-busy="true"
      aria-label="Loading applicant profile"
    >
      <div className="min-h-screen w-full">
        <div className="min-h-screen overflow-hidden border border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.12)]">
          <header className="flex flex-col gap-5 border-b border-blue-100 bg-gradient-to-r from-[#eff6ff] to-[#dfeeff] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-blue-200" />
              <div className="space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-blue-200" />
                <div className="h-8 w-56 animate-pulse rounded bg-blue-200" />
              </div>
            </div>
            <div className="h-10 w-full animate-pulse rounded-full bg-blue-200 sm:w-32" />
          </header>

          <div className="flex flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-8 lg:p-8">
            <aside className="space-y-6 rounded-2xl border border-blue-100 bg-[#f8fbff] p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-blue-200" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-blue-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-blue-100" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-10 animate-pulse rounded-xl bg-blue-100" />
                <div className="h-10 animate-pulse rounded-xl bg-blue-100" />
                <div className="h-10 animate-pulse rounded-xl bg-blue-100" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 animate-pulse rounded-xl bg-blue-100" />
                <div className="h-16 animate-pulse rounded-xl bg-blue-100" />
                <div className="h-16 animate-pulse rounded-xl bg-blue-100" />
              </div>
            </aside>

            <section className="space-y-6 rounded-2xl border border-blue-100 bg-white p-5 sm:p-6">
              <div className="space-y-3">
                <div className="h-4 w-20 animate-pulse rounded bg-blue-200" />
                <div className="h-24 animate-pulse rounded-xl bg-blue-100" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-28 animate-pulse rounded bg-blue-200" />
                <div className="flex flex-wrap gap-3">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-blue-100" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-blue-100" />
                  <div className="h-8 w-16 animate-pulse rounded-full bg-blue-100" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ApplicantProfileShimmer;
