function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
      <div className="min-w-0">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="truncate text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}

export default SummaryCard
