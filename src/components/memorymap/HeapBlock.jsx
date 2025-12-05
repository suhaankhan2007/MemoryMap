import React from "react";
import { motion } from "framer-motion";
import { Database, Trash2, AlertTriangle, Box, Layers, Braces } from "lucide-react";

export default function HeapBlock({ block, isDarkMode, isLeaked }) {
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') {
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  const renderArrayValue = (values) => {
    if (!Array.isArray(values)) return null;
    
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {values.slice(0, 10).map((val, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.1, y: -2 }}
            className="bg-white/15 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center border border-white/25 shadow-lg cursor-pointer"
          >
            <div className="text-[9px] opacity-60 font-semibold">[{idx}]</div>
            <div className="font-mono text-sm font-bold">{formatValue(val)}</div>
          </motion.div>
        ))}
        {values.length > 10 && (
          <div className="col-span-5 text-center text-xs opacity-75 py-1">
            ... +{values.length - 10} more elements
          </div>
        )}
      </div>
    );
  };

  // Get size estimation for type
  const getTypeSize = (type) => {
    const sizes = {
      'int': 4, 'float': 4, 'double': 8, 'char': 1, 'bool': 1,
      'long': 8, 'short': 2, 'std::string': 32
    };
    const baseType = type?.replace(/[*\[\]0-9]/g, '').trim();
    return sizes[baseType] || 8;
  };

  const isArray = block.isArray || block.isVector;
  const isDeleted = block.isDeleted;
  const isStruct = block.isStruct;
  const typeSize = getTypeSize(block.type);
  const totalSize = isArray && Array.isArray(block.value) 
    ? block.value.length * typeSize 
    : typeSize;
  
  // Premium gradient based on state
  const gradientClass = isLeaked && !isDeleted
    ? "from-red-500 via-red-600 to-red-700"
    : isDeleted 
      ? "from-gray-500 via-gray-600 to-gray-700"
      : isArray
        ? "from-amber-400 via-orange-500 to-red-500"
        : isStruct
          ? "from-rose-400 via-pink-500 to-purple-500"
          : "from-orange-400 via-red-500 to-pink-500";
  
  // 3D shadow effect
  const shadowStyle = isDeleted 
    ? {} 
    : {
        boxShadow: `
          0 10px 30px -10px rgba(0, 0, 0, 0.4),
          0 20px 50px -20px ${isLeaked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(249, 115, 22, 0.3)'},
          inset 0 -3px 0 0 rgba(0, 0, 0, 0.2),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
        `
      };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.5, 
        y: 20,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: isDeleted ? 1 : 1.02, y: isDeleted ? 0 : -4 }}
      className="relative group"
    >
      {/* 3D Card Container */}
      <div 
        className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-5 text-white border-2 transition-all duration-300 ${
          isDeleted 
            ? 'border-gray-400 opacity-50' 
            : isLeaked 
              ? 'border-red-300 ring-2 ring-red-400 ring-offset-2 ring-offset-transparent' 
              : 'border-white/30 group-hover:border-white/50'
        }`}
        style={shadowStyle}
      >
        {/* Memory Leak Badge */}
        {isLeaked && !isDeleted && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 border border-red-400"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </motion.span>
            LEAK
          </motion.div>
        )}

        {/* Size Badge */}
        {!isDeleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -left-2 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border border-white/20"
          >
            {totalSize} bytes
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isDeleted ? (
              <Trash2 className="w-5 h-5 opacity-50" />
            ) : isArray ? (
              <Layers className="w-4 h-4" />
            ) : isStruct ? (
              <Braces className="w-4 h-4" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span className="text-xs bg-black/25 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm border border-white/10">
              {block.type}
            </span>
          </div>
          {isDeleted && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs bg-red-900/60 px-3 py-1 rounded-full font-bold border border-red-400/50"
            >
              ✕ DELETED
            </motion.span>
          )}
        </div>
        
        {isArray ? (
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs opacity-75 font-semibold uppercase tracking-wide">
                  {block.isVector ? '📦 Vector' : '📊 Array'} Elements
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                  {Array.isArray(block.value) ? block.value.length : 0} items
                </span>
              </div>
              {renderArrayValue(block.value)}
            </div>
          </div>
        ) : isStruct ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-2 font-semibold">Members:</div>
              {block.members?.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0"
                >
                  <span className="text-xs opacity-75">.{member.name}</span>
                  <span className="font-mono text-sm font-bold">
                    {formatValue(block.value?.[member.name])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div 
            className="font-mono text-3xl font-black mb-2 break-words drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {formatValue(block.value)}
          </motion.div>
        )}
        
        <div className="mt-4 pt-3 border-t border-white/20 space-y-2">
          <div className="text-xs opacity-90 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
              {block.address}
            </span>
            {!isDeleted && (
              <span className="bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                Heap
              </span>
            )}
          </div>
          {isLeaked && !isDeleted && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs bg-red-900/40 backdrop-blur-sm px-3 py-2 rounded-lg font-semibold flex items-center gap-2 border border-red-400/30"
            >
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <span>Never freed - Memory Leak!</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
