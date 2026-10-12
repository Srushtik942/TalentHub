import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Naukri from '../assets/Naukri.png'
const Login = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();


  const clickOnSubmit= async (event)=>{
     event.preventDefault();

     setError("");
     setLoading(true);

     try{
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API}/api/auth/login`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    email,
                    password,
                }),

            }
        );

        const data = await response.json();

        if(!response.ok){
            setError(data.message);
            return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard")

     }catch(err){
        setError("Something went wrong. Please try again",err);

     }finally{
        setLoading(false);
     }
  }



  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7ff] px-4 py-6 sm:px-8">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-7 py-8 shadow-[0_18px_55px_rgba(30,64,175,0.10)] sm:px-12 sm:py-9" aria-label="TalentHub login">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm text-white">T</span>
          TalentHub
        </div>

        <div className="mb-7 mt-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Welcome back!</h1>
          <p className="mt-2 text-sm text-slate-500">Log in to your account to continue</p>
        </div>

        <form className="space-y-4" onSubmit={clickOnSubmit}>
          <label className="block text-xs font-semibold text-slate-700">Email address
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"  name="email" type="email" placeholder="Enter your email" autoComplete="email" required value={email} onChange={(event)=>setEmail(event.target.value)} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Password
            <span className="relative mt-2 block">
              <input className="w-full rounded-lg border border-slate-200 px-3.5 py-3 pr-16 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required  value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 hover:text-blue-600" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </span>
          </label>
         <div className="flex items-center justify-between gap-3 text-xs">
  <label className="flex items-center gap-2 text-slate-700">
    <input className="accent-blue-600" type="checkbox" />
    Remember me
  </label>

  <button
    className="font-semibold text-blue-600 hover:underline"
    type="button"
  >
    Forgot password?
  </button>
</div>

{error && (
  <p className="text-sm text-red-500">
    {error}
  </p>
)}

 <button
  className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
   type="submit"
  disabled={loading}
>
  {loading ? "Logging in..." : "Login"}
</button>
          <p className="pt-1 text-center text-xs text-slate-500">Don’t have an account? <button className="font-semibold text-blue-600 hover:underline" type="button" onClick={onRegister}>Register</button></p>
        </form>
        <img className="mx-auto mt-7 h-28 w-full max-w-[230px] object-contain mix-blend-multiply" src={Naukri} alt="Professional working at a laptop" />
      </section>
    </main>
  )
}

export default Login
