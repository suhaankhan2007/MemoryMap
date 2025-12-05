/**
 * ArrowSystem - Professional grade Bezier curve arrows with flow animations
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArrowSystem({ arrows, isDarkMode, containerRef }) {
  if (!arrows || arrows.length === 0) return null;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ zIndex: 1, width: '100%', height: '100%' }}
    >
      <defs>
        {/* Pointer Arrow Heads */}
        <marker
          id="arrowhead-heap"
          markerWidth="14"
          markerHeight="14"
          refX="13"
          refY="7"
          orient="auto"
        >
          <path d="M 0 0 L 14 7 L 0 14 z" fill={isDarkMode ? "#34d399" : "#10b981"} />
        </marker>
        <marker
          id="arrowhead-heap-dark"
          markerWidth="14"
          markerHeight="14"
          refX="13"
          refY="7"
          orient="auto"
        >
          <path d="M 0 0 L 14 7 L 0 14 z" fill="#34d399" />
        </marker>
        <marker
          id="arrowhead-stack"
          markerWidth="14"
          markerHeight="14"
          refX="13"
          refY="7"
          orient="auto"
        >
          <path d="M 0 0 L 14 7 L 0 14 z" fill={isDarkMode ? "#60a5fa" : "#3b82f6"} />
        </marker>
        <marker
          id="arrowhead-stack-dark"
          markerWidth="14"
          markerHeight="14"
          refX="13"
          refY="7"
          orient="auto"
        >
          <path d="M 0 0 L 14 7 L 0 14 z" fill="#60a5fa" />
        </marker>
        <marker
          id="arrowhead-dangling"
          markerWidth="14"
          markerHeight="14"
          refX="13"
          refY="7"
          orient="auto"
        >
          <path d="M 0 0 L 14 7 L 0 14 z" fill="#ef4444" />
        </marker>
        
        {/* Gradients */}
        <linearGradient id="pointer-gradient-heap" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDarkMode ? "#34d399" : "#10b981"} stopOpacity="0.5" />
          <stop offset="100%" stopColor={isDarkMode ? "#34d399" : "#10b981"} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="pointer-gradient-stack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity="0.5" />
          <stop offset="100%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity="1" />
        </linearGradient>
      </defs>
      
      <AnimatePresence>
        {arrows.map((arrow) => {
          const isDangling = arrow.isDangling;
          const strokeColor = isDangling
            ? "#ef4444"
            : arrow.isHeapTarget 
              ? (isDarkMode ? "#34d399" : "#10b981")
              : (isDarkMode ? "#60a5fa" : "#3b82f6");
              
          const markerEnd = isDangling
            ? "url(#arrowhead-dangling)"
            : arrow.isHeapTarget
              ? (isDarkMode ? "url(#arrowhead-heap-dark)" : "url(#arrowhead-heap)")
              : (isDarkMode ? "url(#arrowhead-stack-dark)" : "url(#arrowhead-stack)");
          
          return (
            <motion.g
              key={`${arrow.from}-${arrow.to}-${arrow.index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: arrow.index * 0.1 }}
            >
              {/* Glow Effect / Shadow */}
              <motion.path
                d={arrow.path}
                stroke={strokeColor}
                strokeWidth="8"
                fill="none"
                opacity={isDangling ? "0.2" : "0.1"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: arrow.index * 0.1 }}
              />
              
              {/* Main Arrow Line */}
              <motion.path
                d={arrow.path}
                stroke={strokeColor}
                strokeWidth={isDangling ? "3" : "4"}
                fill="none"
                markerEnd={markerEnd}
                strokeDasharray={isDangling ? "6,6" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: arrow.index * 0.1 }}
              />
              
              {/* Flow Animation (Particle moving along path) */}
              {!isDangling && (
                <>
                  <motion.circle
                    r="3"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      offsetDistance: ["0%", "100%"]
                    }}
                    style={{ 
                      offsetPath: `path("${arrow.path}")`,
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: arrow.index * 0.2
                    }}
                  />
                  {/* Dashed line animation moving */}
                  <motion.path
                    d={arrow.path}
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4, 12"
                    strokeOpacity="0.3"
                    animate={{ 
                      strokeDashoffset: [0, -16],
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </>
              )}

              {/* Label */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: arrow.index * 0.1 + 0.6 }}
              >
                <foreignObject 
                  x={arrow.labelX - 40} 
                  y={arrow.labelY - 12} 
                  width="80" 
                  height="24"
                >
                  <div className={`
                    flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md border
                    ${isDangling 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : arrow.isHeapTarget
                        ? (isDarkMode ? 'bg-emerald-900/80 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-700 border-emerald-200')
                        : (isDarkMode ? 'bg-blue-900/80 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200')
                    }
                  `}>
                    {arrow.from}
                    {isDangling && " ⚠️"}
                  </div>
                </foreignObject>
              </motion.g>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
