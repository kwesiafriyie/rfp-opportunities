"use client";
import React, { useState, useEffect } from "react";
import OpportunityCard from "@/app/components/opportunity-card";
import OpportunityModal from "@/app/components/opportunity-modal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";

const SOURCES = [
  "standard.gm",
  "thepoint.gm",
  "foroyaa.net",
  "dailyobservergambia.com",
  "gambiatenders.com",
  "tenders.gm",
  "gppa.gm",
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/opportunities/?limit=200`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        setOpportunities(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const haystack = `${opp.title} ${opp.excerpt || ""}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "All" || opp.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Loading opportunities...</div>;
  }

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
          {opportunities.length} consulting {opportunities.length === 1 ? "notice" : "notices"} found
          across {SOURCES.length} trusted news sources.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["All", ...SOURCES].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilterSource(s);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filterSource === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          No opportunities found yet. Check back soon, or adjust your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedOpportunities.map((opp) => (
            <OpportunityCard key={opp.link} opportunity={opp} onOpen={setSelected} />
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
