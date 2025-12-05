import React from "react";
import { motion } from "framer-motion";
import { Clock, HardDrive, BrainCircuit } from "lucide-react";

export default function ComplexityBadge({ timeComplexity, spaceComplexity, pattern, isDarkMode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-xl border flex flex-wrap gap-4 items-center justify-between ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white border-purple-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
        }`}>
          <Clock className="w-4 h-4" />
          <span>Time: {timeComplexity}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
          isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
        }`}>
          <HardDrive className="w-4 h-4" />
          <span>Space: {spaceComplexity}</span>
        </div>
      </div>

      {pattern && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
          isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700'
        }`}>
          <BrainCircuit className="w-4 h-4" />
          <span>Pattern: {pattern}</span>
        </div>
      )}
    </motion.div>
  );
}
