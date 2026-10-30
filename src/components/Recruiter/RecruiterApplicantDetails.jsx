import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import RecruiterShell from "./RecruiterShell";
import { primaryButtonClass, secondaryButtonClass } from "./recruiterStyles";

const applicationStatuses = [
  { value: "new", label: "New application" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

function getApplicationId(application) {
  return application.id ?? application._id ?? application.email;
}

function getApplicationStatus(application) {
  return application?.shortlisted
    ? "shortlisted"
    : application?.status || "new";
}

function formatStatus(status) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getApplicant(application) {
  return { ...application, ...(application?.applicant ?? {}) };
}

function ApplicantField({ label, value }) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-slate-600">
      {label}
      <input
        className="mt-2 h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none"
        type="text"
        value={value || "Not provided"}
        readOnly
      />
    </label>
  );
}

function RecruiterApplicantDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [resumeError, setResumeError] = useState("");


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
        setSelectedStatus(getApplicationStatus(matchedApplication));
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

  async function updateApplicationStatus() {
    if (!application || updating) return;

    const status = selectedStatus;
    const token = localStorage.getItem("token");
    setUpdating(true);
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/recruiter/applications/status/${encodeURIComponent(applicationId)}`,
      {
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
            Authorization:  `Bearer ${token}` ,
        },
        body: JSON.stringify({ status }),
      }
      );

      const data = await response.json().catch(()=> ({}));

      if(!response.ok){
        throw new Error(data?.message || "Failed to update the application status.");
      }
      setApplication((current) => ({
        ...current,
        status,
        shortlisted: status === "shortlisted",
      }));
      setError("");
    }catch(err){
      setError(
        err instanceof Error
          ? err.message
          : "Could not update the application status.",
      );
    }finally{
      setUpdating(false);
    }
  }

  async function viewResume() {
    if (!resume) return;

    const newTab = window.open("", "_blank");
    setResumeError("");
    if (!newTab) {
      setResumeError("Allow pop-ups to view the applicant's resume.");
      return;
    }

    try {
      let resumeUrl = resume;
      if (!/^(https?:\/\/|\/)/i.test(resume)) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/applicant/resume/download-url?key=${encodeURIComponent(resume)}`,
          { headers: { Authorization: "Bearer " + token } },
        );
        const data = await response.json();
        if (!response.ok || !data?.url) {
          throw new Error(data?.message || "Could not open the applicant's resume.");
        }
        resumeUrl = data.url;
      }

      newTab.location.href = resumeUrl;
    } catch (resumeFetchError) {
      newTab?.close();
      setResumeError(
        resumeFetchError instanceof Error
          ? resumeFetchError.message
          : "Could not open the applicant's resume.",
      );
    }
  }

  const applicant = application ? getApplicant(application) : {};
  const skills = Array.isArray(applicant.skills)
    ? applicant.skills
    : typeof applicant.skills === "string"
      ? applicant.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];
  const resume = applicant.resume ?? application?.resume ?? "";
  const applicationStatus = getApplicationStatus(application);
  const hasSelectedStatusChanged = selectedStatus !== applicationStatus;
  const hasCurrentStatusOption = applicationStatuses.some(
    ({ value }) => value === applicationStatus,
  );

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
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <section
              className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              aria-labelledby="application-status-heading"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                      Current: {formatStatus(applicationStatus)}
                    </span>
                  </div>
                  <label
                    className="block text-sm font-medium text-slate-600"
                    htmlFor="application-status"
                  >
                    Update candidate status
                  </label>
                  <select
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-sm"
                    id="application-status"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    disabled={updating}
                  >
                    {!hasCurrentStatusOption && (
                      <option value={applicationStatus}>
                        {formatStatus(applicationStatus)}
                      </option>
                    )}
                    {applicationStatuses.map(({ value, label }) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className={`${primaryButtonClass} w-full sm:w-auto`}
                  type="button"
                  onClick={updateApplicationStatus}
                  disabled={updating || !hasSelectedStatusChanged}
                >
                  {updating ? "Saving status…" : "Update status"}
                </button>
              </div>
            </section>

            <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">
              <ApplicantField
                label="Full name"
                value={applicant.fullName || application.fullName}
              />
              <ApplicantField
                label="Email"
                value={
                  applicant.emailId || applicant.email || application.email
                }
              />
              <ApplicantField
                label="Location"
                value={applicant.location}
              />
              <ApplicantField
                label="Experience"
                value={
                  applicant.experience != null
                    ? String(applicant.experience) + " years"
                    : ""
                }
              />
              <ApplicantField
                label="Skills"
                value={skills.join(", ")}
              />
              <ApplicantField
                label="Status"
                value={formatStatus(applicationStatus)}
              />
              <div className="min-w-0 sm:col-span-2">
                <p className="text-sm font-semibold text-slate-600">Resume</p>
                <div className="mt-2">
                  {resume ? (
                    <button
                      className={secondaryButtonClass}
                      type="button"
                      onClick={viewResume}
                    >
                      View resume
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500">Not provided</p>
                  )}
                  {resumeError && (
                    <p className="mt-2 text-sm text-red-700" role="alert">
                      {resumeError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </RecruiterShell>
  );
}

export default RecruiterApplicantDetails;
