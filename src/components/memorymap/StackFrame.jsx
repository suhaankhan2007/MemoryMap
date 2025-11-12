import React from "react";
import { motion } from "framer-motion";
import { Box, ArrowRight } from "lucide-react";

export default function StackFrame({ variable, isDarkMode }) {
  const typeColors = {
    int: "from-blue-400 via-blue-500 to-blue-600",
    float: "from-cyan-400 via-cyan-500 to-cyan-600",
    double: "from-indigo-400 via-indigo-500 to-indigo-600",
    char: "from-pink-400 via-pink-500 to-pink-600",
    bool: "from-violet-400 via-violet-500 to-violet-600",
    'std::string': "from-amber-400 via-amber-500 to-amber-600",
    string: "from-amber-400 via-amber-500 to-amber-600",
    long: "from-blue-500 via-blue-600 to-blue-700",
    short: "from-blue-300 via-blue-400 to-blue-500",
    pointer: "from-green-400 via-green-500 to-green-600",
    reference: "from-purple-400 via-purple-500 to-purple-600",
  };

  const getTypeColor = () => {
    if (variable.type.includes('*')) return typeColors.pointer;
    if (variable.type.includes('&')) return typeColors.reference;
    
    // Check for exact type match
    const baseType = variable.type.toLowerCase();
    if (typeColors[baseType]) return typeColors[baseType];
    
    // Check if type contains specific keywords
    if (baseType.includes('string')) return typeColors['std::string'];
    
    return typeColors.int; // default
  };

  const isPointer = variable.type.includes('*');
  
  // Format value display based on type
  const formatValue = (value) => {
    if (typeof value === 'string') {
      // Handle strings and chars with quotes
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative"
    >
      <div className={`bg-gradient-to-br ${getTypeColor()} rounded-xl p-5 shadow-xl text-white border-2 border-white/30 ${isPointer ? 'ring-2 ring-green-300 ring-offset-2' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPointer ? <ArrowRight className="w-5 h-5 animate-pulse" /> : <Box className="w-4 h-4" />}
            <span className="font-mono font-bold text-lg">{variable.name}</span>
          </div>
          <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
            {variable.type}
          </span>
        </div>
        {isPointer ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-1">Stores Address:</div>
              <span className="font-mono text-lg font-bold">
                {variable.value || 'nullptr'}
              </span>
            </div>
            {variable.value && (
              <div className="text-xs opacity-90 flex items-center gap-2 bg-black/20 rounded-lg p-2">
                <span className="text-yellow-200">→</span>
                <span>Points to heap memory</span>
              </div>
            )}
          </div>
        ) : (
          <div className="font-mono text-2xl font-bold mb-2 break-words">
            {formatValue(variable.value)}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-90 font-mono">
          📍 Stack: {variable.address}
        </div>
      </div>
    </motion.div>
  );
}