import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, SkipForward, RotateCcw, Lightbulb, Code2, Zap, Pause, BookOpen, AlertTriangle, TrendingUp, Moon, Sun, Undo, Redo } from "lucide-react";
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
import { parseAndSimulateCpp } from "../components/memorymap/cppSimulator";
import HelpModal from "../components/memorymap/HelpModal";

const CODE_EXAMPLES = {
  basic: `int x = 10;
int y = 20;
int* ptr = &x;
*ptr = 15;`,
  
  heap: `int* ptr = new int(30);
*ptr = 40;
int x = 50;
delete ptr;`,
  
  multiple_pointers: `int x = 5;
int* p1 = &x;
int* p2 = p1;
*p2 = 10;
int* heap = new int(20);
p1 = heap;`,
  
  complex: `int a = 10;
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
delete heap2;`,

  mixed_types: `int x = 42;
float pi = 3.14;
double e = 2.718;
char c = 'A';
bool flag = true;
double* dptr = &e;
*dptr = 2.5;
float* fheap = new float(9.99);
delete fheap;`,

  strings: `std::string name = "Alice";
std::string* ptr = &name;
std::string* heap = new std::string("Hello");
int age = 25;
delete heap;`,
};

export default function MemoryMapPage() {
  const [code, setCode] = useState(CODE_EXAMPLES.basic);
  const [codeHistory, setCodeHistory] = useState([CODE_EXAMPLES.basic]);
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
  const intervalRef = React.useRef(null);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('memorymap-dark-mode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('memorymap-dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Handle code change with history
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const newHistory = codeHistory.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setCodeHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(codeHistory[historyIndex - 1]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  // Keyboard shortcuts
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

  // Parse code and generate execution steps
  const handleRun = async () => {
    setError(null);
    setMemoryLeaks([]);
    setDanglingPointers([]);
    try {
      console.log("Parsing code:", code);
      const steps = parseAndSimulateCpp(code);
      console.log("Generated steps:", steps);
      
      if (steps.length === 0) {
        setError("No executable code found. Please check your C++ syntax.");
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

  // Detect memory leaks and dangling pointers
  const detectMemoryIssues = (steps) => {
    const lastStep = steps[steps.length - 1];
    if (lastStep) {
      // Memory leaks: heap blocks never freed
      const leakedMemory = lastStep.memoryState.heap.filter(block => !block.isDeleted);
      if (leakedMemory.length > 0) {
        setMemoryLeaks(leakedMemory);
      }
      
      // Dangling pointers
      const danglingPtrs = lastStep.memoryState.danglingPointers || [];
      if (danglingPtrs.length > 0) {
        setDanglingPointers(danglingPtrs);
      }
    }
  };

  // Generate AI explanations for each step
  const generateExplanations = async (steps) => {
    setIsGeneratingExplanations(true);
    const newExplanations = {};

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const prompt = `You are teaching a beginner C++ student about memory management. 
Explain what happens in this line of C++ code in simple, friendly language (2-3 sentences max):

Line: "${step.line}"

Current memory state before this line:
- Stack variables: ${JSON.stringify(step.memoryState.stack)}
- Heap allocations: ${JSON.stringify(step.memoryState.heap)}

Focus on:
1. What memory operation is happening (allocation, assignment, pointer manipulation, etc.)
2. Where in memory it affects (stack or heap)
3. What the student should understand about this operation

Keep it conversational and encouraging. Use phrases like "Here we...", "Notice how...", "This creates...".`;

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

  // Step to next line
  const handleStep = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Auto-run through all steps
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
      setCurrentStep(step);
    }, runSpeed);
  };

  // Pause auto-run
  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Reset to beginning
  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Load example code
  const handleLoadExample = (exampleKey) => {
    const newCode = CODE_EXAMPLES[exampleKey];
    setCode(newCode);
    setCodeHistory([...codeHistory, newCode]);
    setHistoryIndex(codeHistory.length);
    setExecutionSteps([]);
    setCurrentStep(0);
    setExplanations({});
    setError(null);
  };

  // Cleanup on unmount
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

  // Calculate memory stats
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
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} isDarkMode={isDarkMode} />
      
      {/* Header */}
      <header className={`${headerClass} shadow-xl`}>
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Memory Map</h1>
                <p className="text-blue-100">Visualize C++ Stack, Heap & Pointers in Real-Time</p>
              </div>
            </div>
            
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
                <SelectTrigger className="w-40 bg-white/90 border-none">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Examples" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Pointers</SelectItem>
                  <SelectItem value="heap">Heap Memory</SelectItem>
                  <SelectItem value="multiple_pointers">Multiple Pointers</SelectItem>
                  <SelectItem value="complex">Complex Example</SelectItem>
                  <SelectItem value="mixed_types">Mixed Types</SelectItem>
                  <SelectItem value="strings">Strings</SelectItem>
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
            <div>
              <strong>Error:</strong> {error}
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
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  C++ Code Editor
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

        {/* Tutorial hint */}
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
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2 text-lg`}>Getting Started with Memory Map</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-blue-800'} leading-relaxed mb-3`}>
                  Enter your C++ code in the editor (up to 30 lines), then click <strong className="text-yellow-600">Parse Code</strong> to analyze it. 
                  Use <strong className="text-green-600">Auto Run</strong> to play through all steps automatically, or <strong>Step</strong> to go line by line. 
                  Watch how variables are allocated on the stack and heap, and see pointers come to life with animated arrows!
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-blue-700'} mb-3`}>
                  💡 Try the <strong>Examples</strong> dropdown to load pre-made code snippets, or adjust the <strong>Speed</strong> slider to control auto-run timing. 
                  Use <strong>Undo/Redo</strong> (Ctrl+Z/Y) to navigate code changes.
                </p>
                <Button 
                  onClick={() => setShowHelp(true)}
                  variant="outline"
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-blue-50 border-blue-300'}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Tutorial
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}