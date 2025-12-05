import React from "react";
import { motion } from "framer-motion";
import { Box, ArrowRight, Link2, Hash, Type, ToggleLeft, Layers, Braces } from "lucide-react";

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
    pointer: "from-green-400 via-emerald-500 to-teal-600",
    reference: "from-purple-400 via-fuchsia-500 to-pink-600",
    array: "from-teal-400 via-teal-500 to-cyan-600",
    struct: "from-rose-400 via-rose-500 to-red-600",
    vector: "from-orange-400 via-amber-500 to-yellow-600",
  };

  // Type icons
  const typeIcons = {
    int: Hash,
    float: Hash,
    double: Hash,
    char: Type,
    bool: ToggleLeft,
    'std::string': Type,
    string: Type,
    pointer: ArrowRight,
    reference: Link2,
    array: Layers,
    struct: Braces,
    vector: Layers,
  };

  const getTypeColor = () => {
    if (variable.isArray) return typeColors.array;
    if (variable.isStruct) return typeColors.struct;
    if (variable.type.includes('*')) return typeColors.pointer;
    if (variable.type.includes('&')) return typeColors.reference;
    
    const baseType = variable.type.toLowerCase();
    if (typeColors[baseType]) return typeColors[baseType];
    
    if (baseType.includes('string')) return typeColors['std::string'];
    
    return typeColors.int;
  };

  const isPointer = variable.type.includes('*');
  const isReference = variable.type.includes('&');
  const isArray = variable.isArray;
  const isStruct = variable.isStruct;
  
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

  // Get the appropriate icon for this type
  const getTypeIcon = () => {
    if (isPointer) return ArrowRight;
    if (isReference) return Link2;
    if (isArray) return Layers;
    if (isStruct) return Braces;
    
    const baseType = variable.type.toLowerCase();
    return typeIcons[baseType] || Box;
  };

  const TypeIcon = getTypeIcon();

  // Get size estimation
  const getTypeSize = () => {
    const sizes = {
      'int': 4, 'float': 4, 'double': 8, 'char': 1, 'bool': 1,
      'long': 8, 'short': 2, 'std::string': 32
    };
    if (isPointer) return 8;
    if (isArray && Array.isArray(variable.value)) {
      const baseType = variable.type.replace(/\[.*\]/, '').trim();
      return variable.value.length * (sizes[baseType] || 4);
    }
    const baseType = variable.type.toLowerCase();
    return sizes[baseType] || 4;
  };

  // 3D shadow effect
  const shadowStyle = {
    boxShadow: `
      0 10px 30px -10px rgba(0, 0, 0, 0.4),
      0 20px 50px -20px ${isPointer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'},
      inset 0 -3px 0 0 rgba(0, 0, 0, 0.2),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
    `
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      {/* Size badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-2 -left-2 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border border-white/20 z-10"
      >
        {getTypeSize()} bytes
      </motion.div>

      <div 
        className={`bg-gradient-to-br ${getTypeColor()} rounded-2xl p-5 text-white border-2 transition-all duration-300 ${
          isPointer || isReference 
            ? 'border-white/40 ring-2 ring-green-400/50 ring-offset-2 ring-offset-transparent' 
            : 'border-white/30 group-hover:border-white/50'
        }`}
        style={shadowStyle}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isPointer || isReference ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TypeIcon className={`w-5 h-5 ${isPointer || isReference ? 'text-white' : 'text-white/80'}`} />
            </motion.div>
            <span className="font-mono font-bold text-xl">{variable.name}</span>
          </div>
          <span className="text-xs bg-black/25 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm border border-white/10">
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
                <span>Points to {isArray ? 'heap array' : 'heap memory'}</span>
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
        
        <div className="mt-4 pt-3 border-t border-white/20 text-xs opacity-90 font-mono flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            {variable.address}
          </span>
          <span className="bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
            Stack
          </span>
        </div>
      </div>
    </motion.div>
  );
}