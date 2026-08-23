import React from "react";
import { CalendarIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import { motion } from "framer-motion";

const RFPCard = ({ title, summary, deadline, source, link, urgent, image }) => {
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    className=" rounded-lg  overflow-hidden"
    // dark:bg-gray-800
  >
    <div className="max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Image Placeholder */}
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <InfoIcon className="w-12 h-12 text-gray-300" />
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {/* Summary */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{summary}</p>

        {/* Additional Info */}
        <div className="mt-4 flex items-center justify-between text-sm">
          {/* Deadline */}
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span
              className={`${
                urgent ? "text-red-500 font-semibold" : "text-gray-500"
              }`}
            >
              Deadline: {deadline}
            </span>
          </div>

          {/* Source Badge */}
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
          <span className="text-gray-400">Source: {source}</span>
          </span>
        </div>

        {/* Action Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
        >
          <span>View RFP</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
    </motion.div>
  );
};

export default RFPCard;
