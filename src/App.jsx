import { useState } from 'react'
import BrandPanel from './components/BrandPanel'
import RegistrationForm from './components/RegistrationForm'
import './App.css'

function App() {
  const [role, setRole] = useState('applicant')

  return (
    <main className="min-h-screen bg-[#f4f7ff] px-4 py-6 font-sans text-slate-900 sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(30,64,175,0.10)] lg:grid-cols-[38%_62%]" aria-label="TalentHub registration">
        <BrandPanel />
        <RegistrationForm role={role} onRoleChange={setRole} />
      </section>
    </main>
  )
}

export default App
