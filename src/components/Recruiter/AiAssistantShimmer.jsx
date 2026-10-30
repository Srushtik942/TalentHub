function AiAssistantShimmer() {
  return (
    <div
      className="space-y-3"
      aria-busy="true"
    >
      <span className="sr-only">Analyzing applicants…</span>
      <div aria-hidden="true" className="animate-pulse space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        {[0, 1].map((row) => (
          <div
            className="rounded-lg border border-slate-200 p-3"
            key={row}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiAssistantShimmer;
