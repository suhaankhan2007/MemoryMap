import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function CodeEditor({ code, onChange, currentLine, isDarkMode }) {
  const textareaRef = useRef(null);
  const lines = code.split('\n');

  const handleChange = (e) => {
    const newCode = e.target.value;
    const lineCount = newCode.split('\n').length;
    
    if (lineCount <= 30) {
      onChange(newCode);
    }
  };

  const bgClass = isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-900 to-gray-800';
  const lineNumBg = isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-800 to-gray-900';

  return (
    <div className="relative">
      {/* Line numbers and highlighting */}
      <div className={`flex gap-0 font-mono text-sm bg-gradient-to-br ${bgClass} rounded-xl overflow-hidden shadow-inner border ${isDarkMode ? 'border-gray-700' : 'border-gray-700'}`}>
        {/* Line numbers */}
        <div className={`bg-gradient-to-b ${lineNumBg} text-gray-400 py-5 px-4 select-none border-r border-gray-700`}>
          {lines.map((_, index) => (
            <div
              key={index}
              className={`leading-7 text-right transition-all duration-300 ${
                index + 1 === currentLine 
                  ? 'text-yellow-400 font-bold scale-110' 
                  : 'hover:text-gray-300'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code area with syntax highlighting */}
        <div className="relative flex-1">
          {/* Highlighted current line */}
          {currentLine > 0 && (
            <motion.div
              layoutId="current-line"
              className="absolute left-0 right-0 bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-transparent pointer-events-none border-l-4 border-yellow-400"
              style={{
                top: `${(currentLine - 1) * 28 + 20}px`,
                height: '28px',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            className="w-full h-full bg-transparent text-gray-100 py-5 px-5 font-mono text-sm leading-7 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-r-xl"
            style={{
              minHeight: '500px',
              maxHeight: '700px',
            }}
            placeholder="Enter your C++ code here... (max 30 lines)"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Line count indicator */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className={`font-semibold ${lines.length > 30 ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {lines.length} / 30 lines
        </span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Supports: int, float, double, char, bool, std::string, pointers, new/delete
        </span>
      </div>
    </div>
  );
}