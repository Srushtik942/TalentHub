import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import JobDetailsSkeleton from './JobDetailsSkeleton'

function Icon({ name, className = 'h-4 w-4' }) {
  const base = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

  if (name === 'back') {
    return (
      <svg {...base}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    )
  }

  if (name === 'money') {
    return (
      <svg {...base}>
        <path d="M12 1v22M17 5.5A3.5 3.5 0 0 0 12 3H10.5A3.5 3.5 0 0 0 7 6.5 3.5 3.5 0 0 0 10.5 10H13.5A3.5 3.5 0 0 1 17 13.5 3.5 3.5 0 0 1 13.5 17H11A3.5 3.5 0 0 1 7 13.5" />
      </svg>
    )
  }

  if (name === 'briefcase') {
    return (
      <svg {...base}>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      </svg>
    )
  }

  if (name === 'location') {
    return (
      <svg {...base}>
        <path d="M12 21s6-5.2 6-11A6 6 0 1 0 6 10c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }

  if (name === 'bookmark') {
    return (
      <svg {...base}>
        <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
      </svg>
    )
  }



  if (name === 'star') {
    return (
      <svg {...base}>
        <path d="m12 2.5 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.1l6.2-.9z" />
      </svg>
    )
  }

  return null
}

function JobDetails() {
    const {jobId} = useParams();
    console.log("id",jobId)
  const navigate = useNavigate();
  const [job,setJob] = useState("");
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(()=>{
    const fetchJob = async()=>{
        try{
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/${jobId}`,
                {
                    headers:
                    {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            console.log("response",response)

            if(!response.ok) throw new Error("Job not found");

            const data = await response.json();
            console.log("data",data?.job);
            setJob(data?.job)
        }catch(err){
        setError(err.message);
        }finally{
            setLoading(false);
        }
    }
    fetchJob();
  },[jobId])
 if (loading) return <JobDetailsSkeleton />
if (error || !job) return <p className="p-8 text-sm text-red-600">{error || 'Job not found'}</p>

const skills = (job.requiredSkills ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

  const date = new Date(job?.createdAt);

  const formatDate = date.toLocaleDateString('en-IN',{
    day:'numeric',
    month:'short',
    year:'numeric'
  })


  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      {/* <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d4ed8] text-lg font-bold text-white shadow-sm">
            T
          </div>
          <span className="text-[2rem] font-black tracking-tight text-slate-900">TalentHub</span>
        </div>
      </header> */}

      <main className="w-full px-5 py-7 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-[1.05rem] font-medium text-slate-900 transition hover:text-blue-700"
        >
          <Icon name="back" className="h-5 w-5" />
          <span>Back to jobs</span>
        </button>

        <div className="mt-6 grid gap-7 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0f172a] text-2xl font-bold text-white">
                {job?.companyName?.charAt(0)}
              </div>

              <div className="flex-1">
                <h1 className="text-[2.2rem] font-bold tracking-tight text-slate-900">{job.title}</h1>
                <p className="mt-1 font-semibold text-[1.05rem] text-slate-700">{job.companyName}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-x-6 overflow-x-auto whitespace-nowrap text-sm text-slate-700">
  <span className="inline-flex items-center gap-2">
    <Icon name="money" className="h-4 w-4 text-slate-500" />
    ₹ {job.salaryMin / 100000} - {job.salaryMax / 100000} LPA
  </span>
  <span className="inline-flex items-center gap-2">
    <Icon name="briefcase" className="h-4 w-4 text-slate-500" />
    {job.experience} years
  </span>
  <span className="inline-flex items-center gap-2">
    <Icon name="location" className="h-4 w-4 text-slate-500" />
    {job.location}
  </span>
  <span className="inline-flex items-center gap-2 capitalize">
    <Icon name="star" className="h-4 w-4 text-slate-500" />
    {job.workMode}
  </span>
  <span className="inline-flex items-center gap-2 capitalize">
    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
    {job.employmentType}
  </span>
  <span className="text-slate-600">Posted {formatDate}</span>
</div>

            <div className="mt-8 flex gap-8 border-b border-slate-200 pb-2 text-base font-medium text-slate-500">
              <button type="button" className="border-b-2 border-blue-600 pb-2 text-blue-700">Job Details</button>
              <button type="button" className="pb-2">About Company</button>
              <button type="button" className="pb-2">Reviews</button>
              <button type="button" className="pb-2">Similar Jobs</button>
            </div>

            <div className="mt-8">
              <h2 className="text-[1.1rem] font-semibold text-slate-900">Job Description</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">{job?.jobDescription}</p>
            </div>

            {/* <div className="mt-8">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">Responsibilities</h3>
              <ul className="mt-4 space-y-3 text-base text-slate-700">
                {job.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-slate-800" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="mt-8">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">Skills</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-slate-200 bg-[#f8fbff] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-slate-900">Generate questions related to this position</h3>
                  <p className="mt-1 text-sm text-slate-600">This will use the job description and skills to create interview questions.</p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-[#1d4ed8] py-2 px-1 text-sm font-semibold text-white transition hover:bg-[#1e40af]"
                >
                  Generate Questions
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-[1.1rem] font-semibold text-slate-900">Apply for this job</h2>
              <button
                type="button"
                onClick={() => setApplied((current) => !current)}
                className={`mt-5 w-full rounded-xl px-4 py-3 text-base font-semibold transition ${
                  applied ? 'bg-[#0f172a] text-white hover:bg-[#111827]' : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]'
                }`}
              >
                {applied ? 'Applied' : 'Apply Now'}
              </button>

              <button
                type="button"
                onClick={() => setSaved((current) => !current)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-base font-medium transition ${
                  saved ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon  className="h-4 w-4" />
                {saved ? 'Saved Job' : 'Save Job'}
              </button>
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">Recruiter</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-lg font-bold text-slate-700">
                  {job?.postedBy?.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{job?.postedBy?.fullName}</p>
                  <p className="text-sm text-slate-600">{job?.postedBy?.email}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700 font-semibold">{job?.postedBy?.companyName}</p>
              <button type="button" className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800">
                View Profile
              </button>
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">Similar Jobs</h3>

              {/* <div className="mt-4 space-y-4">
                {job.similarJobs.map((similarJob, index) => (
                  <div key={similarJob.title} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white ${index % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#e2e8f0] text-slate-700'}`}>
                      {similarJob.title.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900">{similarJob.title}</p>
                      <p className="text-sm text-slate-600">{similarJob.company}</p>
                      <p className="text-sm text-slate-500">{similarJob.location}</p>
                    </div>
                  </div>
                ))}
              </div> */}

              <button type="button" className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800">
                View all similar jobs
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default JobDetails
