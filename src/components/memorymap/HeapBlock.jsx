import React from "react";
import { motion } from "framer-motion";
import { Database, Trash2, AlertTriangle } from "lucide-react";

export default function HeapBlock({ block, isDarkMode, isLeaked }) {
  const formatValue = (value) => {
    if (typeof value === 'string') {
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }
    }
    return value;
  };

  const renderArrayValue = (values) => {
    if (!Array.isArray(values)) return null;
    
    return (
      <div className="grid grid-cols-5 gap-1">
        {values.slice(0, 10).map((val, idx) => (
          <div 
            key={idx}
            className="bg-white/10 backdrop-blur-sm rounded px-2 py-1 text-center border border-white/20"
          >
            <div className="text-[10px] opacity-75">[{idx}]</div>
            <div className="font-mono text-xs font-bold">{formatValue(val)}</div>
          </div>
        ))}
        {values.length > 10 && (
          <div className="col-span-5 text-center text-xs opacity-75">
            ... +{values.length - 10} more
          </div>
        )}
      </div>
    );
  };

  const isArray = block.isArray || block.isVector;
  const isDeleted = block.isDeleted;
  
  // Memory leak visual indicator
  const gradientClass = isLeaked && !isDeleted
    ? "from-red-500 via-red-600 to-red-700"
    : isDeleted 
      ? "from-gray-500 via-gray-600 to-gray-700"
      : "from-orange-400 via-red-500 to-pink-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: isDeleted ? 1 : 1.02, y: isDeleted ? 0 : -2 }}
      className="relative"
    >
      <div className={`bg-gradient-to-br ${gradientClass} rounded-xl p-5 shadow-xl text-white border-2 ${
        isDeleted ? 'border-gray-400 opacity-50' : isLeaked ? 'border-red-300 ring-2 ring-red-300 ring-offset-2' : 'border-white/30'
      }`}>
        {/* Memory Leak Badge */}
        {isLeaked && !isDeleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            LEAK
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isDeleted ? (
              <Trash2 className="w-5 h-5 opacity-50" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
              {block.type}
            </span>
          </div>
          {isDeleted && (
            <span className="text-xs bg-red-900/50 px-2 py-1 rounded-full font-bold">
              DELETED
            </span>
          )}
        </div>
        
        {isArray ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-2">
                {block.isVector ? 'Vector' : 'Array'} Elements:
              </div>
              {renderArrayValue(block.value)}
            </div>
          </div>
        ) : (
          <div className="font-mono text-2xl font-bold mb-2 break-words">
            {formatValue(block.value)}
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
          <div className="text-xs opacity-90 font-mono flex items-center justify-between">
            <span>📍 Heap: {block.address}</span>
            {!isDeleted && (
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">
                Dynamic
              </span>
            )}
          </div>
          {isLeaked && !isDeleted && (
            <div className="text-xs bg-red-900/30 px-2 py-1 rounded font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Never freed - Memory Leak!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}