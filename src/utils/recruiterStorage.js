const JOBS_KEY = "recruiterJobs";
const PROFILE_KEY = "recruiterProfile";

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

export function getRecruiterJobs() {
  return readList(JOBS_KEY);
}

export function saveRecruiterJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getRecruiterProfile() {
  const savedProfile = readObject(PROFILE_KEY);
  const currentUser = readObject("user");

  return {
    fullName: savedProfile.fullName ?? currentUser.fullName ?? "",
    email: savedProfile.email ?? currentUser.email ?? "",
    experience: savedProfile.experience ?? currentUser.experience ?? "",
    location: savedProfile.location ?? currentUser.location ?? "",
    companyName: savedProfile.companyName ?? currentUser.companyName ?? "",
    website: savedProfile.website ?? currentUser.website ?? "",
    about: savedProfile.about ?? currentUser.about ?? "",
  };
}

export function saveRecruiterProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  const currentUser = readObject("user");
  localStorage.setItem("user", JSON.stringify({ ...currentUser, ...profile }));
}
