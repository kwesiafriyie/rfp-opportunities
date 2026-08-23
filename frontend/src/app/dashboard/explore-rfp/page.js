

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








"use client";
import React, { useState, useEffect } from "react";
import RFPCard from "@/app/components/rfp-card";

export default function Card() {
  const [rfps, setRfps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Fetch data from the backend API
  useEffect(() => {
    const fetchRfps = async () => {
      try {
        console.log("Fetching from: http://localhost:8000/jobs");
        const response = await fetch("http://localhost:8000/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));  // Log headers

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

        const mappedRfps = data.map((rfp) => {
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
  const filteredRFPs = rfps.filter((rfp) => {
    const matchesSearch =
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency =
      filterUrgency === "All" || (filterUrgency === "Urgent" && rfp.urgent);
    const matchesSource =
      filterSource === "All" || rfp.source === filterSource;
    return matchesSearch && matchesUrgency && matchesSource;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRFPs = filteredRFPs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Open Opportunities
        </h1>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-900">
                Search RFPs
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Urgency Filter */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                Filter by Urgency
              </label>
              <select
                id="urgency"
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              >
                <option value="All">All</option>
                <option value="Urgent">Urgent</option>
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

        {/* RFP Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRFPs.map((rfp) => (
            <RFPCard key={rfp.link} {...rfp} />
          ))}
        </div>

        {/* Pagination */}
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