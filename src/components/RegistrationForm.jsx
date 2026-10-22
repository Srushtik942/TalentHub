import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "./RoleSelector";
import { setUser } from "../redux/userSlice";

const RegistrationForm = ({ role, onRoleChange, onShowLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const isApplicant = role === "applicant";

  async function clickOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (form.password.value !== form.confirmPassword.value) {
        throw new Error("Passwords do not match");
      }

      const payload = {
        fullName: form.fullName.value,
        email: form.email.value,
        password: form.password.value,
        role,

        ...(isApplicant
          ? {
              experience: form.experience.value,
              location: form.location.value,
              skills: form.skills.value
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
              resume: "",
            }
          : {
              companyName: form.companyName.value,
              companySize: form.companySize.value,
              location: form.workLocation.value,
            }),
      };

      const apiBaseUrl = import.meta.env.VITE_BACKEND_API?.replace(/\/+$/, "");
      if (!apiBaseUrl) {
        throw new Error("The registration API URL is not configured.");
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again.",
        );
      }

      setSuccess(data.message || "Your account was created successfully.");
      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="bg-white px-6 py-8 sm:px-12 lg:px-10 lg:py-9"
      aria-label={`${isApplicant ? "Applicant" : "Recruiter"} signup form`}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill in your details to get started
          </p>
        </div>

        <RoleSelector role={role} onRoleChange={onRoleChange} />

        <form className="mt-6 space-y-4" onSubmit={clickOnSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Full Name
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Email Address
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Password
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="password"
                type="password"
                placeholder="Create a password"
                required
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Confirm Password
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </label>
          </div>

          {isApplicant ? (
            <>
              <label className="block text-xs font-semibold text-slate-700">
                Experience
                <select
                  name="experience"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your experience
                  </option>
                  <option>0</option>
                  <option>1-3 years</option>
                  <option>4-7 years</option>
                  <option>8+ years</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  Current Location
                  <input
                    name="location"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    type="text"
                    placeholder="Enter your current location"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Skills{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                  <input
                    name="skills"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    type="text"
                    placeholder="e.g. React, Node.js, SQL"
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold text-slate-700">
                Upload Resume{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
                <input
                  className="mt-2 block w-full rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-normal text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-600"
                  type="file"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </>
          ) : (
            <>
              <label className="block text-xs font-semibold text-slate-700">
                Company Name
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  name="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  Company Size
                  <select
                    name="companySize"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select company size
                    </option>
                    <option>1-50 employees</option>
                    <option>51-250 employees</option>
                    <option>251+ employees</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Work Location
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    name="workLocation"
                    type="text"
                    placeholder="Enter company location"
                  />
                </label>
              </div>
            </>
          )}

          <label className="flex items-start gap-2 pt-1 text-xs text-slate-500">
            <input
              className="mt-0.5 accent-blue-600"
              type="checkbox"
              required
            />{" "}
            <span>
              I agree to the{" "}
              <a
                className="font-semibold text-blue-600 hover:underline"
                href="#terms"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-blue-600 hover:underline"
                href="#privacy"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700" role="status">
              {success}
            </p>
          )}
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              className="font-semibold text-blue-600 hover:underline"
              type="button"
              onClick={onShowLogin}
            >
              Log in here
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
