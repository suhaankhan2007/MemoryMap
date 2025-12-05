import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Code2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const LEETCODE_PROBLEMS = [
  {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    pattern: "Two Pointers",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    code: `struct ListNode {
  int val;
  ListNode* next;
};

// Setup list: 1 -> 2 -> 3 -> null
ListNode* head = new ListNode;
head->val = 1;
ListNode* node2 = new ListNode;
node2->val = 2;
head->next = node2;
ListNode* node3 = new ListNode;
node3->val = 3;
node2->next = node3;
node3->next = nullptr;

// Reverse Logic
ListNode* prev = nullptr;
ListNode* curr = head;
while (curr != nullptr) {
  ListNode* nextTemp = curr->next;
  curr->next = prev;
  prev = curr;
  curr = nextTemp;
}
head = prev;`
  },
  {
    id: 141,
    title: "Linked List Cycle",
    difficulty: "Easy",
    pattern: "Fast & Slow Pointers",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    code: `struct ListNode {
  int val;
  ListNode* next;
};

// Setup cycle: 1 -> 2 -> 3 -> 2...
ListNode* head = new ListNode;
head->val = 1;
ListNode* node2 = new ListNode;
node2->val = 2;
head->next = node2;
ListNode* node3 = new ListNode;
node3->val = 3;
node2->next = node3;
node3->next = node2; // Cycle

// Detection Logic
ListNode* slow = head;
ListNode* fast = head;
bool hasCycle = false;

while (fast != nullptr && fast->next != nullptr) {
  slow = slow->next;
  fast = fast->next->next;
  if (slow == fast) {
    hasCycle = true;
    break;
  }
}`
  },
  {
    id: 226,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    pattern: "DFS (Recursion)",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

// Setup Tree
TreeNode* root = new TreeNode;
root->val = 4;
TreeNode* l = new TreeNode;
l->val = 2;
root->left = l;
TreeNode* r = new TreeNode;
r->val = 7;
root->right = r;

// Invert Logic (Iterative for visualization)
std::vector<TreeNode*> stack;
stack.push_back(root);

while (stack.size() > 0) {
  TreeNode* node = stack[stack.size()-1];
  stack.pop_back(); // simplified pop
  
  if (node != nullptr) {
    TreeNode* temp = node->left;
    node->left = node->right;
    node->right = temp;
    
    if (node->left) stack.push_back(node->left);
    if (node->right) stack.push_back(node->right);
  }
}`
  }
];

export default function LeetCodePanel({ onLoadProblem, currentProblem, isDarkMode, isOpen, onToggle }) {
  // When embedded in the Featured Tools panel, show content directly
  const isEmbedded = isOpen && !onToggle;
  
  if (!isOpen) return null;

  // Embedded version for Featured Tools panel
  if (isEmbedded) {
    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Current Problem Badge */}
        {currentProblem && (
          <div className={`flex items-center gap-3 p-3 rounded-xl ${
            isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                Currently Practicing: #{currentProblem.id}
              </span>
              <p className={`text-xs ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-600'}`}>
                {currentProblem.title}
              </p>
            </div>
          </div>
        )}

        {/* Problems Grid */}
        <div className="grid gap-3">
          {LEETCODE_PROBLEMS.map((problem) => (
            <motion.div
              key={problem.id}
              onClick={() => onLoadProblem(problem.code, problem)}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                currentProblem?.id === problem.id
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 hover:border-yellow-400/50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                    isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    #{problem.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                {currentProblem?.id === problem.id && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {problem.title}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  {problem.pattern}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Code2 className="w-3 h-3" />
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* LeetCode Link */}
        <a 
          href="https://leetcode.com/problemset/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'bg-orange-900/30 hover:bg-orange-900/50 text-orange-300 border border-orange-700' 
              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
          }`}
        >
          🔥 Practice more on LeetCode.com
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  // Original collapsible version
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`mb-6 rounded-xl border-2 overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <h3 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            LeetCode Problems
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-64 p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {LEETCODE_PROBLEMS.map((problem) => (
            <div
              key={problem.id}
              onClick={() => onLoadProblem(problem.code, problem)}
              className={`p-4 rounded-lg cursor-pointer border-2 transition-all hover:scale-[1.02] ${
                currentProblem?.id === problem.id
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:border-yellow-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                  #{problem.id}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {problem.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {problem.pattern}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <Code2 className="w-3 h-3" />
                <span>C++ Solution</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
