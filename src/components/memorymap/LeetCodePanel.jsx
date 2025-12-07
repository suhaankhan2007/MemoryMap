import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Code2, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
ListNode* curr = head;`
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

// Setup: 1 -> 2 -> 3 -> back to 2
ListNode* head = new ListNode;
head->val = 1;
ListNode* node2 = new ListNode;
node2->val = 2;
head->next = node2;
ListNode* node3 = new ListNode;
node3->val = 3;
node2->next = node3;
node3->next = node2;

ListNode* slow = head;
ListNode* fast = head;`
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    pattern: "Two Pointers",
    timeComplexity: "O(n+m)",
    spaceComplexity: "O(1)",
    code: `struct ListNode {
  int val;
  ListNode* next;
};

// List 1: 1 -> 3 -> 5
ListNode* l1 = new ListNode;
l1->val = 1;
ListNode* l1b = new ListNode;
l1b->val = 3;
l1->next = l1b;
ListNode* l1c = new ListNode;
l1c->val = 5;
l1b->next = l1c;
l1c->next = nullptr;

// List 2: 2 -> 4 -> 6
ListNode* l2 = new ListNode;
l2->val = 2;
ListNode* l2b = new ListNode;
l2b->val = 4;
l2->next = l2b;
l2b->next = nullptr;

// Merge setup
ListNode* dummy = new ListNode;
dummy->val = 0;
ListNode* curr = dummy;`
  },
  {
    id: 226,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    pattern: "DFS / BFS",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

// Build tree: 4 with children 2,7
TreeNode* root = new TreeNode;
root->val = 4;
TreeNode* left = new TreeNode;
left->val = 2;
root->left = left;
TreeNode* right = new TreeNode;
right->val = 7;
root->right = right;
left->left = nullptr;
left->right = nullptr;
right->left = nullptr;
right->right = nullptr;

// Swap children
TreeNode* temp = root->left;
root->left = root->right;
root->right = temp;`
  },
  {
    id: 104,
    title: "Max Depth of Binary Tree",
    difficulty: "Easy",
    pattern: "DFS Recursion",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

// Build tree depth 3
TreeNode* root = new TreeNode;
root->val = 3;
TreeNode* l = new TreeNode;
l->val = 9;
root->left = l;
TreeNode* r = new TreeNode;
r->val = 20;
root->right = r;
l->left = nullptr;
l->right = nullptr;

TreeNode* rl = new TreeNode;
rl->val = 15;
r->left = rl;
TreeNode* rr = new TreeNode;
rr->val = 7;
r->right = rr;
rl->left = nullptr;
rl->right = nullptr;
rr->left = nullptr;
rr->right = nullptr;`
  },
  {
    id: 19,
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    pattern: "Two Pointers",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    code: `struct ListNode {
  int val;
  ListNode* next;
};

// List: 1 -> 2 -> 3 -> 4 -> 5
ListNode* head = new ListNode;
head->val = 1;
ListNode* n2 = new ListNode;
n2->val = 2;
head->next = n2;
ListNode* n3 = new ListNode;
n3->val = 3;
n2->next = n3;
ListNode* n4 = new ListNode;
n4->val = 4;
n3->next = n4;
ListNode* n5 = new ListNode;
n5->val = 5;
n4->next = n5;
n5->next = nullptr;

// Two pointer setup
ListNode* fast = head;
ListNode* slow = head;
int n = 2;`
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    pattern: "Linked List Math",
    timeComplexity: "O(max(m,n))",
    spaceComplexity: "O(max(m,n))",
    code: `struct ListNode {
  int val;
  ListNode* next;
};

// Number 342: 2 -> 4 -> 3
ListNode* l1 = new ListNode;
l1->val = 2;
ListNode* l1b = new ListNode;
l1b->val = 4;
l1->next = l1b;
ListNode* l1c = new ListNode;
l1c->val = 3;
l1b->next = l1c;
l1c->next = nullptr;

// Number 465: 5 -> 6 -> 4
ListNode* l2 = new ListNode;
l2->val = 5;
ListNode* l2b = new ListNode;
l2b->val = 6;
l2->next = l2b;
ListNode* l2c = new ListNode;
l2c->val = 4;
l2b->next = l2c;
l2c->next = nullptr;

int carry = 0;
ListNode* result = new ListNode;
result->val = 0;`
  },
  {
    id: 98,
    title: "Validate BST",
    difficulty: "Medium",
    pattern: "DFS + Range",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

// Valid BST: 2 with 1,3
TreeNode* root = new TreeNode;
root->val = 2;
TreeNode* left = new TreeNode;
left->val = 1;
root->left = left;
TreeNode* right = new TreeNode;
right->val = 3;
root->right = right;
left->left = nullptr;
left->right = nullptr;
right->left = nullptr;
right->right = nullptr;

// Check: left < root < right
bool isValid = true;
isValid = left->val < root->val;
isValid = root->val < right->val;`
  }
];

export default function LeetCodePanel({ onLoadProblem, currentProblem, isDarkMode, isOpen, onToggle }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // When embedded in the Featured Tools panel, show content directly
  const isEmbedded = isOpen && !onToggle;
  
  if (!isOpen) return null;

  // Problem card component (reusable)
  const ProblemCard = ({ problem, compact = false }) => (
    <motion.div
      key={problem.id}
      onClick={() => {
        onLoadProblem(problem.code, problem);
        if (isFullscreen) setIsFullscreen(false);
      }}
      whileHover={{ scale: 1.02, x: compact ? 4 : 0 }}
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
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{problem.timeComplexity}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );

  // Fullscreen Dialog
  const FullscreenDialog = () => (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className={`max-w-4xl h-[80vh] ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              LeetCode Problems ({LEETCODE_PROBLEMS.length})
            </h2>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(80vh-120px)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {LEETCODE_PROBLEMS.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </ScrollArea>
        
        <a 
          href="https://leetcode.com/problemset/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors mt-4 ${
            isDarkMode 
              ? 'bg-orange-900/30 hover:bg-orange-900/50 text-orange-300 border border-orange-700' 
              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
          }`}
        >
          🔥 Practice more on LeetCode.com
          <ArrowRight className="w-4 h-4" />
        </a>
      </DialogContent>
    </Dialog>
  );

  // Embedded version for Featured Tools panel - FULL WIDTH
  if (isEmbedded) {
    return (
      <>
        <FullscreenDialog />
        <div className="space-y-3 w-full">
          {/* Header with fullscreen button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                LeetCode Problems
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                {LEETCODE_PROBLEMS.length} available
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFullscreen(true)}
              className={`h-7 px-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              <span className="text-xs hidden sm:inline">Expand</span>
            </Button>
          </div>

          {/* Current Problem Badge */}
          {currentProblem && (
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Practicing: #{currentProblem.id} - {currentProblem.title}
                </span>
                <p className={`text-xs ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-600'}`}>
                  {currentProblem.pattern} • {currentProblem.timeComplexity}
                </p>
              </div>
            </div>
          )}

          {/* Problems Grid - FULL WIDTH responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {LEETCODE_PROBLEMS.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} compact />
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
      </>
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
