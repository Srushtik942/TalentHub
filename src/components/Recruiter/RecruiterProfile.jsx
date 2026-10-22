import { useState, useEffect } from "react";
import { Building2, Pencil } from "lucide-react";
import {
  getRecruiterProfile,
  saveRecruiterProfile,
} from "../../utils/recruiterStorage";
import RecruiterShell from "./RecruiterShell";
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./recruiterStyles";

const fields = [
  ["fullName", "Full name"],
  ["email", "Email"],
  ["companyName", "Company name"],
  ["location", "Location"],
  ["companySize", "Company Size"],
  ["website", "Website"],
];

function RecruiterProfile() {
  const [profile, setProfile] = useState(getRecruiterProfile);
  const [draft, setDraft] = useState(getRecruiterProfile);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [profileData, setProfileData] = useState("");

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveProfile(event) {
    event.preventDefault();
    try {
      saveRecruiterProfile(draft);
      setProfile(draft);
      setEditing(false);
      setError("");
      setNotice("Profile saved in this browser.");
    } catch {
      setError(
        "Could not save your profile. Check available browser storage and try again.",
      );
      setNotice("");
    }
  }

  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/recruiter/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recruiter profile");
      }

      const data = await response.json();
      console.log(data);
      setProfileData(data?.userData);
      setProfile(data?.userData);
      setDraft(data?.userData);
    };
    fetchRecruiterProfile();
  }, []);

  return (
    <RecruiterShell
      title="Recruiter profile"
      subtitle="Keep your recruiter and company information up to date."
    >
      <form
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7"
        onSubmit={saveProfile}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">
                {profile.companyName || "Your company"}
              </h2>
              <p className="text-sm text-slate-600">
                {profile.location || "Location not set"}
              </p>
            </div>
          </div>
          {!editing && (
            <button
              className={primaryButtonClass}
              type="button"
              onClick={() => {
                setDraft(profile);
                setEditing(true);
                setNotice("");
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit details
            </button>
          )}
        </div>
        {notice && (
          <p className="mb-4 text-sm text-blue-700" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="mb-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([field, label]) => (
            <label
              className="block text-sm font-semibold text-slate-700"
              key={field}
            >
              {label}
              <input
                className={inputClass}
                type={field === "email" ? "email" : "text"}
                value={editing ? draft[field] : profile[field]}
                readOnly={!editing}
                onChange={(event) => updateField(field, event.target.value)}
              />
            </label>
          ))}
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            About the company
            <textarea
              className={`${inputClass} min-h-32 resize-y`}
              value={editing ? draft.about : profile.about}
              readOnly={!editing}
              onChange={(event) => updateField("about", event.target.value)}
            />
          </label>
        </div>
        {editing && (
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              className={secondaryButtonClass}
              type="button"
              onClick={() => {
                setDraft(profile);
                setEditing(false);
                setError("");
              }}
            >
              Cancel
            </button>
            <button className={primaryButtonClass} type="submit">
              Save details
            </button>
          </div>
        )}
      </form>
    </RecruiterShell>
  );
}

export default RecruiterProfile;
