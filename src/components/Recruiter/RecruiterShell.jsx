import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Plus, UserRound } from 'lucide-react'
import { getRecruiterProfile } from '../../utils/recruiterStorage'
import { secondaryButtonClass } from './recruiterStyles'

function RecruiterShell({ children, title, subtitle }) {
  const navigate = useNavigate()
  const profile = getRecruiterProfile()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3.5 text-lg font-semibold ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
  }`

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex min-h-16 w-full items-center justify-between gap-4 px-3 sm:px-4">
          <NavLink className="flex items-center gap-2 text-base font-bold" to="/recruiter/dashboard">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">T</span>
            TalentHub <span className="hidden font-medium text-slate-500 sm:inline">for Employers</span>
          </NavLink>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block max-w-48 truncate text-base font-semibold">{profile.fullName || 'Recruiter'}</span>
              <span className="block max-w-48 truncate text-sm text-slate-500">{profile.companyName}</span>
            </span>
            <button className={secondaryButtonClass} type="button" onClick={logout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="grid w-full max-w-7xl gap-6 py-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 md:py-8">
        <aside>
          <nav className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 md:sticky md:top-6 md:border-0 md:bg-transparent md:p-0" aria-label="Recruiter navigation">
            <NavLink className={linkClass} to="/recruiter/dashboard"><LayoutDashboard className="h-5 w-5 shrink-0" />Dashboard</NavLink>
            <NavLink className={linkClass} to="/recruiter/profile"><UserRound className="h-5 w-5 shrink-0" />Profile</NavLink>
            <NavLink className={linkClass} to="/recruiter/jobs/new"><Plus className="h-5 w-5 shrink-0" />Post a job</NavLink>
          </nav>
        </aside>
        <section className="min-w-0 px-4 sm:px-6 md:px-0">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
              {subtitle && <p className="mt-2 text-base text-slate-600">{subtitle}</p>}
            </div>
          )}
          {children}
        </section>
      </div>
    </main>
  )
}

export default RecruiterShell
