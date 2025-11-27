import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchPanel({ watchList, onAddWatch, onRemoveWatch, memoryState, isDarkMode }) {
  const [newWatch, setNewWatch] = useState("");
  const bgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  const handleAdd = () => {
    if (newWatch.trim()) {
      onAddWatch(newWatch.trim());
      setNewWatch("");
    }
  };

  const getVariableValue = (varName) => {
    if (!memoryState || !memoryState.stack) return null;
    const variable = memoryState.stack.find(v => v.name === varName);
    return variable;
  };

  const formatValue = (variable) => {
    if (!variable) return "undefined";
    
    if (Array.isArray(variable.value)) {
      return `[${variable.value.slice(0, 5).join(', ')}${variable.value.length > 5 ? '...' : ''}]`;
    }
    
    if (typeof variable.value === 'object' && variable.value !== null) {
      return JSON.stringify(variable.value);
    }
    
    return String(variable.value);
  };

  return (
    <Card className={`p-4 ${bgClass} shadow-xl border-2`}>
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-5 h-5 text-green-600" />
        <h3 className={`font-bold ${textClass}`}>Watch List</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          value={newWatch}
          onChange={(e) => setNewWatch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Variable name..."
          className={`text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
        />
        <Button onClick={handleAdd} size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {watchList.map((varName) => {
            const variable = getVariableValue(varName);
            
            return (
              <motion.div
                key={varName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`
                  p-2 rounded-lg border
                  ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-green-600">{varName}</span>
                      {variable && (
                        <span className={`text-xs ${secondaryTextClass}`}>
                          {variable.type}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm font-mono mt-1 ${textClass} truncate`}>
                      {variable ? formatValue(variable) : (
                        <span className="text-red-500 text-xs">Not in scope</span>
                      )}
                    </div>
                    {variable && variable.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        @ {variable.address}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => onRemoveWatch(varName)}
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {watchList.length === 0 && (
          <div className={`text-sm ${secondaryTextClass} text-center py-4`}>
            Add variables to watch their values
          </div>
        )}
      </div>
    </Card>
  );
}