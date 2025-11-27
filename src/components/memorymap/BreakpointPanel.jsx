import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BreakpointPanel({ breakpoints, onRemoveBreakpoint, isDarkMode }) {
  const bgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  const sortedBreakpoints = Array.from(breakpoints).sort((a, b) => a - b);

  return (
    <Card className={`p-4 ${bgClass} shadow-xl border-2`}>
      <div className="flex items-center gap-2 mb-3">
        <Circle className="w-5 h-5 text-red-600 fill-red-600" />
        <h3 className={`font-bold ${textClass}`}>Breakpoints</h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {sortedBreakpoints.map((lineNumber) => (
            <motion.div
              key={lineNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`
                p-2 rounded-lg border flex items-center justify-between
                ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-red-50 border-red-300'}
              `}
            >
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-red-600 fill-red-600" />
                <span className={`font-mono font-bold ${textClass}`}>Line {lineNumber}</span>
              </div>
              <Button
                onClick={() => onRemoveBreakpoint(lineNumber)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedBreakpoints.length === 0 && (
          <div className={`text-sm ${secondaryTextClass} text-center py-4`}>
            Click line numbers in the editor to add breakpoints
          </div>
        )}
      </div>
    </Card>
  );
}