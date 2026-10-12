
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {setUser} from '../../redux/userSlice';

const normalizeProfile  = (u)=>({
  name: u.fullName || '',
  title: u.title || u.role,
  location : u.location || 'Not Specified',
  email: u.email || '',
  phone: u.phone || '',
  experience: u.experience ?? '0',
  availability: u.availability || 'Open to work',
  summary: u.summary || '',
  skills: Array.isArray(u.skills) ? u.skills : [],
  resume: u.resume || '',

})

const isResumeUrl = (resume) =>
  typeof resume === 'string' && /^(https?:\/\/|\/)/i.test(resume)

function ApplicantProfile() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [draft, setDraft] = useState(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false);
  const[error,setError] = useState(null);
  const [loading,setLoading] = useState(true);
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('');
  const [skillsText, setSkillsText] = useState('')
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => () => {
    if (resumePreviewUrl) URL.revokeObjectURL(resumePreviewUrl)
  }, [resumePreviewUrl])

  useEffect(()=>{
  const fetchProfile = async()=>{
    try{
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_API}/api/applicant/profile`,
              {
                headers:{
                  Authorization: `Bearer ${token}`
                }
              }
            )
            console.log("response",response);

            if(!response.ok) throw new Error("Profile not found");

            const data = await response.json();
            console.log(data);
            dispatch(setUser(data.userData));

            const normalized = normalizeProfile(data.userData);
            setProfile(normalized);
            setDraft(normalized);
            setSkillsText(normalized.skills.join(', '))

    }catch(err){
     setError(err.message);
    }finally{
      setLoading(false);
    }
  }
  fetchProfile();
},[])


  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setResumePreviewUrl(URL.createObjectURL(file))
    setDraft((current) => ({
      ...current,
      resume: file.name,
    }))
    if (!isEditing) {
      setProfile((current) => current ? { ...current, resume: file.name } : current)
    }
    event.target.value = ''
  }

  const handleInputChange = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSkillsChange = (value) => {
    const nextSkills = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    setDraft((current) => ({
      ...current,
      skills: nextSkills,
    }))
  }

  const saveProfile = async() => {
   try{
    setSaving(true);
    setSaveError('');
    if (!userData?._id) throw new Error('User not loaded yet')

    const token = localStorage.getItem('token');

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/applicant/editProfile/${userData._id}`,
      {
        method:'PUT',
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({
           fullName: draft.name,
          email: draft.email,
          experience: Number(draft.experience),
          location: draft.location,
          skills: draft.skills,
          resume: draft.resume,
        })
      }
    )
 const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to update profile')

    dispatch(setUser(data.userData))           // dashboard header updates too
    const normalized = normalizeProfile(data.userData)
    setProfile(normalized)
    setDraft(normalized)
    setSkillsText(normalized.skills.join(', '))
    setIsEditing(false)

   }catch(err){
    setSaveError(err.message);
   }finally{
    setSaving(false);
   }
  }

  const cancelEdit = () => {
    setDraft(profile)
    setSkillsText(profile.skills.join(','))
    setResumePreviewUrl('')
    setIsEditing(false)
  }

    if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#edf4ff]">
        <p className="text-slate-600">Loading profile…</p>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#edf4ff]">
        <p className="text-red-600">{error || 'Something went wrong'}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#edf4ff] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.12)]">
          <header className="flex flex-col gap-5 border-b border-blue-100 bg-gradient-to-r from-[#eff6ff] to-[#dfeeff] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:mt-0"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Applicant profile</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Professional details</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing((open) => !open)}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:w-auto"
            >
              {isEditing ? 'Close editor' : 'Edit details'}
            </button>
          </header>

          <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start lg:gap-8 lg:p-8">
            <aside className="w-full rounded-2xl border border-blue-100 bg-[#f8fbff] p-5 lg:max-w-[320px]">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                  {(profile.name || '?')
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900">{profile.name }</h2>
                  <p className="mt-1 text-sm font-medium text-blue-700">{profile.title}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                 <MapPin className="h-4 w-4 text-blue-600" />
                     <span className="min-w-0 break-words">{profile.location}</span>
              </div>

                <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                      <span className="text-blue-600">✉️</span>
                   <span className="min-w-0 break-all">{profile.email}</span>
                </div>

               <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="min-w-0 break-all">{profile.phone || 'Phone not provided'}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-center ring-1 ring-blue-100">
                  <div className="text-lg font-bold text-blue-700">{profile.experience} Yrs</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-blue-600">Exp</div>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-center ring-1 ring-blue-100">
                  <div className="text-lg font-bold text-blue-700">{profile.skills.length}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-blue-600">Skills</div>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-center ring-1 ring-blue-100">
                  <div className="text-lg font-bold text-blue-700">{profile.availability === 'Open to work' ? 'Yes' : 'No'}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-blue-600">Status</div>
                </div>
              </div>
            </aside>

            <section className="flex-1 rounded-2xl border border-blue-100 bg-white p-5 sm:p-6">
              {isEditing ? (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Full name
                      <input
                        value={draft.name}
                        onChange={(event) => handleInputChange('name', event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Professional title
                      <input
                        value={draft.title}
                        onChange={(event) => handleInputChange('title', event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Experience
                      <input
                        min="0"
                        type='number'
                        value={draft.experience}
                        onChange={(event) => handleInputChange('experience', event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Availability
                      <input
                        value={draft.availability}
                        onChange={(event) => handleInputChange('availability', event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Location
                    <input
                      value={draft.location}
                      onChange={(event) => handleInputChange('location', event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Summary
                    <textarea
                      value={draft.summary}
                      rows={4}
                      onChange={(event) => handleInputChange('summary', event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Skills
                    <input
                      value={skillsText}
                      onChange={(event)=>{
                        setSkillsText(event.target.value)
                        handleSkillsChange(event.target.value)
                        }}
                      placeholder="React, NodeJs, MongoDB"
                      className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <div className="rounded-2xl border border-dashed border-blue-200 bg-[#f6faff] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">Resume</p>
                        <p className="mt-1 break-all text-sm text-slate-600">{draft.resume || 'No resume uploaded yet'}</p>
                        {(resumePreviewUrl || isResumeUrl(draft.resume)) && (
                          <a
                            href={resumePreviewUrl || draft.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
                          >
                            Preview resume
                          </a>
                        )}
                      </div>

                      <div className="flex w-full gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
                        >
                          Upload resume
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                 {saveError && <p className="text-sm text-red-500">{saveError}</p>}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="w-full rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled ={saving}
                      className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60 sm:w-auto"
                    >
                    {saving ? 'Saving...' : 'Save changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">About</p>
                    <p className="mt-3 text-base leading-7 text-slate-700">{profile.summary || 'No summary added yet'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Experience</p>
                    <div className="mt-3 rounded-2xl border border-blue-100 bg-[#f8fbff] p-4">
                      {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Senior Product Designer</h3>
                          <p className="text-sm text-slate-600">Northstar Labs • 2021 - Present</p>
                        </div>
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{profile.experience}</span>
                      </div> */}
                      <div className="flex items-center justify-between">
  <p className="text-base font-semibold text-slate-900">
    {Number(profile.experience) > 0
      ? `${profile.experience} years of experience`
      : 'Fresher'}
  </p>
  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
    {profile.experience} Yrs
  </span>
</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Skills</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Resume</p>
                    <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-[#f8fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-all text-base font-semibold text-slate-900">
                            {profile.resume || 'No resume uploaded'}
                          </p>
                        {(resumePreviewUrl || isResumeUrl(profile.resume)) && (
                          <a
                            href={resumePreviewUrl || profile.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
                          >
                            View resume
                          </a>
                        )}
                      </div>
                      <div className="flex w-full gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:w-auto"
                        >
                          Upload resume
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ApplicantProfile
