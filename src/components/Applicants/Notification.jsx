import { useState, useEffect, useRef } from "react";

const STATUS_STYLES = {
  hired: "bg-green-100 text-green-700",
  shortlisted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const keyOf = (a) => `${a._id}:${String(a.status).toLowerCase()}`;
const storageKey = (userId) => `seenNotifications:${userId}`;

function readSeen(userId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId))) ?? [];
  } catch {
    return [];
  }
}

export default function NotificationBell({ applications, userId, BellIcon }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => readSeen(userId));
  const ref = useRef(null);

  const updates = applications
    .filter((a) =>
      ["hired", "shortlisted", "rejected"].includes(
        String(a.status).toLowerCase(),
      ),
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const unreadCount = updates.filter((a) => !seen.includes(keyOf(a))).length;

  // Close when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      const allKeys = updates.map(keyOf);
      setSeen(allKeys);
      localStorage.setItem(storageKey(userId), JSON.stringify(allKeys));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={toggle}
      >
        {BellIcon}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
          <h3 className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-900">
            Notifications
          </h3>
          {updates.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No updates yet
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {updates.map((a) => {
                const status = String(a.status).toLowerCase();
                return (
                  <li key={a._id} className="px-4 py-3">
                    <p className="text-sm text-slate-800">
                      {status === "hired"
                        ? "🎉 You've been hired at "
                        : status === "rejected"
                          ? "Your application was rejected at "
                          : "You've been shortlisted at "}
                      <span className="font-semibold">
                        {a.job?.companyName ?? "a company"}
                      </span>
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="truncate text-xs text-slate-500">
                        {a.job?.title ?? "Job no longer available"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
                        {status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}