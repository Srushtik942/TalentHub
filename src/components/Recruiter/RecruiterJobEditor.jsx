import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecruiterJobs, getRecruiterProfile, saveRecruiterJobs } from '../../utils/recruiterStorage'
import RecruiterError from './RecruiterError'
import RecruiterShell from './RecruiterShell'
import { inputClass, primaryButtonClass, secondaryButtonClass } from './recruiterStyles'

function RecruiterJobEditor() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const currentJob = useMemo(() => getRecruiterJobs().find((job) => job.id === jobId), [jobId])
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => ({
    title: currentJob?.title ?? '',
    location: currentJob?.location ?? '',
    employmentType: currentJob?.employmentType ?? 'Full-time',
    experience: currentJob?.experience ?? '',
    salary: currentJob?.salary ?? '',
    description: currentJob?.description ?? '',
    requiredSkills: currentJob?.requiredSkills ?? '',
  }))

  function changeField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submitJob(event) {
    event.preventDefault()
    try {
      const jobs = getRecruiterJobs()
      const job = {
        ...currentJob,
        ...form,
        id: currentJob?.id ?? (globalThis.crypto?.randomUUID?.() || `${Date.now()}`),
        companyName: getRecruiterProfile().companyName,
        createdAt: currentJob?.createdAt ?? new Date().toISOString(),
        archived: false,
      }
      const updatedJobs = currentJob
        ? jobs.map((item) => item.id === jobId ? job : item)
        : [job, ...jobs]
      saveRecruiterJobs(updatedJobs)
      navigate('/recruiter/dashboard')
    } catch {
      setError('Could not save this job post. Check available browser storage and try again.')
    }
  }

  if (jobId && !currentJob) {
    return <RecruiterError message="The job post could not be found." />
  }

  return (
    <RecruiterShell title={currentJob ? 'Edit job post' : 'Post a job'} subtitle="Add clear details so candidates understand the opportunity.">
      <form className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7" onSubmit={submitJob}>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Job title<input className={inputClass} value={form.title} required onChange={(event) => changeField('title', event.target.value)} /></label>
          <label className="block text-sm font-semibold text-slate-700">Location<input className={inputClass} value={form.location} required onChange={(event) => changeField('location', event.target.value)} /></label>
          <label className="block text-sm font-semibold text-slate-700">Employment type
            <select className={inputClass} value={form.employmentType} onChange={(event) => changeField('employmentType', event.target.value)}>
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700">Experience<input className={inputClass} value={form.experience} placeholder="e.g. 3+ years" onChange={(event) => changeField('experience', event.target.value)} /></label>
          <label className="block text-sm font-semibold text-slate-700">Salary range<input className={inputClass} value={form.salary} placeholder="e.g. ₹8–12 LPA" onChange={(event) => changeField('salary', event.target.value)} /></label>
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Required skills<input className={inputClass} value={form.requiredSkills} placeholder="Separate skills with commas" onChange={(event) => changeField('requiredSkills', event.target.value)} /></label>
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Job description<textarea className={`${inputClass} min-h-40 resize-y`} value={form.description} required onChange={(event) => changeField('description', event.target.value)} /></label>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button className={secondaryButtonClass} type="button" onClick={() => navigate('/recruiter/dashboard')}>Cancel</button>
          <button className={primaryButtonClass} type="submit">{currentJob ? 'Save changes' : 'Publish job'}</button>
        </div>
      </form>
    </RecruiterShell>
  )
}

export default RecruiterJobEditor
