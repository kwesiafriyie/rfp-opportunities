"use client";
import React, { useState, useEffect } from "react";
import RFPCard from "@/app/components/rfp-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ExploreOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/opportunities/?limit=200`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setOpportunities(data);
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
  const sources = [...new Set(opportunities.map((opp) => opp.source))];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading opportunities...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center text-red-500">
        Couldn&apos;t load opportunities: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Consulting Opportunities
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-900">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                id="source"
                value={filterSource}
                onChange={(e) => {
                  setFilterSource(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              >
                <option value="All">All</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <p className="text-center text-gray-500">
            No opportunities found yet. Check back soon, or adjust your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedOpportunities.map((opp) => (
              <RFPCard
                key={opp.link}
                title={opp.title}
                summary={opp.excerpt}
                date={opp.published_at}
                source={opp.source}
                link={opp.link}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
