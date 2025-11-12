import React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

export default function ExplanationPanel({ explanation, isLoading, stepNumber, totalSteps, isDarkMode }) {
  const cardClass = isDarkMode 
    ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-gray-600' 
    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-300';
  
  const titleClass = isDarkMode ? 'text-gray-100' : 'text-indigo-900';
  const textClass = isDarkMode ? 'text-gray-300' : 'text-indigo-900';
  const loadingBg = isDarkMode ? 'bg-gray-700/50' : 'bg-white/50';
  const emptyBg = isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-indigo-200';

  return (
    <Card className={`p-6 ${cardClass} border-2 shadow-xl`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold ${titleClass} text-lg`}>AI Explanation</h3>
            {totalSteps > 0 && (
              <span className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-sm">
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
                className={`flex items-center gap-3 text-indigo-600 ${loadingBg} rounded-lg p-4`}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Generating beginner-friendly explanation...</span>
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
                  <Lightbulb className="w-4 h-4" />
                  Step through the code to see AI-powered explanations for each line
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}