module.exports = {

"[project]/src/app/dashboard/analysis/page.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
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
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/chart.js/dist/chart.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-chartjs-2/dist/index.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BarElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ArcElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RadialLinearScale"]);
const AnalyticsPage = ()=>{
    const [rfps, setRfps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filterType, setFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [filterSource, setFilterSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    // Fetch data from the backend API with filters
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchRfps = async ()=>{
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
                        "Content-Type": "application/json"
                    }
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
    }, [
        filterType,
        filterStatus,
        filterSource
    ]);
    // Helper to parse dates and calculate days remaining
    const parseDate = (dateStr)=>{
        const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
        return new Date(cleaned);
    };
    const today = new Date();
    // Prepare Bar Chart Data: RFPs by Source
    const sourceCounts = rfps.reduce((acc, rfp)=>{
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
                    "rgba(153, 102, 255, 0.5)"
                ].slice(0, Object.keys(sourceCounts).length),
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)"
                ].slice(0, Object.keys(sourceCounts).length),
                borderWidth: 1
            }
        ]
    };
    // Prepare Line Chart Data: Trends Over Time
    const monthCounts = rfps.reduce((acc, rfp)=>{
        const date = parseDate(rfp.posted_date);
        const month = date.toLocaleString("default", {
            month: "short"
        });
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
                fill: true
            }
        ]
    };
    // Prepare Pie Chart Data: Urgency Distribution
    const urgencyCounts = rfps.reduce((acc, rfp)=>{
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
                    "rgba(54, 162, 235, 0.6)"
                ].slice(0, Object.keys(urgencyCounts).length),
                borderWidth: 1
            }
        ]
    };
    // Prepare Radar Chart Data: Dynamic Performance Metrics
    const performanceMetrics = {
        // Urgency Score: % of Critical jobs (0-100)
        urgencyScore: rfps.length ? (urgencyCounts["Critical"] || 0) / rfps.length * 100 : 0,
        // Timeliness: Avg days remaining to deadline (scaled 0-100)
        avgDaysRemaining: rfps.length ? Math.min(rfps.reduce((sum, rfp)=>{
            const deadline = parseDate(rfp.deadline);
            const days = (deadline - today) / (1000 * 60 * 60 * 24);
            return sum + (days > 0 ? days : 0);
        }, 0) / rfps.length / 30 * 100, 100) : 0,
        // Source Diversity: Unique sources / total possible (scaled 0-100)
        sourceDiversity: rfps.length ? Object.keys(sourceCounts).length / 5 * 100 // Assume max 5 sources
         : 0,
        // Completeness: % of jobs with non-empty descriptions (0-100)
        completeness: rfps.length ? rfps.filter((rfp)=>rfp.description && rfp.description !== "No description available").length / rfps.length * 100 : 0,
        // Frequency: Avg RFPs per source (scaled 0-100)
        avgPerSource: rfps.length ? rfps.length / Object.keys(sourceCounts).length / 10 * 100 // Scale: 10 RFPs/source = 100
         : 0
    };
    const radarData = {
        labels: [
            "Urgency",
            "Timeliness",
            "Source Diversity",
            "Completeness",
            "Frequency"
        ],
        datasets: [
            {
                label: "Performance Metrics",
                data: [
                    performanceMetrics.urgencyScore,
                    performanceMetrics.avgDaysRemaining,
                    performanceMetrics.sourceDiversity,
                    performanceMetrics.completeness,
                    performanceMetrics.avgPerSource
                ],
                backgroundColor: "rgba(153, 102, 255, 0.5)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            }
        ]
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-center",
            children: "Loading analytics data..."
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/analysis/page.js",
            lineNumber: 536,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-center text-red-500",
            children: [
                "Error: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/analysis/page.js",
            lineNumber: 540,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-center mb-6 text-gray-700",
                children: "Analytics Dashboard"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/analysis/page.js",
                lineNumber: 545,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg p-6 mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "type",
                                    className: "block text-sm font-medium text-gray-700",
                                    children: "Filter by Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 552,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "type",
                                    value: filterType,
                                    onChange: (e)=>setFilterType(e.target.value),
                                    className: "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "All",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "RFP",
                                            children: "RFP"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 562,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "EOI",
                                            children: "EOI"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 563,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 555,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                            lineNumber: 551,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "status",
                                    className: "block text-sm font-medium text-gray-700",
                                    children: "Filter by Status"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 569,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "status",
                                    value: filterStatus,
                                    onChange: (e)=>setFilterStatus(e.target.value),
                                    className: "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "All",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 578,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Critical",
                                            children: "Critical"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 579,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Active",
                                            children: "Active"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 580,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 572,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                            lineNumber: 568,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "source",
                                    className: "block text-sm font-medium text-gray-700",
                                    children: "Filter by Source"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 586,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "source",
                                    value: filterSource,
                                    onChange: (e)=>setFilterSource(e.target.value),
                                    className: "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "All",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                                            lineNumber: 595,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            ...new Set(rfps.map((rfp)=>rfp.source))
                                        ].map((source, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: source,
                                                children: source
                                            }, idx, false, {
                                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                                lineNumber: 597,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                                    lineNumber: 589,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/analysis/page.js",
                            lineNumber: 585,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/analysis/page.js",
                    lineNumber: 549,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/analysis/page.js",
                lineNumber: 548,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow-lg rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold mb-4 text-gray-500",
                                children: "RFPs by Source"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                                data: barData
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/analysis/page.js",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow-lg rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold mb-4 text-gray-500",
                                children: "Trends Over Time"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 616,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                                data: lineData
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 617,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/analysis/page.js",
                        lineNumber: 615,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow-lg rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold mb-4 text-gray-500",
                                children: "Urgency Distribution"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 622,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                data: pieData
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 623,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/analysis/page.js",
                        lineNumber: 621,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow-lg rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold mb-4 text-gray-500",
                                children: "Performance Metrics"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Radar"], {
                                data: radarData
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/analysis/page.js",
                                lineNumber: 629,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/analysis/page.js",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/analysis/page.js",
                lineNumber: 607,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/analysis/page.js",
        lineNumber: 544,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = AnalyticsPage;
}}),
"[project]/src/app/dashboard/analysis/page.js [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=src_app_dashboard_analysis_page_778c83.js.map