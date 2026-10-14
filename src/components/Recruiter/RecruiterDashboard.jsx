import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive,
  BriefcaseBusiness,
  Pencil,
  Plus,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { getRecruiterJobs, saveRecruiterJobs } from '../../utils/recruiterStorage'
import RecruiterShell from './RecruiterShell'
import SummaryCard from './SummaryCard'
import { primaryButtonClass, secondaryButtonClass } from './recruiterStyles'

function getApplicationId(application) {
  return application.id ?? application._id ?? application.email
}

function getRecentApplications(jobs) {
  return jobs
    .flatMap((job) => (job.applications ?? []).map((application) => ({
      ...application,
      jobId: job.id,
      jobTitle: job.title,
    })))
    .sort((first, second) => new Date(second.appliedAt ?? 0) - new Date(first.appliedAt ?? 0))
    .slice(0, 5)
}

function RecruiterDashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(getRecruiterJobs)
  const [selectedJobId, setSelectedJobId] = useState('')
  const [error, setError] = useState('')
  const activeJobs = jobs.filter((job) => !job.archived)
  const applicationCount = jobs.reduce((total, job) => total + (job.applications?.length ?? 0), 0)
  const shortlistedCount = jobs.reduce(
    (total, job) => total + (job.applications ?? []).filter((application) => application.shortlisted).length,
    0,
  )
  const archivedJobs = jobs.filter((job) => job.archived)
  const recentApplications = getRecentApplications(jobs)

  function updateJobs(nextJobs) {
    try {
      saveRecruiterJobs(nextJobs)
      setJobs(nextJobs)
      setError('')
    } catch {
      setError('Could not save the job update in this browser. Check available storage and try again.')
    }
  }

  function toggleShortlist(jobId, applicationId) {
    updateJobs(jobs.map((job) => job.id !== jobId ? job : {
      ...job,
      applications: (job.applications ?? []).map((application) => getApplicationId(application) !== applicationId
        ? application
        : { ...application, shortlisted: !application.shortlisted }),
    }))
  }

  return (
    <RecruiterShell title="Recruiter dashboard" subtitle="Manage your job posts and review candidate activity.">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.length} />
        <SummaryCard icon={UsersRound} label="Applications" value={applicationCount} />
        <SummaryCard icon={UsersRound} label="Shortlisted" value={shortlistedCount} />
        <SummaryCard icon={Archive} label="Archived jobs" value={archivedJobs.length} />
      </div>

      <RecentApplications applications={recentApplications} onToggleShortlist={toggleShortlist} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Your job posts</h2>
        <button className={primaryButtonClass} type="button" onClick={() => navigate('/recruiter/jobs/new')}>
          <Plus className="h-4 w-4" />Post a job
        </button>
      </div>
      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {activeJobs.length === 0 ? (
        <EmptyJobsState onCreate={() => navigate('/recruiter/jobs/new')} />
      ) : (
        <div className="space-y-3">
          {activeJobs.map((job) => (
            <JobPost
              key={job.id}
              job={job}
              selected={selectedJobId === job.id}
              onEdit={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
              onArchive={() => updateJobs(jobs.map((item) => item.id === job.id ? { ...item, archived: true } : item))}
              onToggleApplications={() => setSelectedJobId(selectedJobId === job.id ? '' : job.id)}
              onToggleShortlist={toggleShortlist}
            />
          ))}
        </div>
      )}
      <ArchivedJobs jobs={archivedJobs} onRestore={(jobId) => updateJobs(jobs.map((job) => job.id === jobId ? { ...job, archived: false } : job))} />
    </RecruiterShell>
  )
}

function RecentApplications({ applications, onToggleShortlist }) {
  return (
    <section className="mb-7 rounded-xl border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="recent-applications-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold" id="recent-applications-heading">Recent applications</h2>
        <span className="text-sm text-slate-600">{applications.length} shown</span>
      </div>
      {applications.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">Applicant records will appear here when application data is connected.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-y border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-3 font-semibold">Applicant</th>
                <th className="px-3 py-3 font-semibold">Job title</th>
                <th className="px-3 py-3 font-semibold">Applied on</th>
                <th className="px-3 py-3 font-semibold">Experience</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr className="border-b border-slate-100 last:border-0" key={`${application.jobId}-${getApplicationId(application)}`}>
                  <td className="px-3 py-3">
                    <p className="font-semibold">{application.fullName || 'Candidate'}</p>
                    <p className="text-xs text-slate-500">{application.email}</p>
                  </td>
                  <td className="px-3 py-3">{application.jobTitle}</td>
                  <td className="px-3 py-3">{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : '—'}</td>
                  <td className="px-3 py-3">{application.experience || '—'}</td>
                  <td className="px-3 py-3">{application.shortlisted ? 'Shortlisted' : application.status || 'New'}</td>
                  <td className="px-3 py-3">
                    <button
                      className={application.shortlisted ? primaryButtonClass : secondaryButtonClass}
                      type="button"
                      onClick={() => onToggleShortlist(application.jobId, getApplicationId(application))}
                    >
                      {application.shortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function EmptyJobsState({ onCreate }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <BriefcaseBusiness className="mx-auto h-8 w-8 text-blue-600" />
      <h3 className="mt-3 font-semibold">No active jobs yet</h3>
      <p className="mt-1 text-sm text-slate-600">Create a job post to start organizing your hiring pipeline.</p>
      <button className={`${primaryButtonClass} mt-5`} type="button" onClick={onCreate}>
        <Plus className="h-4 w-4" />Create job post
      </button>
    </div>
  )
}

function JobPost({ job, selected, onEdit, onArchive, onToggleApplications, onToggleShortlist }) {
  const applications = job.applications ?? []
  const topCandidate = [...applications]
    .filter((application) => Number.isFinite(Number(application.matchScore)))
    .sort((first, second) => Number(second.matchScore) - Number(first.matchScore))[0]

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.location} · {job.employmentType}</p>
          <p className="mt-2 text-xs text-slate-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={secondaryButtonClass} type="button" onClick={onEdit}><Pencil className="h-4 w-4" />Edit</button>
          <button className={secondaryButtonClass} type="button" onClick={onToggleApplications}>
            <UsersRound className="h-4 w-4" />Applications ({applications.length})
          </button>
          <button className={secondaryButtonClass} type="button" onClick={onArchive}><Archive className="h-4 w-4" />Archive</button>
        </div>
      </div>
      {selected && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold">Applicants</h4>
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
              <span className="inline-flex items-center gap-1.5 font-semibold"><Sparkles className="h-4 w-4" />Top candidate</span>
              <p className="mt-1">{topCandidate ? `${topCandidate.fullName} · ${topCandidate.matchScore}% match` : 'Candidate recommendations will appear when application data is connected.'}</p>
            </div>
          </div>
          {applications.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No applicant records are connected to this job yet.</p>
          ) : (
            <div className="space-y-2">
              {applications.map((application) => (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3" key={getApplicationId(application)}>
                  <div>
                    <p className="font-semibold">{application.fullName}</p>
                    <p className="text-sm text-slate-600">{application.email}</p>
                  </div>
                  <button
                    className={application.shortlisted ? primaryButtonClass : secondaryButtonClass}
                    type="button"
                    onClick={() => onToggleShortlist(job.id, getApplicationId(application))}
                  >
                    {application.shortlisted ? 'Shortlisted' : 'Shortlist'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function ArchivedJobs({ jobs, onRestore }) {
  if (jobs.length === 0) return null

  return (
    <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-700">Archived jobs ({jobs.length})</summary>
      <ul className="mt-3 space-y-2">
        {jobs.map((job) => (
          <li className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm" key={job.id}>
            <span>{job.title}</span>
            <button className={secondaryButtonClass} type="button" onClick={() => onRestore(job.id)}>Restore</button>
          </li>
        ))}
      </ul>
    </details>
  )
}

export default RecruiterDashboard
