import React from "react";
import { CalendarIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import { motion } from "framer-motion";

const formatDate = (iso) => {
  if (!iso) return "Date unknown";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RFPCard = ({ title, summary, date, source, link }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden"
    >
      <div className="max-w-md w-full h-full flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="h-16 bg-gray-100 flex items-center justify-center">
          <InfoIcon className="w-8 h-8 text-gray-300" />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
            {summary || "No description available."}
          </p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
              {source}
            </span>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            <span>View Notice</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default RFPCard;
