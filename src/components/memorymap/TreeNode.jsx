import React, { forwardRef } from "react";
import { motion } from "framer-motion";

/**
 * TreeNode - Premium binary tree node visualization
 * Displays value with left/right child indicators
 */
const TreeNode = forwardRef(({ 
  node, 
  level = 0,
  position = 'root', // 'root', 'left', 'right'
  isRoot,
  isDarkMode,
  isHighlighted,
  onHover,
}, ref) => {
  const { address, value, isDeleted } = node;
  
  // Extract data value
  const dataValue = value?.data ?? value?.val ?? value?.value ?? '?';
  const hasLeft = value?.left !== null && value?.left !== undefined;
  const hasRight = value?.right !== null && value?.right !== undefined;
  
  const baseGradient = isDeleted 
    ? "from-gray-500 to-gray-600"
    : isRoot
      ? "from-amber-400 via-orange-500 to-red-500"
      : isHighlighted
        ? "from-yellow-400 via-orange-500 to-red-500"
        : position === 'left'
          ? "from-blue-400 via-indigo-500 to-purple-600"
          : "from-pink-400 via-rose-500 to-red-600";

  // Node size decreases with level
  const nodeSize = Math.max(56, 80 - level * 8);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: level * 0.15 
      }}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      onMouseEnter={() => onHover?.(address)}
      onMouseLeave={() => onHover?.(null)}
      className="relative flex flex-col items-center"
      data-address={address}
    >
      {/* Root Label */}
      {isRoot && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-7 px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        >
          🌳 ROOT
        </motion.div>
      )}

      {/* Main Node */}
      <motion.div
        className={`relative rounded-xl bg-gradient-to-br ${baseGradient} shadow-2xl border-4 ${
          isDeleted ? 'border-gray-400 opacity-50' : 'border-white/40'
        } flex items-center justify-center cursor-pointer overflow-hidden`}
        style={{
          width: nodeSize,
          height: nodeSize,
          boxShadow: isHighlighted 
            ? '0 0 30px rgba(251, 191, 36, 0.6)' 
            : '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Inner styling */}
        <div className="absolute inset-1 rounded-lg bg-white/10 backdrop-blur-sm" />
        
        {/* Value */}
        <div className="relative z-10 text-center">
          <div className={`font-mono font-black text-white drop-shadow-lg ${
            nodeSize > 60 ? 'text-2xl' : 'text-lg'
          }`}>
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
            <span className="text-red-400 text-2xl">✕</span>
          </motion.div>
        )}
      </motion.div>

      {/* Child indicators */}
      <div className="flex gap-4 mt-2">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          hasLeft 
            ? 'bg-blue-500/30 text-blue-300 border border-blue-400' 
            : 'bg-gray-700/30 text-gray-500 border border-gray-600'
        }`}>
          L {hasLeft ? '↙' : '∅'}
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          hasRight 
            ? 'bg-pink-500/30 text-pink-300 border border-pink-400' 
            : 'bg-gray-700/30 text-gray-500 border border-gray-600'
        }`}>
          R {hasRight ? '↘' : '∅'}
        </div>
      </div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: level * 0.15 + 0.2 }}
        className={`mt-1 px-2 py-0.5 rounded text-[9px] font-mono ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-400' 
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {address}
      </motion.div>
    </motion.div>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;


