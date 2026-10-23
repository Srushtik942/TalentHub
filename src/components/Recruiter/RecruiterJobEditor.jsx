import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecruiterJobs,
  saveRecruiterJobs,
} from "../../utils/recruiterStorage";
import RecruiterError from "./RecruiterError";
import RecruiterShell from "./RecruiterShell";
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./recruiterStyles";

function RecruiterJobEditor() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { jobId } = useParams();
  const currentJob = useMemo(
    () => getRecruiterJobs().find((job) => job.id === jobId),
    [jobId],
  );
  const [error, setError] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  const [form, setForm] = useState(() => ({
    title: currentJob?.title ?? "",
    location: currentJob?.location ?? "",
    employmentType: currentJob?.employmentType ?? "full-time",
    workMode: currentJob?.workMode ?? "on-site",
    experience: currentJob?.experience ?? "",
    salaryMin: currentJob?.salaryMin ?? "",
    salaryMax: currentJob?.salaryMax ?? "",
    companySize: currentJob?.companySize ?? "",
    jobDescription: currentJob?.jobDescription ?? "",
    requiredSkills: currentJob?.requiredSkills ?? "",
    applicationDeadline: currentJob?.applicationDeadline ?? "",
  }));

  function changeField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/recruiter/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("Failed to fetch recruiter profile");

        const data = await response.json();
        setProfileCompany(data?.userData?.companyName ?? "");
      } catch (err) {
        if (err.name !== "AbortError") setProfileCompany("");
      } finally {
        if (!controller.signal.aborted) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => controller.abort();
  }, []);

  async function submitJob(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const jobs = getRecruiterJobs();

      const payload = {
        ...form,
        title: form.title.trim(),
        companyName: profileCompany.trim(),
        experience: Number(form.experience),
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
      };

      if (!payload.companyName) {
        throw new Error(
          "Please add your company name in your recruiter profile before posting a job.",
        );
      }

      if (payload.salaryMin > payload.salaryMax) {
        throw new Error(
          "Minimum salary cannot be greater than maximum salary.",
        );
      }

      if (!currentJob) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/recruiter/jobs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );
        console.log("response", response);

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Failed to publish the job post.");
        }

        const saved = data?.job ?? data;
        const newJob = {
          ...payload,
          ...saved,
          id: saved?.id ?? saved._id,
          createdAt: saved?.createdAt ?? new Date().toISOString(),
          archived: false,
          applications: saved?.applications ?? [],
        };
        saveRecruiterJobs([newJob, ...jobs]);
      } else {
        const job = {
          ...currentJob,
          ...payload,
          archived: false,
        };
        saveRecruiterJobs(jobs.map((item) => (item.id === jobId ? job : item)));
      }
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : " Could not save this job post. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (jobId && !currentJob) {
    return <RecruiterError message="The job post could not be found." />;
  }

  return (
    <RecruiterShell
      title={currentJob ? "Edit job post" : "Post a job"}
      subtitle="Add clear details so candidates understand the opportunity."
    >
      <form
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7"
        onSubmit={submitJob}
      >
        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Job title
            <input
              className={inputClass}
              value={form.title}
              required
              onChange={(e) => changeField("title", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Location
            <input
              className={inputClass}
              value={form.location}
              required
              onChange={(e) => changeField("location", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Employment type
            <select
              className={inputClass}
              value={form.employmentType}
              onChange={(e) => changeField("employmentType", e.target.value)}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Work mode
            <select
              className={inputClass}
              value={form.workMode}
              onChange={(e) => changeField("workMode", e.target.value)}
            >
              <option value="on-site">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Experience (years)
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.experience}
              required
              onChange={(e) => changeField("experience", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Minimum salary (₹)
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.salaryMin}
              required
              onChange={(e) => changeField("salaryMin", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Maximum salary (₹)
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.salaryMax}
              required
              onChange={(e) => changeField("salaryMax", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Application deadline
            <input
              className={inputClass}
              type="date"
              value={form.applicationDeadline}
              required
              onChange={(e) =>
                changeField("applicationDeadline", e.target.value)
              }
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Company size
            <select
              className={inputClass}
              value={form.companySize}
              onChange={(e) => changeField("companySize", e.target.value)}
            >
              <option value="">Select company size</option>
              {[
                "11-50 employees",
                "51-200 employees",
                "201-500 employees",
                "501-1000 employees",
                "1000+ employees",
              ].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Required skills
            <input
              className={inputClass}
              value={form.requiredSkills}
              placeholder="Separate skills with commas"
              onChange={(e) => changeField("requiredSkills", e.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Job description
            <textarea
              className={`${inputClass} min-h-40 resize-y`}
              value={form.jobDescription}
              required
              onChange={(e) => changeField("jobDescription", e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            className={secondaryButtonClass}
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate("/recruiter/dashboard")}
          >
            Cancel
          </button>
          <button
            className={primaryButtonClass}
            type="submit"
            disabled={isSubmitting || profileLoading}
          >
            {" "}
            {isSubmitting
              ? "Saving..."
              : currentJob
                ? "Save changes"
                : "Publish job"}
          </button>
        </div>
      </form>
    </RecruiterShell>
  );
}

export default RecruiterJobEditor;
