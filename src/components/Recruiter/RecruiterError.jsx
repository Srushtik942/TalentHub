import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { primaryButtonClass } from "./recruiterStyles";

function RecruiterError({
  message = "We could not find the page you are looking for.",
}) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-blue-700">
          Recruiter workspace
        </p>
        <h1 className="mt-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <button
          className={`${primaryButtonClass} mt-6`}
          type="button"
          onClick={() => navigate("/recruiter/dashboard")}
        >
          Go to dashboard <ArrowUpRight className="h-4 w-4" />
        </button>
      </section>
    </main>
  );
}

export default RecruiterError;
