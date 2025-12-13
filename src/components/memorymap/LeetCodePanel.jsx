import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Code2, 
  Lightbulb, 
  Clock, 
  Database,
  ChevronRight,
  Zap,
  Link,
  Brain,
  CheckCircle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LEETCODE_PROBLEMS, 
  PROBLEM_CATEGORIES, 
  DIFFICULTY_COLORS,
  getAllProblems 
} from "./LeetCodeProblems";

/**
 * LeetCode Panel Component
 * Displays curated LeetCode problems focused on memory and data structures
 */
export default function LeetCodePanel({ 
  onLoadProblem, 
  currentProblem, 
  isDarkMode,
  isOpen,
  onToggle 
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredProblem, setHoveredProblem] = useState(null);

  // Get problems based on selected category
  const getFilteredProblems = () => {
    if (selectedCategory === "all") {
      return getAllProblems();
    }
    const keys = PROBLEM_CATEGORIES[selectedCategory] || [];
    return keys.map(key => ({ key, ...LEETCODE_PROBLEMS[key] })).filter(p => p.title);
  };

  const problems = getFilteredProblems();

  // Handle loading a problem
  const handleLoadProblem = (problem) => {
    if (onLoadProblem && problem) {
      onLoadProblem({
        code: problem.starterCode,
        title: problem.title,
        difficulty: problem.difficulty,
        pattern: problem.pattern,
        hints: problem.hints,
        timeComplexity: problem.timeComplexity,
        spaceComplexity: problem.spaceComplexity,
        memoryConceptsTaught: problem.memoryConceptsTaught
      });
    }
  };

  // Category buttons
  const categories = [
    { key: "all", label: "All Problems", icon: Trophy },
    { key: "linkedList", label: "Linked Lists", icon: Link },
    { key: "binaryTree", label: "Binary Trees", icon: Brain },
    { key: "memoryManagement", label: "Memory", icon: Database },
    { key: "arrays", label: "Arrays", icon: Code2 }
  ];

  // Problem card component
  const ProblemCard = ({ problem }) => {
    const isSelected = currentProblem?.title === problem.title;
    const isHovered = hoveredProblem === problem.key;
    const difficultyStyle = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Easy;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onHoverStart={() => setHoveredProblem(problem.key)}
        onHoverEnd={() => setHoveredProblem(null)}
        onClick={() => handleLoadProblem(problem)}
        className={`
          relative p-4 rounded-xl cursor-pointer 
          transition-all duration-200 ease-out
          transform-gpu
          ${isDarkMode 
            ? 'bg-gray-800 border-2 border-gray-700' 
            : 'bg-white border-2 border-gray-200'
          }
          ${isHovered
            ? isDarkMode
              ? 'scale-[1.02] border-purple-500 shadow-lg'
              : 'scale-[1.02] border-purple-400 shadow-md'
            : ''
          }
          ${isSelected 
            ? 'ring-2 ring-purple-500 ring-offset-2 ' + (isDarkMode ? 'ring-offset-gray-900' : 'ring-offset-white')
            : ''
          }
        `}
      >
        {/* Selected indicator */}
        {isSelected && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1"
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {problem.id > 0 && (
                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  #{problem.id}
                </span>
              )}
              <Badge className={`text-xs ${difficultyStyle.bg} ${difficultyStyle.text} border ${difficultyStyle.border}`}>
                {problem.difficulty}
              </Badge>
            </div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {problem.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {problem.description}
        </p>

        {/* Pattern tag */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs ${isDarkMode ? 'border-purple-700 text-purple-400' : 'border-purple-300 text-purple-600'}`}>
            <Zap className="w-3 h-3 mr-1" />
            {problem.pattern}
          </Badge>
        </div>

        {/* Memory concepts */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(problem.memoryConceptsTaught || []).slice(0, 2).map((concept, idx) => (
            <span 
              key={idx}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDarkMode 
                  ? 'bg-blue-900/30 text-blue-400' 
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {concept}
            </span>
          ))}
        </div>

        {/* Complexity */}
        <div className={`flex items-center gap-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {problem.timeComplexity}
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {problem.spaceComplexity}
          </span>
        </div>

        {/* Load button */}
        <div
          className={`absolute bottom-4 right-4 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Code2 className="w-4 h-4 mr-1" />
            Load
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
            <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              LeetCode Practice
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {problems.length} problems to master memory concepts
            </p>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.key;
          return (
            <Button
              key={cat.key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.key)}
              className={`
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0' 
                  : isDarkMode 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-1" />
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Problems grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {problems.map(problem => (
          <ProblemCard key={problem.key} problem={problem} />
        ))}
      </div>

      {/* Empty state */}
      {problems.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No problems in this category yet</p>
        </div>
      )}

      {/* Tips section */}
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-800' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
        <div className="flex items-start gap-3">
          <Lightbulb className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <div>
            <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Pro Tip: Watch the Memory!
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Click any problem to load it, then use "Parse Code" to step through and see exactly how pointers, 
              nodes, and memory change. This visual approach makes complex concepts click!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

