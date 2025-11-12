import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, HardDrive } from "lucide-react";
import StackFrame from "./StackFrame";
import HeapBlock from "./HeapBlock";

export default function MemoryVisualization({ memoryState, isActive, isDarkMode }) {
  const { stack = [], heap = [], pointers = [] } = memoryState;
  const stackRefs = useRef({});
  const heapRefs = useRef({});
  const containerRef = useRef(null);
  const [arrowPaths, setArrowPaths] = useState([]);

  // Calculate arrow paths when memory state changes
  useEffect(() => {
    if (pointers.length === 0) {
      setArrowPaths([]);
      return;
    }

    // Small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      const paths = [];
      
      pointers.forEach((pointer, index) => {
        const fromElement = stackRefs.current[pointer.from];
        const toElement = heapRefs.current[pointer.to] || stackRefs.current[findStackVarByAddress(pointer.to)];

        if (fromElement && toElement && containerRef.current) {
          const fromRect = fromElement.getBoundingClientRect();
          const toRect = toElement.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          // Calculate positions - arrow goes FROM right edge of pointer TO left edge of target
          const startX = fromRect.right - containerRect.left;
          const startY = fromRect.top - containerRect.top + fromRect.height / 2;
          const endX = toRect.left - containerRect.left;
          const endY = toRect.top - containerRect.top + toRect.height / 2;

          // Create smooth curved path with control point above
          const midX = (startX + endX) / 2;
          const distance = Math.abs(endX - startX);
          const curveOffset = Math.min(distance * 0.3, 60);
          const controlY = Math.min(startY, endY) - curveOffset;
          
          const path = `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;

          // Determine if pointing to heap or stack
          const isHeapTarget = heap.some(h => h.address === pointer.to);

          paths.push({
            path,
            from: pointer.from,
            to: pointer.to,
            index,
            startX,
            startY,
            endX,
            endY,
            isHeapTarget,
            isDangling: pointer.isDangling,
            midX,
            controlY,
          });
        }
      });

      setArrowPaths(paths);
    }, 200);

    return () => clearTimeout(timer);
  }, [pointers, stack, heap, isDarkMode]);

  const findStackVarByAddress = (address) => {
    const variable = stack.find(v => v.address === address);
    return variable?.name;
  };

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-purple-200 to-blue-200'} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <svg className={`w-10 h-10 ${isDarkMode ? 'text-gray-400' : 'text-purple-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </motion.div>
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Ready to visualize memory</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Click <strong className="text-yellow-600">Parse Code</strong> to begin</p>
        </div>
      </div>
    );
  }

  const emptyBoxClass = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
  const titleClass = isDarkMode ? 'text-gray-300' : 'text-gray-800';
  const subtitleClass = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-blue-200';
  const heapBorderClass = isDarkMode ? 'border-gray-600' : 'border-orange-200';

  return (
    <div ref={containerRef} className="relative min-h-[600px]">
      {/* Pointer Arrows - SVG layer BEHIND content */}
      {arrowPaths.length > 0 && (
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ zIndex: 1, width: '100%', height: '100%' }}
        >
          <defs>
            <marker
              id="arrowhead-heap"
              markerWidth="14"
              markerHeight="14"
              refX="13"
              refY="7"
              orient="auto"
            >
              <path d="M 0 0 L 14 7 L 0 14 z" fill="#10b981" />
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
              <path d="M 0 0 L 14 7 L 0 14 z" fill="#3b82f6" />
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
          </defs>
          
          <AnimatePresence>
            {arrowPaths.map((arrow) => {
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
                  transition={{ duration: 0.5, delay: arrow.index * 0.2 }}
                >
                  {/* Glowing background */}
                  <motion.path
                    d={arrow.path}
                    stroke={strokeColor}
                    strokeWidth="8"
                    fill="none"
                    opacity={isDangling ? "0.4" : "0.2"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: arrow.index * 0.2 }}
                  />
                  
                  {/* Main arrow line */}
                  <motion.path
                    d={arrow.path}
                    stroke={strokeColor}
                    strokeWidth="4"
                    fill="none"
                    markerEnd={markerEnd}
                    strokeDasharray={isDangling ? "4,4" : "8,4"}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                    }}
                    transition={{ 
                      pathLength: { duration: 0.8, ease: "easeInOut", delay: arrow.index * 0.2 },
                    }}
                  />
                  
                  {/* Animated dash movement */}
                  {!isDangling && (
                    <motion.path
                      d={arrow.path}
                      stroke={strokeColor}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8,4"
                      animate={{ 
                        strokeDashoffset: [0, -12],
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                        delay: arrow.index * 0.2 + 0.8
                      }}
                    />
                  )}

                  {/* Pointer label */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: arrow.index * 0.2 + 0.5 }}
                  >
                    <rect
                      x={(arrow.startX + arrow.endX) / 2 - 30}
                      y={arrow.controlY - 15}
                      width="60"
                      height="24"
                      rx="12"
                      fill={strokeColor}
                      opacity="0.95"
                    />
                    <text
                      x={(arrow.startX + arrow.endX) / 2}
                      y={arrow.controlY}
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono"
                    >
                      {arrow.from}
                      {isDangling && " ⚠️"}
                    </text>
                  </motion.g>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      )}

      <div className="relative z-10 grid grid-cols-2 gap-10">
        {/* Stack Section */}
        <div>
          <div className={`mb-5 pb-3 border-b-2 ${borderClass}`}>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className={`text-base font-bold ${titleClass} uppercase tracking-wide`}>
                Stack Memory
              </h3>
            </div>
            <p className={`text-xs ${subtitleClass}`}>Local variables & automatic storage</p>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {stack.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} italic py-8 text-center ${emptyBoxClass} rounded-lg border-2 border-dashed`}
                >
                  No stack variables yet
                </motion.div>
              ) : (
                stack.map((variable, index) => (
                  <div key={`${variable.name}-${index}`} ref={(el) => {
                    if (el) {
                      stackRefs.current[variable.name] = el;
                      if (variable.address) {
                        stackRefs.current[variable.address] = el;
                      }
                    }
                  }}>
                    <StackFrame variable={variable} isDarkMode={isDarkMode} />
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Heap Section */}
        <div>
          <div className={`mb-5 pb-3 border-b-2 ${heapBorderClass}`}>
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-5 h-5 text-orange-600" />
              <h3 className={`text-base font-bold ${titleClass} uppercase tracking-wide`}>
                Heap Memory
              </h3>
            </div>
            <p className={`text-xs ${subtitleClass}`}>Dynamic allocations (new/delete) - RAII</p>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} italic py-8 text-center ${emptyBoxClass} rounded-lg border-2 border-dashed`}
                >
                  No heap allocations yet
                </motion.div>
              ) : (
                heap.map((block, index) => (
                  <div key={block.address} ref={(el) => {
                    if (el) heapRefs.current[block.address] = el;
                  }}>
                    <HeapBlock block={block} isDarkMode={isDarkMode} />
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Legend for pointers */}
      {pointers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 ${isDarkMode ? 'bg-gray-700/80' : 'bg-green-50/80'} backdrop-blur-sm border-2 ${isDarkMode ? 'border-green-400' : 'border-green-300'} rounded-lg px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} shadow-lg flex items-center justify-center gap-2`}
        >
          <span className="text-lg">→</span>
          <span>{pointers.length} active pointer{pointers.length > 1 ? 's' : ''} connecting to {heap.filter(h => !h.isDeleted).length > 0 ? 'heap memory' : 'stack variables'}</span>
        </motion.div>
      )}
    </div>
  );
}