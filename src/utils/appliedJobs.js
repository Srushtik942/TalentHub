function getAppliedJobsKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?._id || user?.id || user?.email || "current";
    return `appliedJobs:${userId}`;
  } catch {
    return "appliedJobs:current";
  }
}

export function getAppliedJobIds() {
  try {
    const appliedJobIds = JSON.parse(
      localStorage.getItem(getAppliedJobsKey()) || "[]",
    );
    return Array.isArray(appliedJobIds) ? appliedJobIds : [];
  } catch {
    return [];
  }
}

export function updateAppliedJobStatus(jobId, isApplied) {
  const appliedJobIds = getAppliedJobIds().filter(
    (id) => String(id) !== String(jobId),
  );

  if (isApplied) {
    appliedJobIds.push(jobId);
  }

  localStorage.setItem(getAppliedJobsKey(), JSON.stringify(appliedJobIds));
  return appliedJobIds;
}
