// // 'use client';

// // import React from 'react';
// // import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   ArcElement,
// //   RadialLinearScale,
// // } from 'chart.js';

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   ArcElement,
// //   RadialLinearScale
// // );

// // const AnalyticsPage = () => {
// //   // Bar Chart Data
// //   const barData = {
// //     labels: ['Source A', 'Source B', 'Source C', 'Source D', 'Source E'],
// //     datasets: [
// //       {
// //         label: 'RFPS Trends',
// //         data: [12, 19, 7, 10, 14],
// //         backgroundColor: [
// //           'rgba(255, 99, 132, 0.5)',
// //           'rgba(54, 162, 235, 0.5)',
// //           'rgba(255, 206, 86, 0.5)',
// //           'rgba(75, 192, 192, 0.5)',
// //           'rgba(153, 102, 255, 0.5)',
// //         ],
// //         borderColor: [
// //           'rgba(255, 99, 132, 1)',
// //           'rgba(54, 162, 235, 1)',
// //           'rgba(255, 206, 86, 1)',
// //           'rgba(75, 192, 192, 1)',
// //           'rgba(153, 102, 255, 1)',
// //         ],
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   // Line Chart Data
// //   const lineData = {
// //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
// //     datasets: [
// //       {
// //         label: 'Urgency Trends',
// //         data: [3, 5, 2, 6, 8, 10, 7],
// //         borderColor: 'rgba(75, 192, 192, 1)',
// //         backgroundColor: 'rgba(75, 192, 192, 0.3)',
// //         tension: 0.4,
// //         fill: true,
// //       },
// //     ],
// //   };

// //   // Pie Chart Data
// //   const pieData = {
// //     labels: ['Low', 'Medium', 'High'],
// //     datasets: [
// //       {
// //         label: 'Urgency Distribution',
// //         data: [25, 40, 35],
// //         backgroundColor: [
// //           'rgba(255, 99, 132, 0.6)',
// //           'rgba(54, 162, 235, 0.6)',
// //           'rgba(255, 206, 86, 0.6)',
// //         ],
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   // Radar Chart Data
// //   const radarData = {
// //     labels: ['Accuracy', 'Speed', 'Coverage', 'Reliability', 'Scalability'],
// //     datasets: [
// //       {
// //         label: 'Performance Metrics',
// //         data: [80, 65, 90, 75, 85],
// //         backgroundColor: 'rgba(153, 102, 255, 0.5)',
// //         borderColor: 'rgba(153, 102, 255, 1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Analytics Dashboard</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         {/* Bar Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-4">
// //           <h2 className="text-lg font-semibold mb-4 text-gray-500">RFPs by Source</h2>
// //           <Bar data={barData} />
// //         </div>

// //         {/* Line Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-4">
// //           <h2 className="text-lg font-semibold mb-4 text-gray-500">Trends Over Time</h2>
// //           <Line data={lineData} />
// //         </div>

// //         {/* Pie Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-4">
// //           <h2 className="text-lg font-semibold mb-4 text-gray-500">Urgency Distribution</h2>
// //           <Pie data={pieData} />
// //         </div>

// //         {/* Radar Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-4">
// //           <h2 className="text-lg font-semibold mb-4 text-gray-500">Performance Metrics</h2>
// //           <Radar data={radarData} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AnalyticsPage;





// "use client";
// import React, { useState, useEffect } from "react";
// import { Bar, Line, Pie, Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale
// );

// const AnalyticsPage = () => {
//   const [rfps, setRfps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from the backend API
//   useEffect(() => {
//     const fetchRfps = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/jobs", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setRfps(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchRfps();
//   }, []);

//   // Prepare Bar Chart Data: RFPs by Source
//   const sourceCounts = rfps.reduce((acc, rfp) => {
//     acc[rfp.source] = (acc[rfp.source] || 0) + 1;
//     return acc;
//   }, {});
//   const barData = {
//     labels: Object.keys(sourceCounts),
//     datasets: [
//       {
//         label: "RFPs by Source",
//         data: Object.values(sourceCounts),
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.5)",
//           "rgba(54, 162, 235, 0.5)",
//           "rgba(255, 206, 86, 0.5)",
//           "rgba(75, 192, 192, 0.5)",
//           "rgba(153, 102, 255, 0.5)",
//         ].slice(0, Object.keys(sourceCounts).length),
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//         ].slice(0, Object.keys(sourceCounts).length),
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Prepare Line Chart Data: Trends Over Time (by posted_date month)
//   const monthCounts = rfps.reduce((acc, rfp) => {
//     const date = new Date(rfp.posted_date.replace(/(\d+)(st|nd|rd|th)/, "$1")); // Clean suffixes
//     const month = date.toLocaleString("default", { month: "short" });
//     acc[month] = (acc[month] || 0) + 1;
//     return acc;
//   }, {});
//   const lineData = {
//     labels: Object.keys(monthCounts),
//     datasets: [
//       {
//         label: "RFP Trends Over Time",
//         data: Object.values(monthCounts),
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.3)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Prepare Pie Chart Data: Urgency Distribution (Critical vs Active)
//   const urgencyCounts = rfps.reduce((acc, rfp) => {
//     acc[rfp.status] = (acc[rfp.status] || 0) + 1;
//     return acc;
//   }, {});
//   const pieData = {
//     labels: Object.keys(urgencyCounts),
//     datasets: [
//       {
//         label: "Urgency Distribution",
//         data: Object.values(urgencyCounts),
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",  // Critical
//           "rgba(54, 162, 235, 0.6)",  // Active
//         ].slice(0, Object.keys(urgencyCounts).length),
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Radar Chart Data: Placeholder Metrics (customize as needed)
//   const radarData = {
//     labels: ["Accuracy", "Speed", "Coverage", "Reliability", "Scalability"],
//     datasets: [
//       {
//         label: "Performance Metrics",
//         data: [80, 65, 90, 75, 85],  // Static for now—update with real metrics if available
//         backgroundColor: "rgba(153, 102, 255, 0.5)",
//         borderColor: "rgba(153, 102, 255, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   if (loading) {
//     return <div className="p-8 text-center">Loading analytics data...</div>;
//   }

//   if (error) {
//     return <div className="p-8 text-center text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Analytics Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Bar Chart */}
//         <div className="bg-white shadow-lg rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-4 text-gray-500">RFPs by Source</h2>
//           <Bar data={barData} />
//         </div>

//         {/* Line Chart */}
//         <div className="bg-white shadow-lg rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-4 text-gray-500">Trends Over Time</h2>
//           <Line data={lineData} />
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white shadow-lg rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-4 text-gray-500">Urgency Distribution</h2>
//           <Pie data={pieData} />
//         </div>

//         {/* Radar Chart */}
//         <div className="bg-white shadow-lg rounded-lg p-4">
//           <h2 className="text-lg font-semibold mb-4 text-gray-500">Performance Metrics</h2>
//           <Radar data={radarData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsPage;




"use client";
import React, { useState, useEffect } from "react";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
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
  ArcElement,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const AnalyticsPage = () => {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  // Fetch data from the backend API with filters
  useEffect(() => {
    const fetchRfps = async () => {
      try {
        let url = "http://localhost:8000/jobs";
        const params = new URLSearchParams();
        if (filterType !== "All") params.append("type", filterType);
        if (filterStatus !== "All") params.append("status", filterStatus);
        if (filterSource !== "All") params.append("source", filterSource);
        if (params.toString()) url += `?${params.toString()}`;

        console.log("Fetching from:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRfps(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRfps();
  }, [filterType, filterStatus, filterSource]);

  // Helper to parse dates and calculate days remaining
  const parseDate = (dateStr) => {
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    return new Date(cleaned);
  };

  const today = new Date();

  // Prepare Bar Chart Data: RFPs by Source
  const sourceCounts = rfps.reduce((acc, rfp) => {
    acc[rfp.source] = (acc[rfp.source] || 0) + 1;
    return acc;
  }, {});
  const barData = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        label: "RFPs by Source",
        data: Object.values(sourceCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ].slice(0, Object.keys(sourceCounts).length),
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ].slice(0, Object.keys(sourceCounts).length),
        borderWidth: 1,
      },
    ],
  };

  // Prepare Line Chart Data: Trends Over Time
  const monthCounts = rfps.reduce((acc, rfp) => {
    const date = parseDate(rfp.posted_date);
    const month = date.toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const lineData = {
    labels: Object.keys(monthCounts),
    datasets: [
      {
        label: "RFP Trends Over Time",
        data: Object.values(monthCounts),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Prepare Pie Chart Data: Urgency Distribution
  const urgencyCounts = rfps.reduce((acc, rfp) => {
    acc[rfp.status] = (acc[rfp.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(urgencyCounts),
    datasets: [
      {
        label: "Urgency Distribution",
        data: Object.values(urgencyCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ].slice(0, Object.keys(urgencyCounts).length),
        borderWidth: 1,
      },
    ],
  };

  // Prepare Radar Chart Data: Dynamic Performance Metrics
  const performanceMetrics = {
    // Urgency Score: % of Critical jobs (0-100)
    urgencyScore: rfps.length
      ? (urgencyCounts["Critical"] || 0) / rfps.length * 100
      : 0,
    // Timeliness: Avg days remaining to deadline (scaled 0-100)
    avgDaysRemaining: rfps.length
      ? Math.min(
          rfps.reduce((sum, rfp) => {
            const deadline = parseDate(rfp.deadline);
            const days = (deadline - today) / (1000 * 60 * 60 * 24);
            return sum + (days > 0 ? days : 0);
          }, 0) / rfps.length / 30 * 100, // Scale: 30 days = 100
          100
        )
      : 0,
    // Source Diversity: Unique sources / total possible (scaled 0-100)
    sourceDiversity: rfps.length
      ? Object.keys(sourceCounts).length / 5 * 100 // Assume max 5 sources
      : 0,
    // Completeness: % of jobs with non-empty descriptions (0-100)
    completeness: rfps.length
      ? rfps.filter(rfp => rfp.description && rfp.description !== "No description available").length / rfps.length * 100
      : 0,
    // Frequency: Avg RFPs per source (scaled 0-100)
    avgPerSource: rfps.length
      ? rfps.length / Object.keys(sourceCounts).length / 10 * 100 // Scale: 10 RFPs/source = 100
      : 0,
  };

  const radarData = {
    labels: ["Urgency", "Timeliness", "Source Diversity", "Completeness", "Frequency"],
    datasets: [
      {
        label: "Performance Metrics",
        data: [
          performanceMetrics.urgencyScore,
          performanceMetrics.avgDaysRemaining,
          performanceMetrics.sourceDiversity,
          performanceMetrics.completeness,
          performanceMetrics.avgPerSource,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="p-8 text-center">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Analytics Dashboard</h1>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Filter by Type
            </label>
            <select
              id="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            >
              <option value="All">All</option>
              <option value="RFP">RFP</option>
              <option value="EOI">EOI</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="Active">Active</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Filter by Source
            </label>
            <select
              id="source"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            >
              <option value="All">All</option>
              {[...new Set(rfps.map((rfp) => rfp.source))].map((source, idx) => (
                <option key={idx} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">RFPs by Source</h2>
          <Bar data={barData} />
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">Trends Over Time</h2>
          <Line data={lineData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">Urgency Distribution</h2>
          <Pie data={pieData} />
        </div>

        {/* Radar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">Performance Metrics</h2>
          <Radar data={radarData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;



