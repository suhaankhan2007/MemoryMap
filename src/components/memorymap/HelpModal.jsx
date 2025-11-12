import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Code, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpModal({ isOpen, onClose, isDarkMode }) {
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[85vh] z-50"
          >
            <div className={`${bgClass} rounded-2xl shadow-2xl overflow-hidden border-2 ${isDarkMode ? 'border-gray-700' : 'border-purple-200'}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">How to Use Memory Map</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
                <div className="space-y-6">
                  {/* Getting Started */}
                  <section>
                    <h3 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                      <Code className="w-5 h-5 text-blue-600" />
                      Getting Started
                    </h3>
                    <ul className={`space-y-2 ${secondaryTextClass} text-sm`}>
                      <li className="flex gap-2">
                        <span className="text-purple-600 font-bold">1.</span>
                        <span>Write C++ code in the editor (max 30 lines)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600 font-bold">2.</span>
                        <span>Click <strong className="text-yellow-600">Parse Code</strong> to analyze it</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600 font-bold">3.</span>
                        <span>Use <strong className="text-green-600">Auto Run</strong> or <strong>Step</strong> to execute line by line</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600 font-bold">4.</span>
                        <span>Watch memory visualization and read AI explanations</span>
                      </li>
                    </ul>
                  </section>

                  {/* Supported Features */}
                  <section>
                    <h3 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Supported C++ Features
                    </h3>
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 font-mono text-sm space-y-2`}>
                      <div className={secondaryTextClass}>
                        <strong className="text-blue-600">Primitive Types:</strong> int, float, double, char, bool, long, short
                      </div>
                      <div className={secondaryTextClass}>
                        <strong className="text-amber-600">Strings:</strong> std::string name = "Alice";
                      </div>
                      <div className={secondaryTextClass}>
                        <strong className="text-green-600">Pointers:</strong> int* ptr = &x; double* ptr = new double(3.14);
                      </div>
                      <div className={secondaryTextClass}>
                        <strong className="text-orange-600">Heap:</strong> new Type(value), delete ptr
                      </div>
                      <div className={secondaryTextClass}>
                        <strong className="text-purple-600">Dereferencing:</strong> *ptr = 20;
                      </div>
                      <div className={secondaryTextClass}>
                        <strong className="text-red-600">Null:</strong> ptr = nullptr; or ptr = NULL;
                      </div>
                    </div>
                  </section>

                  {/* Memory Management Warnings */}
                  <section>
                    <h3 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Memory Management Detection
                    </h3>
                    <div className="space-y-3">
                      <div className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border-2 border-red-300 rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-red-800 dark:text-red-400">Memory Leaks:</strong>
                            <p className={`text-sm ${secondaryTextClass} mt-1`}>
                              Heap memory allocated with <code className="bg-red-200 dark:bg-red-800 px-1 rounded">new</code> but never freed with <code className="bg-red-200 dark:bg-red-800 px-1 rounded">delete</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'} border-2 border-orange-300 rounded-lg p-3`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-orange-800 dark:text-orange-400">Dangling Pointers:</strong>
                            <p className={`text-sm ${secondaryTextClass} mt-1`}>
                              Pointers that point to deleted memory (use-after-free bugs)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Tips */}
                  <section>
                    <h3 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Pro Tips
                    </h3>
                    <ul className={`space-y-2 ${secondaryTextClass} text-sm`}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Use <strong>Examples</strong> dropdown to load pre-made code</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Adjust <strong>Speed</strong> slider to control auto-run timing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Use <strong>Undo/Redo</strong> (Ctrl+Z/Ctrl+Y) for code changes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Watch for animated arrows showing pointer connections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Toggle <strong>Dark Mode</strong> for comfortable viewing</span>
                      </li>
                    </ul>
                  </section>

                  {/* RAII Explanation */}
                  <section className={`${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'} border-2 border-indigo-300 rounded-lg p-4`}>
                    <h3 className={`text-lg font-bold ${textClass} mb-2`}>
                      🎯 Understanding RAII
                    </h3>
                    <p className={`text-sm ${secondaryTextClass}`}>
                      <strong>Resource Acquisition Is Initialization (RAII)</strong> is a C++ programming technique where:
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${secondaryTextClass} ml-4`}>
                      <li>• Resources are acquired in a constructor</li>
                      <li>• Resources are released in a destructor</li>
                      <li>• This visualization shows manual memory management - RAII automates this!</li>
                    </ul>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <Button onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Got it, let's code!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}