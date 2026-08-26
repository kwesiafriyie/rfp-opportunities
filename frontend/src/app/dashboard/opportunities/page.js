"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import OpportunityCard from "@/app/components/opportunity-card";
import OpportunityModal from "@/app/components/opportunity-modal";
import useNowTick from "@/app/lib/useNowTick";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";

const DEADLINE_OPTIONS = [
  { value: "all", label: "All open opportunities" },
  { value: "3", label: "Due within 3 days" },
  { value: "7", label: "Due within 7 days" },
  { value: "10", label: "Due within 10 days" },
  { value: "30", label: "Due within 30 days" },
  { value: "custom", label: "Custom range" },
];

const PUBLISHED_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "1", label: "Today" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

const SORT_OPTIONS = [
  { value: "deadline_asc", label: "Deadline: Soonest" },
  { value: "deadline_desc", label: "Deadline: Latest" },
  { value: "newest", label: "Newest" },
];

const ITEMS_PER_PAGE = 9;

function useDebounced(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function DateInput({ value, onChange, ariaLabel }) {
  return (
    <input
      type="date"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-slate-200 rounded-lg bg-white shadow-sm text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
    />
  );
}

export default function OpportunitiesPage() {
  const now = useNowTick();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 350);

  const [country, setCountry] = useState("");
  const [deadlineRange, setDeadlineRange] = useState("all");
  const [deadlineFrom, setDeadlineFrom] = useState("");
  const [deadlineTo, setDeadlineTo] = useState("");
  const [opportunityType, setOpportunityType] = useState("");
  const [source, setSource] = useState("");
  const [sector, setSector] = useState("");
  const [publishedRange, setPublishedRange] = useState("all");
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");
  const [sort, setSort] = useState("deadline_asc");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState({ sources: [], countries: [], opportunity_types: [], sectors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/opportunities/filters`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setFacets(data))
      .catch(() => {});
  }, []);

  // Any filter (or sort) change other than paging itself starts back at page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, country, deadlineRange, deadlineFrom, deadlineTo, opportunityType, source, sector, publishedRange, publishedFrom, publishedTo, sort]);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("skip", String((currentPage - 1) * ITEMS_PER_PAGE));
    params.set("limit", String(ITEMS_PER_PAGE));
    params.set("sort", sort);
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (opportunityType) params.set("opportunity_type", opportunityType);
    if (source) params.set("source", source);
    if (sector) params.set("sector", sector);

    if (deadlineRange === "custom") {
      if (deadlineFrom) params.set("deadline_from", deadlineFrom);
      if (deadlineTo) params.set("deadline_to", deadlineTo);
    } else if (deadlineRange !== "all") {
      params.set("deadline_within_days", deadlineRange);
    }

    if (publishedRange === "custom") {
      if (publishedFrom) params.set("published_from", publishedFrom);
      if (publishedTo) params.set("published_to", publishedTo);
    } else if (publishedRange !== "all") {
      params.set("published_within_days", publishedRange);
    }

    return params.toString();
  }, [currentPage, sort, search, country, opportunityType, source, sector, deadlineRange, deadlineFrom, deadlineTo, publishedRange, publishedFrom, publishedTo]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_URL}/api/opportunities/?${buildParams()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const totalHeader = res.headers.get("X-Total-Count");
        const data = await res.json();
        if (cancelled) return;
        setOpportunities(data);
        setTotal(totalHeader ? parseInt(totalHeader, 10) : data.length);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [buildParams]);

  // Belt-and-suspenders: the backend already excludes expired opportunities
  // at fetch time, but this keeps the list correct live, between fetches,
  // as the shared clock ticks past a deadline while the page stays open.
  const visibleOpportunities = useMemo(
    () => opportunities.filter((o) => !o.deadline || new Date(o.deadline).getTime() > now),
    [opportunities, now]
  );

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const countryOptions = useMemo(
    () => [...facets.countries].sort((a, b) => a.value.localeCompare(b.value)),
    [facets.countries]
  );
  const hasActiveFilters = Boolean(
    search || country || deadlineRange !== "all" || opportunityType || source || sector || publishedRange !== "all"
  );

  const clearFilters = () => {
    setSearchInput("");
    setCountry("");
    setDeadlineRange("all");
    setDeadlineFrom("");
    setDeadlineTo("");
    setOpportunityType("");
    setSource("");
    setSector("");
    setPublishedRange("all");
    setPublishedFrom("");
    setPublishedTo("");
  };

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Couldn&apos;t load opportunities: {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Opportunities</h1>
        <p className="text-slate-500 mt-1">
          {total} open consulting {total === 1 ? "notice" : "notices"} you can still act on.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, description, organization, country, reference..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Country"
            value={country}
            onChange={setCountry}
            placeholder="All countries"
            options={countryOptions.map((c) => ({ value: c.value, label: `${c.value} (${c.count})` }))}
          />
          <FilterSelect label="Deadline" value={deadlineRange} onChange={setDeadlineRange} options={DEADLINE_OPTIONS} />
          <FilterSelect
            label="Opportunity type"
            value={opportunityType}
            onChange={setOpportunityType}
            placeholder="All types"
            options={facets.opportunity_types.map((t) => ({ value: t.value, label: `${t.value} (${t.count})` }))}
          />
          <FilterSelect
            label="Source"
            value={source}
            onChange={setSource}
            placeholder="All sources"
            options={facets.sources.map((s) => ({ value: s.value, label: `${s.value} (${s.count})` }))}
          />

          <button
            onClick={() => setShowMoreFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              showMoreFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            More filters
          </button>

          <div className="flex-1" />

          <FilterSelect label="Sort by" value={sort} onChange={setSort} options={SORT_OPTIONS} />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {deadlineRange === "custom" && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Deadline between</span>
            <DateInput ariaLabel="Deadline from" value={deadlineFrom} onChange={setDeadlineFrom} />
            <span className="text-xs text-slate-400">and</span>
            <DateInput ariaLabel="Deadline to" value={deadlineTo} onChange={setDeadlineTo} />
          </div>
        )}

        {showMoreFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <FilterSelect
              label="Sector"
              value={sector}
              onChange={setSector}
              placeholder="All sectors"
              options={facets.sectors.map((s) => ({ value: s.value, label: `${s.value} (${s.count})` }))}
            />
            <FilterSelect label="Published" value={publishedRange} onChange={setPublishedRange} options={PUBLISHED_OPTIONS} />
            {publishedRange === "custom" && (
              <>
                <span className="text-xs text-slate-400">between</span>
                <DateInput ariaLabel="Published from" value={publishedFrom} onChange={setPublishedFrom} />
                <span className="text-xs text-slate-400">and</span>
                <DateInput ariaLabel="Published to" value={publishedTo} onChange={setPublishedTo} />
              </>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-400">Loading opportunities...</div>
      ) : visibleOpportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          No open opportunities match your filters. Try widening your search, or check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleOpportunities.map((opp) => (
            <OpportunityCard key={opp.link} opportunity={opp} onOpen={setSelected} now={now} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-600"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-600"
          >
            Next
          </button>
        </div>
      )}

      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
