import React, { forwardRef } from "react";
import { motion } from "framer-motion";

/**
 * LinkedListNode - Premium circular node visualization
 * Displays value, next pointer, and connecting arrows
 */
const LinkedListNode = forwardRef(({ 
  node, 
  index, 
  isHead, 
  isTail, 
  isDarkMode,
  isHighlighted,
  onHover,
  nodeType = 'singly' // 'singly' or 'doubly'
}, ref) => {
  const { address, value, isDeleted } = node;
  
  // Extract data value from node (commonly 'data', 'val', or 'value')
  const dataValue = value?.data ?? value?.val ?? value?.value ?? '?';
  const hasNext = value?.next !== null && value?.next !== undefined;
  const hasPrev = nodeType === 'doubly' && value?.prev !== null && value?.prev !== undefined;
  
  const baseGradient = isDeleted 
    ? "from-gray-500 to-gray-600"
    : isHighlighted
      ? "from-yellow-400 via-orange-500 to-red-500"
      : "from-emerald-400 via-teal-500 to-cyan-600";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: index * 0.1 
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => onHover?.(address)}
      onMouseLeave={() => onHover?.(null)}
      className="relative flex flex-col items-center"
      data-address={address}
    >
      {/* Head/Tail Label */}
      {(isHead || isTail) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute -top-8 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            isHead 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
          }`}
        >
          {isHead ? '🔗 HEAD' : '🔚 TAIL'}
        </motion.div>
      )}

      {/* Node Container */}
      <div className="flex items-center">
        {/* Prev Pointer (for doubly linked) */}
        {nodeType === 'doubly' && (
          <div className={`w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center text-xs mr-1 ${
            hasPrev 
              ? 'border-purple-400 bg-purple-500/20 text-purple-300' 
              : 'border-gray-500 bg-gray-700/30 text-gray-500'
          }`}>
            {hasPrev ? '←' : '∅'}
          </div>
        )}

        {/* Main Node Circle */}
        <motion.div
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${baseGradient} shadow-2xl border-4 ${
            isDeleted ? 'border-gray-400 opacity-50' : 'border-white/40'
          } flex items-center justify-center cursor-pointer overflow-hidden`}
          style={{
            boxShadow: isHighlighted 
              ? '0 0 30px rgba(251, 191, 36, 0.6)' 
              : '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm" />
          
          {/* Value Display */}
          <div className="relative z-10 text-center">
            <div className="font-mono text-2xl font-black text-white drop-shadow-lg">
              {dataValue}
            </div>
          </div>

          {/* Deleted overlay */}
          {isDeleted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <span className="text-red-400 text-3xl">✕</span>
            </motion.div>
          )}
        </motion.div>

        {/* Next Pointer Box */}
        <div className={`w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center text-xs ml-1 transition-all ${
          hasNext 
            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' 
            : 'border-gray-500 bg-gray-700/30 text-gray-500'
        }`}>
          {hasNext ? '→' : '∅'}
        </div>
      </div>

      {/* Address Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className={`mt-3 px-3 py-1 rounded-full text-[10px] font-mono ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-300' 
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {address}
      </motion.div>
    </motion.div>
  );
});

LinkedListNode.displayName = 'LinkedListNode';

export default LinkedListNode;
