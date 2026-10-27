
export function getApplicantData(overrides = {}) {
  return {
    fullName: "Test User",
    email: `test.user.${Date.now()}@example.com`,
    password: "Test@12345",
    confirmPassword: "Test@12345",
    experience: "1-3 years",
    location: "Pune, India",
    skills: "React, Node.js, MongoDB",
    ...overrides,
  };
}