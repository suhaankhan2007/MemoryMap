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

  // Track scroll position to show/hide floating bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingBar(scrollY > 300);
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
      if (!code || !code.trim()) {
        setError("Please enter some code to parse.");
        return;
      }
      
      console.log(`Parsing ${language} code:`, code);
      
      let steps = [];
      try {
        steps = language === 'cpp' ? parseAndSimulateCpp(code) : parseAndSimulateC(code);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        setError(`Error parsing code: ${parseError.message || 'Invalid syntax'}`);
        return;
      }
      
      console.log("Generated steps:", steps);
      
      if (!steps || steps.length === 0) {
        setError(`No executable code found. Please check your ${language === 'cpp' ? 'C++' : 'C'} syntax.`);
        return;
      }
      
      // Validate and normalize steps structure to prevent crashes
      const validSteps = steps
        .filter(step => step && typeof step === 'object')
        .map(step => ({
          ...step,
          memoryState: {
            stack: Array.isArray(step.memoryState?.stack) ? step.memoryState.stack : [],
            heap: Array.isArray(step.memoryState?.heap) ? step.memoryState.heap : [],
            pointers: Array.isArray(step.memoryState?.pointers) ? step.memoryState.pointers : [],
            linkedListConnections: Array.isArray(step.memoryState?.linkedListConnections) ? step.memoryState.linkedListConnections : [],
            treeConnections: Array.isArray(step.memoryState?.treeConnections) ? step.memoryState.treeConnections : [],
            danglingPointers: Array.isArray(step.memoryState?.danglingPointers) ? step.memoryState.danglingPointers : [],
            callStack: Array.isArray(step.memoryState?.callStack) ? step.memoryState.callStack : [],
          },
          lineNumber: typeof step.lineNumber === 'number' ? step.lineNumber : 0,
          line: typeof step.line === 'string' ? step.line : '',
        }));
      
      if (validSteps.length === 0) {
        setError("Generated steps are invalid. Please check your code syntax.");
        return;
      }
      
      setExecutionSteps(validSteps);
      setCurrentStep(0);
      
      // Auto-open Mem AI panel to show explanations
      setFeaturedTab('memai');
      setLearningSidebarOpen(true);
      
      // Detect memory leaks and dangling pointers (with error handling)
      try {
        detectMemoryIssues(steps);
      } catch (detectError) {
        console.error("Error detecting memory issues:", detectError);
        // Continue execution even if detection fails
      }
      
      // Generate AI explanations (with error handling)
      try {
        await generateExplanations(steps);
      } catch (explanationError) {
        console.error("Error generating explanations:", explanationError);
        // Continue execution even if explanations fail
      }
    } catch (error) {
      console.error("Error parsing code:", error);
      setError("Error parsing code: " + (error.message || 'Unknown error occurred'));
    }
  };

  const detectMemoryIssues = (steps) => {
    try {
      if (!steps || steps.length === 0) {
        return;
      }
      
      const lastStep = steps[steps.length - 1];
      if (!lastStep || !lastStep.memoryState) {
        return;
      }
      
      const memoryState = lastStep.memoryState;
      
      // Memory leaks: heap blocks never freed - get their addresses
      if (memoryState.heap && Array.isArray(memoryState.heap)) {
        const leakedMemory = memoryState.heap
          .filter(block => block && !block.isDeleted)
          .map(block => block.address)
          .filter(addr => addr !== undefined);
        if (leakedMemory.length > 0) {
          setMemoryLeaks(leakedMemory);
        }
      }
      
      const danglingPtrs = Array.isArray(memoryState.danglingPointers) ? memoryState.danglingPointers : [];
      if (danglingPtrs.length > 0) {
        setDanglingPointers(danglingPtrs);
      }
    } catch (error) {
      console.error("Error detecting memory issues:", error);
      // Don't crash the app, just log the error
    }
  };

  // Generate smart fallback explanations when API isn't available
  const generateFallbackExplanation = (step, lang) => {
    if (!step || !step.line) {
      return `📝 **Executing Code**: Watch the memory visualization to see changes!`;
    }
    
    const line = step.line.trim();
    const langName = lang === 'cpp' ? 'C++' : 'C';
    const memState = step.memoryState || {};
    const stackCount = memState.stack?.length || 0;
    const heapCount = memState.heap?.length || 0;
    
    // === DATA STRUCTURE PATTERNS (LeetCode focus) ===
    
    // Linked List patterns
    if (line.includes('new ') && (line.includes('ListNode') || line.includes('Node'))) {
      return `🔗 **Creating Linked List Node**: Allocating a new ListNode on the heap. This node contains a value and a \`next\` pointer.\n\n💡 **LeetCode Tip:** Most linked list problems (Reverse List, Merge Lists, Cycle Detection) start by creating or traversing nodes like this.\n\n📊 Current: ${heapCount} heap allocations`;
    }
    if (line.match(/head\s*=/) || line.includes('ListNode* head')) {
      return `🔗 **Head Pointer**: Setting up the head pointer - your entry point to the linked list. Lose this and you lose the whole list!\n\n💡 **LeetCode Tip:** Many problems use a "dummy head" trick: \`ListNode dummy(0); dummy.next = head;\` to simplify edge cases.`;
    }
    if (line.includes('->next') && line.includes('=')) {
      return `🔗 **Linking Nodes**: Connecting nodes by setting the \`next\` pointer. This is how linked lists are built and modified!\n\n💡 **LeetCode Tip:** Be careful with order - always save the next node before overwriting: \`temp = curr->next; curr->next = prev;\`\n\n⚠️ Watch the arrows update in the visualization!`;
    }
    if (line.includes('->next') && !line.includes('=')) {
      return `🔗 **Traversing List**: Following the \`next\` pointer to move to the next node. This is O(1) for one hop, O(n) for full traversal.\n\n💡 **LeetCode Tip:** Two-pointer technique (slow/fast) can detect cycles and find middle elements efficiently!`;
    }
    if (line.includes('slow') && line.includes('fast')) {
      return `🐢🐇 **Two Pointer Technique**: The classic slow/fast pointer pattern! Fast moves 2x speed of slow.\n\n💡 **LeetCode Tip:** Used in: Cycle Detection (Floyd's), Finding Middle, Happy Number, and more!\n\n📊 When fast reaches end, slow is at middle. If they meet, there's a cycle!`;
    }
    
    // Binary Tree patterns
    if (line.includes('new ') && line.includes('TreeNode')) {
      return `🌳 **Creating Tree Node**: Allocating a TreeNode with a value and left/right child pointers.\n\n💡 **LeetCode Tip:** Tree problems often use recursion. Each node spawns two subproblems (left & right subtrees).\n\n📊 Current: ${heapCount} nodes in tree`;
    }
    if (line.includes('->left') && line.includes('=')) {
      return `🌳 **Setting Left Child**: Connecting the left subtree. In BSTs, left children have smaller values.\n\n💡 **LeetCode Tip:** Recursive tree construction: \`root->left = buildTree(leftPart);\``;
    }
    if (line.includes('->right') && line.includes('=')) {
      return `🌳 **Setting Right Child**: Connecting the right subtree. In BSTs, right children have larger values.\n\n💡 **LeetCode Tip:** For balanced trees, alternate left/right to maintain O(log n) height.`;
    }
    if (line.includes('->left') || line.includes('->right')) {
      return `🌳 **Tree Traversal**: Accessing a child node. This is the basis for DFS traversal.\n\n💡 **LeetCode Tip:** Three DFS orders: Preorder (root→left→right), Inorder (left→root→right), Postorder (left→right→root).\n\n📊 Inorder on BST gives sorted order!`;
    }
    if (line.includes('->val') || line.includes('->data')) {
      return `📦 **Accessing Node Value**: Reading/writing the data stored in this node.\n\n💡 **LeetCode Tip:** Tree problems often aggregate values: sum paths, find max/min, check properties.\n\n⚡ Arrow operator \`->\` = dereference + member access in one!`;
    }
    
    // Stack/Queue patterns (common in BFS)
    if (line.includes('push') || line.includes('push_back')) {
      return `📥 **Push Operation**: Adding an element to a stack/queue/vector. O(1) amortized for vectors.\n\n💡 **LeetCode Tip:** Stacks for DFS, Queues for BFS. \`push\` to add work, \`pop\` to process it!`;
    }
    if (line.includes('pop') || line.includes('pop_back')) {
      return `📤 **Pop Operation**: Removing an element. Stack = LIFO (last in, first out), Queue = FIFO.\n\n💡 **LeetCode Tip:** Always check \`empty()\` before \`pop()\` to avoid undefined behavior!`;
    }
    if (line.includes('queue') || line.includes('Queue')) {
      return `📋 **Queue Data Structure**: FIFO ordering - first in, first out. Perfect for BFS!\n\n💡 **LeetCode Tip:** Level-order traversal of trees uses a queue to process nodes level by level.`;
    }
    if (line.includes('stack') || line.includes('Stack')) {
      return `📚 **Stack Data Structure**: LIFO ordering - last in, first out. Natural for DFS and recursion!\n\n💡 **LeetCode Tip:** Iterative DFS uses explicit stack. Also great for matching parentheses, monotonic problems.`;
    }
    
    // Vector/Array patterns
    if (line.includes('vector<') || line.includes('new int[')) {
      return `📊 **Dynamic Array**: Creating a resizable array (vector) or heap array. Contiguous memory = cache-friendly!\n\n💡 **LeetCode Tip:** Vectors for dynamic sizing, arrays when size is fixed. Both give O(1) random access.`;
    }
    if (line.match(/\[.*\]\s*=/)) {
      return `📊 **Array Assignment**: Writing to a specific index. O(1) direct access via memory arithmetic!\n\n💡 **LeetCode Tip:** Two-pointer on arrays: start from both ends and move inward, or use sliding window.`;
    }
    
    // === MEMORY MANAGEMENT PATTERNS ===
    
    if (line.includes('new ') && line.includes('int')) {
      return `🔵 **Heap Allocation**: Allocating memory for an integer on the heap. You control its lifetime!\n\n💡 **Memory Insight:** Heap is slower but flexible. Stack is fast but scoped to function.\n\n⚠️ Always pair \`new\` with \`delete\`! Current heap: ${heapCount} blocks`;
    }
    if (line.includes('new ')) {
      return `🔵 **Dynamic Allocation**: Using \`new\` to allocate memory on the heap. Returns a pointer to the allocated memory.\n\n💡 **Memory Insight:** Heap memory persists until you \`delete\` it. Forgetting = memory leak!\n\n📊 Current heap usage: ${heapCount} allocations`;
    }
    if (line.includes('delete[]')) {
      return `🗑️ **Array Deallocation**: Freeing a dynamically allocated array. The \`[]\` tells the system to free all elements.\n\n⚠️ **Critical:** Using \`delete\` instead of \`delete[]\` on arrays = undefined behavior!\n\n💡 Set pointer to \`nullptr\` after deletion.`;
    }
    if (line.includes('delete ')) {
      return `🗑️ **Memory Deallocation**: Freeing heap memory with \`delete\`. The memory returns to the system.\n\n⚠️ **Watch Out:** Pointer is now "dangling" - using it = crash! Set to \`nullptr\` immediately.\n\n📊 Heap after: ${heapCount > 0 ? heapCount - 1 : 0} blocks`;
    }
    if (line.includes('nullptr') || line.includes('NULL')) {
      return `🚫 **Null Pointer**: Setting pointer to null - it points to nothing. Essential for safety!\n\n💡 **Best Practice:** Always nullify after delete. Check for null before dereferencing.\n\n⚠️ Dereferencing null = segmentation fault!`;
    }
    if (line.includes('malloc') || line.includes('calloc')) {
      return `🔵 **C-Style Allocation**: Using \`malloc\`/\`calloc\` for raw memory allocation. Returns \`void*\`.\n\n💡 **C vs C++:** Use \`new\`/\`delete\` in C++, \`malloc\`/\`free\` in C. Don't mix them!`;
    }
    if (line.includes('free(')) {
      return `🗑️ **C-Style Deallocation**: Freeing memory allocated with \`malloc\`. Same dangers as \`delete\`.\n\n⚠️ Double-free = crash! Only free what you malloc'd, only once.`;
    }
    
    // === POINTER OPERATIONS ===
    
    if (line.includes('&') && !line.includes('&&') && line.includes('=')) {
      return `📍 **Address-Of Operator**: The \`&\` gets the memory address of a variable. Now a pointer can reference it!\n\n💡 **Pointer Insight:** This creates a connection - changing via pointer changes the original!\n\n📊 Stack: ${stackCount} vars | Heap: ${heapCount} blocks`;
    }
    if (line.includes('*') && line.includes('=') && !line.includes('new') && !line.includes('/*')) {
      return `📝 **Dereferencing**: The \`*\` operator accesses the value at the pointed address. Like "follow the arrow."\n\n💡 **Key Concept:** \`*ptr = 5\` changes what ptr points TO, not ptr itself.\n\n⚡ This is how we modify heap memory!`;
    }
    if (line.match(/\*\s*\w+\s*=/) && !line.includes('new')) {
      return `📍 **Pointer Assignment**: Storing an address in a pointer variable. The pointer now "points to" that location.\n\n💡 **Mental Model:** Think of pointers as arrows in memory. This sets where the arrow points.`;
    }
    
    // === VARIABLE DECLARATIONS ===
    
    if (line.match(/(int|char|float|double|bool|long|short)\s+\w+.*\*/)) {
      return `📍 **Pointer Declaration**: Creating a pointer variable. It will store a memory address, not a direct value.\n\n💡 **Size Fact:** Pointers are 8 bytes on 64-bit systems, regardless of what they point to!`;
    }
    if (line.match(/(int|char|float|double|bool|long|short)\s+\w+\s*=/)) {
      return `📊 **Stack Variable**: Creating a local variable on the stack. Automatic lifetime - created now, destroyed when function ends.\n\n💡 **Speed:** Stack allocation is just moving a pointer - essentially free! Current stack: ${stackCount} vars`;
    }
    if (line.match(/(int|char|float|double|bool|long|short)\s+\w+\s*;/)) {
      return `📊 **Variable Declaration**: Reserving space on the stack for this variable. Value is uninitialized (garbage)!\n\n⚠️ **Best Practice:** Always initialize variables! Uninitialized reads = undefined behavior.`;
    }
    
    // === CONTROL FLOW ===
    
    if (line.includes('while') && line.includes('!=') && (line.includes('null') || line.includes('nullptr'))) {
      return `🔄 **List/Tree Traversal Loop**: Continuing while pointer isn't null - the standard traversal pattern!\n\n💡 **LeetCode Pattern:** \`while (curr != nullptr)\` then \`curr = curr->next;\` at the end.\n\n⚡ This visits every node exactly once: O(n)`;
    }
    if (line.includes('while')) {
      return `🔄 **While Loop**: Repeating code while condition is true. Common for traversing data structures.\n\n💡 **LeetCode Tip:** For linked lists: \`while(current)\`. For arrays: \`while(left < right)\`.\n\n⚠️ Ensure loop terminates - update condition inside!`;
    }
    if (line.includes('for')) {
      return `🔄 **For Loop**: Compact loop with init, condition, and update in one line.\n\n💡 **LeetCode Tip:** \`for(int i=0; i<n; i++)\` for arrays, range-based \`for(auto& x : vec)\` for containers.`;
    }
    if (line.includes('if') && (line.includes('null') || line.includes('nullptr'))) {
      return `🔀 **Null Check**: Checking if pointer is null before using it. Essential safety!\n\n💡 **LeetCode Pattern:** Base case in recursion often checks: \`if (!root) return;\`\n\n⚡ This prevents segfault crashes!`;
    }
    if (line.includes('if') || line.includes('else')) {
      return `🔀 **Conditional Branch**: Program takes different paths based on condition. Handle edge cases!\n\n💡 **LeetCode Tip:** Common conditions: empty list, single element, null pointer, boundary check.`;
    }
    if (line.includes('return')) {
      return `↩️ **Return Statement**: Exiting function and returning a value. Stack frame will be destroyed!\n\n💡 **Memory Insight:** All local variables on stack are deallocated. Returned pointers must point to heap!`;
    }
    
    // === STRUCT/CLASS ===
    
    if (line.includes('struct ') || line.includes('class ')) {
      return `🏗️ **Type Definition**: Creating a custom data type. Instances will have their own copy of all members.\n\n💡 **Memory Layout:** Members are stored contiguously. Order can affect size due to padding!`;
    }
    if (line.match(/\w+\.\w+\s*=/)) {
      return `📦 **Member Assignment**: Setting a field of a struct/object using dot notation.\n\n💡 **Dot vs Arrow:** Use \`.\` with objects, \`->\` with pointers to objects.`;
    }
    
    // === FUNCTIONS ===
    
    if (line.match(/^\s*(void|int|bool|char|float|double|auto|ListNode\*|TreeNode\*)\s+\w+\s*\(/)) {
      return `🔧 **Function Definition**: Declaring a function. Each call creates a new stack frame!\n\n💡 **Recursion Insight:** Recursive calls stack up frames. Too deep = stack overflow!`;
    }
    if (line.match(/\w+\s*\([^)]*\)\s*;/) && !line.includes('if') && !line.includes('while')) {
      return `📞 **Function Call**: Invoking a function. A new stack frame is created for its local variables.\n\n💡 **Memory Flow:** Args are copied (or referenced). Return pops the stack frame.`;
    }
    
    // Default explanation with context
    return `📝 **${langName} Execution**: \`${line.substring(0, 50)}${line.length > 50 ? '...' : ''}\`\n\nWatch the memory visualization update! Stack: ${stackCount} vars | Heap: ${heapCount} blocks\n\n💡 **Tip:** Step through slowly to see each memory change!`;
  };

  const generateExplanations = async (steps) => {
    setIsGeneratingExplanations(true);
    const newExplanations = {};

    try {
      // Generate high-quality fallback explanations immediately (no API dependency)
      // This ensures the app ALWAYS works, even offline
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step) continue;
        
        // Use our comprehensive pattern-matched explanations
        newExplanations[i] = generateFallbackExplanation(step, language);
        
        // Update progressively so user sees explanations appear instantly
        if (i % 3 === 0 || i === steps.length - 1) {
          setExplanations({...newExplanations});
        }
      }

      setExplanations(newExplanations);
      
      // Optional: Try to enhance with AI in background (non-blocking)
      // This is a nice-to-have, not required for functionality
      try {
        const shouldTryAPI = steps.length <= 10; // Only for short programs
        if (shouldTryAPI && base44?.integrations?.Core?.InvokeLLM) {
          // Fire and forget - don't block the UI
          enhanceWithAI(steps, newExplanations);
        }
      } catch (e) {
        // Silently ignore - fallbacks are already great
        console.log("AI enhancement skipped");
      }
      
    } catch (error) {
      console.error("Error generating explanations:", error);
      // Even if something fails, generate basic explanations
      for (let i = 0; i < steps.length; i++) {
        if (steps[i]) {
          newExplanations[i] = generateFallbackExplanation(steps[i], language);
        }
      }
      setExplanations(newExplanations);
    } finally {
      setIsGeneratingExplanations(false);
    }
  };
  
  // Optional AI enhancement (runs in background, non-blocking)
  const enhanceWithAI = async (steps, existingExplanations) => {
    try {
      const langName = language === 'cpp' ? 'C++' : 'C';
      
      // Only try first 3 steps to minimize API calls
      for (let i = 0; i < Math.min(3, steps.length); i++) {
        const step = steps[i];
        if (!step || !step.line) continue;
        
        const prompt = `You are Mem AI, a friendly ${langName} memory tutor. Explain this line simply:

Line: "${step.line}"
Memory: Stack has ${step.memoryState?.stack?.length || 0} vars, Heap has ${step.memoryState?.heap?.length || 0} blocks.

Give a 2-3 sentence explanation of what this line does with memory. Be concise but insightful. End with one emoji.`;

        const result = await Promise.race([
          base44.integrations.Core.InvokeLLM({ prompt }),
          new Promise((_, reject) => setTimeout(() => reject('timeout'), 3000))
        ]);
        
        if (result && typeof result === 'string' && result.length > 20) {
          existingExplanations[i] = result;
          setExplanations({...existingExplanations});
        }
      }
    } catch (e) {
      // Silently fail - fallbacks are already in place
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

  const handleLoadLeetCodeProblem = (problemData) => {
    // Handle both old format (problemCode, problem) and new format ({code, ...problem})
    const code = typeof problemData === 'string' ? problemData : problemData?.code;
    const problem = typeof problemData === 'string' ? arguments[1] : problemData;
    
    if (!code) {
      console.warn("No code provided for LeetCode problem");
      return;
    }
    
    setCode(code);
    setCodeHistory([...codeHistory, code]);
    setHistoryIndex(codeHistory.length);
    setExecutionSteps([]);
    setCurrentStep(0);
    setExplanations({});
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    setBreakpoints(new Set());
    setWatchList([]);
    setCurrentProblem(problem || null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Safely extract and normalize memoryState to prevent crashes
  const rawMemoryState = executionSteps[currentStep]?.memoryState;
  const currentMemoryState = {
    stack: Array.isArray(rawMemoryState?.stack) ? rawMemoryState.stack : [],
    heap: Array.isArray(rawMemoryState?.heap) ? rawMemoryState.heap : [],
    pointers: Array.isArray(rawMemoryState?.pointers) ? rawMemoryState.pointers : [],
    linkedListConnections: Array.isArray(rawMemoryState?.linkedListConnections) ? rawMemoryState.linkedListConnections : [],
    treeConnections: Array.isArray(rawMemoryState?.treeConnections) ? rawMemoryState.treeConnections : [],
    danglingPointers: Array.isArray(rawMemoryState?.danglingPointers) ? rawMemoryState.danglingPointers : [],
    callStack: Array.isArray(rawMemoryState?.callStack) ? rawMemoryState.callStack : [],
  };
  
  const currentLine = executionSteps[currentStep]?.lineNumber || 0;
  const currentExplanation = explanations[currentStep] || "";
  const currentDanglingPointers = currentMemoryState.danglingPointers;

  const stackSize = currentMemoryState.stack.length;
  const heapSize = currentMemoryState.heap.filter(b => b && !b.isDeleted).length;
  const deletedHeap = currentMemoryState.heap.filter(b => b && b.isDeleted).length;

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

      {/* Memory Leak Warning - Prominent at end */}
      {memoryLeaks.length > 0 && (
        <div id="memory-leak-warning" className="max-w-[1800px] mx-auto px-6 pt-6 pb-4 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`border-4 rounded-2xl p-6 shadow-2xl flex items-start gap-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-500' 
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500'
            }`}
          >
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-500/30' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                ⚠️ Memory Leak Detected!
              </h3>
              <p className={`text-base mb-3 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                You have <strong>{memoryLeaks.length}</strong> heap allocation(s) that were never freed with <code className={`px-2 py-1 rounded font-mono ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-200 text-red-900'}`}>delete</code>.
              </p>
              <div className={`p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                  Leaked Memory Addresses:
                </p>
                <code className={`px-2 py-1 rounded font-mono text-sm ${isDarkMode ? 'bg-gray-800 text-red-300' : 'bg-white text-red-900'}`}>
                  {memoryLeaks.join(', ')}
                </code>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                <strong>Fix:</strong> Always match every <code className={`px-1 py-0.5 rounded ${isDarkMode ? 'bg-red-900/50' : 'bg-red-200'}`}>new</code> with a corresponding <code className={`px-1 py-0.5 rounded ${isDarkMode ? 'bg-red-900/50' : 'bg-red-200'}`}>delete</code>. Memory leaks cause programs to consume more and more memory over time!
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ⭐ FEATURED LEARNING HUB - Collapsible Top Banner */}
      <div className="max-w-[1800px] mx-auto px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden shadow-2xl border-2 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-purple-500' 
              : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border-purple-400'
          }`}
        >
          {/* Compact Header - Always Visible */}
          <button
            onClick={() => setLearningSidebarOpen(!learningSidebarOpen)}
            className={`w-full p-3 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500' 
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400'
            } text-white hover:brightness-110 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: learningSidebarOpen ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 2, repeat: learningSidebarOpen ? Infinity : 0 }}
                  className="text-xl"
                >
                  ✨
                </motion.div>
                <div className="text-left">
                  <h3 className="font-bold text-sm md:text-base">Learning Hub</h3>
                  <p className="text-[10px] md:text-xs text-white/80 hidden sm:block">
                    Resources • LeetCode • AI Explanations
                  </p>
                </div>
                
                {/* Quick Tab Buttons */}
                <div className="hidden md:flex items-center gap-2 ml-4">
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
              
              <div className="flex items-center gap-3">
                {currentProblem && (
                  <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold">
                    <Trophy className="w-3 h-3" />
                    #{currentProblem.id}
                  </span>
                )}
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                  🔥 Featured
                </span>
                <motion.div
                  animate={{ rotate: learningSidebarOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5" />
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
                  <TabsList className={`w-full grid grid-cols-3 h-12 rounded-none ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <TabsTrigger 
                      value="memai" 
                      className={`gap-2 text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">🧠 Mem AI</span>
                      <span className="sm:hidden">🧠</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="leetcode" 
                      className={`gap-2 text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <Trophy className="w-4 h-4" />
                      <span className="hidden sm:inline">🏆 LeetCode</span>
                      <span className="sm:hidden">🏆</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="learn" 
                      className={`gap-2 text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="hidden sm:inline">📚 Learn</span>
                      <span className="sm:hidden">📚</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents - Larger Panel with Better Layout */}
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'} max-h-[450px] overflow-y-auto`}>
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
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <LeetCodePanel
                            onLoadProblem={handleLoadLeetCodeProblem}
                            currentProblem={currentProblem}
                            isDarkMode={isDarkMode}
                            isOpen={true}
                            onToggle={() => {}}
                          />
                        </div>
                        {currentProblem && (
                          <div>
                            <ComplexityBadge
                              timeComplexity={currentProblem.timeComplexity}
                              spaceComplexity={currentProblem.spaceComplexity}
                              pattern={currentProblem.pattern}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="learn" className="m-0">
                      <div className="max-w-4xl mx-auto">
                        <LearningSidebar
                          code={code}
                          currentProblem={currentProblem}
                          isDarkMode={isDarkMode}
                          isOpen={true}
                          onToggle={() => {}}
                        />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Content - Code Editor & Visualization Side by Side */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Code Editor */}
          <div className="space-y-4">
            <Card className={`p-5 ${cardClass} shadow-2xl border-2`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textClass} flex items-center gap-2`}>
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

            {/* Debugging Panels - Compact */}
            {executionSteps.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
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

      {/* Floating Control Bar - appears when scrolling */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-gray-900/95 border-gray-700' 
                : 'bg-white/95 border-purple-200'
            }`}>
              {/* Step counter */}
              <div className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {executionSteps.length > 0 
                  ? `Step ${currentStep + 1}/${executionSteps.length}`
                  : 'Ready'
                }
              </div>
              
              {/* Memory leak indicator - clickable */}
              {memoryLeaks.length > 0 && executionSteps.length > 0 && currentStep === executionSteps.length - 1 && (
                <button
                  onClick={() => {
                    const warningElement = document.getElementById('memory-leak-warning');
                    if (warningElement) {
                      warningElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-900/70 hover:border-red-600' 
                      : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:border-red-400'
                  }`}
                  title="Click to view memory leak details"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold">{memoryLeaks.length} Leak{memoryLeaks.length > 1 ? 's' : ''}</span>
                </button>
              )}

              {/* Control buttons */}
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleRun}
                  disabled={isRunning || !code.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-semibold"
                >
                  <Zap className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">Parse</span>
                </Button>
                
                <Button
                  onClick={handleAutoRun}
                  disabled={executionSteps.length === 0 || currentStep >= executionSteps.length - 1}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="ml-1 hidden sm:inline">{isRunning ? 'Pause' : 'Run'}</span>
                </Button>
                
                <Button
                  onClick={handleStep}
                  disabled={executionSteps.length === 0 || currentStep >= executionSteps.length - 1}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <SkipForward className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">Step</span>
                </Button>
                
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Speed slider */}
              <div className="hidden md:flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Speed</span>
                <Slider
                  value={[runSpeed]}
                  onValueChange={(value) => setRunSpeed(value[0])}
                  min={300}
                  max={3000}
                  step={300}
                  className="w-20"
                />
              </div>

              {/* Mem AI quick button */}
              <Button
                onClick={() => {
                  setFeaturedTab('memai');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                🧠 Mem AI
              </Button>

              {/* Scroll to top */}
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="sm"
                variant="ghost"
                className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              >
                ↑
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}