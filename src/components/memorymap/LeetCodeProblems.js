/**
 * Curated LeetCode problems focused on memory management and data structures
 * Each problem includes starter code, hints, and memory concepts to learn
 */

export const LEETCODE_PROBLEMS = {
  // ============ LINKED LIST PROBLEMS ============
  reverseLinkedList: {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    pattern: "Two Pointers",
    memoryConceptsTaught: ["Pointer manipulation", "In-place modification", "Linked list traversal"],
    description: "Reverse a singly linked list. Watch how pointers change direction!",
    starterCode: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Create a simple linked list: 1 -> 2 -> 3
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);

// Reverse the list
ListNode* prev = nullptr;
ListNode* curr = head;

while (curr != nullptr) {
    ListNode* nextTemp = curr->next;
    curr->next = prev;
    prev = curr;
    curr = nextTemp;
}

// prev is now the new head`,
    hints: [
      "Use three pointers: prev, curr, and next",
      "Save the next node before changing the pointer",
      "The previous node becomes the new next"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },

  mergeTwoSortedLists: {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    pattern: "Two Pointers",
    memoryConceptsTaught: ["Dummy node pattern", "Pointer comparison", "Building new lists"],
    description: "Merge two sorted linked lists into one sorted list.",
    starterCode: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// List 1: 1 -> 3 -> 5
ListNode* l1 = new ListNode(1);
l1->next = new ListNode(3);
l1->next->next = new ListNode(5);

// List 2: 2 -> 4 -> 6
ListNode* l2 = new ListNode(2);
l2->next = new ListNode(4);
l2->next->next = new ListNode(6);

// Merge using dummy head
ListNode dummy(0);
ListNode* tail = &dummy;

while (l1 && l2) {
    if (l1->val <= l2->val) {
        tail->next = l1;
        l1 = l1->next;
    } else {
        tail->next = l2;
        l2 = l2->next;
    }
    tail = tail->next;
}

tail->next = l1 ? l1 : l2;
ListNode* merged = dummy.next;`,
    hints: [
      "Use a dummy node to simplify edge cases",
      "Compare values and attach the smaller one",
      "Don't forget the remaining nodes at the end"
    ],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)"
  },

  linkedListCycle: {
    id: 141,
    title: "Linked List Cycle",
    difficulty: "Easy",
    pattern: "Fast & Slow Pointers",
    memoryConceptsTaught: ["Cycle detection", "Floyd's algorithm", "Pointer speed difference"],
    description: "Detect if a linked list has a cycle using the tortoise and hare algorithm.",
    starterCode: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Create list with cycle: 1 -> 2 -> 3 -> 4 -> back to 2
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);
head->next->next->next = new ListNode(4);
head->next->next->next->next = head->next; // Creates cycle!

// Floyd's cycle detection
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
}`,
    hints: [
      "Fast pointer moves 2 steps, slow moves 1 step",
      "If there's a cycle, they will eventually meet",
      "If fast reaches null, there's no cycle"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },

  removeNthFromEnd: {
    id: 19,
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    pattern: "Two Pointers",
    memoryConceptsTaught: ["Gap maintenance", "Single pass traversal", "Node deletion"],
    description: "Remove the nth node from the end of a linked list in one pass.",
    starterCode: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Create list: 1 -> 2 -> 3 -> 4 -> 5
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);
head->next->next->next = new ListNode(4);
head->next->next->next->next = new ListNode(5);

int n = 2; // Remove 2nd from end (node with value 4)

// Use dummy to handle edge case of removing head
ListNode dummy(0);
dummy.next = head;
ListNode* first = &dummy;
ListNode* second = &dummy;

// Move first n+1 steps ahead
for (int i = 0; i <= n; i++) {
    first = first->next;
}

// Move both until first reaches end
while (first != nullptr) {
    first = first->next;
    second = second->next;
}

// Delete the node
ListNode* toDelete = second->next;
second->next = second->next->next;
delete toDelete;

head = dummy.next;`,
    hints: [
      "Create a gap of n nodes between two pointers",
      "When the first pointer reaches the end, second is at the right spot",
      "Use dummy node to handle removing the head"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },

  // ============ BINARY TREE PROBLEMS ============
  invertBinaryTree: {
    id: 226,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    pattern: "Tree Recursion",
    memoryConceptsTaught: ["Recursive tree traversal", "Pointer swapping", "Tree structure"],
    description: "Invert a binary tree by swapping left and right children at every node.",
    starterCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Create tree:     4
//                /   \\
//               2     7
//              / \\   / \\
//             1   3 6   9

TreeNode* root = new TreeNode(4);
root->left = new TreeNode(2);
root->right = new TreeNode(7);
root->left->left = new TreeNode(1);
root->left->right = new TreeNode(3);
root->right->left = new TreeNode(6);
root->right->right = new TreeNode(9);

// Invert the tree (swap children at each node)
TreeNode* temp = root->left;
root->left = root->right;
root->right = temp;

// After full inversion:
//        4
//      /   \\
//     7     2
//    / \\   / \\
//   9   6 3   1`,
    hints: [
      "Swap left and right children at each node",
      "Recursively invert left and right subtrees",
      "Base case: null node returns null"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) - height of tree"
  },

  maximumDepth: {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    pattern: "Tree Recursion",
    memoryConceptsTaught: ["Recursive depth calculation", "Call stack visualization", "Tree height"],
    description: "Find the maximum depth (height) of a binary tree.",
    starterCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Create tree with depth 3:
//        3
//       / \\
//      9  20
//        /  \\
//       15   7

TreeNode* root = new TreeNode(3);
root->left = new TreeNode(9);
root->right = new TreeNode(20);
root->right->left = new TreeNode(15);
root->right->right = new TreeNode(7);

// Calculate depth at each node
int leftDepth = 1;  // Depth of left subtree
int rightDepth = 2; // Depth of right subtree
int maxDepth = 1 + 2; // 1 + max(left, right) = 3`,
    hints: [
      "Depth = 1 + max(leftDepth, rightDepth)",
      "Base case: null node has depth 0",
      "Watch the call stack grow as we recurse"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)"
  },

  validateBST: {
    id: 98,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    pattern: "Tree Recursion",
    memoryConceptsTaught: ["BST property", "Range validation", "Recursive bounds"],
    description: "Check if a binary tree is a valid Binary Search Tree.",
    starterCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Valid BST:    5
//              / \\
//             3   7
//            / \\   \\
//           1   4   9

TreeNode* root = new TreeNode(5);
root->left = new TreeNode(3);
root->right = new TreeNode(7);
root->left->left = new TreeNode(1);
root->left->right = new TreeNode(4);
root->right->right = new TreeNode(9);

// Check BST property at each node
// Left child (3) < Root (5) < Right child (7)
bool leftValid = root->left->val < root->val;
bool rightValid = root->right->val > root->val;
bool isValid = leftValid && rightValid;`,
    hints: [
      "Each node has a valid range (min, max)",
      "Left subtree values must be less than root",
      "Right subtree values must be greater than root"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)"
  },

  // ============ MEMORY MANAGEMENT PROBLEMS ============
  memoryLeak: {
    id: 0,
    title: "Detect Memory Leak",
    difficulty: "Medium",
    pattern: "Memory Management",
    memoryConceptsTaught: ["Memory leaks", "Proper deallocation", "RAII pattern"],
    description: "Learn to identify and fix memory leaks in C++ code.",
    starterCode: `// BUGGY CODE - Has memory leak!
int* ptr1 = new int(10);
int* ptr2 = new int(20);
int* ptr3 = new int(30);

// Reassigning ptr2 without deleting - MEMORY LEAK!
ptr2 = ptr1;

// Now the memory at original ptr2 is lost forever!
// We can't access it or delete it.

// Proper cleanup (but we already leaked one!)
delete ptr1;
// delete ptr2 would crash - same memory as ptr1!
delete ptr3;

// FIXED VERSION:
int* a = new int(10);
int* b = new int(20);
int* c = new int(30);

// Delete before reassigning!
delete b;
b = a;

delete a;
// Don't delete b - it's the same as a now
delete c;`,
    hints: [
      "Always delete before reassigning a pointer",
      "Track all allocations and ensure matching deletes",
      "Consider using smart pointers (unique_ptr, shared_ptr)"
    ],
    timeComplexity: "N/A",
    spaceComplexity: "N/A"
  },

  danglingPointer: {
    id: 0,
    title: "Dangling Pointer Detection",
    difficulty: "Medium",
    pattern: "Memory Management",
    memoryConceptsTaught: ["Dangling pointers", "Use-after-free", "Null safety"],
    description: "Understand and avoid dangling pointer bugs.",
    starterCode: `// DANGEROUS CODE - Dangling pointer!
int* ptr = new int(42);
int* alias = ptr;  // Both point to same memory

delete ptr;  // Memory freed!
// ptr and alias are now DANGLING POINTERS

// ptr = nullptr;  // Good practice - but alias still dangles!

// *alias = 10;  // CRASH! Use-after-free bug!

// SAFE VERSION:
int* safe = new int(42);
int* copy = safe;

delete safe;
safe = nullptr;
copy = nullptr;  // Must null ALL aliases!

// Now both are safe to check
if (safe != nullptr) {
    *safe = 10;  // Won't execute
}`,
    hints: [
      "After delete, set pointer to nullptr immediately",
      "Be aware of all aliases to the same memory",
      "Check for nullptr before dereferencing"
    ],
    timeComplexity: "N/A",
    spaceComplexity: "N/A"
  },

  twoSum: {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    pattern: "Hash Map",
    memoryConceptsTaught: ["Array indexing", "Stack arrays", "Value lookup"],
    description: "Find two numbers that add up to target. Classic first LeetCode problem!",
    starterCode: `// Array on stack
int nums[4] = {2, 7, 11, 15};
int target = 9;

// Brute force approach - check all pairs
int result1 = -1;
int result2 = -1;

for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 4; j++) {
        if (nums[i] + nums[j] == target) {
            result1 = i;
            result2 = j;
        }
    }
}

// Result: indices 0 and 1 (values 2 + 7 = 9)`,
    hints: [
      "Brute force: check all pairs O(n^2)",
      "Optimal: use hash map for O(n)",
      "Store complement = target - current"
    ],
    timeComplexity: "O(n^2) brute force, O(n) with hash map",
    spaceComplexity: "O(1) brute force, O(n) with hash map"
  },

  addTwoNumbers: {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    pattern: "Linked List",
    memoryConceptsTaught: ["Building linked lists", "Carry propagation", "Node creation"],
    description: "Add two numbers represented as linked lists (digits in reverse order).",
    starterCode: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Number 342 as: 2 -> 4 -> 3
ListNode* l1 = new ListNode(2);
l1->next = new ListNode(4);
l1->next->next = new ListNode(3);

// Number 465 as: 5 -> 6 -> 4
ListNode* l2 = new ListNode(5);
l2->next = new ListNode(6);
l2->next->next = new ListNode(4);

// Add: 342 + 465 = 807
// Result: 7 -> 0 -> 8
ListNode dummy(0);
ListNode* curr = &dummy;
int carry = 0;

while (l1 || l2 || carry) {
    int sum = carry;
    if (l1) { sum += l1->val; l1 = l1->next; }
    if (l2) { sum += l2->val; l2 = l2->next; }
    
    carry = sum / 10;
    curr->next = new ListNode(sum % 10);
    curr = curr->next;
}

ListNode* result = dummy.next;`,
    hints: [
      "Process digits from least significant (head)",
      "Handle carry for sums >= 10",
      "Don't forget final carry!"
    ],
    timeComplexity: "O(max(n, m))",
    spaceComplexity: "O(max(n, m))"
  }
};

// Problem categories for filtering
export const PROBLEM_CATEGORIES = {
  linkedList: ["reverseLinkedList", "mergeTwoSortedLists", "linkedListCycle", "removeNthFromEnd", "addTwoNumbers"],
  binaryTree: ["invertBinaryTree", "maximumDepth", "validateBST"],
  memoryManagement: ["memoryLeak", "danglingPointer"],
  arrays: ["twoSum"]
};

// Difficulty colors
export const DIFFICULTY_COLORS = {
  Easy: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", border: "border-green-300 dark:border-green-700" },
  Medium: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-300 dark:border-yellow-700" },
  Hard: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-300 dark:border-red-700" }
};

// Get all problems as array
export const getAllProblems = () => Object.entries(LEETCODE_PROBLEMS).map(([key, problem]) => ({
  key,
  ...problem
}));

// Get problems by category
export const getProblemsByCategory = (category) => {
  const keys = PROBLEM_CATEGORIES[category] || [];
  return keys.map(key => ({ key, ...LEETCODE_PROBLEMS[key] }));
};

