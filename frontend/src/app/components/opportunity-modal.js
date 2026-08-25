"use client";
import React, { useEffect } from "react";
import { XMarkIcon, CalendarIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { SOURCE_STYLES, formatDate } from "./opportunity-card";

// Single shared modal, rendered once at the page level and driven by
// `opportunity` (null = closed). Closes on Escape, backdrop click, or the
// close button; locks background scroll while open.
export default function OpportunityModal({ opportunity, onClose }) {
  useEffect(() => {
    if (!opportunity) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [opportunity, onClose]);

  if (!opportunity) return null;

  const { title, excerpt, published_at, source, link, matched_keywords = [] } = opportunity;
  const sourceStyle = SOURCE_STYLES[source] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="opportunity-modal-title"
    >
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100">
          <div className="min-w-0">
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${sourceStyle}`}
            >
              {source}
            </span>
            <h2 id="opportunity-modal-title" className="mt-2 text-lg font-semibold text-slate-900 leading-snug">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-none p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <CalendarIcon className="w-4 h-4" />
            {formatDate(published_at)}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {excerpt || "No description available."}
          </p>

          {matched_keywords.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Matched keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {matched_keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            View Original Listing
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-lg hover:border-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
