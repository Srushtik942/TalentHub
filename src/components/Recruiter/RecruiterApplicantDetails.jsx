import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { getRecruiterJobs, saveRecruiterJobs } from "../../utils/recruiterStorage";
import RecruiterShell from "./RecruiterShell";
import { primaryButtonClass, secondaryButtonClass } from "./recruiterStyles";

function getApplicationId(application) {
  return application.id ?? application._id ?? application.email;
}

function getApplicant(application) {
  return { ...application, ...(application?.applicant ?? {}) };
}

function RecruiterApplicantDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    const controller = new AbortController();

    async function fetchApplication() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/recruiter/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Application not found."
              : "Failed to fetch applications.",
          );
        }

        const data = await response.json();
        if (!Array.isArray(data?.applications)) {
          throw new Error("The applications response was invalid.");
        }

        const matchedApplication = data.applications.find(
          (item) => String(getApplicationId(item)) === applicationId,
        );
        if (!matchedApplication) {
          throw new Error("Application not found.");
        }

        setApplication(matchedApplication);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load applicant details.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchApplication();
    return () => controller.abort();
  }, [applicationId]);

  async function shortListAplication(){

    if(!application || updating) return;

    const token = localStorage.getItem('token');
    setUpdating(true);
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/recruiter/applications/status/${applicationId}`,
      {
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
            Authorization:  `Bearer ${token}` ,
        },
        body:JSON.stringify({status:"shortlisted"}),
      }
      );

      const data = await response.json().catch(()=> ({}));

      if(!response.ok){
        throw new Error(data?.message || "Faied to shortlist the applicant");
      }
      setApplication((current)=>({...current, status:"shortlisted"}));
      setError("");
    }catch(err){
      setError(err instanceof Error ? err.message : "Could not shortlist the applicant.");
    }finally{
      setUpdating(false);
    }
  }

  const applicant = application ? getApplicant(application) : {};
  const skills = Array.isArray(applicant.skills)
    ? applicant.skills
    : typeof applicant.skills === "string"
      ? applicant.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];
  const resume = applicant.resume ?? application?.resume ?? "";

  return (
    <RecruiterShell
      title="Applicant details"
      subtitle={application?.job?.title || "Review this applicant"}
    >
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-7">


        {loading ? (
          <p className="text-sm text-slate-600" role="status">
            Loading applicant details…
          </p>
        ) : error && !application ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold">
                  {applicant.fullName || application.fullName || "Candidate"}
                </h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {applicant.location || "Location not provided"}
                </p>
              </div>
              <button
                className={
                  application.shortlisted
                    ? primaryButtonClass
                    : secondaryButtonClass
                }
                type="button"
                onClick={shortListAplication}
                disabled={updating || application.status === "shortlisted"}
              >
                {application.status === "shortlisted" ? "Shortlisted"  : updating
      ? "Shortlisting…"
      : "Shortlist"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <dl className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-slate-500">Email</dt>
                <dd className="mt-1 min-w-0 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">
                  {applicant.emailId ||
                    applicant.email ||
                    application.email ||
                    "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Experience
                </dt>
                <dd className="mt-1 text-slate-900">
                  {applicant.experience ?? "Not provided"}
                  {applicant.experience != null ? " years" : ""}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">Skills</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600">Not provided</span>
                  )}
                </dd>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <dt className="text-sm font-semibold text-slate-500">Resume</dt>
                <dd className="mt-1 break-all text-slate-900">
                  {resume ? (
                    /^(https?:\/\/|\/)/i.test(resume) ? (
                      <a
                        className="font-semibold text-blue-700 underline"
                        href={resume}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View resume
                      </a>
                    ) : (
                      resume
                    )
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
            </dl>
          </>
        )}
      </section>
    </RecruiterShell>
  );
}

export default RecruiterApplicantDetails;
