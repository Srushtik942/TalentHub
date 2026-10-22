import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobDetailsSkeleton from "./JobDetailsSkeleton";
import {
  getAppliedJobIds,
  updateAppliedJobStatus,
} from "../../utils/appliedJobs";

function Icon({ name, className = "h-4 w-4" }) {
  const base = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "back") {
    return (
      <svg {...base}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    );
  }

  if (name === "money") {
    return (
      <svg {...base}>
        <path d="M12 1v22M17 5.5A3.5 3.5 0 0 0 12 3H10.5A3.5 3.5 0 0 0 7 6.5 3.5 3.5 0 0 0 10.5 10H13.5A3.5 3.5 0 0 1 17 13.5 3.5 3.5 0 0 1 13.5 17H11A3.5 3.5 0 0 1 7 13.5" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg {...base}>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg {...base}>
        <path d="M12 21s6-5.2 6-11A6 6 0 1 0 6 10c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "bookmark") {
    return (
      <svg {...base}>
        <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg {...base}>
        <path d="m12 2.5 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.1l6.2-.9z" />
      </svg>
    );
  }

  return null;
}

function JobDetails() {
  const { jobId } = useParams();
  console.log("id", jobId);
  const navigate = useNavigate();
  const [job, setJob] = useState("");
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [topicsToRevise, setTopicsToRevise] = useState([]);
  const [preparationTips, setPreparationTips] = useState("");
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applyJobs, setApplyJobs] = useState([]);
  const [applyLoading, setApplyLoading] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("response", response);

        if (!response.ok) throw new Error("Job not found");

        const data = await response.json();
        console.log("data", data?.job);
        setJob(data?.job);

        const application = data?.application ?? data?.job?.application;
        const applicationStatus = data?.status ?? application?.status;
        const isApplied =
          applicationStatus === "applied" ||
          (applicationStatus == null &&
            getAppliedJobIds().some((id) => String(id) === String(jobId)));

        setApplied(isApplied);
        setApplyJobs(application ? [application] : []);
        if (applicationStatus != null) {
          updateAppliedJobStatus(jobId, applicationStatus === "applied");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);
  if (loading) return <JobDetailsSkeleton />;
  if (error || !job)
    return (
      <p className="p-8 text-sm text-red-600">{error || "Job not found"}</p>
    );

  const skills = (job.requiredSkills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const onClickTab = (tab) => {
    setActiveTab(tab);
    if (tab === "similar") onClickViewJobs();
  };

  const date = new Date(job?.createdAt);

  const formatDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const onClickGenerateQuestionButton = async () => {
    try {
      setGeneratingQuestions(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/applicant/ai-interview-prep/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      console.log("data", data);

      setQuestion(data.result.interviewQuestions);
      setTopicsToRevise(data.result.topicsToRevise);
      setPreparationTips(data.result.preparationTips);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const onClickViewJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/search?title=${encodeURIComponent(job.title)}&excludeId=${job._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("response", response);

      if (!response.ok) {
        throw new Error(`Data with ${title} is missing`);
      }

      const data = await response.json();
      console.log("data", data);
      console.log("data", data?.jobs);

      setSimilarJobs(data?.jobs);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApplyJobs = async () => {
    try {
      setApplyLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      console.log("response", response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to apply");
      }

      const isApplied =
        data?.status === "applied" || data?.application?.status === "applied";
      setApplied(isApplied);
      if (isApplied && data.application) {
        setApplyJobs((prev) => [...prev, data.application]);
      }
      updateAppliedJobStatus(jobId, isApplied);
    } catch (error) {
      console.error(error);
    } finally {
      setApplyLoading(false);
    }
  };

  const onClickWithdraw = async () => {
    try {
      setApplyLoading(true);

      const token = localStorage.getItem("token");

      const application = applyJobs.find(
        (app) => String(app.job?._id || app.job || app.jobId) === String(jobId),
      );

      if (!application?._id) {
        throw new Error("Application not found!");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/applicant/applications/${application._id}/withdraw`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to withdraw");
      }

      setApplyJobs((prev) => prev.filter((app) => app._id !== application._id));
      setApplied(false);
      updateAppliedJobStatus(jobId, false);
    } catch (error) {
      console.error(error);
    } finally {
      setApplyLoading(false);
    }
  };

  const onClickApplyOrWithdraw = () => {
    if (applyLoading) return;
    if (applied) {
      onClickWithdraw();
    } else {
      onClickApplyJobs();
    }
  };

  const onClickSavedJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `
        ${import.meta.env.VITE_BACKEND_API}/api/applicant/jobs/${jobId}/bookmark`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save job");
      }

      setSaved((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <main className="w-full px-5 py-7 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-[1.05rem] font-medium text-slate-900 transition hover:text-blue-700"
        >
          <Icon name="back" className="h-5 w-5" />
          <span>Back to jobs</span>
        </button>

        <div className="mt-6 grid gap-7 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0f172a] text-2xl font-bold text-white">
                {job?.companyName?.charAt(0)}
              </div>

              <div className="flex-1">
                <h1 className="text-[2.2rem] font-bold tracking-tight text-slate-900">
                  {job.title}
                </h1>
                <p className="mt-1 font-semibold text-[1.05rem] text-slate-700">
                  {job.companyName}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-x-6 overflow-x-auto whitespace-nowrap text-sm text-slate-700">
              <span className="inline-flex items-center gap-2">
                <Icon name="money" className="h-4 w-4 text-slate-500" />₹{" "}
                {job.salaryMin / 100000} - {job.salaryMax / 100000} LPA
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="briefcase" className="h-4 w-4 text-slate-500" />
                {job.experience} years
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="location" className="h-4 w-4 text-slate-500" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-2 capitalize">
                <Icon name="star" className="h-4 w-4 text-slate-500" />
                {job.workMode}
              </span>
              <span className="inline-flex items-center gap-2 capitalize">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {job.employmentType}
              </span>
              <span className="text-slate-600">Posted {formatDate}</span>
            </div>

            <div className="mt-8 flex gap-8 border-b border-slate-200 pb-2 text-base font-medium text-slate-500">
              {/* <button type="button" className="border-b-2 border-blue-600 pb-2 text-blue-700">Job Details</button>
              <button type="button" className="pb-2">About Company</button>
              <button onClick={onClickViewJobs} type="button" className="pb-2">Similar Jobs</button> */}
              {[
                { id: "details", label: "Job Details" },
                { id: "company", label: "About Company" },
                // { id: 'similar', label: 'Similar Jobs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onClickTab(tab.id)}
                  className={`pb-2 ${activeTab === tab.id ? "border-b-2 border-blue-600 text-blue-700" : "hover:text-slate-800"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <>
                <div className="mt-8">
                  <h2 className="text-[1.1rem] font-semibold text-slate-900">
                    Job Description
                  </h2>
                  <p className="mt-4 text-base leading-8 text-slate-700">
                    {job?.jobDescription}
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-[1.1rem] font-semibold text-slate-900">
                    Skills
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-xl border border-slate-200 bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[1.1rem] font-semibold text-slate-900">
                        Generate questions related to this position
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        This will use the job description and skills to create
                        interview questions.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-[#1d4ed8] py-2 px-1 text-sm font-semibold text-white transition hover:bg-[#1e40af]"
                      onClick={onClickGenerateQuestionButton}
                      disabled={generatingQuestions}
                    >
                      {generatingQuestions
                        ? "Generating..."
                        : " Generate Questions"}
                    </button>
                  </div>
                  {question.length > 0 && (
                    <div className="mt-6 space-y-6">
                      {/* Interview Questions */}
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Interview Questions
                        </h4>

                        <div className="mt-3 space-y-3">
                          {question.map((item, index) => (
                            <div
                              key={index}
                              className="rounded-lg border border-slate-200 bg-white p-4"
                            >
                              <p className="text-sm leading-6 text-slate-700">
                                <span className="font-semibold text-slate-900">
                                  {index + 1}.{" "}
                                </span>
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Topics to Revise */}
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Topics to Revise
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {topicsToRevise.map((topic, index) => (
                            <span
                              key={index}
                              className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Preparation Tips */}
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Preparation Tips
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {preparationTips}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-[1.1rem] font-semibold text-slate-900">
                Apply for this job
              </h2>
              <button
                type="button"
                onClick={onClickApplyOrWithdraw}
                disabled={applyLoading}
                className={`mt-5 w-full rounded-xl px-4 py-3 text-base font-semibold transition ${
                  applied
                    ? "bg-[#0f172a] text-white hover:bg-[#111827]"
                    : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
                }`}
              >
                {applyLoading
                  ? "Please wait..."
                  : applied
                    ? "Withdraw Application"
                    : "Apply Now"}
              </button>
              <button
                type="button"
                // onClick={() => setSaved((current) => !current)}
                onClick={onClickSavedJob}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-base font-medium transition ${
                  saved
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon name="bookmark" className="h-4 w-4" />
                {saved ? "Saved Job" : "Save Job"}
              </button>
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">
                Recruiter
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-lg font-bold text-slate-700">
                  {job?.postedBy?.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {job?.postedBy?.fullName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {job?.postedBy?.email && (
                      <a
                        href={`mailto: ${job.postedBy.email}`}
                        className="text-sm text-slate-600 hover:text-blue-700 hover:underline"
                      >
                        {job.postedBy.email}
                      </a>
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700 font-semibold">
                {job?.postedBy?.companyName}
              </p>
              {/* <button type="button" className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800">
                View Profile
              </button> */}
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-[1.1rem] font-semibold text-slate-900">
                Similar Jobs
              </h3>
              <button
                type="button"
                className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
                onClick={onClickViewJobs}
              >
                View all similar jobs
              </button>
              {similarJobs.length > 0 && (
                <div className="mt-4">
                  {similarJobs.map((similarJob) => (
                    <div
                      key={similarJob._id}
                      className="flex items-center gap-3 border-b border-slate-100 pb-3"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f172a] text-lg font-bold text-white">
                        {similarJob?.companyName?.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {similarJob.title}
                        </p>

                        <p className="text-sm text-slate-600">
                          {similarJob.companyName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
