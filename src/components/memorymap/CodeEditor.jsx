import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CodeEditor({ code, onChange, currentLine, isDarkMode, isExecuting, breakpoints, onToggleBreakpoint }) {
  const textareaRef = useRef(null);
  const lines = code.split('\n');
  const [cursorLine, setCursorLine] = useState(1);

  const handleChange = (e) => {
    const newCode = e.target.value;
    const lineCount = newCode.split('\n').length;
    
    if (lineCount <= 30) {
      onChange(newCode);
    }
    updateCursorLine();
  };

  const updateCursorLine = () => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBeforeCursor = code.substring(0, cursorPos);
      const lineNumber = textBeforeCursor.split('\n').length;
      setCursorLine(lineNumber);
    }
  };

  // Update cursor line on click, keyboard navigation, etc.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handleUpdate = () => updateCursorLine();
      textarea.addEventListener('click', handleUpdate);
      textarea.addEventListener('keyup', handleUpdate);
      textarea.addEventListener('keydown', handleUpdate);
      textarea.addEventListener('focus', handleUpdate);
      textarea.addEventListener('select', handleUpdate);
      
      return () => {
        textarea.removeEventListener('click', handleUpdate);
        textarea.removeEventListener('keyup', handleUpdate);
        textarea.removeEventListener('keydown', handleUpdate);
        textarea.removeEventListener('focus', handleUpdate);
        textarea.removeEventListener('select', handleUpdate);
      };
    }
  }, [code]);

  // Tokenize and highlight a line of code
  const tokenizeLine = (line) => {
    const types = ['int', 'float', 'double', 'char', 'bool', 'long', 'short', 'unsigned', 'signed', 'std::string', 'string', 'std::vector'];
    const keywords = ['struct', 'class', 'new', 'delete', 'return', 'if', 'else', 'while', 'for', 'break', 'continue', 'const', 'static', 'void', 'public', 'private', 'protected', 'nullptr', 'NULL'];
    
    const tokens = [];
    let current = '';
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      // Handle strings
      if ((char === '"' || char === "'") && !inString) {
        if (current) {
          tokens.push({ text: current, type: 'default' });
          current = '';
        }
        inString = true;
        stringChar = char;
        current = char;
      } else if (inString && char === stringChar) {
        current += char;
        tokens.push({ text: current, type: 'string' });
        current = '';
        inString = false;
      } else if (inString) {
        current += char;
      }
      // Handle regular tokens
      else if (/[a-zA-Z0-9_:]/.test(char)) {
        current += char;
      } else {
        if (current) {
          // Check if it's a keyword, type, or number
          if (types.includes(current)) {
            tokens.push({ text: current, type: 'type' });
          } else if (keywords.includes(current)) {
            tokens.push({ text: current, type: 'keyword' });
          } else if (/^\d+\.?\d*$/.test(current)) {
            tokens.push({ text: current, type: 'number' });
          } else {
            tokens.push({ text: current, type: 'default' });
          }
          current = '';
        }
        tokens.push({ text: char, type: 'operator' });
      }
    }
    
    // Push remaining
    if (current) {
      if (inString) {
        tokens.push({ text: current, type: 'string' });
      } else if (types.includes(current)) {
        tokens.push({ text: current, type: 'type' });
      } else if (keywords.includes(current)) {
        tokens.push({ text: current, type: 'keyword' });
      } else if (/^\d+\.?\d*$/.test(current)) {
        tokens.push({ text: current, type: 'number' });
      } else {
        tokens.push({ text: current, type: 'default' });
      }
    }
    
    return tokens;
  };

  const getTokenColor = (type) => {
    switch(type) {
      case 'type': return 'text-blue-400';
      case 'keyword': return 'text-purple-400';
      case 'string': return 'text-orange-400';
      case 'number': return 'text-green-400';
      case 'operator': return 'text-gray-300';
      default: return 'text-gray-100';
    }
  };

  const bgClass = isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-900 to-gray-800';
  const lineNumBg = isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-800 to-gray-900';

  // Use execution line when running, otherwise use cursor line for editing
  const activeLineNumber = isExecuting ? currentLine : cursorLine;

  return (
    <div className="relative">
      <div className={`flex gap-0 font-mono text-sm bg-gradient-to-br ${bgClass} rounded-xl overflow-hidden shadow-inner border ${isDarkMode ? 'border-gray-700' : 'border-gray-700'}`}>
        {/* Line numbers with breakpoints */}
        <div className={`bg-gradient-to-b ${lineNumBg} text-gray-400 py-5 px-2 select-none border-r border-gray-700 relative`}>
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const hasBreakpoint = breakpoints && breakpoints.has(lineNum);

            return (
              <div
                key={index}
                className={`leading-7 text-right transition-all duration-300 flex items-center justify-end gap-1 cursor-pointer group ${
                  index + 1 === activeLineNumber
                    ? 'text-yellow-400 font-bold scale-110' 
                    : 'hover:text-gray-300'
                }`}
                onClick={() => onToggleBreakpoint && onToggleBreakpoint(lineNum)}
              >
                {hasBreakpoint && (
                  <div className="w-3 h-3 rounded-full bg-red-600 border border-red-400 shadow-lg" />
                )}
                {!hasBreakpoint && (
                  <div className="w-3 h-3 rounded-full border border-gray-600 opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
                <span className="min-w-[20px]">{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Code area */}
        <div className="relative flex-1">
          {/* Highlighted current line */}
          {activeLineNumber > 0 && (
            <motion.div
              key={activeLineNumber}
              className="absolute left-0 right-0 bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-transparent pointer-events-none border-l-4 border-yellow-400"
              style={{
                top: `${(activeLineNumber - 1) * 28 + 20}px`,
                height: '28px',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Syntax highlighted overlay */}
          <div className="absolute inset-0 py-5 px-5 font-mono text-sm leading-7 pointer-events-none overflow-hidden whitespace-pre-wrap break-words">
            {lines.map((line, lineIndex) => (
              <div key={lineIndex}>
                {line === '' ? '\n' : tokenizeLine(line).map((token, tokenIndex) => (
                  <span key={tokenIndex} className={getTokenColor(token.type)}>
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Textarea (invisible) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            className="w-full h-full bg-transparent text-transparent caret-white py-5 px-5 font-mono text-sm leading-7 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-r-xl relative z-10"
            style={{
              minHeight: '500px',
              maxHeight: '880px',
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
          Supports: int, float, double, char, bool, std::string, std::vector, pointers, new/delete, arrays, structs, references
        </span>
      </div>
    </div>
  );
}