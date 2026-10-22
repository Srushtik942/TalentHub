# Change log

## 2026-10-22

- Added an optional company size selector to the recruiter job editor and included its value in the job form state so it is saved with the job. The choices match the company-size ranges already used during registration.
- Removed the extra "Post a job" button from the recruiter dashboard job-post heading and added a disabled AI-Hiring Assistant button as a UI placeholder until its API is integrated. The empty-dashboard create-job action and recruiter navigation remain available.
- Added a loading state and accessible shimmer rows for recent applications. The section now shows request and invalid-response errors instead of silently presenting an empty state.
- Added responsive horizontal padding and centered the recruiter content container to keep recruiter pages aligned and usable across viewport sizes.
