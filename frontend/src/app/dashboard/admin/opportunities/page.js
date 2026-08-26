"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";
import { adminFetch } from "@/app/lib/adminAuth";
import { formatDate } from "@/app/components/opportunity-card";

const ITEMS_PER_PAGE = 20;

function useDebounced(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function AdminOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 350);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        skip: String((page - 1) * ITEMS_PER_PAGE),
        limit: String(ITEMS_PER_PAGE),
      });
      if (search) params.set("search", search);
      const res = await adminFetch(`${API_URL}/api/admin/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const totalHeader = res.headers.get("X-Total-Count");
      const data = await res.json();
      setOpportunities(data);
      setTotal(totalHeader ? parseInt(totalHeader, 10) : data.length);
      setError(null);
    } catch (err) {
      if (err.isAuthError) {
        router.replace("/dashboard/admin/login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (opportunity) => {
    if (!window.confirm(`Delete "${opportunity.title}"? This can't be undone.`)) return;
    setDeletingId(opportunity.id);
    try {
      const res = await adminFetch(`${API_URL}/api/admin/opportunities/${opportunity.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      setOpportunities((prev) => prev.filter((o) => o.id !== opportunity.id));
      setTotal((t) => t - 1);
    } catch (err) {
      if (err.isAuthError) {
        router.replace("/dashboard/admin/login");
        return;
      }
      window.alert(`Couldn't delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const isExpired = (deadline) => deadline && new Date(deadline).getTime() <= Date.now();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Opportunities</h1>
          <p className="text-slate-500 mt-1">
            {total} total, across every source and status -- unlike the public listing, expired opportunities stay visible here so they can be corrected.
          </p>
        </div>
        <Link
          href="/dashboard/admin/opportunities/new"
          className="flex-none inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add Opportunity
        </Link>
      </div>

      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search title, organization, reference..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-slate-400">Loading...</p>
        ) : opportunities.length === 0 ? (
          <p className="p-8 text-center text-slate-400">No opportunities found.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {opportunities.map((o) => (
              <li key={o.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {o.source}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                        o.ingestion_method === "manual" ? "bg-violet-50 text-violet-600" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {o.ingestion_method === "manual" ? "Manual" : "Automated"}
                    </span>
                    {isExpired(o.deadline) && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-50 text-red-500">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-1 truncate">{o.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {o.organization || "No organization"} · Deadline {o.deadline ? formatDate(o.deadline) : "not set"}
                  </p>
                </div>
                <div className="flex-none flex items-center gap-1">
                  <Link
                    href={`/dashboard/admin/opportunities/${o.id}/edit`}
                    aria-label={`Edit ${o.title}`}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(o)}
                    disabled={deletingId === o.id}
                    aria-label={`Delete ${o.title}`}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 text-sm font-medium text-slate-600"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 text-sm font-medium text-slate-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
