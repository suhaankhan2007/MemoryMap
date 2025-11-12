import React from "react";
import { motion } from "framer-motion";
import { Database, Zap } from "lucide-react";

export default function HeapBlock({ block, isDarkMode }) {
  // Format value display based on type
  const formatValue = (value) => {
    if (typeof value === 'string') {
      // Handle strings and chars with quotes
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, rotate: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative"
    >
      <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-xl p-5 shadow-xl text-white border-2 border-white/30 ring-2 ring-orange-300 ring-offset-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="font-mono font-bold text-lg">
              {block.type}
            </span>
          </div>
          <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-semibold backdrop-blur-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
            new
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 mb-3">
          <div className="text-xs opacity-75 mb-1">Value Stored:</div>
          <div className="font-mono text-2xl font-bold break-words">
            {formatValue(block.value)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90 font-mono bg-black/20 rounded px-2 py-1">
            📍 Heap: {block.address}
          </div>
          <div className="text-xs opacity-75 flex items-center gap-2 bg-yellow-400/20 rounded px-2 py-1">
            <Zap className="w-3 h-3" />
            <span>Dynamic allocation via 'new'</span>
          </div>
        </div>
        {block.isDeleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-900/95 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm border-2 border-red-500"
          >
            <span className="text-red-400 font-bold text-xl mb-2">❌ DELETED</span>
            <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded">Memory freed via 'delete'</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}