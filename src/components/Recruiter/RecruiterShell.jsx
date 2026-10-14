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

  const linkClass = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
  }`

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink className="flex items-center gap-2 text-base font-bold" to="/recruiter/dashboard">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">T</span>
            TalentHub <span className="hidden font-medium text-slate-500 sm:inline">for Employers</span>
          </NavLink>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block max-w-48 truncate text-sm font-semibold">{profile.fullName || 'Recruiter'}</span>
              <span className="block max-w-48 truncate text-xs text-slate-500">{profile.companyName}</span>
            </span>
            <button className={secondaryButtonClass} type="button" onClick={logout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
        <aside>
          <nav className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 lg:block lg:space-y-1 lg:border-0 lg:bg-transparent lg:p-0" aria-label="Recruiter navigation">
            <NavLink className={linkClass} to="/recruiter/dashboard"><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>
            <NavLink className={linkClass} to="/recruiter/profile"><UserRound className="h-4 w-4" />Profile</NavLink>
            <NavLink className={linkClass} to="/recruiter/jobs/new"><Plus className="h-4 w-4" />Post a job</NavLink>
          </nav>
        </aside>
        <section className="min-w-0">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
            </div>
          )}
          {children}
        </section>
      </div>
    </main>
  )
}

export default RecruiterShell
