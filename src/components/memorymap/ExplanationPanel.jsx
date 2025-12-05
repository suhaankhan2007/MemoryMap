import React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2, Sparkles, Brain, BookOpen, Zap, Bot } from "lucide-react";

export default function ExplanationPanel({ explanation, isLoading, stepNumber, totalSteps, isDarkMode, embedded = false }) {
  const cardClass = isDarkMode 
    ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-gray-600' 
    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-300';
  
  const titleClass = isDarkMode ? 'text-gray-100' : 'text-indigo-900';
  const textClass = isDarkMode ? 'text-gray-300' : 'text-indigo-900';
  const loadingBg = isDarkMode ? 'bg-gray-700/50' : 'bg-white/50';
  const emptyBg = isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-indigo-200';

  // Embedded version for Featured Tools panel
  if (embedded) {
    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Mem AI Header */}
        <div className={`flex items-center justify-between p-3 rounded-xl ${
          isDarkMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                🧠 Mem AI
              </span>
              <p className={`text-[10px] ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                Your personal memory tutor
              </p>
            </div>
          </div>
          {totalSteps > 0 && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-700'
            }`}>
              Step {stepNumber} of {totalSteps}
            </span>
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/70'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                  >
                    <Bot className="w-7 h-7 text-white" />
                  </motion.div>
                  <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    🧠 Mem AI is thinking...
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Crafting a personalized explanation just for you
                  </p>
                </div>
              </div>
            </motion.div>
          ) : explanation ? (
            <motion.div
              key={explanation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Main Explanation */}
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700/70' : 'bg-white/80'
              } shadow-sm`}>
                <p className={`text-sm ${textClass} leading-relaxed whitespace-pre-line`}>
                  {explanation}
                </p>
              </div>

              {/* Learning Tips */}
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Study Tip
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  Try modifying the values and running the code again to see how the memory changes. 
                  Understanding through experimentation is the best way to learn!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Empty State */}
              <div className={`p-6 rounded-xl border-2 border-dashed text-center ${
                isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white/50 border-purple-200'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-9 h-9 text-white" />
                </div>
                <h4 className={`font-bold mb-2 text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Meet Mem AI 🧠
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your personal AI tutor for memory management. Parse your code and step through to get instant explanations!
                </p>
              </div>

              {/* How It Works */}
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/70'
              }`}>
                <h5 className={`text-xs font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  🧠 What Mem AI Does For You:
                </h5>
                <div className="space-y-2">
                  {[
                    { icon: '💬', text: 'Explains each line in simple, friendly language' },
                    { icon: '🔍', text: 'Deep dives into memory operations & data structures' },
                    { icon: '⚠️', text: 'Warns you about memory leaks & dangling pointers' },
                    { icon: '✨', text: 'Suggests modern C++ best practices' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span>{item.icon}</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Original Card version
  return (
    <Card className={`p-6 ${cardClass} border-2 shadow-xl`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`font-bold ${titleClass} text-lg`}>🧠 Mem AI</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your personal memory tutor</p>
            </div>
            {totalSteps > 0 && (
              <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-sm">
                Step {stepNumber} / {totalSteps}
              </span>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 text-purple-600 ${loadingBg} rounded-lg p-4`}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Mem AI is thinking...</span>
              </motion.div>
            ) : explanation ? (
              <motion.div
                key={explanation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${isDarkMode ? 'bg-gray-700/70' : 'bg-white/70'} rounded-lg p-4 shadow-sm`}
              >
                <p className={`text-sm ${textClass} leading-relaxed font-medium`}>
                  {explanation}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${emptyBg} rounded-lg p-4 border-2 border-dashed`}
              >
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-indigo-600'} italic flex items-center gap-2`}>
                  <Bot className="w-4 h-4" />
                  Step through the code and Mem AI will explain each line!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}