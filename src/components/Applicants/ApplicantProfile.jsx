import { useRef, useState } from 'react'

const defaultProfile = {
  name: 'Sophia Carter',
  title: 'Senior Product Designer',
  location: 'Bengaluru, India',
  email: 'sophia.carter@email.com',
  phone: '+91 98765 43210',
  experience: '7+ Years',
  availability: 'Open to work',
  summary:
    'Product designer with a strong track record in user-centered design, design systems, and digital product strategy for SaaS and fintech teams.',
  skills: ['UX Research', 'Figma', 'Design Systems', 'User Flows', 'Prototyping', 'Product Strategy'],
  resume: 'Sophia_Carter_Resume.pdf',
}

function ApplicantProfile() {
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(defaultProfile)
  const [draft, setDraft] = useState(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setDraft((current) => ({
      ...current,
      resume: file.name,
    }))
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

  const saveProfile = () => {
    setProfile(draft)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraft(profile)
    setIsEditing(false)
  }

  return (
    <main className="min-h-screen bg-[#edf4ff] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.12)]">
          <header className="flex flex-col gap-4 border-b border-blue-100 bg-gradient-to-r from-[#eff6ff] to-[#dfeeff] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Applicant profile</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Professional details</h1>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing((open) => !open)}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              {isEditing ? 'Close editor' : 'Edit details'}
            </button>
          </header>

          <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start lg:gap-8 lg:p-8">
            <aside className="w-full rounded-2xl border border-blue-100 bg-[#f8fbff] p-5 lg:max-w-[320px]">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                  {profile.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                  <p className="mt-1 text-sm font-medium text-blue-700">{profile.title}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                  <span className="text-blue-600">📍</span>
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                  <span className="text-blue-600">✉️</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-blue-100">
                  <span className="text-blue-600">📞</span>
                  <span>{profile.phone}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-center ring-1 ring-blue-100">
                  <div className="text-lg font-bold text-blue-700">{profile.experience}</div>
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
                      value={draft.skills.join(', ')}
                      onChange={(event) => handleSkillsChange(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <div className="rounded-2xl border border-dashed border-blue-200 bg-[#f6faff] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Resume</p>
                        <p className="mt-1 text-sm text-slate-600">{draft.resume}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
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

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">About</p>
                    <p className="mt-3 text-base leading-7 text-slate-700">{profile.summary}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Experience</p>
                    <div className="mt-3 rounded-2xl border border-blue-100 bg-[#f8fbff] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Senior Product Designer</h3>
                          <p className="text-sm text-slate-600">Northstar Labs • 2021 - Present</p>
                        </div>
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{profile.experience}</span>
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
                      <div>
                        <p className="text-base font-semibold text-slate-900">{profile.resume}</p>
                        <p className="text-sm text-slate-600">Last updated: 2 weeks ago</p>
                      </div>

                      <button
                        type="button"
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View resume
                      </button>
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
