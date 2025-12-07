import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, SkipForward, RotateCcw, Lightbulb, Zap, Pause, BookOpen, AlertTriangle, TrendingUp, Moon, Sun, Undo, Redo, Share2, Trophy, Home, ChevronDown } from "lucide-react";
import { MemoryMapLogo } from "@/components/ui/memory-map-logo";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
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
import LeetCodePanel from "../components/memorymap/LeetCodePanel";
import ExportModal from "../components/memorymap/ExportModal";
import ComplexityBadge from "../components/memorymap/ComplexityBadge";
import LearningSidebar from "../components/memorymap/LearningSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";

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

  linked_list: {
    name: "🔗 Linked List",
    description: "Build and visualize a linked list",
    code: `struct Node {
  int data;
  Node* next;
};

Node* head = new Node;
head->data = 1;

Node* second = new Node;
second->data = 2;
head->next = second;

Node* third = new Node;
third->data = 3;
second->next = third;
third->next = nullptr;`
  },

  binary_tree: {
    name: "🌳 Binary Tree",
    description: "Build and visualize a binary tree",
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

TreeNode* root = new TreeNode;
root->val = 10;

TreeNode* left = new TreeNode;
left->val = 5;
root->left = left;
left->left = nullptr;
left->right = nullptr;

TreeNode* right = new TreeNode;
right->val = 15;
root->right = right;
right->left = nullptr;
right->right = nullptr;`
  },

  doubly_linked: {
    name: "🔗🔗 Doubly Linked List",
    description: "Linked list with prev and next pointers",
    code: `struct Node {
  int data;
  Node* prev;
  Node* next;
};

Node* head = new Node;
head->data = 1;
head->prev = nullptr;

Node* second = new Node;
second->data = 2;
head->next = second;
second->prev = head;

Node* third = new Node;
third->data = 3;
second->next = third;
third->prev = second;
third->next = nullptr;`
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
  
  // LeetCode Mode State
  const [leetCodeOpen, setLeetCodeOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [learningSidebarOpen, setLearningSidebarOpen] = useState(false); // Collapsed by default for better view
  const [featuredTab, setFeaturedTab] = useState("memai"); // 'memai', 'leetcode', 'learn'
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Track scroll position for floating bar
  useEffect(() => {
    const handleScroll = () => {
      // Show floating bar when scrolled past 200px
      setShowFloatingBar(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      
      // Auto-open Mem AI panel to show explanations
      setFeaturedTab('memai');
      setLearningSidebarOpen(true);
      
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

  // Generate smart fallback explanations when API isn't available
  const generateFallbackExplanation = (step, lang) => {
    const line = step.line.trim();
    const langName = lang === 'cpp' ? 'C++' : 'C';
    
    // Pattern matching for common operations
    if (line.includes('new ') && line.includes('int')) {
      return `🔵 **Heap Allocation**: This line allocates memory on the heap for an integer using \`new\`. The returned address is stored in a pointer variable.\n\n💡 **Deeper Insight:** Heap memory persists until explicitly freed with \`delete\`. Unlike stack memory, you control its lifetime.\n\n⚠️ **Watch Out:** Always pair \`new\` with \`delete\` to prevent memory leaks!`;
    }
    if (line.includes('new ') && (line.includes('Node') || line.includes('ListNode') || line.includes('TreeNode'))) {
      return `🔵 **Node Creation**: Allocating a new node structure on the heap. This is the building block for data structures like linked lists and trees.\n\n💡 **Deeper Insight:** Each node typically contains data and pointer(s) to other nodes, creating connected structures in memory.`;
    }
    if (line.includes('->next')) {
      return `🔗 **Linked List Operation**: Using the arrow operator (\`->\`) to access or modify the \`next\` pointer of a node. This connects nodes together to form a chain.\n\n💡 **Deeper Insight:** Following \`next\` pointers is O(n) traversal - each hop requires dereferencing a memory address.`;
    }
    if (line.includes('->left') || line.includes('->right')) {
      return `🌳 **Binary Tree Operation**: Accessing a child node pointer in a binary tree structure. Left typically holds smaller values, right holds larger (in BST).\n\n💡 **Deeper Insight:** Tree height affects performance - balanced trees give O(log n) operations.`;
    }
    if (line.includes('->val') || line.includes('->data')) {
      return `📦 **Accessing Node Data**: Reading or writing the value stored in this node using the arrow operator.\n\n💡 **Deeper Insight:** The arrow operator (\`->\`) combines dereferencing (\`*\`) and member access (\`.\`) into one operation.`;
    }
    if (line.includes('delete ')) {
      return `🗑️ **Memory Deallocation**: This line frees heap memory using \`delete\`. The memory is returned to the system for reuse.\n\n⚠️ **Watch Out:** After deletion, the pointer becomes "dangling" - set it to \`nullptr\` immediately to avoid use-after-free bugs!`;
    }
    if (line.includes('nullptr') || line.includes('NULL')) {
      return `🚫 **Null Pointer Assignment**: Setting a pointer to null indicates it points to nothing. This is crucial after deletion or for marking list/tree ends.\n\n💡 **Deeper Insight:** Always check for null before dereferencing to prevent crashes!`;
    }
    if (line.includes('*') && line.includes('=') && !line.includes('new')) {
      return `📝 **Dereferencing & Assignment**: The \`*\` operator accesses the value at the memory address stored in the pointer. This modifies the actual data in memory.\n\n💡 **Deeper Insight:** This is how we "reach through" a pointer to change what it points to.`;
    }
    if (line.includes('int ') || line.includes('char ') || line.includes('float ') || line.includes('double ')) {
      if (line.includes('*')) {
        return `📍 **Pointer Declaration**: Creating a pointer variable that will store a memory address. The \`*\` indicates this is a pointer type.\n\n💡 **Deeper Insight:** Pointers are typically 8 bytes on 64-bit systems, regardless of what type they point to.`;
      }
      return `📊 **Stack Variable**: Declaring a variable on the stack. Stack memory is automatically managed - it's created when the function is called and destroyed when it returns.\n\n💡 **Deeper Insight:** Stack allocation is extremely fast - just moving the stack pointer!`;
    }
    if (line.includes('struct ') || line.includes('class ')) {
      return `🏗️ **Structure Definition**: Defining a custom data type that groups related variables together. Each instance will have its own copy of these members.\n\n💡 **Deeper Insight:** Structs lay out members contiguously in memory, which is cache-friendly.`;
    }
    if (line.includes('while') || line.includes('for')) {
      return `🔄 **Loop Structure**: Beginning a loop that will repeat code until a condition is false. Common for traversing data structures.\n\n💡 **Deeper Insight:** When traversing linked structures, always check for null to avoid infinite loops!`;
    }
    if (line.includes('if') || line.includes('else')) {
      return `🔀 **Conditional Branch**: The program will take different paths based on this condition. Essential for handling edge cases like empty lists.\n\n💡 **Deeper Insight:** Always handle null pointer cases before dereferencing!`;
    }
    
    // Default explanation
    return `📝 **${langName} Code**: ${line}\n\nThis line is being executed. Watch the memory visualization to see how the stack and heap change!\n\n💡 **Tip:** Step through slowly to understand each memory operation.`;
  };

  const generateExplanations = async (steps) => {
    setIsGeneratingExplanations(true);
    const newExplanations = {};

    try {
      // Try API-based generation first
      let apiWorking = true;
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // If API failed before, use fallback for remaining
        if (!apiWorking) {
          newExplanations[i] = generateFallbackExplanation(step, language);
          continue;
        }
        
        const langName = language === 'cpp' ? 'C++' : 'C';
        const prompt = `You are Mem AI, a friendly ${langName} memory tutor. Explain this line simply:

Line: "${step.line}"
Memory: Stack has ${step.memoryState.stack.length} vars, Heap has ${step.memoryState.heap.length} blocks.

Give a 2-3 sentence explanation of what this line does with memory. Be concise but insightful. If it's a pointer/struct operation, explain the memory connection. End with one emoji that represents the operation.`;

        try {
          const result = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
          });
          
          if (result && result.length > 10) {
            newExplanations[i] = result;
          } else {
            newExplanations[i] = generateFallbackExplanation(step, language);
          }
        } catch (apiError) {
          console.warn("API call failed for step", i, "- using fallback");
          apiWorking = false;
          newExplanations[i] = generateFallbackExplanation(step, language);
        }
        
        // Update explanations progressively so user sees them appear
        setExplanations({...newExplanations});
      }

      setExplanations(newExplanations);
    } catch (error) {
      console.error("Error generating explanations:", error);
      // Generate all fallbacks if total failure
      for (let i = 0; i < steps.length; i++) {
        newExplanations[i] = generateFallbackExplanation(steps[i], language);
      }
      setExplanations(newExplanations);
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
    setCurrentProblem(null); // Clear LeetCode problem
  };

  const handleLoadLeetCodeProblem = (problemCode, problem) => {
    setCode(problemCode);
    setCodeHistory([...codeHistory, problemCode]);
    setHistoryIndex(codeHistory.length);
    setExecutionSteps([]);
    setCurrentStep(0);
    setExplanations({});
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    setBreakpoints(new Set());
    setWatchList([]);
    setCurrentProblem(problem);
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
      
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        executionSteps={executionSteps}
        code={code}
        isDarkMode={isDarkMode}
      />
      
      {/* Header - Compact Single Line */}
      <header className={`${headerClass} shadow-xl`}>
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo & Title */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                <MemoryMapLogo className="w-7 h-7" />
              </div>
              <span className="text-xl font-bold text-white hidden md:block">MemoryMap</span>
            </Link>
            
            {/* Current Problem Badge */}
            {currentProblem && (
              <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1 flex-shrink-0">
                <Trophy className="w-3 h-3" />
                #{currentProblem.id}
              </span>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-white/30 hidden md:block" />
            
            {/* Language Tabs */}
            <Tabs value={language} onValueChange={handleLanguageChange} className="flex-shrink-0">
              <TabsList className="bg-white/20 h-8">
                <TabsTrigger value="cpp" className="text-xs px-3 h-6 data-[state=active]:bg-white data-[state=active]:text-purple-700 text-white">C++</TabsTrigger>
                <TabsTrigger value="c" className="text-xs px-3 h-6 data-[state=active]:bg-white data-[state=active]:text-blue-700 text-white">C</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Examples Dropdown */}
            <Select onValueChange={handleLoadExample}>
              <SelectTrigger className="w-36 h-8 bg-white/90 border-none text-xs">
                <SelectValue placeholder="Examples" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(language === 'cpp' ? CPP_EXAMPLES : C_EXAMPLES).map(([key, example]) => (
                  <SelectItem key={key} value={key} className="text-sm">
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Mem AI - Standalone Premium Feature */}
            <Button
              onClick={() => { setFeaturedTab('memai'); setLearningSidebarOpen(true); }}
              size="sm"
              className={`h-8 px-3 gap-1.5 font-semibold text-xs shadow-lg transition-all ${
                featuredTab === 'memai' && learningSidebarOpen 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-300' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              🧠 Mem AI
              {isGeneratingExplanations && <span className="ml-1 animate-pulse">•••</span>}
            </Button>

            {/* Other Tools - Compact */}
            <div className="flex items-center bg-white/20 rounded-lg p-0.5 backdrop-blur-sm">
              <Button
                onClick={() => { setFeaturedTab('leetcode'); setLearningSidebarOpen(true); }}
                size="sm"
                variant="ghost"
                className={`h-7 px-2 text-xs rounded ${featuredTab === 'leetcode' && learningSidebarOpen ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-white/20'}`}
              >
                🏆 LC
              </Button>
              <Button
                onClick={() => { setFeaturedTab('learn'); setLearningSidebarOpen(true); }}
                size="sm"
                variant="ghost"
                className={`h-7 px-2 text-xs rounded ${featuredTab === 'learn' && learningSidebarOpen ? 'bg-blue-500 text-white' : 'text-white hover:bg-white/20'}`}
              >
                📚
              </Button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/30" />

            {/* Execution Controls */}
            <div className="flex items-center gap-1">
              <Button onClick={handleRun} size="sm" className="h-8 px-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold text-xs" disabled={isRunning || !code.trim()}>
                <Zap className="w-4 h-4 mr-1" /> Parse
              </Button>
              
              {!isRunning ? (
                <Button onClick={handleAutoRun} size="sm" className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white text-xs" disabled={executionSteps.length === 0}>
                  <Play className="w-4 h-4 mr-1" /> Run
                </Button>
              ) : (
                <Button onClick={handlePause} size="sm" className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs">
                  <Pause className="w-4 h-4 mr-1" /> Pause
                </Button>
              )}
              
              <Button onClick={handleStep} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" disabled={isRunning || currentStep >= executionSteps.length - 1} title="Step">
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button onClick={handleReset} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" disabled={executionSteps.length === 0} title="Reset">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/30" />

            {/* Utility Buttons */}
            <div className="flex items-center gap-1">
              <Button onClick={handleUndo} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" disabled={historyIndex <= 0} title="Undo">
                <Undo className="w-4 h-4" />
              </Button>
              <Button onClick={handleRedo} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" disabled={historyIndex >= codeHistory.length - 1} title="Redo">
                <Redo className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowExportModal(true)} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" disabled={executionSteps.length === 0} title="Export">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowHelp(true)} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" title="Help">
                <BookOpen className="w-4 h-4" />
              </Button>
              <Button onClick={() => setIsDarkMode(!isDarkMode)} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90" title="Toggle Dark Mode">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Speed Control Bar - Only when running */}
      {executionSteps.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-2`}>
          <div className="max-w-[1920px] mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Step {currentStep + 1}/{executionSteps.length}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Speed:</span>
                <Slider value={[runSpeed]} onValueChange={(v) => setRunSpeed(v[0])} min={300} max={3000} step={300} className="w-24" />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{runSpeed}ms</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-500" /> Stack: {stackSize}</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-orange-500" /> Heap: {heapSize}</span>
              {deletedHeap > 0 && <span className="text-gray-400">{deletedHeap} freed</span>}
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

      {/* ⭐ FEATURED LEARNING HUB - Collapsible Top Banner */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-purple-500' 
              : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border-purple-400'
          }`}
        >
          {/* Compact Header - Always Visible */}
          <button
            onClick={() => setLearningSidebarOpen(!learningSidebarOpen)}
            className={`w-full p-2 sm:p-3 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500' 
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400'
            } text-white hover:brightness-110 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <motion.div 
                  animate={{ rotate: learningSidebarOpen ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 2, repeat: learningSidebarOpen ? Infinity : 0 }}
                  className="text-lg sm:text-xl"
                >
                  ✨
                </motion.div>
                <div className="text-left">
                  <h3 className="font-bold text-xs sm:text-sm md:text-base">Learning Hub</h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-white/80 hidden xs:block">
                    Mem AI • LeetCode • Resources
                  </p>
                </div>
                
                {/* Quick Tab Buttons - Hidden on mobile, shown on tablet+ */}
                <div className="hidden lg:flex items-center gap-2 ml-4">
                  {[
                    { id: 'memai', icon: '🧠', label: 'Mem AI' },
                    { id: 'leetcode', icon: '🏆', label: 'LeetCode' },
                    { id: 'learn', icon: '📚', label: 'Learn' },
                  ].map((tab) => (
                    <span
                      key={tab.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedTab(tab.id);
                        setLearningSidebarOpen(true);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        featuredTab === tab.id && learningSidebarOpen
                          ? 'bg-white text-purple-700 shadow-lg'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {currentProblem && (
                  <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-[10px] sm:text-xs font-bold">
                    <Trophy className="w-3 h-3" />
                    #{currentProblem.id}
                  </span>
                )}
                <span className="hidden sm:inline px-2 py-1 bg-white/20 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
                  🔥 Featured
                </span>
                <motion.div
                  animate={{ rotate: learningSidebarOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </div>
            </div>
          </button>

          {/* Expandable Content */}
          <AnimatePresence>
            {learningSidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Tabs */}
                <Tabs value={featuredTab} onValueChange={setFeaturedTab} className="w-full">
                  <TabsList className={`w-full grid grid-cols-3 h-10 sm:h-12 rounded-none ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <TabsTrigger 
                      value="memai" 
                      className={`gap-1 sm:gap-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">🧠 Mem AI</span>
                      <span className="sm:hidden text-[11px]">🧠 AI</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="leetcode" 
                      className={`gap-1 sm:gap-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">🏆 LeetCode</span>
                      <span className="sm:hidden text-[11px]">🏆 LC</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="learn" 
                      className={`gap-1 sm:gap-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">📚 Learn</span>
                      <span className="sm:hidden text-[11px]">📚</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents - Full Width Panel */}
                  <div className={`p-3 sm:p-4 ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'} max-h-[60vh] sm:max-h-[450px] overflow-y-auto`}>
                    <TabsContent value="memai" className="m-0">
                      <div className="max-w-3xl mx-auto">
                        <ExplanationPanel
                          explanation={currentExplanation}
                          isLoading={isGeneratingExplanations}
                          stepNumber={currentStep + 1}
                          totalSteps={executionSteps.length}
                          isDarkMode={isDarkMode}
                          embedded={true}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="leetcode" className="m-0">
                      {/* LeetCode takes FULL WIDTH */}
                      <LeetCodePanel
                        onLoadProblem={handleLoadLeetCodeProblem}
                        currentProblem={currentProblem}
                        isDarkMode={isDarkMode}
                        isOpen={true}
                        onToggle={() => {}}
                      />
                    </TabsContent>

                    <TabsContent value="learn" className="m-0">
                      <LearningSidebar
                        code={code}
                        currentProblem={currentProblem}
                        isDarkMode={isDarkMode}
                        isOpen={true}
                        onToggle={() => {}}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Content - Code Editor & Visualization Side by Side */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Code Editor */}
          <div className="space-y-3 sm:space-y-4">
            <Card className={`p-3 sm:p-5 ${cardClass} shadow-2xl border-2`}>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className={`text-base sm:text-lg font-bold ${textClass} flex items-center gap-2`}>
                  <div className={`w-2 h-2 ${language === 'cpp' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
                  <span className="hidden sm:inline">{language === 'cpp' ? 'C++' : 'C'} Code Editor</span>
                  <span className="sm:hidden">{language === 'cpp' ? 'C++' : 'C'}</span>
                </h2>
                <span className="text-[10px] sm:text-xs font-semibold text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
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

            {/* Debugging Panels - Responsive */}
            {executionSteps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
            <Card className={`p-4 sm:p-6 lg:p-8 ${cardClass} shadow-2xl border-2 min-h-[400px] sm:min-h-[500px] lg:min-h-[700px]`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <h2 className={`text-base sm:text-lg lg:text-xl font-bold ${textClass}`}>Memory Visualization</h2>
                <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded shadow-sm"></div>
                    <span className={secondaryTextClass}>Stack</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded shadow-sm"></div>
                    <span className={secondaryTextClass}>Heap</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-green-500 rounded shadow-sm"></div>
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

      {/* 🎮 FLOATING CONTROL BAR - Appears when scrolled down */}
      <AnimatePresence>
        {showFloatingBar && executionSteps.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 ${
              isDarkMode 
                ? 'bg-gray-900/95 border-purple-500/50' 
                : 'bg-white/95 border-purple-300'
            } backdrop-blur-xl rounded-2xl shadow-2xl border-2 px-3 sm:px-4 py-2 sm:py-3`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Step Counter */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Step {currentStep + 1}/{executionSteps.length}
                </span>
              </div>

              {/* Mobile Step Counter */}
              <span className={`sm:hidden text-xs font-bold px-2 py-1 rounded ${
                isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {currentStep + 1}/{executionSteps.length}
              </span>

              {/* Divider */}
              <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

              {/* Control Buttons */}
              {!isRunning ? (
                <Button 
                  onClick={handleAutoRun} 
                  size="sm" 
                  className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white text-xs gap-1"
                  disabled={currentStep >= executionSteps.length - 1}
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Run</span>
                </Button>
              ) : (
                <Button 
                  onClick={handlePause} 
                  size="sm" 
                  className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs gap-1"
                >
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </Button>
              )}

              <Button 
                onClick={handleStep} 
                size="sm" 
                className={`h-8 px-3 text-xs gap-1 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isRunning || currentStep >= executionSteps.length - 1}
              >
                <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Step</span>
              </Button>

              <Button 
                onClick={handleReset} 
                size="sm" 
                variant="outline"
                className={`h-8 w-8 p-0 ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                title="Reset"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>

              {/* Divider */}
              <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

              {/* Speed Control */}
              <div className="hidden md:flex items-center gap-2">
                <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Speed</span>
                <Slider 
                  value={[runSpeed]} 
                  onValueChange={(v) => setRunSpeed(v[0])} 
                  min={300} 
                  max={3000} 
                  step={300} 
                  className="w-16" 
                />
              </div>

              {/* Mem AI Button */}
              <Button
                onClick={() => {
                  setFeaturedTab('memai');
                  setLearningSidebarOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                size="sm"
                className={`h-8 px-2 sm:px-3 text-xs gap-1 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                } text-white`}
              >
                🧠
                <span className="hidden sm:inline">Mem AI</span>
              </Button>

              {/* Scroll to Top */}
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                title="Scroll to top"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}