// Deadline display helpers. Deliberately pure functions of (deadlineIso, nowMs)
// rather than components with their own timers -- callers drive them from a
// single shared ticking clock (see useNowTick) so a page full of cards
// updates in lockstep instead of drifting independently.
//
// Urgency and "days left" are computed from calendar-day difference in the
// viewer's own local timezone (via the browser's Date object), not raw
// hour math -- a deadline at 11pm today reads "Due today" all day, not
// "0 days left" only once fewer than 24 raw hours remain. The backend
// already normalized the deadline to an absolute UTC instant, so this is
// just "what local calendar day does that instant fall on" -- correct
// across DST transitions for free, since it's the runtime's own timezone
// database doing the conversion.

const startOfDay = (ms) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** true if the deadline has passed as of `nowMs`. A malformed/unparseable
 * deadline is treated the same as no deadline (false) -- we can't safely
 * assume it's expired just because we couldn't read it. In practice this
 * shouldn't happen: the backend only ever stores a deadline it successfully
 * parsed, or null.
 */
export function isExpired(deadlineIso, nowMs = Date.now()) {
  if (!deadlineIso) return false;
  const deadlineMs = new Date(deadlineIso).getTime();
  if (Number.isNaN(deadlineMs)) return false;
  return deadlineMs <= nowMs;
}

/**
 * Returns null for no deadline (or a deadline string that fails to parse --
 * the backend never stores one of those, but this guards against it rather
 * than rendering "NaN days left" if it ever happened). Otherwise:
 * { expired, urgent, label, detail, daysUntil }
 * - label: "Due today" | "1 day left" | "N days left" | "Expired"
 * - detail: fine-grained live countdown, e.g. "7d 14h 32m remaining"
 * - urgent: true when 0-10 days remain (inclusive), the visual-priority cutoff
 */
export function getCountdown(deadlineIso, nowMs = Date.now()) {
  if (!deadlineIso) return null;

  const deadlineMs = new Date(deadlineIso).getTime();
  if (Number.isNaN(deadlineMs)) return null;

  const diffMs = deadlineMs - nowMs;

  if (diffMs <= 0) {
    return { expired: true, urgent: false, label: "Expired", detail: null, daysUntil: null };
  }

  const daysUntil = Math.round((startOfDay(deadlineMs) - startOfDay(nowMs)) / MS_PER_DAY);

  let label;
  if (daysUntil <= 0) label = "Due today";
  else if (daysUntil === 1) label = "1 day left";
  else label = `${daysUntil} days left`;

  const totalMinutes = Math.floor(diffMs / 60000);
  const d = Math.floor(totalMinutes / 1440);
  const h = Math.floor((totalMinutes % 1440) / 60);
  const m = totalMinutes % 60;
  const detail = d > 0 ? `${d}d ${h}h ${m}m remaining` : `${h}h ${m}m remaining`;

  return { expired: false, urgent: daysUntil <= 10, label, detail, daysUntil };
}

/** "2 days ago" / "Today" / "3 weeks ago", for published dates. */
export function formatRelative(iso, nowMs = Date.now()) {
  if (!iso) return "Date unknown";
  const diffDays = Math.floor((startOfDay(nowMs) - startOfDay(new Date(iso).getTime())) / MS_PER_DAY);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
