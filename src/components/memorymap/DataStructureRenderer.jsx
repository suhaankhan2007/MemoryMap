/**
 * DataStructureRenderer - Premium visualization for linked lists, trees, and other data structures
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";

// Linked List Node Component
export function LinkedListNode({ node, index, isDarkMode, isHead, isTail, nodeRefs }) {
  // Safety checks
  if (!node) return null;
  
  const nodeValue = node.value || {};
  const dataValue = nodeValue.val ?? nodeValue.data ?? nodeValue.value ?? '?';
  const hasNext = nodeValue.next !== null && nodeValue.next !== undefined;
  
  return (
    <motion.div
      ref={(el) => { if (el && nodeRefs) nodeRefs.current[node.address] = el; }}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
      className="relative flex items-center flex-shrink-0"
    >
      {isHead && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg whitespace-nowrap z-20"
        >
          HEAD
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className={`relative flex rounded-xl overflow-hidden shadow-2xl border-2 ${
          isDarkMode 
            ? 'border-emerald-400 bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'border-emerald-500 bg-gradient-to-br from-white to-gray-50'
        }`}
        style={{ minWidth: '120px' }}
      >
        <div className={`flex-1 p-4 border-r-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>data</div>
          <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dataValue}</div>
        </div>
        
        <div className={`w-12 p-2 flex flex-col items-center justify-center ${isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-50'}`}>
          <div className={`text-[10px] font-semibold mb-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>next</div>
          <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowRight className={`w-5 h-5 ${hasNext ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-gray-400'}`} />
          </motion.div>
        </div>
        
        {isTail && !hasNext && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg whitespace-nowrap z-20">
            TAIL
          </motion.div>
        )}
        
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
          {node.address}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Binary Tree Node Component
export function TreeNode({ node, isDarkMode, nodeRefs, level = 0 }) {
  // Safety checks
  if (!node) return null;
  
  const nodeValue = node.value || {};
  const dataValue = nodeValue.val ?? nodeValue.data ?? nodeValue.value ?? '?';
  
  return (
    <motion.div
      ref={(el) => { if (el && nodeRefs) nodeRefs.current[node.address] = el; }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: level * 0.15 }}
      className="relative flex-shrink-0"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl border-3 ${
          isDarkMode ? 'border-purple-400 bg-gradient-to-br from-purple-900 to-indigo-900' : 'border-purple-500 bg-gradient-to-br from-purple-100 to-indigo-100'
        }`}
      >
        <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dataValue}</div>
      </motion.div>
      
      <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
        {node.address}
      </div>
    </motion.div>
  );
}

// Main Linked List Renderer
export function LinkedListRenderer({ nodes = [], connections = [], isDarkMode, containerRef: parentRef }) {
  const nodeRefs = useRef({});
  const localContainerRef = useRef(null);
  const containerRef = parentRef || localContainerRef;
  const [arrows, setArrows] = useState([]);
  
  const orderedNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    // Filter out any null/undefined nodes
    const validNodes = nodes.filter(n => n && n.address);
    if (validNodes.length === 0) return [];
    
    // Only consider 'next' connections for ordering
    const validConnections = (connections || []).filter(c => c && c.type === 'next' && c.from && c.to);
    const pointedTo = new Set(validConnections.map(c => c.to));
    
    // Find head(s) - nodes that are not pointed to by any other node via 'next'
    let head = validNodes.find(n => !pointedTo.has(n.address));
    if (!head) head = validNodes[0]; // Fallback (e.g. circular list)
    
    const ordered = [];
    const visited = new Set();
    let current = head;
    
    while (current && !visited.has(current.address)) {
      ordered.push(current);
      visited.add(current.address);
      const nextConn = validConnections.find(c => c.from === current.address);
      current = nextConn ? validNodes.find(n => n.address === nextConn.to) : null;
    }
    
    // Add any disconnected nodes
    validNodes.forEach(n => { if (!visited.has(n.address)) ordered.push(n); });
    return ordered;
  }, [nodes, connections]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const newArrows = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      connections.forEach((conn, idx) => {
        const fromEl = nodeRefs.current[conn.from];
        const toEl = nodeRefs.current[conn.to];
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          
          if (conn.type === 'next') {
            newArrows.push({
              id: `${conn.from}-${conn.to}`,
              startX: fromRect.right - containerRect.left,
              startY: fromRect.top - containerRect.top + fromRect.height / 2,
              endX: toRect.left - containerRect.left,
              endY: toRect.top - containerRect.top + toRect.height / 2,
              type: conn.type,
            });
          } else if (conn.type === 'prev') {
             // Curve below for prev pointers
             newArrows.push({
              id: `${conn.from}-${conn.to}`,
              startX: fromRect.left - containerRect.left,
              startY: fromRect.bottom - containerRect.top - 10,
              endX: toRect.right - containerRect.left,
              endY: toRect.bottom - containerRect.top - 10,
              type: conn.type,
              isCurved: true
            });
          }
        }
      });
      setArrows(newArrows);
    }, 300); // Wait for layout
    return () => clearTimeout(timer);
  }, [orderedNodes, connections, containerRef]);
  
  if (orderedNodes.length === 0) return null;
  
  return (
    <div className="relative overflow-x-auto pb-8 pt-4">
      {/* Container for arrows - absolute to the scrolling container */}
      <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 5, minWidth: '100%', height: '100%' }}>
        <defs>
          <marker id="linkedlist-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isDarkMode ? "#34d399" : "#10b981"} />
          </marker>
           <marker id="linkedlist-arrow-prev" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isDarkMode ? "#a78bfa" : "#8b5cf6"} />
          </marker>
          <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDarkMode ? "#34d399" : "#10b981"} />
            <stop offset="100%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} />
          </linearGradient>
        </defs>
        <AnimatePresence>
          {arrows.map((arrow, idx) => (
            <motion.g key={arrow.id}>
              {arrow.isCurved ? (
                 <motion.path
                  d={`M ${arrow.startX} ${arrow.startY} Q ${(arrow.startX + arrow.endX) / 2} ${arrow.startY + 40} ${arrow.endX} ${arrow.endY}`}
                  stroke={isDarkMode ? "#a78bfa" : "#8b5cf6"}
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#linkedlist-arrow-prev)"
                  strokeDasharray="4,2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                />
              ) : (
                <>
                  <motion.line x1={arrow.startX} y1={arrow.startY} x2={arrow.endX} y2={arrow.endY}
                    stroke={isDarkMode ? "#34d399" : "#10b981"} strokeWidth="8" opacity="0.1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: idx * 0.1 }} />
                  <motion.line x1={arrow.startX} y1={arrow.startY} x2={arrow.endX} y2={arrow.endY}
                    stroke="url(#arrow-gradient)" strokeWidth="3" markerEnd="url(#linkedlist-arrow)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: idx * 0.1 }} />
                  <motion.circle r="3" fill={isDarkMode ? "#34d399" : "#10b981"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], cx: [arrow.startX, arrow.endX], cy: [arrow.startY, arrow.endY] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2, ease: "linear" }} />
                </>
              )}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
      
      <div className="flex items-center gap-16 px-4 relative z-10 min-w-max">
        {orderedNodes.map((node, idx) => (
          <LinkedListNode key={node.address} node={node} index={idx} isDarkMode={isDarkMode}
            isHead={idx === 0} isTail={idx === orderedNodes.length - 1 && !node.value?.next} nodeRefs={nodeRefs} />
        ))}
        {orderedNodes.length > 0 && (() => {
          const lastNode = orderedNodes[orderedNodes.length - 1];
          const lastNodeValue = lastNode?.value || {};
          return lastNodeValue.next === null || lastNodeValue.next === undefined;
        })() && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-lg font-mono font-bold flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-red-400 border-2 border-red-500/50' : 'bg-gray-100 text-red-600 border-2 border-red-300'}`}>
            NULL
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function BinaryTreeRenderer({ nodes, connections, isDarkMode, containerRef: parentRef }) {
  const nodeRefs = useRef({});
  const localContainerRef = useRef(null);
  const containerRef = parentRef || localContainerRef;
  const [arrows, setArrows] = useState([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const newArrows = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      connections.forEach((conn, idx) => {
        const fromEl = nodeRefs.current[conn.from];
        const toEl = nodeRefs.current[conn.to];
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          newArrows.push({
            id: `${conn.from}-${conn.to}`,
            startX: fromRect.left - containerRect.left + fromRect.width / 2,
            startY: fromRect.bottom - containerRect.top,
            endX: toRect.left - containerRect.left + toRect.width / 2,
            endY: toRect.top - containerRect.top,
            type: conn.type,
          });
        }
      });
      setArrows(newArrows);
    }, 300);
    return () => clearTimeout(timer);
  }, [nodes, connections, containerRef]);
  
  if (nodes.length === 0) return null;
  
  return (
    <div className="relative py-8 flex justify-center">
      <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 5, width: '100%', height: '100%' }}>
        <defs>
          <marker id="tree-arrow-left" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isDarkMode ? "#60a5fa" : "#3b82f6"} />
          </marker>
          <marker id="tree-arrow-right" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isDarkMode ? "#fb923c" : "#f97316"} />
          </marker>
        </defs>
        {arrows.map((arrow, idx) => (
          <motion.path key={arrow.id}
            d={`M ${arrow.startX} ${arrow.startY} C ${arrow.startX} ${arrow.startY + 20}, ${arrow.endX} ${arrow.endY - 20}, ${arrow.endX} ${arrow.endY}`}
            stroke={arrow.type === 'left' ? (isDarkMode ? "#60a5fa" : "#3b82f6") : (isDarkMode ? "#fb923c" : "#f97316")}
            strokeWidth="3" fill="none" markerEnd={`url(#tree-arrow-${arrow.type})`}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: idx * 0.1 }} />
        ))}
      </svg>
      
      <div className="flex items-start justify-center gap-12 relative z-10">
        {nodes.map((node, idx) => (<TreeNode key={node.address} node={node} isDarkMode={isDarkMode} nodeRefs={nodeRefs} level={idx} />))}
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-blue-500" /><span>Left Child</span></div>
        <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-orange-500 transform scale-x-[-1]" /><span>Right Child</span></div>
      </div>
    </div>
  );
}

export default function DataStructureRenderer(props) {
  const { heap, isDarkMode } = props;
  
  // Split nodes
  const linkedListNodes = heap.filter(n => n.isLinkedListNode);
  const treeNodes = heap.filter(n => n.isBinaryTreeNode);
  
  return (
    <div className="space-y-12">
      {linkedListNodes.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Linked List View</h4>
          <LinkedListRenderer nodes={linkedListNodes} {...props} />
        </div>
      )}
      
      {treeNodes.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Binary Tree View</h4>
          <BinaryTreeRenderer nodes={treeNodes} {...props} />
        </div>
      )}
    </div>
  );
}
