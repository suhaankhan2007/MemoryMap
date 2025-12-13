
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, HardDrive } from "lucide-react";
import StackFrame from "./StackFrame";
import HeapBlock from "./HeapBlock";

export default function MemoryVisualization({ memoryState = {}, isActive, isDarkMode, memoryLeaks = [] }) {
  // Safety: ensure memoryState and its properties are valid
  const safeMemoryState = memoryState || {};
  const stack = Array.isArray(safeMemoryState.stack) ? safeMemoryState.stack.filter(v => v) : [];
  const heap = Array.isArray(safeMemoryState.heap) ? safeMemoryState.heap.filter(h => h) : [];
  const pointers = Array.isArray(safeMemoryState.pointers) ? safeMemoryState.pointers.filter(p => p && p.from && p.to) : [];
  const linkedListConnections = Array.isArray(safeMemoryState.linkedListConnections) 
    ? safeMemoryState.linkedListConnections.filter(c => c && c.from && c.to) 
    : [];
  
  const stackRefs = useRef({});
  const heapRefs = useRef({});
  const containerRef = useRef(null);
  const [arrowPaths, setArrowPaths] = useState([]);
  const [cyclePaths, setCyclePaths] = useState([]);

  // Create stable dependency keys to prevent infinite loops
  // Use a simple string key based on lengths and first/last items
  const pointersKey = useMemo(() => {
    if (pointers.length === 0) return '';
    const first = pointers[0] ? `${pointers[0].from}-${pointers[0].to}` : '';
    const last = pointers[pointers.length - 1] ? `${pointers[pointers.length - 1].from}-${pointers[pointers.length - 1].to}` : '';
    return `${pointers.length}-${first}-${last}`;
  }, [pointers.length, pointers[0]?.from, pointers[0]?.to, pointers[pointers.length - 1]?.from, pointers[pointers.length - 1]?.to]);

  const stackKey = useMemo(() => {
    if (stack.length === 0) return '';
    const first = stack[0]?.name || stack[0]?.address || '';
    const last = stack[stack.length - 1]?.name || stack[stack.length - 1]?.address || '';
    return `${stack.length}-${first}-${last}`;
  }, [stack.length, stack[0]?.name, stack[0]?.address, stack[stack.length - 1]?.name, stack[stack.length - 1]?.address]);

  const heapKey = useMemo(() => {
    if (heap.length === 0) return '';
    const first = heap[0]?.address || '';
    const last = heap[heap.length - 1]?.address || '';
    return `${heap.length}-${first}-${last}`;
  }, [heap.length, heap[0]?.address, heap[heap.length - 1]?.address]);

  // Detect cycles in linked list - improved algorithm
  const detectCycles = (connections) => {
    const cycleConnections = [];
    
    // Build a map of all 'next' connections
    const nextMap = new Map();
    const allConnections = [];
    connections.forEach(conn => {
      if (conn.type === 'next') {
        nextMap.set(conn.from, conn.to);
        allConnections.push(conn);
      }
    });
    
    if (nextMap.size === 0) return [];
    
    // Find all nodes
    const allNodes = new Set();
    const pointedTo = new Set();
    allConnections.forEach(conn => {
      allNodes.add(conn.from);
      allNodes.add(conn.to);
      pointedTo.add(conn.to);
    });
    
    // Find starting nodes (nodes not pointed to by others, or any node if all are in cycle)
    const startNodes = Array.from(allNodes).filter(node => !pointedTo.has(node));
    if (startNodes.length === 0 && allNodes.size > 0) {
      // All nodes are in a cycle, start from first node
      startNodes.push(Array.from(allNodes)[0]);
    }
    
    // For each starting node, use Floyd's cycle detection approach
    startNodes.forEach(startNode => {
      const visited = new Set();
      const nodeToPathIndex = new Map(); // Track where each node appears in path
      let current = startNode;
      let steps = 0;
      const maxSteps = 200; // Increased for longer lists
      
      while (current && steps < maxSteps) {
        // Check if we've seen this node before (cycle detected!)
        if (visited.has(current)) {
          // Find the connection that creates the cycle
          // The cycle is created by the connection from the previous node to this already-visited node
          const prevNode = Array.from(visited).pop();
          if (prevNode) {
            const cycleConn = allConnections.find(c => 
              c.from === prevNode && c.to === current
            );
            if (cycleConn && !cycleConnections.some(cc => cc.from === cycleConn.from && cc.to === cycleConn.to)) {
              cycleConnections.push(cycleConn);
            }
          }
          break;
        }
        
        visited.add(current);
        nodeToPathIndex.set(current, visited.size - 1);
        
        const nextNode = nextMap.get(current);
        if (!nextNode || nextNode === null) break;
        
        // Check if next node is already visited (creates cycle)
        if (visited.has(nextNode)) {
          const cycleConn = allConnections.find(c => 
            c.from === current && c.to === nextNode
          );
          if (cycleConn && !cycleConnections.some(cc => cc.from === cycleConn.from && cc.to === cycleConn.to)) {
            cycleConnections.push(cycleConn);
          }
          break;
        }
        
        current = nextNode;
        steps++;
      }
    });
    
    // Also check all connections directly - if a connection points to an earlier node, it's a cycle
    allConnections.forEach(conn => {
      // If this connection's 'to' node appears before 'from' in any traversal, it's a cycle
      const fromNode = conn.from;
      const toNode = conn.to;
      
      // Simple check: if we can reach 'from' from 'to', then 'to' -> 'from' -> ... -> 'to' is a cycle
      let canReach = false;
      let temp = nextMap.get(toNode);
      let tempSteps = 0;
      while (temp && tempSteps < 100) {
        if (temp === fromNode) {
          canReach = true;
          break;
        }
        temp = nextMap.get(temp);
        tempSteps++;
      }
      
      if (canReach && !cycleConnections.some(cc => cc.from === conn.from && cc.to === conn.to)) {
        cycleConnections.push(conn);
      }
    });
    
    return cycleConnections;
  };

  // Calculate cycle paths for visualization
  useEffect(() => {
    if (linkedListConnections.length === 0) {
      setCyclePaths([]);
      return;
    }

    const timer = setTimeout(() => {
      const cycleConnections = detectCycles(linkedListConnections);
      const cycleArrows = [];
      
      cycleConnections.forEach((conn, index) => {
        // Find the from and to heap blocks
        const fromBlock = heap.find(h => h.address === conn.from);
        const toBlock = heap.find(h => h.address === conn.to);
        
        if (fromBlock && toBlock) {
          let fromElement = heapRefs.current[conn.from];
          let toElement = heapRefs.current[conn.to];
          
          // Fallback: find by data attribute
          if (!fromElement && containerRef.current) {
            fromElement = containerRef.current.querySelector(`[data-heap-address="${conn.from}"]`);
          }
          if (!toElement && containerRef.current) {
            toElement = containerRef.current.querySelector(`[data-heap-address="${conn.to}"]`);
          }
          
          if (fromElement && toElement && containerRef.current) {
            const fromRect = fromElement.getBoundingClientRect();
            const toRect = toElement.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            
            // Calculate positions
            const startX = fromRect.right - containerRect.left - 2;
            const startY = fromRect.top - containerRect.top + fromRect.height / 2;
            const endX = toRect.left - containerRect.left + 2;
            const endY = toRect.top - containerRect.top + toRect.height / 2;
            
            // Create a dramatic loop path that goes high up and curves back (very obvious for cycles)
            const midX = (startX + endX) / 2;
            const distance = Math.abs(endX - startX);
            // Make the loop much higher and more dramatic
            const loopHeight = Math.max(150, Math.max(distance * 0.5, 200));
            const controlY = Math.min(startY, endY) - loopHeight;
            
            // Create a dramatic curved path with cubic bezier - goes high up to make cycle obvious
            const controlX1 = startX + (endX - startX) * 0.25;
            const controlX2 = startX + (endX - startX) * 0.75;
            // Add extra curve points for more dramatic loop
            const path = `M ${startX} ${startY} 
                         C ${controlX1} ${controlY - 20} ${controlX2} ${controlY - 20} ${endX} ${endY}`;
            
            cycleArrows.push({
              path,
              from: conn.from,
              to: conn.to,
              cycleIndex: index,
              startX,
              startY,
              endX,
              endY,
              midX,
              controlY,
              isCycle: true
            });
          }
        }
      });
      
      setCyclePaths(cycleArrows);
    }, 350);

    return () => clearTimeout(timer);
  }, [linkedListConnections, heap, isDarkMode]);

  // Calculate arrow paths when memory state changes
  useEffect(() => {
    if (!isActive) return;
    
    try {
      if (pointers.length === 0) {
        setArrowPaths([]);
        return;
      }

      // Small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        try {
          const paths = [];
          
          // Group pointers by target to handle multiple pointers to same object
          const pointersByTarget = new Map();
          pointers.forEach((pointer, index) => {
            if (pointer && pointer.from && pointer.to) {
              if (!pointersByTarget.has(pointer.to)) {
                pointersByTarget.set(pointer.to, []);
              }
              pointersByTarget.get(pointer.to).push({ ...pointer, originalIndex: index });
            }
          });
          
          pointers.forEach((pointer, index) => {
            try {
              if (!pointer || !pointer.from || !pointer.to) return;
              
              // Try multiple ways to find the source element
              let fromElement = stackRefs.current[pointer.from] || 
                               stackRefs.current[`ptr_${pointer.from}`];
              
              // Fallback: find by data attribute
              if (!fromElement && containerRef.current) {
                try {
                  fromElement = containerRef.current.querySelector(`[data-variable-name="${pointer.from}"]`);
                } catch (e) {
                  // Ignore querySelector errors
                }
              }
              
              // Try multiple ways to find the target element
              let toElement = heapRefs.current[pointer.to];
              
              if (!toElement && Array.isArray(stack)) {
                // Check if it's a stack variable by address
                const stackVar = stack.find(v => v && v.address === pointer.to);
                if (stackVar) {
                  toElement = stackRefs.current[stackVar.name] || stackRefs.current[stackVar.address];
                  if (!toElement && containerRef.current) {
                    try {
                      toElement = containerRef.current.querySelector(`[data-variable-address="${pointer.to}"]`);
                    } catch (e) {
                      // Ignore querySelector errors
                    }
                  }
                }
              }
              
              // If still not found, try finding by address in heap
              if (!toElement && Array.isArray(heap)) {
                const heapBlock = heap.find(h => h && h.address === pointer.to);
                if (heapBlock) {
                  toElement = heapRefs.current[heapBlock.address];
                  // Fallback: find by data attribute
                  if (!toElement && containerRef.current) {
                    try {
                      toElement = containerRef.current.querySelector(`[data-heap-address="${pointer.to}"]`);
                    } catch (e) {
                      // Ignore querySelector errors
                    }
                  }
                }
              }

              if (fromElement && toElement && containerRef.current) {
                try {
                  const fromRect = fromElement.getBoundingClientRect();
                  const toRect = toElement.getBoundingClientRect();
                  const containerRect = containerRef.current.getBoundingClientRect();

                  // Calculate positions relative to container
                  const startX = fromRect.right - containerRect.left;
                  const startY = fromRect.top - containerRect.top + fromRect.height / 2;
                  const endX = toRect.left - containerRect.left;
                  const endY = toRect.top - containerRect.top + toRect.height / 2;

                  // If multiple pointers to same target, offset them slightly
                  const pointersToSameTarget = pointersByTarget.get(pointer.to) || [];
                  const pointerIndex = pointersToSameTarget.findIndex(p => p && p.from === pointer.from);
                  const offsetY = pointersToSameTarget.length > 1 
                    ? (pointerIndex - (pointersToSameTarget.length - 1) / 2) * 12 
                    : 0;

                  // Ensure arrow connects properly - adjust start/end to be at edges
                  const adjustedStartX = startX - 2;
                  const adjustedEndX = endX + 2;
                  const adjustedEndY = endY + offsetY;

                  // Create smooth curved path with control point
                  const midX = (adjustedStartX + adjustedEndX) / 2;
                  const distance = Math.abs(adjustedEndX - adjustedStartX);
                  const curveOffset = Math.min(distance * 0.25, 50);
                  const controlY = Math.min(startY, adjustedEndY) - curveOffset;
                  
                  // Use quadratic bezier for smooth curve
                  const path = `M ${adjustedStartX} ${startY} Q ${midX} ${controlY} ${adjustedEndX} ${adjustedEndY}`;

                  // Determine if pointing to heap or stack
                  const isHeapTarget = Array.isArray(heap) && heap.some(h => h && h.address === pointer.to);

                  const pathData = {
                    path,
                    from: pointer.from,
                    to: pointer.to,
                    index,
                    startX: adjustedStartX,
                    startY,
                    endX: adjustedEndX,
                    endY: adjustedEndY,
                    isHeapTarget,
                    isDangling: pointer.isDangling || false,
                    midX,
                    controlY,
                  };
                  paths.push(pathData);
                } catch (rectError) {
                  console.warn("Error calculating arrow path:", rectError);
                }
              }
            } catch (pointerError) {
              console.warn("Error processing pointer:", pointerError);
            }
          });

          setArrowPaths(paths);
        } catch (timerError) {
          console.error("Error in arrow calculation timer:", timerError);
          setArrowPaths([]);
        }
      }, 300);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error in arrow calculation useEffect:", error);
      setArrowPaths([]);
    }
  }, [pointersKey, stackKey, heapKey, isDarkMode, isActive]);

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
        <>
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ zIndex: 1, width: '100%', height: '100%' }}
        >
          <defs>
            {/* Smaller, clearer arrowheads */}
            <marker
              id="arrowhead-heap"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" fill="#10b981" stroke="#10b981" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrowhead-heap-dark"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" fill="#34d399" stroke="#34d399" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrowhead-stack"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" fill="#3b82f6" stroke="#3b82f6" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrowhead-stack-dark"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" fill="#60a5fa" stroke="#60a5fa" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrowhead-dangling"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" fill="#ef4444" stroke="#ef4444" strokeWidth="0.5" />
            </marker>
            {/* Cycle arrowhead - distinct orange/pink color */}
            <marker
              id="arrowhead-cycle"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 12 6 L 0 12 L 4 6 Z" fill="#f97316" stroke="#f97316" strokeWidth="0.5" />
            </marker>
            <marker
              id="arrowhead-cycle-dark"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 12 6 L 0 12 L 4 6 Z" fill="#fb923c" stroke="#fb923c" strokeWidth="0.5" />
            </marker>
          </defs>
          
          <AnimatePresence mode="popLayout">
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.3,
                    transition: { duration: 0.6, ease: "easeIn" }
                  }}
                  transition={{ duration: 0.5, delay: arrow.index * 0.2 }}
                >
                  {/* Glowing background - thinner for cleaner look */}
                  <motion.path
                    d={arrow.path}
                    stroke={strokeColor}
                    strokeWidth="6"
                    fill="none"
                    opacity={isDangling ? "0.3" : "0.15"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ 
                      pathLength: 0,
                      opacity: 0,
                      transition: { duration: 0.6, ease: "easeIn" }
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: arrow.index * 0.2 }}
                  />
                  
                  {/* Main arrow line - thinner and cleaner */}
                  <motion.path
                    d={arrow.path}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    fill="none"
                    markerEnd={markerEnd}
                    strokeDasharray={isDangling ? "4,4" : "6,3"}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                    }}
                    exit={{ 
                      pathLength: 0,
                      opacity: 0,
                      transition: { duration: 0.6, ease: "easeIn" }
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
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="6,3"
                      animate={{ 
                        strokeDashoffset: [0, -9],
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.3, ease: "easeIn" }
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
                    exit={{ 
                      opacity: 0, 
                      scale: 0,
                      transition: { duration: 0.4, ease: "easeIn" }
                    }}
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
          
          {/* Cycle Arrows - Distinct styling for cycles */}
          <AnimatePresence>
            {cyclePaths.map((cycle, index) => {
              const cycleColor = isDarkMode ? "#fb923c" : "#f97316";
              const cycleMarker = isDarkMode ? "url(#arrowhead-cycle-dark)" : "url(#arrowhead-cycle)";
              
              return (
                <motion.g
                  key={`cycle-${cycle.from}-${cycle.to}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                >
                  {/* Pulsing glow background for cycle - very prominent */}
                  <motion.path
                    d={cycle.path}
                    stroke={cycleColor}
                    strokeWidth="12"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.3 }}
                    animate={{ 
                      pathLength: 1,
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ 
                      pathLength: { duration: 1, ease: "easeInOut", delay: index * 0.3 },
                      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  
                  {/* Main cycle arrow - very thick and bright */}
                  <motion.path
                    d={cycle.path}
                    stroke={cycleColor}
                    strokeWidth="5"
                    fill="none"
                    markerEnd={cycleMarker}
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{ 
                      pathLength: { duration: 1, ease: "easeInOut", delay: index * 0.3 },
                      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  
                  {/* Animated dash movement for cycle - faster and more obvious */}
                  <motion.path
                    d={cycle.path}
                    stroke={cycleColor}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray="10,5"
                    animate={{ 
                      strokeDashoffset: [0, -15],
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.3 + 1
                    }}
                  />
                  
                  {/* Cycle label - very prominent with pulsing */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      delay: index * 0.3 + 0.7,
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <rect
                      x={cycle.midX - 55}
                      y={cycle.controlY - 25}
                      width="110"
                      height="32"
                      rx="16"
                      fill={cycleColor}
                      opacity="0.98"
                    />
                    <text
                      x={cycle.midX}
                      y={cycle.controlY - 8}
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono"
                    >
                      🔄 CYCLE DETECTED
                    </text>
                  </motion.g>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
        </>
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
                stack.map((variable, index) => {
                  if (!variable || !variable.name) return null;
                  return (
                    <div 
                      key={`${variable.name}-${index}`} 
                      ref={(el) => {
                        if (el) {
                          // Store ref by variable name
                          stackRefs.current[variable.name] = el;
                          // Also store by address if available
                          if (variable.address) {
                            stackRefs.current[variable.address] = el;
                          }
                          // Store by both for pointer lookups
                          if (variable.type && variable.type.includes('*')) {
                            stackRefs.current[`ptr_${variable.name}`] = el;
                          }
                        }
                      }}
                      data-variable-name={variable.name}
                      data-variable-address={variable.address}
                    >
                      <StackFrame variable={variable} isDarkMode={isDarkMode} />
                    </div>
                  );
                })
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
                heap.map((block, index) => {
                  if (!block || !block.address) return null;
                  // Check if this block is part of a cycle
                  const isInCycle = cyclePaths.some(cycle => 
                    cycle.from === block.address || cycle.to === block.address
                  );
                  return (
                    <div 
                      key={block.address} 
                      ref={(el) => {
                        if (el) heapRefs.current[block.address] = el;
                      }}
                      data-heap-address={block.address}
                    >
                      <HeapBlock 
                        block={block} 
                        isDarkMode={isDarkMode}
                        isLeaked={memoryLeaks.includes(block.address)}
                        isInCycle={isInCycle}
                        linkedListConnections={linkedListConnections}
                      />
                    </div>
                  );
                })
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
