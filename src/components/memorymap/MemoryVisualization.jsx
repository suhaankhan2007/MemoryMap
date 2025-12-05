
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, HardDrive, GitBranch, Binary } from "lucide-react";
import StackFrame from "./StackFrame";
import HeapBlock from "./HeapBlock";
import DataStructureRenderer from "./DataStructureRenderer";
import ArrowSystem from "./ArrowSystem";

export default function MemoryVisualization({ memoryState, isActive, isDarkMode, memoryLeaks = [] }) {
  const { 
    stack = [], 
    heap = [], 
    pointers = [],
    linkedListConnections = [],
    treeConnections = []
  } = memoryState;
  const stackRefs = useRef({});
  const heapRefs = useRef({});
  const containerRef = useRef(null);
  const [arrowPaths, setArrowPaths] = useState([]);

  // Check for data structures in heap
  const hasLinkedLists = heap.some(h => h.isLinkedListNode && !h.isDeleted);
  const hasTrees = heap.some(h => h.isBinaryTreeNode && !h.isDeleted);
  const hasDataStructures = hasLinkedLists || hasTrees;

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

          // Create smooth bezier curve with S-shape
          const distance = Math.abs(endX - startX);
          const curveOffset = Math.min(distance * 0.3, 80);
          const control1X = startX + distance * 0.3;
          const control1Y = startY - curveOffset * 0.5;
          const control2X = endX - distance * 0.3;
          const control2Y = endY - curveOffset * 0.5;
          
          const path = `M ${startX} ${startY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${endX} ${endY}`;

          // Determine if pointing to heap or stack
          const isHeapTarget = heap.some(h => h.address === pointer.to);

          // Label position (middle of curve)
          const labelX = (startX + endX) / 2;
          const labelY = Math.min(startY, endY) - curveOffset;

          paths.push({
            path,
            from: pointer.from,
            to: pointer.to,
            type: pointer.type || 'pointer',
            index,
            startX,
            startY,
            endX,
            endY,
            labelX,
            labelY,
            isHeapTarget,
            isDangling: pointer.isDangling,
            dataStructureType: pointer.dataStructureType,
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

  // Filter out data structure nodes for special rendering
  const regularHeapBlocks = heap.filter(h => !h.isLinkedListNode && !h.isBinaryTreeNode);
  const dsHeapBlocks = heap.filter(h => h.isLinkedListNode || h.isBinaryTreeNode);

  return (
    <div ref={containerRef} className="relative min-h-[600px]">
      {/* Professional Arrow System */}
      {arrowPaths.length > 0 && (
        <ArrowSystem 
          arrows={arrowPaths} 
          isDarkMode={isDarkMode}
          containerRef={containerRef}
        />
      )}

      {/* Data Structure Visualization Section */}
      {hasDataStructures && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-2xl border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700' 
              : 'bg-gradient-to-br from-slate-50 to-white border-slate-200'
          } shadow-xl`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
              <GitBranch className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Data Structures Detected
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {hasLinkedLists && 'Linked List'}{hasLinkedLists && hasTrees && ' • '}{hasTrees && 'Binary Tree'}
              </p>
            </div>
          </div>
          
          <DataStructureRenderer
            heap={dsHeapBlocks}
            linkedListConnections={linkedListConnections}
            treeConnections={treeConnections}
            isDarkMode={isDarkMode}
            containerRef={containerRef}
          />
        </motion.div>
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
              {regularHeapBlocks.length === 0 && !hasDataStructures ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} italic py-8 text-center ${emptyBoxClass} rounded-lg border-2 border-dashed`}
                >
                  No heap allocations yet
                </motion.div>
              ) : regularHeapBlocks.length === 0 && hasDataStructures ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} py-4 text-center ${emptyBoxClass} rounded-lg border-2 border-dashed flex items-center justify-center gap-2`}
                >
                  <Binary className="w-4 h-4" />
                  <span>Data structures shown above</span>
                </motion.div>
              ) : (
                regularHeapBlocks.map((block, index) => (
                  <div key={block.address} ref={(el) => {
                    if (el) heapRefs.current[block.address] = el;
                  }}>
                    <HeapBlock 
                      block={block} 
                      isDarkMode={isDarkMode}
                      isLeaked={memoryLeaks.includes(block.address)}
                    />
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
