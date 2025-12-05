import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ExternalLink, ChevronDown, ChevronRight, 
  Lightbulb, GraduationCap, Youtube, FileText, Gamepad2,
  CheckCircle2, Star, Sparkles, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  LEARNING_RESOURCES, 
  PATTERN_RESOURCES,
  detectRelevantConcepts, 
  getResourceIcon,
  getDifficultyColor 
} from "./EducationalResources";

/**
 * LearningSidebar - Educational resources panel for CS students
 */
export default function LearningSidebar({ 
  code, 
  currentProblem,
  isDarkMode,
  isOpen,
  onToggle 
}) {
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [completedResources, setCompletedResources] = useState(new Set());

  // Detect relevant concepts from the current code
  const relevantConcepts = useMemo(() => {
    return detectRelevantConcepts(code);
  }, [code]);

  // Get pattern resources if in LeetCode mode
  const patternResources = currentProblem?.pattern 
    ? PATTERN_RESOURCES[currentProblem.pattern] 
    : null;

  const toggleTopic = (topicKey) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey);
    } else {
      newExpanded.add(topicKey);
    }
    setExpandedTopics(newExpanded);
  };

  const markComplete = (resourceUrl) => {
    const newCompleted = new Set(completedResources);
    if (newCompleted.has(resourceUrl)) {
      newCompleted.delete(resourceUrl);
    } else {
      newCompleted.add(resourceUrl);
    }
    setCompletedResources(newCompleted);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'interactive': return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  // When embedded in the Featured Tools panel, show content directly
  const isEmbedded = isOpen && !onToggle;

  if (isEmbedded) {
    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Detected Topics Badge */}
        {relevantConcepts.length > 0 && (
          <div className={`flex items-center gap-2 p-3 rounded-xl ${
            isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
          }`}>
            <span className="text-lg">📍</span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              {relevantConcepts.length} concept{relevantConcepts.length > 1 ? 's' : ''} detected in your code
            </span>
          </div>
        )}

        {/* Pattern Resources (if in LeetCode mode) */}
        {patternResources && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className={`font-bold text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                Pattern: {currentProblem.pattern}
              </span>
            </div>
            <p className={`text-xs mb-3 ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-600'}`}>
              {patternResources.explanation}
            </p>
            <div className="space-y-2">
              {patternResources.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                    isDarkMode 
                      ? 'bg-yellow-800/30 hover:bg-yellow-800/50 text-yellow-200' 
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {getTypeIcon(resource.type)}
                  <span className="flex-1">{resource.name}: {resource.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detected Topics */}
        {relevantConcepts.length > 0 && relevantConcepts.map((conceptKey) => {
          const concept = LEARNING_RESOURCES[conceptKey];
          if (!concept) return null;
          
          const isExpanded = expandedTopics.has(conceptKey);
          
          return (
            <motion.div
              key={conceptKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white'
              } shadow-sm`}
            >
              <button
                onClick={() => toggleTopic(conceptKey)}
                className={`w-full p-3 flex items-center justify-between text-left ${
                  isDarkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {conceptKey === 'linkedLists' ? '🔗' :
                     conceptKey === 'binaryTrees' ? '🌳' :
                     conceptKey === 'pointers' ? '👆' :
                     conceptKey === 'memoryAllocation' ? '📦' :
                     conceptKey === 'memoryLeaks' ? '💧' :
                     conceptKey === 'stackVsHeap' ? '📊' :
                     conceptKey === 'arrays' ? '📋' :
                     conceptKey === 'vectors' ? '📦' : '📚'}
                  </span>
                  <div>
                    <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {concept.topic}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getDifficultyColor(concept.difficulty)}`}>
                        {concept.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-3 pt-0 space-y-3 border-t ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-100'
                    }`}>
                      {/* Key Points */}
                      <div className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <span className={`text-xs font-bold ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Key Points
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {concept.keyPoints.map((point, idx) => (
                            <li key={idx} className={`text-xs flex items-start gap-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              <span className="text-green-500 mt-0.5">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Resources */}
                      <div className="space-y-2">
                        <div className={`text-xs font-medium ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          📖 Learning Resources
                        </div>
                        {concept.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markComplete(resource.url)}
                            className={`flex items-center gap-3 p-2 rounded-lg text-xs transition-all group ${
                              completedResources.has(resource.url)
                                ? isDarkMode 
                                  ? 'bg-green-900/30 border border-green-700' 
                                  : 'bg-green-50 border border-green-200'
                                : isDarkMode 
                                  ? 'bg-gray-700 hover:bg-gray-600' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium truncate ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                                {resource.title}
                              </div>
                              <div className={`flex items-center gap-1 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <span>{getResourceIcon(resource.type)}</span>
                                <span>{resource.name}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {completedResources.has(resource.url) ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Quick Links */}
        <div className={`p-4 rounded-xl ${
          isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-100 to-purple-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-blue-500" />
            <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Quick Reference Links
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'W3Schools C++', url: 'https://www.w3schools.com/cpp/', icon: '📚' },
              { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/c-plus-plus/', icon: '🧠' },
              { name: 'CPlusPlus.com', url: 'https://cplusplus.com/doc/tutorial/', icon: '📖' },
              { name: 'LearnCpp', url: 'https://www.learncpp.com/', icon: '🎓' },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className={`text-center p-3 rounded-xl ${
          isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
        }`}>
          <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            🌟 <strong>Keep learning!</strong> Every concept you master brings you closer to becoming a great programmer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/50' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
    } ${isOpen ? 'shadow-2xl' : 'shadow-lg'}`}>
      
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between ${
          isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-100/50'
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              📚 Learn & Resources
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {relevantConcepts.length > 0 
                ? `${relevantConcepts.length} relevant topics detected`
                : 'Tutorials, videos & articles'
              }
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 max-h-[500px] overflow-y-auto">
              
              {/* Pattern Resources (if in LeetCode mode) */}
              {patternResources && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className={`font-bold text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      Pattern: {currentProblem.pattern}
                    </span>
                  </div>
                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-600'}`}>
                    {patternResources.explanation}
                  </p>
                  <div className="space-y-2">
                    {patternResources.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                          isDarkMode 
                            ? 'bg-yellow-800/30 hover:bg-yellow-800/50 text-yellow-200' 
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {getTypeIcon(resource.type)}
                        <span className="flex-1">{resource.name}: {resource.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Detected Topics */}
              {relevantConcepts.length > 0 && (
                <>
                  <div className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    📍 Relevant to Your Code
                  </div>
                  
                  {relevantConcepts.map((conceptKey) => {
                    const concept = LEARNING_RESOURCES[conceptKey];
                    if (!concept) return null;
                    
                    const isExpanded = expandedTopics.has(conceptKey);
                    
                    return (
                      <motion.div
                        key={conceptKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl overflow-hidden ${
                          isDarkMode ? 'bg-gray-700/50' : 'bg-white'
                        } shadow-sm`}
                      >
                        <button
                          onClick={() => toggleTopic(conceptKey)}
                          className={`w-full p-3 flex items-center justify-between text-left ${
                            isDarkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {conceptKey === 'linkedLists' ? '🔗' :
                               conceptKey === 'binaryTrees' ? '🌳' :
                               conceptKey === 'pointers' ? '👆' :
                               conceptKey === 'memoryAllocation' ? '📦' :
                               conceptKey === 'memoryLeaks' ? '💧' :
                               conceptKey === 'stackVsHeap' ? '📊' :
                               conceptKey === 'arrays' ? '📋' :
                               conceptKey === 'vectors' ? '📦' : '📚'}
                            </span>
                            <div>
                              <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {concept.topic}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getDifficultyColor(concept.difficulty)}`}>
                                  {concept.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className={`p-3 pt-0 space-y-3 border-t ${
                                isDarkMode ? 'border-gray-600' : 'border-gray-100'
                              }`}>
                                {/* Key Points */}
                                <div className={`p-3 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
                                }`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                                    <span className={`text-xs font-bold ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                      Key Points
                                    </span>
                                  </div>
                                  <ul className="space-y-1">
                                    {concept.keyPoints.map((point, idx) => (
                                      <li key={idx} className={`text-xs flex items-start gap-2 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        <span className="text-green-500 mt-0.5">•</span>
                                        {point}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Resources */}
                                <div className="space-y-2">
                                  <div className={`text-xs font-medium ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    📖 Learning Resources
                                  </div>
                                  {concept.resources.map((resource, idx) => (
                                    <a
                                      key={idx}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => markComplete(resource.url)}
                                      className={`flex items-center gap-3 p-2 rounded-lg text-xs transition-all group ${
                                        completedResources.has(resource.url)
                                          ? isDarkMode 
                                            ? 'bg-green-900/30 border border-green-700' 
                                            : 'bg-green-50 border border-green-200'
                                          : isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                      }`}
                                    >
                                      <div className="flex-shrink-0">
                                        {getTypeIcon(resource.type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-medium truncate ${
                                          isDarkMode ? 'text-white' : 'text-gray-800'
                                        }`}>
                                          {resource.title}
                                        </div>
                                        <div className={`flex items-center gap-1 ${
                                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                          <span>{getResourceIcon(resource.type)}</span>
                                          <span>{resource.name}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {completedResources.has(resource.url) ? (
                                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </>
              )}

              {/* Quick Links */}
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-100 to-purple-100'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Quick Reference Links
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'W3Schools C++', url: 'https://www.w3schools.com/cpp/', icon: '📚' },
                    { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/c-plus-plus/', icon: '🧠' },
                    { name: 'CPlusPlus.com', url: 'https://cplusplus.com/doc/tutorial/', icon: '📖' },
                    { name: 'LearnCpp', url: 'https://www.learncpp.com/', icon: '🎓' },
                  ].map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                          : 'bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Encouragement */}
              <div className={`text-center p-3 rounded-xl ${
                isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
              }`}>
                <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  🌟 <strong>Keep learning!</strong> Every concept you master brings you closer to becoming a great programmer.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
