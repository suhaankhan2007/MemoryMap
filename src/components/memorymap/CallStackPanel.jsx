import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Layers, ChevronRight } from "lucide-react";

export default function CallStackPanel({ callStack, isDarkMode }) {
  const bgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  if (!callStack || callStack.length === 0) {
    return null;
  }

  return (
    <Card className={`p-4 ${bgClass} shadow-xl border-2`}>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-5 h-5 text-blue-600" />
        <h3 className={`font-bold ${textClass}`}>Call Stack</h3>
      </div>
      
      <div className="space-y-2">
        {callStack.slice().reverse().map((frame, index) => {
          const isActive = index === 0; // Top of reversed stack is active
          const actualIndex = callStack.length - 1 - index;
          
          return (
            <motion.div
              key={actualIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white shadow-lg scale-105' 
                  : isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300' 
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isActive && <ChevronRight className="w-4 h-4 animate-pulse" />}
                  <span className="font-mono font-bold">{frame.name}()</span>
                </div>
                <span className={`text-xs ${isActive ? 'text-blue-100' : secondaryTextClass}`}>
                  {frame.varCount} vars
                </span>
              </div>
              {isActive && (
                <div className="text-xs mt-1 text-blue-100">
                  ← Currently executing
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}