import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, SkipForward, RotateCcw, Lightbulb, Zap, Pause, BookOpen, AlertTriangle, TrendingUp, Moon, Sun, Undo, Redo } from "lucide-react";
import { MemoryMapLogo } from "@/components/ui/memory-map-logo";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CodeEditor from "../components/memorymap/CodeEditor";
import MemoryVisualization from "../components/memorymap/MemoryVisualization";
import ExplanationPanel from "../components/memorymap/ExplanationPanel";
import CallStackPanel from "../components/memorymap/CallStackPanel";
import WatchPanel from "../components/memorymap/WatchPanel";
import BreakpointPanel from "../components/memorymap/BreakpointPanel";
import { parseAndSimulateCpp } from "../components/memorymap/cppSimulator";
import { parseAndSimulateC } from "../components/memorymap/cSimulator";
import HelpModal from "../components/memorymap/HelpModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CPP_EXAMPLES = {
  basic: {
    name: "Basic Pointers",
    description: "Learn pointer fundamentals and dereferencing",
    code: `int* ptr = new int(42);
*ptr = 100;
delete ptr;
ptr = nullptr;`
  },

  heap: {
    name: "Heap Memory",
    description: "Dynamic memory allocation and deallocation",
    code: `int* ptr = new int(30);
*ptr = 40;
int x = 50;
delete ptr;`
  },

  arrays: {
    name: "Arrays",
    description: "Stack and heap arrays with indexing",
    code: `int arr[3] = {10, 20, 30};
arr[1] = 25;
int* dynArr = new int[4];
dynArr[0] = 100;
dynArr[3] = 400;
delete[] dynArr;`
  },

  references: {
    name: "References",
    description: "C++ references and aliasing",
    code: `int x = 10;
int& ref = x;
ref = 20;
int y = 30;`
  },

  structs: {
    name: "Structs",
    description: "Structured data types",
    code: `struct Point {
int x;
int y;
};
Point p;
p.x = 5;
p.y = 10;`
  },

  functions: {
    name: "Function Calls",
    description: "Function calls with stack frames",
    code: `int add(int a, int b) {
int result = a + b;
return result;
}
int x = 5;
int y = 10;
int sum = add(x, y);`
  },

  multiple_pointers: {
    name: "Multiple Pointers",
    description: "Multiple pointers to same location",
    code: `int x = 5;
int* p1 = &x;
int* p2 = p1;
*p2 = 10;
int* heap = new int(20);
p1 = heap;
delete heap;`
  },

  complex: {
    name: "Complex Example",
    description: "Advanced pointer manipulation",
    code: `int a = 10;
int b = 20;
int* ptr1 = &a;
int* ptr2 = &b;
*ptr1 = 30;
int* heap1 = new int(100);
int* heap2 = new int(200);
ptr1 = heap1;
ptr2 = heap2;
*ptr1 = 150;
delete heap1;
delete heap2;`
  },

  mixed_types: {
    name: "Mixed Types",
    description: "Different data types in memory",
    code: `int x = 42;
float pi = 3.14;
double e = 2.718;
char c = 'A';
bool flag = true;
double* dptr = &e;
*dptr = 2.5;
float* fheap = new float(9.99);
delete fheap;`
  },

  strings: {
    name: "Strings",
    description: "String handling in C++",
    code: `std::string name = "Alice";
std::string* ptr = &name;
std::string* heap = new std::string("Hello");
int age = 25;
delete heap;`
  },

  vectors: {
    name: "Vectors",
    description: "std::vector operations",
    code: `std::vector<int> vec = {1, 2, 3};
vec.push_back(4);
vec.push_back(5);
vec[0] = 10;
int x = 42;`
  },

  memory_leak: {
    name: "Memory Leak Demo",
    description: "See how memory leaks occur",
    code: `int* ptr1 = new int(100);
int* ptr2 = new int(200);
int x = 50;
delete ptr1;`
  },

  raii: {
    name: "RAII Pattern",
    description: "Resource management with functions",
    code: `int allocate(int val) {
int* ptr = new int(val);
int result = *ptr;
delete ptr;
return result;
}
int value = allocate(42);`
  },
};

const C_EXAMPLES = {
  basic: {
    name: "Basic Pointers",
    description: "Learn pointer fundamentals in C",
    code: `int* ptr = (int*)malloc(sizeof(int));
*ptr = 42;
free(ptr);
ptr = NULL;`
  },

  malloc_free: {
    name: "malloc/free",
    description: "Dynamic memory with malloc and free",
    code: `int* ptr = (int*)malloc(sizeof(int));
*ptr = 42;
int x = 50;
free(ptr);`
  },

  arrays: {
    name: "Arrays",
    description: "Stack and heap arrays",
    code: `int arr[3] = {10, 20, 30};
arr[1] = 25;
int* dynArr = (int*)malloc(4 * sizeof(int));
dynArr[0] = 100;
dynArr[3] = 400;
free(dynArr);`
  },

  structs: {
    name: "Structs",
    description: "Structured data types in C",
    code: `struct Point {
int x;
int y;
};
struct Point p;
p.x = 5;
p.y = 10;`
  },

  calloc: {
    name: "calloc",
    description: "Zero-initialized allocation",
    code: `int* arr = (int*)calloc(5, sizeof(int));
arr[0] = 10;
arr[4] = 50;
free(arr);`
  },

  pointer_arithmetic: {
    name: "Pointer Basics",
    description: "Working with multiple pointers",
    code: `int x = 5;
int* p1 = &x;
int* p2 = p1;
*p2 = 10;
int* heap = (int*)malloc(sizeof(int));
*heap = 20;
free(heap);`
  },

  memory_leak: {
    name: "Memory Leak Demo",
    description: "See how memory leaks occur in C",
    code: `int* ptr1 = (int*)malloc(sizeof(int));
*ptr1 = 100;
int* ptr2 = (int*)malloc(sizeof(int));
*ptr2 = 200;
free(ptr1);`
  },

  mixed_types: {
    name: "Mixed Types",
    description: "Different data types in memory",
    code: `int x = 42;
float pi = 3.14;
double e = 2.718;
char c = 'A';
double* dptr = &e;
*dptr = 2.5;`
  },
};

export default function MemoryMapPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(`double num = 6.5;
int* ptr = new int(42);
*ptr = 100;
delete ptr;
ptr = nullptr;`);
  const [codeHistory, setCodeHistory] = useState([`double num = 6.5;
int* ptr = new int(42);
*ptr = 100;
delete ptr;
ptr = nullptr;`]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [runSpeed, setRunSpeed] = useState(1500);
  const [explanations, setExplanations] = useState({});
  const [isGeneratingExplanations, setIsGeneratingExplanations] = useState(false);
  const [error, setError] = useState(null);
  const [memoryLeaks, setMemoryLeaks] = useState([]);
  const [danglingPointers, setDanglingPointers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [watchList, setWatchList] = useState([]);
  const intervalRef = React.useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('memorymap-dark-mode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memorymap-dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const newHistory = codeHistory.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setCodeHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(codeHistory[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, codeHistory]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const examples = newLang === 'cpp' ? CPP_EXAMPLES : C_EXAMPLES;
    const newCode = examples.basic.code;
    setCode(newCode);
    setCodeHistory([newCode]);
    setHistoryIndex(0);
    setExecutionSteps([]);
    setCurrentStep(0);
    setExplanations({});
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    setBreakpoints(new Set());
    setWatchList([]);
  };

  const handleRun = async () => {
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    try {
      console.log(`Parsing ${language} code:`, code);
      const steps = language === 'cpp' ? parseAndSimulateCpp(code) : parseAndSimulateC(code);
      console.log("Generated steps:", steps);
      
      if (steps.length === 0) {
        setError(`No executable code found. Please check your ${language === 'cpp' ? 'C++' : 'C'} syntax.`);
        return;
      }
      
      setExecutionSteps(steps);
      setCurrentStep(0);
      
      // Detect memory leaks and dangling pointers
      detectMemoryIssues(steps);
      
      // Generate AI explanations
      await generateExplanations(steps);
    } catch (error) {
      console.error("Error parsing code:", error);
      setError("Error parsing code: " + error.message);
    }
  };

  const detectMemoryIssues = (steps) => {
    const lastStep = steps[steps.length - 1];
    if (lastStep) {
      // Memory leaks: heap blocks never freed - get their addresses
      const leakedMemory = lastStep.memoryState.heap
        .filter(block => !block.isDeleted)
        .map(block => block.address);
      if (leakedMemory.length > 0) {
        setMemoryLeaks(leakedMemory);
      }
      
      const danglingPtrs = lastStep.memoryState.danglingPointers || [];
      if (danglingPtrs.length > 0) {
        setDanglingPointers(danglingPtrs);
      }
    }
  };

  const generateExplanations = async (steps) => {
    setIsGeneratingExplanations(true);
    const newExplanations = {};

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const fullCode = code;
        
        const langName = language === 'cpp' ? 'C++' : 'C';
        const prompt = `You are an expert ${langName} instructor teaching memory management and advanced concepts.
Analyze this line of ${langName} code and provide a comprehensive but accessible explanation.

**Current Line:** "${step.line}"

**Full Code Context:**
\`\`\`${language === 'cpp' ? 'cpp' : 'c'}
${fullCode}
\`\`\`

**Current Memory State:**
- Stack variables: ${JSON.stringify(step.memoryState.stack)}
- Heap allocations: ${JSON.stringify(step.memoryState.heap)}
- Pointers: ${JSON.stringify(step.memoryState.pointers)}

**Provide insights on (where applicable):**

1. **Memory Operation**: What's happening in memory (stack/heap allocation, pointer manipulation, etc.)

2. **Data Structure Insights**: If the code involves or builds toward data structures (linked lists, trees, graphs, dynamic arrays), explain:
   - How nodes/elements are connected
   - Memory layout implications
   - Time/space complexity hints

3. **Compiler Optimizations**: Mention any likely compiler optimizations:
   - Return Value Optimization (RVO/NRVO)
   - Copy elision
   - Inlining possibilities
   - Register allocation hints
   - Dead code elimination

4. **${language === 'cpp' ? 'C++' : 'C'} Pitfalls & Best Practices**: Warn about potential issues:
   - Undefined behavior risks (uninitialized variables, buffer overflows, integer overflow)
   - Race conditions (if threading context is implied)
   - Object slicing
   - Exception safety concerns
   - Rule of Three/Five/Zero violations
   - Dangling references
   - Use-after-free risks

5. **Modern Alternatives**: Briefly suggest safer alternatives when applicable (${language === 'cpp' ? 'smart pointers, containers, RAII patterns' : 'better memory management practices, using wrapper functions'}).

**Format your response as:**
- Start with a simple 1-2 sentence explanation of what the line does
- Add a "💡 Deeper Insight:" section for advanced concepts (keep it concise)
- Add a "⚠️ Watch Out:" section only if there's a genuine pitfall risk

Keep the tone friendly and educational. Total response should be 3-6 sentences.`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt: prompt,
        });

        newExplanations[i] = result;
      }

      setExplanations(newExplanations);
    } catch (error) {
      console.error("Error generating explanations:", error);
    } finally {
      setIsGeneratingExplanations(false);
    }
  };

  const handleStep = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPaused(false);
    }
  };

  const handleToggleBreakpoint = (lineNumber) => {
    setBreakpoints(prev => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(lineNumber)) {
        newBreakpoints.delete(lineNumber);
      } else {
        newBreakpoints.add(lineNumber);
      }
      return newBreakpoints;
    });
  };

  const handleAddWatch = (varName) => {
    if (!watchList.includes(varName)) {
      setWatchList([...watchList, varName]);
    }
  };

  const handleRemoveWatch = (varName) => {
    setWatchList(watchList.filter(v => v !== varName));
  };

  const handleAutoRun = () => {
    setIsRunning(true);
    setIsPaused(false);
    let step = currentStep;
    
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= executionSteps.length) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        return;
      }
      
      // Check for breakpoint
      const nextLine = executionSteps[step]?.lineNumber;
      if (breakpoints.has(nextLine)) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(true);
        setCurrentStep(step);
        return;
      }
      
      setCurrentStep(step);
    }, runSpeed);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleLoadExample = (exampleKey) => {
    const examples = language === 'cpp' ? CPP_EXAMPLES : C_EXAMPLES;
    const newCode = examples[exampleKey].code;
    setCode(newCode);
    setCodeHistory([...codeHistory, newCode]);
    setHistoryIndex(codeHistory.length);
    setExecutionSteps([]);
    setCurrentStep(0);
    setExplanations({});
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    setBreakpoints(new Set());
    setWatchList([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentMemoryState = executionSteps[currentStep]?.memoryState || { stack: [], heap: [], pointers: [] };
  const currentLine = executionSteps[currentStep]?.lineNumber || 0;
  const currentExplanation = explanations[currentStep] || "";
  const currentDanglingPointers = currentMemoryState.danglingPointers || [];

  const stackSize = currentMemoryState.stack.length;
  const heapSize = currentMemoryState.heap.filter(b => !b.isDeleted).length;
  const deletedHeap = currentMemoryState.heap.filter(b => b.isDeleted).length;

  const bgClass = isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50';
  const headerClass = isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowWelcome(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-700' : 'border-purple-300'}`}>
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <MemoryMapLogo className="w-14 h-14" />
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-3">Welcome to Memory Map</h1>
                  <p className="text-xl text-blue-100">Learn C/C++ Memory Management Visually</p>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className={`${secondaryTextClass} text-lg leading-relaxed`}>
                    <p className="mb-4">
                      Memory Map helps you <strong className="text-purple-600">understand</strong> how C and C++ manage memory by 
                      <strong className="text-blue-600"> visualizing</strong> every step of your code execution.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        <h3 className={`font-bold ${textClass}`}>Interactive Learning</h3>
                      </div>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        Write code, parse it, and watch memory changes step by step
                      </p>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="w-6 h-6 text-orange-600" />
                        <h3 className={`font-bold ${textClass}`}>AI Explanations</h3>
                      </div>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        Get beginner-friendly explanations for every line
                      </p>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <h3 className={`font-bold ${textClass}`}>Bug Detection</h3>
                      </div>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        Automatically detects memory leaks and dangling pointers
                      </p>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-cyan-50'} rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-cyan-600" />
                        <h3 className={`font-bold ${textClass}`}>Advanced Features</h3>
                      </div>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        Supports pointers, arrays, structs, vectors, and functions
                      </p>
                    </div>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} border-2 border-indigo-300 rounded-xl p-4`}>
                    <p className={`text-sm ${secondaryTextClass} text-center`}>
                      💡 <strong>Pro tip:</strong> Start with the <strong className="text-purple-600">Examples</strong> dropdown to explore different concepts!
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowWelcome(false)}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                    >
                      Start Learning
                    </Button>
                    <Button
                      onClick={() => {
                        setShowWelcome(false);
                        setShowHelp(true);
                      }}
                      size="lg"
                      variant="outline"
                      className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} py-6`}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      View Tutorial
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} isDarkMode={isDarkMode} />
      
      {/* Header */}
      <header className={`${headerClass} shadow-xl`}>
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <MemoryMapLogo className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Memory Map</h1>
                <p className="text-blue-100">Visualize C/C++ Memory: Stack, Heap, Pointers, Arrays, Structs & More</p>
              </div>
            </div>
            
            {/* Language Tabs */}
            <Tabs value={language} onValueChange={handleLanguageChange} className="w-auto">
              <TabsList className="bg-white/20 border border-white/30">
                <TabsTrigger value="cpp" className="data-[state=active]:bg-white data-[state=active]:text-purple-700 text-white font-semibold px-6">
                  C++
                </TabsTrigger>
                <TabsTrigger value="c" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 text-white font-semibold px-6">
                  C
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => setShowHelp(true)}
                size="lg"
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-white/50 gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Help</span>
              </Button>

              <Button
                onClick={() => setIsDarkMode(!isDarkMode)}
                size="lg"
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-white/50"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button
                onClick={handleUndo}
                size="lg"
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-white/50"
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleRedo}
                size="lg"
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-white/50"
                disabled={historyIndex >= codeHistory.length - 1}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-5 h-5" />
              </Button>

              <Select onValueChange={handleLoadExample}>
                <SelectTrigger className="w-48 bg-white/90 border-none">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Load Example" />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {Object.entries(language === 'cpp' ? CPP_EXAMPLES : C_EXAMPLES).map(([key, example]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{example.name}</span>
                        <span className="text-xs text-gray-500">{example.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRun}
                size="lg"
                className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold shadow-lg"
                disabled={isRunning || !code.trim()}
              >
                <Zap className="w-5 h-5" />
                Parse Code
              </Button>
              
              {!isRunning ? (
                <Button
                  onClick={handleAutoRun}
                  size="lg"
                  className="gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg"
                  disabled={executionSteps.length === 0}
                >
                  <Play className="w-5 h-5" />
                  Auto Run
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleStep}
                size="lg"
                variant="outline"
                className="gap-2 bg-white/90 hover:bg-white border-2 border-white/50 font-semibold"
                disabled={isRunning || currentStep >= executionSteps.length - 1}
              >
                <SkipForward className="w-5 h-5" />
                Step
              </Button>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-white/50"
                disabled={executionSteps.length === 0}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Speed Control */}
          {executionSteps.length > 0 && (
            <div className="mt-4 flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <span className="text-white text-sm font-medium">Speed:</span>
              <Slider
                value={[runSpeed]}
                onValueChange={(value) => setRunSpeed(value[0])}
                min={500}
                max={3000}
                step={500}
                className="w-48"
              />
              <span className="text-white text-sm">{runSpeed}ms</span>
            </div>
          )}
        </div>
      </header>

      {/* Memory Stats Bar */}
      {executionSteps.length > 0 && (
        <div className={isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b shadow-sm'}>
          <div className="max-w-[1800px] mx-auto px-6 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className={`font-medium ${secondaryTextClass}`}>Stack: {stackSize} variables</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className={`font-medium ${secondaryTextClass}`}>Heap: {heapSize} active</span>
                </div>
                {deletedHeap > 0 && (
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{deletedHeap} deleted</span>
                  </div>
                )}
              </div>
              <div className="font-semibold text-purple-600">
                Step {currentStep + 1} / {executionSteps.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-[1800px] mx-auto px-6 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-800 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-lg">Parsing Error</strong>
              <p className="mt-1">{error}</p>
              <p className="text-sm mt-2 text-red-600">
                💡 Try loading an example from the dropdown or check the syntax guide in the Help menu.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dangling Pointer Warning */}
      {currentDanglingPointers.length > 0 && (
        <div className="max-w-[1800px] mx-auto px-6 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-50 border-2 border-orange-400 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-orange-900">⚠️ Dangling Pointer Detected!</strong>
              <p className="text-orange-800 mt-1">
                Pointer(s) <code className="bg-orange-200 px-1 rounded font-mono">{currentDanglingPointers.join(', ')}</code> point to deleted memory. 
                Using them causes <strong>use-after-free</strong> bugs! Always set pointers to <code className="bg-orange-200 px-1 rounded">nullptr</code> after deletion.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Memory Leak Warning */}
      {memoryLeaks.length > 0 && currentStep === executionSteps.length - 1 && (
        <div className="max-w-[1800px] mx-auto px-6 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-yellow-900">💧 Memory Leak Detected!</strong>
              <p className="text-yellow-800 mt-1">
                You have {memoryLeaks.length} heap allocation(s) that were never freed with <code className="bg-yellow-200 px-1 rounded">delete</code>. 
                Leaked addresses: <code className="bg-yellow-200 px-1 rounded font-mono">{memoryLeaks.join(', ')}</code>. 
                This causes memory leaks in real programs! Always match every <code className="bg-yellow-200 px-1 rounded">new</code> with a <code className="bg-yellow-200 px-1 rounded">delete</code>.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Code Editor */}
          <div className="space-y-6">
            <Card className={`p-6 ${cardClass} shadow-2xl border-2`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${textClass} flex items-center gap-2`}>
                  <div className={`w-2 h-2 ${language === 'cpp' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
                  {language === 'cpp' ? 'C++' : 'C'} Code Editor
                </h2>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Max 30 lines
                </span>
              </div>
              <CodeEditor
                code={code}
                onChange={handleCodeChange}
                currentLine={currentLine}
                isDarkMode={isDarkMode}
                isExecuting={executionSteps.length > 0}
                breakpoints={breakpoints}
                onToggleBreakpoint={handleToggleBreakpoint}
                language={language}
              />
            </Card>

            {/* Explanation Panel */}
            <ExplanationPanel
              explanation={currentExplanation}
              isLoading={isGeneratingExplanations}
              stepNumber={currentStep + 1}
              totalSteps={executionSteps.length}
              isDarkMode={isDarkMode}
            />

            {/* Debugging Panels */}
            {executionSteps.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                <CallStackPanel
                  callStack={currentMemoryState.callStack}
                  isDarkMode={isDarkMode}
                />
                <WatchPanel
                  watchList={watchList}
                  onAddWatch={handleAddWatch}
                  onRemoveWatch={handleRemoveWatch}
                  memoryState={currentMemoryState}
                  isDarkMode={isDarkMode}
                />
                <BreakpointPanel
                  breakpoints={breakpoints}
                  onRemoveBreakpoint={handleToggleBreakpoint}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
            </div>

          {/* Right: Memory Visualization */}
          <div>
            <Card className={`p-8 ${cardClass} shadow-2xl border-2 min-h-[700px]`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${textClass}`}>Memory Visualization</h2>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded shadow-sm"></div>
                    <span className={secondaryTextClass}>Stack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded shadow-sm"></div>
                    <span className={secondaryTextClass}>Heap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded shadow-sm"></div>
                    <span className={secondaryTextClass}>Pointer</span>
                  </div>
                </div>
              </div>

              <MemoryVisualization
                memoryState={currentMemoryState}
                isActive={executionSteps.length > 0}
                isDarkMode={isDarkMode}
              />
            </Card>
          </div>
        </div>

        {/* Quick Start Guide */}
        {executionSteps.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'} border-2 rounded-xl p-6 shadow-lg`}
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-3 text-xl`}>Quick Start Guide</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span className={`font-semibold ${textClass}`}>Write Code</span>
                    </div>
                    <p className={`text-sm ${secondaryTextClass}`}>Enter {language === 'cpp' ? 'C++' : 'C'} code or load an example from the dropdown</p>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span className={`font-semibold ${textClass}`}>Parse</span>
                    </div>
                    <p className={`text-sm ${secondaryTextClass}`}>Click "Parse Code" to analyze your program</p>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span className={`font-semibold ${textClass}`}>Visualize</span>
                    </div>
                    <p className={`text-sm ${secondaryTextClass}`}>Use "Auto Run" or "Step" to see memory in action</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'} rounded-lg p-3 mb-3`}>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    ✨ <strong>Supports:</strong> Pointers, Arrays, Structs, References, std::vector, Functions, Memory Leak Detection, and more!
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => setShowHelp(true)}
                    variant="outline"
                    size="sm"
                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-blue-50 border-blue-300'}`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Full Tutorial
                  </Button>
                  <Button 
                    onClick={() => handleLoadExample('functions')}
                    variant="outline"
                    size="sm"
                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-blue-50 border-blue-300'}`}
                  >
                    Try Function Calls Example
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}