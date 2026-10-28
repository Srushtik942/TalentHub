import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BrandPanel from "./components/BrandPanel";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Dashboard from "./components/Applicants/Dashboard";
import JobDetails from "./components/Applicants/JobDetails";
import LandingPage from "./components/LandingPage";
import ApplicantProfile from "./components/Applicants/ApplicantProfile";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterError from "./components/Recruiter/RecruiterError";
import RecruiterJobEditor from "./components/Recruiter/RecruiterJobEditor";
import RecruiterProfile from "./components/Recruiter/RecruiterProfile";
import RecruiterApplicantDetails from "./components/Recruiter/RecruiterApplicantDetails";
import "./App.css";

function Register() {
  const [role, setRole] = useState("applicant");
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f4f7ff] px-4 py-6 font-sans text-slate-900 sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(30,64,175,0.10)] lg:grid-cols-[38%_62%]">
        <BrandPanel />

        <RegistrationForm
          role={role}
          onRoleChange={setRole}
          onShowLogin={() => navigate("/login")}
        />
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/login"
        element={
          <Login onRegister={() => (window.location.href = "/register")} />
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/job-details/:jobId" element={<JobDetails />} />
      <Route path="/applicant-profile" element={<ApplicantProfile />} />
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route
        path="/recruiter/applicants/:applicationId"
        element={<RecruiterApplicantDetails />}
      />
      <Route path="/recruiter/profile" element={<RecruiterProfile />} />
      <Route path="/recruiter/jobs/new" element={<RecruiterJobEditor />} />
      <Route
        path="/recruiter/jobs/:jobId/edit"
        element={<RecruiterJobEditor />}
      />
      <Route path="/recruiter/error" element={<RecruiterError />} />
      <Route path="*" element={<RecruiterError />} />
    </Routes>
  );
}

export default App;
