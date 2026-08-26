"use client";
import React, { useEffect } from "react";
import { XMarkIcon, CalendarIcon, ClockIcon, ArrowTopRightOnSquareIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { SOURCE_STYLES, SOURCE_FULL_NAMES, formatDate } from "./opportunity-card";
import { getCountdown } from "@/app/lib/deadline";
import useNowTick from "@/app/lib/useNowTick";

// Single shared modal, rendered once at the page level and driven by
// `opportunity` (null = closed). Closes on Escape, backdrop click, or the
// close button; locks background scroll while open.
export default function OpportunityModal({ opportunity, onClose }) {
  const now = useNowTick();
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

  const {
    title, excerpt, published_at, deadline, source, link,
    country, organization, reference, opportunity_type, sector,
    matched_keywords = [],
  } = opportunity;
  const sourceStyle = SOURCE_STYLES[source] || "bg-slate-100 text-slate-600 ring-slate-500/20";
  const sourceFullName = SOURCE_FULL_NAMES[source];
  const countdown = getCountdown(deadline, now);

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
              title={sourceFullName}
              className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${sourceStyle}`}
            >
              {source}
            </span>
            {organization && (
              <span className="ml-2 text-xs text-slate-400">{organization}</span>
            )}
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              Published {formatDate(published_at)}
            </span>
            {country && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4" />
                {country}
              </span>
            )}
          </div>

          {deadline && countdown && !countdown.expired && (
            <div
              className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium ${
                countdown.urgent ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"
              }`}
            >
              <ClockIcon className="w-4 h-4 flex-none" />
              <span>
                Deadline: {formatDate(deadline)} &middot; <strong>{countdown.label}</strong>
                <span className="opacity-75"> ({countdown.detail})</span>
              </span>
            </div>
          )}

          {(opportunity_type || sector || reference) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-4">
              {opportunity_type && <span>{opportunity_type}</span>}
              {sector && <span>&middot; {sector}</span>}
              {reference && <span className="font-mono">Ref: {reference}</span>}
            </div>
          )}

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
