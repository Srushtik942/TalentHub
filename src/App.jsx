import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import BrandPanel from './components/BrandPanel'
import RegistrationForm from './components/RegistrationForm'
import Login from './components/Login'
import Dashboard from './components/Applicants/Dashboard'
import './App.css'

function Register() {
  const [role, setRole] = useState('applicant')
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#f4f7ff] px-4 py-6 font-sans text-slate-900 sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(30,64,175,0.10)] lg:grid-cols-[38%_62%]">
        <BrandPanel />

        <RegistrationForm
          role={role}
          onRoleChange={setRole}
          onShowLogin={() => navigate('/login')}
        />
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login onRegister={() => window.location.href = '/register'} />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  )
}

export default App