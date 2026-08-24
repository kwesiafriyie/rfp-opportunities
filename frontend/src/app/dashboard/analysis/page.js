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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SOURCE_COLORS = ["rgba(59,130,246,0.6)", "rgba(16,185,129,0.6)", "rgba(249,115,22,0.6)"];

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

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

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
        backgroundColor: SOURCE_COLORS.slice(0, Object.keys(sourceCounts).length),
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
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Opportunities Analytics</h1>
      {opportunities.length === 0 ? (
        <p className="text-center text-gray-500">No data yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-500">By Source</h2>
            <Bar data={barData} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Trend Over Time</h2>
            <Line data={lineData} />
          </div>
        </div>
      )}
    </div>
  );
}
