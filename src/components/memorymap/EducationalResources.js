/**
 * Educational Resources for MemoryMap
 * Curated learning materials for CS students learning memory management
 */

// Learning resources organized by topic
export const LEARNING_RESOURCES = {
  pointers: {
    title: "Pointers",
    icon: "pointer",
    difficulty: "beginner",
    description: "Understanding memory addresses and pointer basics",
    keyPoints: [
      "Pointers store memory addresses, not actual values",
      "The * operator dereferences (accesses the value at the address)",
      "The & operator gets the address of a variable",
      "Pointers are 8 bytes on 64-bit systems regardless of type"
    ],
    resources: [
      { title: "Pointers in C/C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/pointers-in-c-and-c-set-1-introduction-arithmetic-and-array/", type: "article" },
      { title: "Pointers Explained - W3Schools", url: "https://www.w3schools.com/cpp/cpp_pointers.asp", type: "article" },
      { title: "Pointers for Beginners - YouTube", url: "https://www.youtube.com/watch?v=zuegQmMdy8M", type: "video" }
    ]
  },

  memoryAllocation: {
    title: "Memory Allocation",
    icon: "memory",
    difficulty: "beginner",
    description: "Dynamic memory allocation with new and delete",
    keyPoints: [
      "new allocates memory on the heap",
      "delete frees heap memory",
      "Always pair new with delete to prevent leaks",
      "new[] must be paired with delete[]"
    ],
    resources: [
      { title: "Dynamic Memory in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/dynamic-memory-allocation-in-c-using-malloc-calloc-free-and-realloc/", type: "article" },
      { title: "new and delete - cppreference", url: "https://en.cppreference.com/w/cpp/memory/new/operator_new", type: "article" },
      { title: "Memory Allocation Visualized - YouTube", url: "https://www.youtube.com/watch?v=_8-ht2AKyH4", type: "video" }
    ]
  },

  memoryLeaks: {
    title: "Memory Leaks",
    icon: "leak",
    difficulty: "intermediate",
    description: "Detecting and preventing memory leaks",
    keyPoints: [
      "Memory leak: allocated memory that's never freed",
      "Happens when you lose the pointer to allocated memory",
      "Use tools like Valgrind to detect leaks",
      "Smart pointers (unique_ptr, shared_ptr) prevent leaks automatically"
    ],
    resources: [
      { title: "Memory Leaks in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/memory-leak-in-c-and-how-to-avoid-it/", type: "article" },
      { title: "Valgrind Tutorial", url: "https://valgrind.org/docs/manual/quick-start.html", type: "article" },
      { title: "Finding Memory Leaks - YouTube", url: "https://www.youtube.com/watch?v=8yO2FBfMH0g", type: "video" }
    ]
  },

  danglingPointers: {
    title: "Dangling Pointers",
    icon: "danger",
    difficulty: "intermediate",
    description: "Understanding and avoiding use-after-free bugs",
    keyPoints: [
      "Dangling pointer: pointer to freed/invalid memory",
      "Using dangling pointers causes undefined behavior",
      "Always set pointers to nullptr after delete",
      "Be aware of all aliases to the same memory"
    ],
    resources: [
      { title: "Dangling Pointers - GeeksforGeeks", url: "https://www.geeksforgeeks.org/dangling-void-null-wild-pointers/", type: "article" },
      { title: "Pointer Safety - W3Schools", url: "https://www.w3schools.com/cpp/cpp_pointers.asp", type: "article" },
      { title: "Use After Free Explained - YouTube", url: "https://www.youtube.com/watch?v=0IbSEEHVKik", type: "video" }
    ]
  },

  stackVsHeap: {
    title: "Stack vs Heap",
    icon: "layers",
    difficulty: "beginner",
    description: "Understanding the two types of program memory",
    keyPoints: [
      "Stack: fast, automatic, limited size, LIFO",
      "Heap: slower, manual management, larger, flexible",
      "Local variables go on stack",
      "new/malloc allocates on heap"
    ],
    resources: [
      { title: "Stack vs Heap - GeeksforGeeks", url: "https://www.geeksforgeeks.org/stack-vs-heap-memory-allocation/", type: "article" },
      { title: "Memory Layout - W3Schools", url: "https://www.w3schools.com/cpp/cpp_memory.asp", type: "article" },
      { title: "Stack and Heap Explained - YouTube", url: "https://www.youtube.com/watch?v=wJ1L2nSIV1s", type: "video" }
    ]
  },

  references: {
    title: "References",
    icon: "reference",
    difficulty: "beginner",
    description: "C++ references as safe aliases",
    keyPoints: [
      "References are aliases - another name for existing variable",
      "Must be initialized when declared",
      "Cannot be null or reassigned",
      "Safer than pointers for many use cases"
    ],
    resources: [
      { title: "References in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/references-in-c/", type: "article" },
      { title: "C++ References - W3Schools", url: "https://www.w3schools.com/cpp/cpp_references.asp", type: "article" },
      { title: "Pointers vs References - YouTube", url: "https://www.youtube.com/watch?v=sxHng1iufQE", type: "video" }
    ]
  },

  arrays: {
    title: "Arrays & Memory",
    icon: "array",
    difficulty: "beginner",
    description: "How arrays are stored in memory",
    keyPoints: [
      "Arrays are contiguous blocks of memory",
      "Array name is a pointer to first element",
      "arr[i] is equivalent to *(arr + i)",
      "Dynamic arrays need manual size tracking"
    ],
    resources: [
      { title: "Arrays in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/arrays-in-c-cpp/", type: "article" },
      { title: "C++ Arrays - W3Schools", url: "https://www.w3schools.com/cpp/cpp_arrays.asp", type: "article" },
      { title: "Array Memory Layout - YouTube", url: "https://www.youtube.com/watch?v=ENDaJi08jCU", type: "video" }
    ]
  },

  linkedLists: {
    title: "Linked Lists",
    icon: "link",
    difficulty: "intermediate",
    description: "Dynamic data structures with pointers",
    keyPoints: [
      "Each node contains data + pointer to next",
      "O(1) insertion/deletion at known position",
      "O(n) search - must traverse from head",
      "Head pointer is crucial - lose it, lose the list"
    ],
    resources: [
      { title: "Linked Lists - GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/linked-list/", type: "article" },
      { title: "Linked List Basics - W3Schools", url: "https://www.w3schools.com/dsa/dsa_data_linkedlists.php", type: "article" },
      { title: "Linked Lists Visualized - YouTube", url: "https://www.youtube.com/watch?v=N6dOwBde7-M", type: "video" }
    ]
  },

  binaryTrees: {
    title: "Binary Trees",
    icon: "tree",
    difficulty: "intermediate",
    description: "Hierarchical data structures",
    keyPoints: [
      "Each node has at most 2 children (left, right)",
      "BST property: left < root < right",
      "Tree height affects performance",
      "Traversals: preorder, inorder, postorder"
    ],
    resources: [
      { title: "Binary Trees - GeeksforGeeks", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/", type: "article" },
      { title: "Tree Traversals - W3Schools", url: "https://www.w3schools.com/dsa/dsa_data_binarytrees.php", type: "article" },
      { title: "Binary Trees Explained - YouTube", url: "https://www.youtube.com/watch?v=H5JubkIy_p8", type: "video" }
    ]
  },

  structs: {
    title: "Structs & Classes",
    icon: "struct",
    difficulty: "beginner",
    description: "Custom data types and memory layout",
    keyPoints: [
      "Group related data together",
      "Members stored contiguously in memory",
      "Padding may be added for alignment",
      "Arrow operator (->) for pointer to struct"
    ],
    resources: [
      { title: "Structures in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/structures-in-cpp/", type: "article" },
      { title: "C++ Structures - W3Schools", url: "https://www.w3schools.com/cpp/cpp_structs.asp", type: "article" },
      { title: "Structs Explained - YouTube", url: "https://www.youtube.com/watch?v=Kk6XVfM3JJU", type: "video" }
    ]
  },

  vectors: {
    title: "Vectors (Dynamic Arrays)",
    icon: "vector",
    difficulty: "beginner",
    description: "C++ STL dynamic arrays",
    keyPoints: [
      "Automatically manages memory",
      "Grows dynamically as elements are added",
      "Contiguous memory like arrays",
      "Use .at() for bounds checking"
    ],
    resources: [
      { title: "Vectors in C++ - GeeksforGeeks", url: "https://www.geeksforgeeks.org/vector-in-cpp-stl/", type: "article" },
      { title: "C++ Vectors - W3Schools", url: "https://www.w3schools.com/cpp/cpp_vectors.asp", type: "article" },
      { title: "STL Vectors - YouTube", url: "https://www.youtube.com/watch?v=PocJ5jXv8No", type: "video" }
    ]
  },

  smartPointers: {
    title: "Smart Pointers",
    icon: "smart",
    difficulty: "advanced",
    description: "Automatic memory management in modern C++",
    keyPoints: [
      "unique_ptr: exclusive ownership, auto-deletes",
      "shared_ptr: shared ownership with reference counting",
      "weak_ptr: non-owning reference",
      "Prefer smart pointers over raw new/delete"
    ],
    resources: [
      { title: "Smart Pointers - GeeksforGeeks", url: "https://www.geeksforgeeks.org/smart-pointers-cpp/", type: "article" },
      { title: "unique_ptr - cppreference", url: "https://en.cppreference.com/w/cpp/memory/unique_ptr", type: "article" },
      { title: "Smart Pointers Explained - YouTube", url: "https://www.youtube.com/watch?v=UOB7-B2MfwA", type: "video" }
    ]
  }
};

// Pattern-specific resources for LeetCode problems
export const PATTERN_RESOURCES = {
  "Two Pointers": {
    title: "Two Pointer Technique",
    description: "Using two pointers to solve array/list problems efficiently",
    resources: [
      { title: "Two Pointers - LeetCode Patterns", url: "https://leetcode.com/discuss/study-guide/1688903/Solved-all-two-pointers-problems-in-100-days", type: "article" },
      { title: "Two Pointer Technique - GeeksforGeeks", url: "https://www.geeksforgeeks.org/two-pointers-technique/", type: "article" }
    ]
  },
  "Fast & Slow Pointers": {
    title: "Floyd's Cycle Detection",
    description: "Tortoise and hare algorithm for cycle detection",
    resources: [
      { title: "Floyd's Algorithm - GeeksforGeeks", url: "https://www.geeksforgeeks.org/floyds-cycle-finding-algorithm/", type: "article" },
      { title: "Cycle Detection - YouTube", url: "https://www.youtube.com/watch?v=gBTe7lFR3vc", type: "video" }
    ]
  },
  "Tree Recursion": {
    title: "Tree Recursion Patterns",
    description: "Solving tree problems with recursive thinking",
    resources: [
      { title: "Tree Recursion - GeeksforGeeks", url: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/", type: "article" },
      { title: "Recursion on Trees - YouTube", url: "https://www.youtube.com/watch?v=fAAZixBzIAI", type: "video" }
    ]
  },
  "Hash Map": {
    title: "Hash Map Techniques",
    description: "Using hash maps for O(1) lookups",
    resources: [
      { title: "Hash Map - GeeksforGeeks", url: "https://www.geeksforgeeks.org/hashing-data-structure/", type: "article" },
      { title: "Hash Tables Explained - YouTube", url: "https://www.youtube.com/watch?v=KyUTuwz_b7Q", type: "video" }
    ]
  },
  "Linked List": {
    title: "Linked List Patterns",
    description: "Common patterns for linked list problems",
    resources: [
      { title: "Linked List Patterns - LeetCode", url: "https://leetcode.com/discuss/study-guide/1800120/Become-Master-In-Linked-List", type: "article" },
      { title: "Linked List Tricks - GeeksforGeeks", url: "https://www.geeksforgeeks.org/top-20-linked-list-interview-question/", type: "article" }
    ]
  },
  "Memory Management": {
    title: "Memory Management Patterns",
    description: "Best practices for safe memory handling",
    resources: [
      { title: "Memory Management - GeeksforGeeks", url: "https://www.geeksforgeeks.org/memory-management-in-c/", type: "article" },
      { title: "RAII Pattern - cppreference", url: "https://en.cppreference.com/w/cpp/language/raii", type: "article" }
    ]
  }
};

/**
 * Detect relevant learning concepts based on code content
 */
export function detectRelevantConcepts(code) {
  if (!code || typeof code !== 'string') return [];
  
  const detected = [];
  const lowerCode = code.toLowerCase();
  
  // Check for each concept
  if (code.includes('*') && (code.includes('int*') || code.includes('char*') || code.includes('->') || code.includes('new '))) {
    detected.push('pointers');
  }
  if (code.includes('new ') || code.includes('malloc') || code.includes('calloc')) {
    detected.push('memoryAllocation');
  }
  if (code.includes('delete ') || code.includes('free(')) {
    detected.push('memoryLeaks');
    detected.push('danglingPointers');
  }
  if (code.includes('&') && !code.includes('&&')) {
    detected.push('references');
  }
  if (code.includes('[') && code.includes(']')) {
    detected.push('arrays');
  }
  if (lowerCode.includes('listnode') || lowerCode.includes('->next')) {
    detected.push('linkedLists');
  }
  if (lowerCode.includes('treenode') || lowerCode.includes('->left') || lowerCode.includes('->right')) {
    detected.push('binaryTrees');
  }
  if (code.includes('struct ') || code.includes('class ')) {
    detected.push('structs');
  }
  if (lowerCode.includes('vector<') || lowerCode.includes('push_back')) {
    detected.push('vectors');
  }
  if (lowerCode.includes('unique_ptr') || lowerCode.includes('shared_ptr') || lowerCode.includes('make_unique')) {
    detected.push('smartPointers');
  }
  
  // Default to basic concepts if nothing detected
  if (detected.length === 0) {
    detected.push('stackVsHeap');
    detected.push('pointers');
  }
  
  return [...new Set(detected)]; // Remove duplicates
}

/**
 * Get icon name for resource type
 */
export function getResourceIcon(type) {
  switch (type) {
    case 'video': return 'Youtube';
    case 'article': return 'FileText';
    case 'interactive': return 'Gamepad2';
    default: return 'ExternalLink';
  }
}

/**
 * Get color classes for difficulty level
 */
export function getDifficultyColor(difficulty, isDarkMode = false) {
  switch (difficulty) {
    case 'beginner':
      return isDarkMode 
        ? 'bg-green-900/30 text-green-400 border-green-700'
        : 'bg-green-100 text-green-700 border-green-300';
    case 'intermediate':
      return isDarkMode
        ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700'
        : 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'advanced':
      return isDarkMode
        ? 'bg-red-900/30 text-red-400 border-red-700'
        : 'bg-red-100 text-red-700 border-red-300';
    default:
      return isDarkMode
        ? 'bg-gray-700 text-gray-300 border-gray-600'
        : 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

