"use client";
import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_URL } from "@/app/lib/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const SOURCE_COLORS = {
  "standard.gm": "#2563eb",
  "thepoint.gm": "#059669",
  "foroyaa.net": "#7c3aed",
  "dailyobservergambia.com": "#e11d48",
  "gambiatenders.com": "#d97706",
  "tenders.gm": "#0891b2",
  "gppa.gm": "#0d9488",
  "tenders.ppa.gov.gh": "#4f46e5",
  "tenders.com.gh": "#c026d3",
};

const CHART_OPTIONS = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#f1f5f9" } },
  },
};

export default function AnalyticsPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/opportunities/?limit=500`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        setOpportunities(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading analytics...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  const sourceCounts = opportunities.reduce((acc, o) => {
    acc[o.source] = (acc[o.source] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        label: "Opportunities by source",
        data: Object.values(sourceCounts),
        backgroundColor: Object.keys(sourceCounts).map((s) => SOURCE_COLORS[s] || "#94a3b8"),
        borderRadius: 6,
        maxBarThickness: 56,
      },
    ],
  };

  const monthCounts = opportunities.reduce((acc, o) => {
    if (!o.published_at) return acc;
    const month = new Date(o.published_at).toLocaleString("default", { month: "short", year: "2-digit" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(monthCounts),
    datasets: [
      {
        label: "Opportunities over time",
        data: Object.values(monthCounts),
        borderColor: "#d97706",
        backgroundColor: "rgba(217, 119, 6, 0.12)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#d97706",
      },
    ],
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">How opportunities break down by source and time.</p>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          No data yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4">By Source</h2>
            <Bar data={barData} options={CHART_OPTIONS} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Trend Over Time</h2>
            <Line data={lineData} options={CHART_OPTIONS} />
          </div>
        </div>
      )}
    </div>
  );
}
