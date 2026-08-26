import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  MapPinIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getCountdown, formatRelative } from "@/app/lib/deadline";

export const SOURCE_STYLES = {
  "standard.gm": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "thepoint.gm": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "foroyaa.net": "bg-violet-50 text-violet-700 ring-violet-600/20",
  "dailyobservergambia.com": "bg-rose-50 text-rose-700 ring-rose-600/20",
  "gambiatenders.com": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "tenders.gm": "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  "gppa.gm": "bg-teal-50 text-teal-700 ring-teal-600/20",
  "tenders.ppa.gov.gh": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  "tenders.com.gh": "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20",
  "UNGM": "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export const SOURCE_FULL_NAMES = {
  UNGM: "United Nations Global Marketplace",
};

export const formatDate = (iso) => {
  if (!iso) return "Date unknown";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// A compact, non-alarming urgency badge: amber once <=10 days remain,
// neutral otherwise. Deliberately reuses the same color for every urgent
// tier (no separate "red" panic state) -- the point is to help users
// prioritize, not alarm them.
export function DeadlineBadge({ deadline, now, className = "" }) {
  if (!deadline) return null;
  const countdown = getCountdown(deadline, now);
  if (!countdown || countdown.expired) return null;

  return (
    <span
      title={countdown.detail}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
        countdown.urgent ? "text-amber-700" : "text-slate-400"
      } ${className}`}
    >
      <ClockIcon className="w-3.5 h-3.5" />
      {countdown.label}
    </span>
  );
}

// Clicking the card body opens the details modal (via onOpen); the "View on
// Source" link is a separate element that goes straight to the external
// site, with its own click handler stopping propagation so it doesn't also
// trigger the modal.
const OpportunityCard = ({ opportunity, onOpen, now }) => {
  const {
    title, excerpt, published_at, deadline, source, link,
    organization, country, opportunity_type, sector, matched_keywords = [],
  } = opportunity;
  const sourceStyle = SOURCE_STYLES[source] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(opportunity);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(opportunity)}
      onKeyDown={handleKeyDown}
      aria-haspopup="dialog"
      className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${sourceStyle}`}
        >
          {source}
        </span>
        <DeadlineBadge deadline={deadline} now={now} />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 leading-snug line-clamp-2 mb-1.5">{title}</h3>

      {organization && (
        <p className="text-xs font-medium text-slate-500 truncate mb-2">{organization}</p>
      )}

      {(country || opportunity_type) && (
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
          {country && (
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
              {country}
            </span>
          )}
          {opportunity_type && (
            <span>
              {opportunity_type}
              {sector ? ` · ${sector}` : ""}
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-slate-500 line-clamp-3 flex-grow">
        {excerpt || "No description available."}
      </p>

      <div className="mt-3 inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 group-hover:text-amber-700">
        View Details
        <ChevronRightIcon className="w-3.5 h-3.5" />
      </div>

      {matched_keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {matched_keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400" title={formatDate(published_at)}>
          <CalendarIcon className="w-3.5 h-3.5" />
          Published {formatRelative(published_at)}
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
        >
          View on Source
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default OpportunityCard;
