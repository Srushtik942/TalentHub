import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Icon({ name, className = 'h-4 w-4' }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'search') return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
  if (name === 'bell') return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>
  if (name === 'bookmark') return <svg {...common}><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" /></svg>
  if (name === 'pin') return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></svg>
  if (name === 'chevron') return <svg {...common}><path d="m7 10 5 5 5-5" /></svg>
  if (name === 'filter') return <svg {...common}><path d="M4 6h16M7 12h10m-7 6h4" /></svg>
  return null
}

function CheckOption({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700">
      <input className="h-4 w-4 rounded border-slate-300 accent-blue-600" type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function formatDate(createdAt){
  const date = new Date(createdAt);

  return date.toLocaleDateString('en-IN',{
    day:'numeric',
    month:'short',
    year: 'numeric'
  })
}

const Dashboard = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState([])
  const [employment, setEmployment] = useState([])
  const [salaryMin, setSalaryMin] = useState(0)
  const [salaryMax, setSalaryMax] = useState(50)
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Most Recent')
  const [saved, setSaved] = useState([])
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [jobs,setJobs] = useState([]);

  const locations = [...new Set(jobs.map((job) => job.location).filter(Boolean))]
  const experienceOptions = [...new Set(jobs.map((job) => job.experience).filter(Boolean).map(String))]
  const employmentOptions = [...new Set([
    'full-time',
  'part-time',
  'internship',
  'contract',
    ...jobs.map((job) => job.employmentType).filter(Boolean),
  ])]

console.log("employmentOptions",employmentOptions)

useEffect(() => {
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response", response);

    const data = await response.json();
    console.log("data",data);
    // setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
      const recruiterJobs = data.jobs.filter((job) => job.isExternal === false);
    console.log("data", recruiterJobs );
    // console.log("jobs",recruiterJobs?.jobs);

    setJobs(recruiterJobs);
  };

  fetchJobs();
}, []);


let filteredJobs = jobs.filter((job) => {
  const query = search.trim().toLowerCase()

  const matchesSearch =
    !query ||
    `${job.title} ${job.companyName} ${job.location}`
      .toLowerCase()
      .includes(query)

  const matchesLocation =
    !location || job.location === location

  const matchesExperience =
    experience.length === 0 ||
    experience.includes(String(job.experience))

  const matchesEmployment =
    employment.length === 0 || employment.includes(job.employmentType)

  const matchesSalary =
    job.salaryMax >= salaryMin * 100000 &&
    job.salaryMin <= salaryMax * 100000

  const matchesRemote =
    !remoteOnly || job.workMode === "remote"

  return (
    matchesSearch &&
    matchesLocation &&
    matchesExperience &&
    matchesEmployment &&
    matchesSalary &&
    matchesRemote
  )
})


if (sortBy === 'Salary: High to Low') {
  filteredJobs = [...filteredJobs].sort(
    (a, b) => b.salaryMax - a.salaryMax
  )
} else if (sortBy === 'Salary: Low to High') {
  filteredJobs = [...filteredJobs].sort(
    (a, b) => a.salaryMin - b.salaryMin
  )
} else {
  filteredJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}


  const pageSize = 4
  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function clearFilters() {
    setSearch('')
    setLocation('')
    setExperience([])
    setEmployment([])
    setSalaryMin(0)
    setSalaryMax(50)
    setRemoteOnly(false)
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] font-sans text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <a className="flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-slate-900" href="/dashboard" aria-label="TalentHub home">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">T</span>
            <span className="hidden sm:inline">TalentHub</span>
          </a>

          <label className="relative mx-auto flex w-full max-w-[420px] items-center">
            <Icon name="search" className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
            <input className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search jobs, companies..." aria-label="Search jobs and companies" />
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" type="button" aria-label="Notifications">
              <Icon name="bell" className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-[#e9eef8] text-xs font-bold text-slate-700 ring-2 ring-white" type="button" aria-label="Profile">AS</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] lg:flex">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} border-b border-slate-200 bg-white px-5 py-5 lg:block lg:min-h-[calc(100vh-66px)] lg:w-[252px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold">Filters</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700" type="button" onClick={clearFilters}>Clear all</button>
          </div>

          <label className="mb-5 block text-xs font-semibold text-slate-800">Location
            <span className="relative mt-2 block">
              <select className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-normal text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={location} onChange={(event) => { setLocation(event.target.value); setPage(1) }}>
                <option value="">Select location</option>
                {locations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <Icon name="chevron" className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-500" />
            </span>
          </label>

          <fieldset className="mb-5 space-y-2.5">
            <legend className="mb-3 text-xs font-semibold text-slate-800">Experience</legend>
            {experienceOptions.map((item) => <CheckOption key={item} label={item} checked={experience.includes(item)} onChange={() => { setExperience((current) => toggleValue(current, item)); setPage(1) }} />)}
          </fieldset>

          <fieldset className="mb-6">
            <legend className="mb-3 text-xs font-semibold text-slate-800">Salary Range</legend>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] text-slate-500"><span className="w-7">From</span><input className="h-1.5 w-full cursor-pointer accent-blue-600" type="range" min="0" max="50" value={salaryMin} onChange={(event) => setSalaryMin(Math.min(Number(event.target.value), salaryMax))} aria-label="Minimum salary in LPA" /></label>
              <label className="flex items-center gap-2 text-[11px] text-slate-500"><span className="w-7">To</span><input className="h-1.5 w-full cursor-pointer accent-blue-600" type="range" min="0" max="50" value={salaryMax} onChange={(event) => setSalaryMax(Math.max(Number(event.target.value), salaryMin))} aria-label="Maximum salary in LPA" /></label>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>₹{salaryMin} LPA</span><span>₹{salaryMax} LPA{salaryMax === 50 ? '+' : ''}</span></div>
          </fieldset>

          <fieldset className="mb-6 space-y-2.5">
            <legend className="mb-3 text-xs font-semibold text-slate-800">Employment Type</legend>
            {employmentOptions.map((item) => <CheckOption key={item} label={item} checked={employment.includes(item)} onChange={() => { setEmployment((current) => toggleValue(current, item)); setPage(1) }} />)}
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold text-slate-800">Remote</legend>
            <CheckOption label="Remote only" checked={remoteOnly} onChange={() => { setRemoteOnly((current) => !current); setPage(1) }} />
          </fieldset>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7" aria-label="Available jobs">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 lg:hidden" type="button" onClick={() => setFiltersOpen((open) => !open)} aria-label="Toggle filters" aria-expanded={filtersOpen}><Icon name="filter" /></button>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">All Jobs</h1>
                <p className="mt-0.5 text-xs text-slate-500">{filteredJobs.length.toLocaleString()} jobs found</p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600">Sort by:
              <span className="relative">
                <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option>Most Recent</option><option>Salary: High to Low</option><option>Salary: Low to High</option>
                </select>
                <Icon name="chevron" className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-500" />
              </span>
            </label>
          </div>

          <div className="space-y-3">
            {visibleJobs.map((job, index) => (
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-blue-200 hover:shadow-sm sm:px-5 sm:py-4" key={job.id}>
                <div className="flex items-start gap-3.5">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold text-white ${job.color}`}>{job.mark}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-slate-900">{job.title}</h2>
                        <p className="mt-1 text-xs text-slate-600">{job.companyName}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {index === 0 && currentPage === 1 && <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">New</span>}
                        <button className={`grid h-8 w-8 place-items-center rounded-md transition hover:bg-slate-100 ${saved.includes(job.id) ? 'text-blue-600' : 'text-slate-500'}`} type="button" onClick={() => setSaved((current) => toggleValue(current, job.id))} aria-label={saved.includes(job.id) ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} aria-pressed={saved.includes(job.id)}><Icon name="bookmark" className="h-[18px] w-[18px]" /></button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-600 sm:gap-x-6">
<span className="flex items-center gap-1.5">
  <span className="text-sm leading-none">₹</span>
  {job.salaryMin / 100000} - {job.salaryMax / 100000} LPA
</span>                      <span className="flex items-center gap-1.5"><span aria-hidden="true">◷</span>{job.experience} years</span>
                      <span className="flex items-center gap-1.5"><Icon name="pin" className="h-3.5 w-3.5" />{job.location}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{job.employmentType}</span>
                      <span className="flex items-center gap-1.5">  Posted {formatDate(job.createdAt)}</span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="rounded-md bg-[#2878c7] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f65a8]" type="button" onClick={() => navigate('/login')}>Apply</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {visibleJobs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h2 className="text-sm font-semibold text-slate-800">No jobs match these filters</h2><p className="mt-1 text-xs text-slate-500">Try changing your search or clearing the filters.</p><button className="mt-4 text-xs font-semibold text-blue-600 hover:underline" type="button" onClick={clearFilters}>Clear all filters</button></div>}
          </div>

          {filteredJobs.length > 0 && <nav className="mt-6 flex items-center justify-center gap-1.5" aria-label="Job result pages">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40" type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page">‹</button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold ${pageNumber === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`} key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={pageNumber === currentPage ? 'page' : undefined}>{pageNumber}</button>)}
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40" type="button" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} aria-label="Next page">›</button>
          </nav>}
        </section>
      </div>
    </main>
  )
}

export default Dashboard
