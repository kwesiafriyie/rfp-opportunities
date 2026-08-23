module.exports = {

"[project]/src/app/components/rfp-card.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InfoIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as InfoIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLinkIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLinkIcon>");
;
;
;
;
const RFPCard = ({ title, summary, deadline, source, link, urgent, image })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        whileHover: {
            scale: 1.05
        },
        transition: {
            duration: 0.3
        },
        className: " rounded-lg  overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-40 bg-gray-100 flex items-center justify-center",
                    children: image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: image,
                        alt: title,
                        className: "w-full h-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/rfp-card.js",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InfoIcon$3e$__["InfoIcon"], {
                        className: "w-12 h-12 text-gray-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/rfp-card.js",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/rfp-card.js",
                    lineNumber: 17,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-gray-800",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/rfp-card.js",
                            lineNumber: 27,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-gray-600 line-clamp-3",
                            children: summary
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/rfp-card.js",
                            lineNumber: 29,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex items-center justify-between text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
                                            className: "w-4 h-4 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/rfp-card.js",
                                            lineNumber: 35,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `${urgent ? "text-red-500 font-semibold" : "text-gray-500"}`,
                                            children: [
                                                "Deadline: ",
                                                deadline
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/rfp-card.js",
                                            lineNumber: 36,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/rfp-card.js",
                                    lineNumber: 34,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: [
                                            "Source: ",
                                            source
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/rfp-card.js",
                                        lineNumber: 47,
                                        columnNumber: 11
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/rfp-card.js",
                                    lineNumber: 46,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/rfp-card.js",
                            lineNumber: 32,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: link,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "mt-4 inline-block text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "View RFP"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/rfp-card.js",
                                    lineNumber: 58,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLinkIcon$3e$__["ExternalLinkIcon"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/rfp-card.js",
                                    lineNumber: 59,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/rfp-card.js",
                            lineNumber: 52,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/rfp-card.js",
                    lineNumber: 25,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/rfp-card.js",
            lineNumber: 15,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/rfp-card.js",
        lineNumber: 7,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = RFPCard;
}}),
"[project]/src/app/dashboard/explore-rfp/page.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// "use client";
// import React, { useState } from "react";
// import RFPCard from "@/app/components/rfp-card";
// export default function Card() {
//   const rfps = [
//     {
//       title: "Website Redesign for NGO",
//       summary:
//         "An opportunity to redesign the official website of a leading non-profit organization to improve user engagement and performance.",
//       deadline: "January 31, 2025",
//       source: "NGO Portal",
//       link: "https://example.com/rfp-details",
//       urgent: true,
//       image: "https://via.placeholder.com/300x150",
//     },
//     {
//       title: "Cloud Infrastructure Setup",
//       summary:
//         "Setting up a scalable cloud infrastructure for a government IT project, including documentation and training.",
//       deadline: "February 15, 2025",
//       source: "GovTech RFPs",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },
//     {
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },{
//       title: "Mobile App Development",
//       summary:
//         "Develop a mobile application to support remote learning for students in rural areas.",
//       deadline: "March 10, 2025",
//       source: "EdTech Network",
//       link: "https://example.com/rfp-details",
//       urgent: false,
//       image: "https://via.placeholder.com/300x150",
//     },
//   ];
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterUrgency, setFilterUrgency] = useState("All");
//   const [filterSource, setFilterSource] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;
//   const filteredRFPs = rfps.filter((rfp) => {
//     const matchesSearch =
//       rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       rfp.summary.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesUrgency =
//       filterUrgency === "All" || (filterUrgency === "Urgent" && rfp.urgent);
//     const matchesSource =
//       filterSource === "All" || rfp.source === filterSource;
//     return matchesSearch && matchesUrgency && matchesSource;
//   });
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedRFPs = filteredRFPs.slice(startIndex, startIndex + itemsPerPage);
//   const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Open Opportunities
//         </h1>
//         {/* Filters */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//           <div className="flex flex-wrap gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               <label htmlFor="search" className="block text-sm font-medium text-gray-900">
//                 Search RFPs
//               </label>
//               <input
//                 id="search"
//                 type="text"
//                 placeholder="Search by title or summary..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             {/* Urgency Filter */}
//             <div>
//               <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
//                 Filter by Urgency
//               </label>
//               <select
//                 id="urgency"
//                 value={filterUrgency}
//                 onChange={(e) => setFilterUrgency(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
//               >
//                 <option value="All">All</option>
//                 <option value="Urgent">Urgent</option>
//               </select>
//             </div>
//             {/* Source Filter */}
//             <div>
//               <label htmlFor="source" className="block text-sm font-medium text-gray-700">
//                 Filter by Source
//               </label>
//               <select
//                 id="source"
//                 value={filterSource}
//                 onChange={(e) => setFilterSource(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
//               >
//                 <option value="All">All</option>
//                 {[...new Set(rfps.map((rfp) => rfp.source))].map((source, idx) => (
//                   <option key={idx} value={source}>
//                     {source}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//         {/* RFP Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {paginatedRFPs.map((rfp, index) => (
//             <RFPCard key={index} {...rfp} />
//           ))}
//         </div>
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// "use client";
// import React, { useState, useEffect } from "react";
// import RFPCard from "@/app/components/rfp-card";
// export default function Card() {
//   const [rfps, setRfps] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterUrgency, setFilterUrgency] = useState("All");
//   const [filterSource, setFilterSource] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const itemsPerPage = 6;
//   // Fetch data from the backend API
//   useEffect(() => {
//     const fetchRfps = async () => {
//       try {
//         console.log("Fetching from: http://localhost:8000/jobs");
//         const response = await fetch("http://localhost:8000/jobs", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("Response status:", response.status);  // Log status
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const text = await response.text();  // Get raw text first
//         console.log("Raw response:", text);  // Log raw response
//         let data;
//         try {
//           data = JSON.parse(text);  // Parse JSON safely
//         } catch (jsonError) {
//           throw new Error(`Invalid JSON: ${jsonError.message}`);
//         }
//         // Map API response to frontend expected fields
//         const mappedRfps = data.map((rfp) => {
//           console.log("Mapping RFP:", rfp);  // Log each RFP
//           return {
//             title: rfp.title,
//             summary: rfp.description,
//             deadline: rfp.deadline,
//             source: rfp.source,
//             link: rfp.link,
//             urgent: rfp.status === "Critical",
//             image: "https://via.placeholder.com/300x150"
//           };
//         });
//         setRfps(mappedRfps);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err);  // Detailed error logging
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchRfps();
//   }, []);
//   // Filter RFPs based on search, urgency, and source
//   const filteredRFPs = rfps.filter((rfp) => {
//     const matchesSearch =
//       rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       rfp.summary.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesUrgency =
//       filterUrgency === "All" || (filterUrgency === "Urgent" && rfp.urgent);
//     const matchesSource =
//       filterSource === "All" || rfp.source === filterSource;
//     return matchesSearch && matchesUrgency && matchesSource;
//   });
//   // Pagination logic
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedRFPs = filteredRFPs.slice(startIndex, startIndex + itemsPerPage);
//   const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);
//   if (loading) {
//     return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
//   }
//   if (error) {
//     return <div className="min-h-screen bg-gray-50 py-8 text-center text-red-500">Error: {error}</div>;
//   }
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Open Opportunities
//         </h1>
//         {/* Filters */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//           <div className="flex flex-wrap gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               <label htmlFor="search" className="block text-sm font-medium text-gray-900">
//                 Search RFPs
//               </label>
//               <input
//                 id="search"
//                 type="text"
//                 placeholder="Search by title or summary..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             {/* Urgency Filter */}
//             <div>
//               <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
//                 Filter by Urgency
//               </label>
//               <select
//                 id="urgency"
//                 value={filterUrgency}
//                 onChange={(e) => setFilterUrgency(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
//               >
//                 <option value="All">All</option>
//                 <option value="Urgent">Urgent</option>
//               </select>
//             </div>
//             {/* Source Filter */}
//             <div>
//               <label htmlFor="source" className="block text-sm font-medium text-gray-700">
//                 Filter by Source
//               </label>
//               <select
//                 id="source"
//                 value={filterSource}
//                 onChange={(e) => setFilterSource(e.target.value)}
//                 className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
//               >
//                 <option value="All">All</option>
//                 {[...new Set(rfps.map((rfp) => rfp.source))].map((source, idx) => (
//                   <option key={idx} value={source}>
//                     {source}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//         {/* RFP Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {paginatedRFPs.map((rfp) => (
//             <RFPCard key={rfp.link} {...rfp} />
//           ))}
//         </div>
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
__turbopack_esm__({
    "default": (()=>Card)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$rfp$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/app/components/rfp-card.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function Card() {
    const [rfps, setRfps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterUrgency, setFilterUrgency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [filterSource, setFilterSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const itemsPerPage = 6;
    // Fetch data from the backend API
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchRfps = async ()=>{
            try {
                console.log("Fetching from: http://localhost:8000/jobs");
                const response = await fetch("http://localhost:8000/jobs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log("Response status:", response.status);
                console.log("Response headers:", Object.fromEntries(response.headers.entries())); // Log headers
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const text = await response.text();
                console.log("Raw response:", text);
                let data;
                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    throw new Error(`Invalid JSON: ${jsonError.message}`);
                }
                const mappedRfps = data.map((rfp)=>{
                    console.log("Mapping RFP:", rfp);
                    return {
                        title: rfp.title,
                        summary: rfp.description,
                        deadline: rfp.deadline,
                        source: rfp.source,
                        link: rfp.link,
                        urgent: rfp.status === "Critical",
                        image: "https://via.placeholder.com/300x150"
                    };
                });
                setRfps(mappedRfps);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchRfps();
    }, []);
    // Filter RFPs based on search, urgency, and source
    const filteredRFPs = rfps.filter((rfp)=>{
        const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) || rfp.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUrgency = filterUrgency === "All" || filterUrgency === "Urgent" && rfp.urgent;
        const matchesSource = filterSource === "All" || rfp.source === filterSource;
        return matchesSearch && matchesUrgency && matchesSource;
    });
    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRFPs = filteredRFPs.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 py-8 text-center",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
            lineNumber: 567,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 py-8 text-center text-red-500",
            children: [
                "Error: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
            lineNumber: 571,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-gray-800 mb-6 text-center",
                    children: "Open Opportunities"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                    lineNumber: 577,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white shadow-md rounded-lg p-6 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "search",
                                        className: "block text-sm font-medium text-gray-900",
                                        children: "Search RFPs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 586,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "search",
                                        type: "text",
                                        placeholder: "Search by title or summary...",
                                        value: searchTerm,
                                        onChange: (e)=>setSearchTerm(e.target.value),
                                        className: "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                lineNumber: 585,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "urgency",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Filter by Urgency"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 601,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "urgency",
                                        value: filterUrgency,
                                        onChange: (e)=>setFilterUrgency(e.target.value),
                                        className: "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                                lineNumber: 610,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Urgent",
                                                children: "Urgent"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                                lineNumber: 611,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 604,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                lineNumber: 600,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "source",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Filter by Source"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 617,
                                        columnNumber: 15
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
                                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                                lineNumber: 626,
                                                columnNumber: 17
                                            }, this),
                                            [
                                                ...new Set(rfps.map((rfp)=>rfp.source))
                                            ].map((source, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: source,
                                                    children: source
                                                }, idx, false, {
                                                    fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                                    lineNumber: 628,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                        lineNumber: 620,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                                lineNumber: 616,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                        lineNumber: 583,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                    lineNumber: 582,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: paginatedRFPs.map((rfp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$rfp$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            ...rfp
                        }, rfp.link, false, {
                            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                            lineNumber: 640,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                    lineNumber: 638,
                    columnNumber: 9
                }, this),
                totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mt-6 space-x-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                            disabled: currentPage === 1,
                            className: "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700",
                            children: "Previous"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                            lineNumber: 647,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "px-4 py-2 text-gray-700",
                            children: `Page ${currentPage} of ${totalPages}`
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                            lineNumber: 654,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, totalPages)),
                            disabled: currentPage === totalPages,
                            className: "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                            lineNumber: 655,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
                    lineNumber: 646,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
            lineNumber: 576,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboard/explore-rfp/page.js",
        lineNumber: 575,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/dashboard/explore-rfp/page.js [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=src_app_bf400a._.js.map