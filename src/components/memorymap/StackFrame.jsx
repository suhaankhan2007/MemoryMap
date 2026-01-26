import React from "react";
import { motion } from "framer-motion";
import { Box, ArrowRight, Link2 } from "lucide-react";

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
    pointer_uninitialized: "from-red-400 via-red-500 to-red-600",
    reference: "from-purple-400 via-purple-500 to-purple-600",
    array: "from-teal-400 via-teal-500 to-teal-600",
    struct: "from-rose-400 via-rose-500 to-rose-600",
    vector: "from-emerald-400 via-teal-500 to-cyan-500",
  };

  const getTypeColor = () => {
    if (variable.isVector) return typeColors.vector;
    if (variable.isArray) return typeColors.array;
    if (variable.isStruct) return typeColors.struct;
    if (variable.type.includes('*')) {
      return variable.isUninitialized ? typeColors.pointer_uninitialized : typeColors.pointer;
    }
    if (variable.type.includes('&')) return typeColors.reference;
    
    const baseType = variable.type.toLowerCase();
    if (typeColors[baseType]) return typeColors[baseType];
    
    if (baseType.includes('string')) return typeColors['std::string'];
    if (baseType.includes('vector')) return typeColors.vector;
    
    return typeColors.int;
  };

  const isPointer = variable.type.includes('*');
  const isReference = variable.type.includes('&');
  const isArray = variable.isArray;
  const isStruct = variable.isStruct;
  const isVector = variable.isVector;
  const isUninitialized = variable.isUninitialized;
  
  const formatValue = (value) => {
    if (typeof value === 'string') {
      if (value.startsWith('"') || value.startsWith("'")) {
        return value;
      }
    }
    return value;
  };

  const renderArrayValue = (values) => {
    if (!Array.isArray(values)) return null;
    
    return (
      <div className="grid grid-cols-5 gap-1">
        {values.slice(0, 10).map((val, idx) => (
          <div 
            key={idx}
            className="bg-white/10 backdrop-blur-sm rounded px-2 py-1 text-center border border-white/20"
          >
            <div className="text-[10px] opacity-75">[{idx}]</div>
            <div className="font-mono text-xs font-bold">{formatValue(val)}</div>
          </div>
        ))}
        {values.length > 10 && (
          <div className="col-span-5 text-center text-xs opacity-75">
            ... +{values.length - 10} more
          </div>
        )}
      </div>
    );
  };

  const renderStructValue = (value, members) => {
    if (!value || !members) return null;
    
    return (
      <div className="space-y-1">
        {members.map((member, idx) => (
          <div 
            key={idx}
            className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75">{member.name}:</span>
              <span className="font-mono text-sm font-bold">{formatValue(value[member.name])}</span>
            </div>
          </div>
        ))}
      </div>
    );
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
      <div className={`bg-gradient-to-br ${getTypeColor()} rounded-xl p-5 shadow-xl text-white border-2 border-white/30 ${(isPointer || isReference) ? 'ring-2 ring-green-300 ring-offset-2' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isReference ? (
              <Link2 className="w-5 h-5 animate-pulse" />
            ) : isPointer ? (
              <ArrowRight className="w-5 h-5 animate-pulse" />
            ) : (
              <Box className="w-4 h-4" />
            )}
            <span className="font-mono font-bold text-lg">{variable.name}</span>
          </div>
          <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
            {variable.type}
          </span>
        </div>
        
        {isPointer ? (
          <div className="space-y-2">
            <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 border ${isUninitialized ? 'border-red-400/50 bg-red-900/20' : 'border-white/20'}`}>
              <div className="text-xs opacity-75 mb-1">Stores Address:</div>
              <span className={`font-mono text-lg font-bold ${isUninitialized ? 'text-red-300' : ''}`}>
                {isUninitialized ? '⚠️ (uninitialized)' : (variable.value || 'nullptr')}
              </span>
            </div>
            {isUninitialized ? (
              <div className="text-xs opacity-90 flex items-center gap-2 bg-red-900/30 rounded-lg p-2 border border-red-400/30">
                <span className="text-red-300">⚠️</span>
                <span className="text-red-200">WARNING: Contains garbage/random memory address!</span>
              </div>
            ) : variable.value && (
              <div className="text-xs opacity-90 flex items-center gap-2 bg-black/20 rounded-lg p-2">
                <span className="text-yellow-200">→</span>
                <span>Points to {variable.pointsToVector ? `element in ${variable.pointsToVector}` : (isArray ? 'heap array' : 'heap memory')}</span>
              </div>
            )}
          </div>
        ) : isReference ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-1">Reference to:</div>
              <span className="font-mono text-lg font-bold">
                {variable.referenceTo || variable.referenceAddress}
              </span>
            </div>
            <div className="text-xs opacity-90 flex items-center gap-2 bg-purple-400/20 rounded-lg p-2">
              <span className="text-purple-200">⇄</span>
              <span>Alias to existing variable</span>
            </div>
          </div>
        ) : isVector ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-75 font-semibold uppercase tracking-wide">
                  📦 std::vector (RAII Container)
                </span>
                <span className="text-[10px] bg-emerald-400/30 px-2 py-0.5 rounded-full text-emerald-200">
                  ✓ Auto-managed
                </span>
              </div>
              {variable.members?.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                  <span className="text-sm opacity-75">.{member.name}</span>
                  <span className="font-mono text-sm font-bold">
                    {member.name === '_data' ? (
                      <span className="text-emerald-300">→ {member.value}</span>
                    ) : (
                      member.value
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-xs opacity-90 flex items-center gap-2 bg-emerald-400/20 rounded-lg p-2">
              <span className="text-emerald-200">✓</span>
              <span>Destructor auto-frees data when scope ends</span>
            </div>
          </div>
        ) : isArray ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-2">Array Elements:</div>
              {renderArrayValue(variable.value)}
            </div>
          </div>
        ) : isStruct ? (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs opacity-75 mb-2">Members:</div>
              {renderStructValue(variable.value, variable.members)}
            </div>
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