import React from "react";
import { CalendarIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const SOURCE_STYLES = {
  "standard.gm": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "thepoint.gm": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "foroyaa.net": "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const formatDate = (iso) => {
  if (!iso) return "Date unknown";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OpportunityCard = ({ title, summary, date, source, link, keywords = [] }) => {
  const sourceStyle = SOURCE_STYLES[source] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${sourceStyle}`}
        >
          {source}
        </span>
        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
      </div>

      <h3 className="font-serif text-lg font-semibold text-slate-900 leading-snug line-clamp-2 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-3 flex-grow">
        {summary || "No description available."}
      </p>

      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
        <CalendarIcon className="w-3.5 h-3.5" />
        {formatDate(date)}
      </div>
    </a>
  );
};

export default OpportunityCard;
