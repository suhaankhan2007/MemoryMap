/**
 * LeetCode Problems Library
 * Curated problems with visualization-friendly implementations
 */

export const LEETCODE_PROBLEMS = {
  // Easy - Linked Lists
  reverseList: {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    pattern: "Two Pointers",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Reverse a singly linked list. Watch how the pointers change direction!",
    hints: [
      "Track the previous node as you traverse",
      "Save the next node before changing pointers",
      "The previous node becomes the new head"
    ],
    code: `struct ListNode {
  int val;
  ListNode* next;
};

ListNode* head = new ListNode;
head->val = 1;
ListNode* node2 = new ListNode;
node2->val = 2;
head->next = node2;
ListNode* node3 = new ListNode;
node3->val = 3;
node2->next = node3;
node3->next = nullptr;

// Reverse the list
ListNode* prev = nullptr;
ListNode* curr = head;
ListNode* next = nullptr;

next = curr->next;
curr->next = prev;
prev = curr;
curr = next;

next = curr->next;
curr->next = prev;
prev = curr;
curr = next;

next = curr->next;
curr->next = prev;
prev = curr;
curr = next;

head = prev;`
  },

  mergeTwoLists: {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    pattern: "Two Pointers",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    description: "Merge two sorted linked lists into one sorted list.",
    hints: [
      "Use a dummy node to simplify the logic",
      "Compare nodes and link the smaller one",
      "Don't forget to attach the remaining nodes"
    ],
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
ListNode* l2c = new ListNode;
l2c->val = 6;
l2b->next = l2c;
l2c->next = nullptr;

// Merge using dummy head
ListNode* dummy = new ListNode;
dummy->val = 0;
ListNode* tail = dummy;

tail->next = l1;
tail = l1;
l1 = l1->next;

tail->next = l2;
tail = l2;
l2 = l2->next;`
  },

  // Medium - Two Pointers
  twoSum: {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    pattern: "Hash Map",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Find two numbers that add up to target. Classic interview problem!",
    hints: [
      "Use a hash map to store seen numbers",
      "For each number, check if (target - num) exists",
      "Return indices, not values"
    ],
    code: `int arr[4] = {2, 7, 11, 15};
int target = 9;
int result1 = -1;
int result2 = -1;

// Brute force approach (visualize the search)
int i = 0;
int j = 1;
int sum = arr[i] + arr[j];

// Found! arr[0] + arr[1] = 9
result1 = i;
result2 = j;`
  },

  // Binary Tree
  maxDepth: {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Binary Tree",
    pattern: "DFS",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    description: "Find the maximum depth of a binary tree using recursion.",
    hints: [
      "Base case: null node has depth 0",
      "Recursive case: 1 + max(left, right)",
      "Watch the call stack grow and shrink"
    ],
    code: `struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
};

TreeNode* root = new TreeNode;
root->val = 3;

TreeNode* left = new TreeNode;
left->val = 9;
root->left = left;
left->left = nullptr;
left->right = nullptr;

TreeNode* right = new TreeNode;
right->val = 20;
root->right = right;

TreeNode* rightLeft = new TreeNode;
rightLeft->val = 15;
right->left = rightLeft;
rightLeft->left = nullptr;
rightLeft->right = nullptr;

TreeNode* rightRight = new TreeNode;
rightRight->val = 7;
right->right = rightRight;
rightRight->left = nullptr;
rightRight->right = nullptr;`
  },

  // Sliding Window
  maxSubarray: {
    id: 53,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array",
    pattern: "Kadane's Algorithm",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Find the contiguous subarray with the largest sum.",
    hints: [
      "Keep track of current sum and max sum",
      "Reset current sum if it becomes negative",
      "Classic dynamic programming pattern"
    ],
    code: `int arr[9] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
int maxSum = arr[0];
int currentSum = arr[0];

// Kadane's algorithm visualization
currentSum = arr[1];
maxSum = 1;

currentSum = currentSum + arr[2];
currentSum = arr[3];
maxSum = 4;

currentSum = currentSum + arr[4];
currentSum = currentSum + arr[5];
currentSum = currentSum + arr[6];
maxSum = 6;`
  },

  // Fast & Slow Pointers
  hasCycle: {
    id: 141,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    pattern: "Fast & Slow Pointers",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Detect if a linked list has a cycle using Floyd's algorithm.",
    hints: [
      "Use two pointers: slow moves 1, fast moves 2",
      "If they meet, there's a cycle",
      "If fast reaches null, no cycle"
    ],
    code: `struct ListNode {
  int val;
  ListNode* next;
};

ListNode* head = new ListNode;
head->val = 3;

ListNode* node2 = new ListNode;
node2->val = 2;
head->next = node2;

ListNode* node3 = new ListNode;
node3->val = 0;
node2->next = node3;

ListNode* node4 = new ListNode;
node4->val = -4;
node3->next = node4;

// Create cycle: -4 points back to 2
node4->next = node2;

// Floyd's cycle detection
ListNode* slow = head;
ListNode* fast = head;

slow = slow->next;
fast = fast->next->next;

slow = slow->next;
fast = fast->next->next;`
  },

  // Stack
  validParentheses: {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    pattern: "Stack",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Check if parentheses are balanced using a stack.",
    hints: [
      "Push opening brackets onto stack",
      "Pop and compare for closing brackets",
      "Stack should be empty at the end"
    ],
    code: `char str[7] = {'(', '[', '{', '}', ']', ')', '\\0'};
int stackTop = -1;
char stack[6];

// Push (
stackTop = 0;
stack[stackTop] = '(';

// Push [
stackTop = 1;
stack[stackTop] = '[';

// Push {
stackTop = 2;
stack[stackTop] = '{';

// Pop for }
char top = stack[stackTop];
stackTop = 1;

// Pop for ]
top = stack[stackTop];
stackTop = 0;

// Pop for )
top = stack[stackTop];
stackTop = -1;

bool isValid = true;`
  },

  // Binary Search
  binarySearch: {
    id: 704,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Array",
    pattern: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Find target in sorted array using binary search.",
    hints: [
      "Use left and right pointers",
      "Calculate mid = left + (right - left) / 2",
      "Halve the search space each iteration"
    ],
    code: `int arr[6] = {-1, 0, 3, 5, 9, 12};
int target = 9;
int left = 0;
int right = 5;
int result = -1;

// First iteration
int mid = left + (right - left) / 2;
// mid = 2, arr[2] = 3 < target

left = mid + 1;
// left = 3

// Second iteration
mid = left + (right - left) / 2;
// mid = 4, arr[4] = 9 == target

result = mid;`
  },

  // Dynamic Programming
  climbStairs: {
    id: 70,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    pattern: "DP - Fibonacci",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Count ways to climb n stairs (1 or 2 steps at a time).",
    hints: [
      "dp[i] = dp[i-1] + dp[i-2]",
      "Same as Fibonacci sequence",
      "Can optimize space to O(1)"
    ],
    code: `int n = 5;
int prev2 = 1;
int prev1 = 1;
int current = 0;

// n = 2
current = prev1 + prev2;
prev2 = prev1;
prev1 = current;

// n = 3
current = prev1 + prev2;
prev2 = prev1;
prev1 = current;

// n = 4
current = prev1 + prev2;
prev2 = prev1;
prev1 = current;

// n = 5
current = prev1 + prev2;
int result = current;`
  }
};

export const PATTERN_DESCRIPTIONS = {
  "Two Pointers": {
    icon: "👆👆",
    description: "Use two pointers to traverse data structure efficiently",
    useCases: ["Linked list operations", "Array problems", "Palindrome checks"]
  },
  "Fast & Slow Pointers": {
    icon: "🐢🐇",
    description: "Floyd's algorithm - slow moves 1, fast moves 2",
    useCases: ["Cycle detection", "Finding middle element", "Finding intersection"]
  },
  "Sliding Window": {
    icon: "🪟",
    description: "Maintain a window of elements as you traverse",
    useCases: ["Subarray problems", "Substring problems", "Fixed-size windows"]
  },
  "Binary Search": {
    icon: "🔍",
    description: "Divide and conquer on sorted data",
    useCases: ["Search in sorted array", "Finding boundaries", "Optimization problems"]
  },
  "DFS": {
    icon: "🌲",
    description: "Depth-First Search - go deep before going wide",
    useCases: ["Tree traversal", "Graph traversal", "Backtracking"]
  },
  "BFS": {
    icon: "🌊",
    description: "Breadth-First Search - explore level by level",
    useCases: ["Shortest path", "Level-order traversal", "Graph problems"]
  },
  "Hash Map": {
    icon: "🗺️",
    description: "O(1) lookup for fast existence/value checks",
    useCases: ["Two Sum variants", "Counting", "Caching"]
  },
  "Stack": {
    icon: "📚",
    description: "LIFO - Last In, First Out",
    useCases: ["Parentheses matching", "Monotonic problems", "Undo operations"]
  },
  "DP - Fibonacci": {
    icon: "🔢",
    description: "Classic DP pattern with overlapping subproblems",
    useCases: ["Climbing stairs", "House robber", "Counting paths"]
  },
  "Kadane's Algorithm": {
    icon: "📈",
    description: "Find maximum subarray sum in O(n)",
    useCases: ["Maximum subarray", "Stock problems", "Contiguous sums"]
  }
};

export const DIFFICULTY_COLORS = {
  "Easy": "from-green-400 to-emerald-500",
  "Medium": "from-yellow-400 to-orange-500",
  "Hard": "from-red-400 to-rose-500"
};

export const CATEGORY_ICONS = {
  "Linked List": "🔗",
  "Binary Tree": "🌳",
  "Array": "📊",
  "Stack": "📚",
  "Queue": "🚶",
  "Hash Map": "🗺️",
  "Dynamic Programming": "🧩",
  "Graph": "🕸️",
  "String": "📝"
};
