/**
 * Educational Resources Library
 * Curated learning resources for CS students (high school to undergrad)
 */

export const LEARNING_RESOURCES = {
  // Memory Fundamentals
  pointers: {
    topic: "Pointers",
    description: "Variables that store memory addresses",
    difficulty: "Beginner",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Pointers in C/C++",
        url: "https://www.geeksforgeeks.org/pointers-in-c-and-c-set-1-introduction-arithmetic-and-array/",
        type: "article"
      },
      {
        name: "W3Schools",
        title: "C++ Pointers",
        url: "https://www.w3schools.com/cpp/cpp_pointers.asp",
        type: "tutorial"
      },
      {
        name: "YouTube",
        title: "Pointers in C++ (freeCodeCamp)",
        url: "https://www.youtube.com/watch?v=zuegQmMdy8M",
        type: "video"
      }
    ],
    keyPoints: [
      "A pointer stores the address of another variable",
      "Use & to get the address of a variable",
      "Use * to dereference (access the value at the address)"
    ]
  },

  memoryAllocation: {
    topic: "Dynamic Memory Allocation",
    description: "Allocating memory at runtime with new/delete",
    difficulty: "Intermediate",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "new and delete Operators",
        url: "https://www.geeksforgeeks.org/new-and-delete-operators-in-cpp-for-dynamic-memory/",
        type: "article"
      },
      {
        name: "CPlusPlus.com",
        title: "Dynamic Memory",
        url: "https://cplusplus.com/doc/tutorial/dynamic/",
        type: "tutorial"
      },
      {
        name: "YouTube",
        title: "Dynamic Memory Allocation (The Cherno)",
        url: "https://www.youtube.com/watch?v=CSVRA4_xOkw",
        type: "video"
      }
    ],
    keyPoints: [
      "new allocates memory on the heap",
      "delete frees heap memory",
      "Always match every new with a delete to avoid leaks"
    ]
  },

  memoryLeaks: {
    topic: "Memory Leaks",
    description: "When allocated memory is never freed",
    difficulty: "Intermediate",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Memory Leak in C++",
        url: "https://www.geeksforgeeks.org/memory-leak-in-c-and-how-to-avoid-it/",
        type: "article"
      },
      {
        name: "LearnCpp",
        title: "Dynamic Memory Allocation",
        url: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
        type: "tutorial"
      },
      {
        name: "YouTube",
        title: "Memory Leaks Explained",
        url: "https://www.youtube.com/watch?v=F8cVv-_pxWE",
        type: "video"
      }
    ],
    keyPoints: [
      "Occurs when you allocate memory but never free it",
      "Can cause your program to run out of memory",
      "Use smart pointers (unique_ptr, shared_ptr) to prevent leaks"
    ]
  },

  danglingPointers: {
    topic: "Dangling Pointers",
    description: "Pointers that point to freed memory",
    difficulty: "Intermediate",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Dangling, Void, Null and Wild Pointers",
        url: "https://www.geeksforgeeks.org/dangling-void-null-wild-pointers/",
        type: "article"
      },
      {
        name: "TutorialsPoint",
        title: "C++ Dangling Pointers",
        url: "https://www.tutorialspoint.com/what-are-dangling-pointers-in-cplusplus",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "A dangling pointer points to memory that has been freed",
      "Using a dangling pointer causes undefined behavior",
      "Set pointers to nullptr after deleting"
    ]
  },

  stackVsHeap: {
    topic: "Stack vs Heap",
    description: "Two types of memory with different purposes",
    difficulty: "Beginner",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Stack vs Heap Memory",
        url: "https://www.geeksforgeeks.org/stack-vs-heap-memory-allocation/",
        type: "article"
      },
      {
        name: "YouTube",
        title: "Stack vs Heap (Jacob Sorber)",
        url: "https://www.youtube.com/watch?v=_8-ht2AKyH4",
        type: "video"
      },
      {
        name: "Programiz",
        title: "Stack and Heap Memory",
        url: "https://www.programiz.com/cpp-programming/memory-management",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "Stack: fast, automatic, limited size, LIFO",
      "Heap: slower, manual control, larger, flexible",
      "Local variables go on stack, new/malloc go on heap"
    ]
  },

  references: {
    topic: "References",
    description: "Aliases for existing variables",
    difficulty: "Beginner",
    resources: [
      {
        name: "W3Schools",
        title: "C++ References",
        url: "https://www.w3schools.com/cpp/cpp_references.asp",
        type: "tutorial"
      },
      {
        name: "GeeksforGeeks",
        title: "References in C++",
        url: "https://www.geeksforgeeks.org/references-in-c/",
        type: "article"
      },
      {
        name: "CPlusPlus.com",
        title: "References",
        url: "https://cplusplus.com/doc/tutorial/pointers/",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "A reference is an alias for another variable",
      "Must be initialized when declared",
      "Cannot be null or reassigned to another variable"
    ]
  },

  arrays: {
    topic: "Arrays",
    description: "Contiguous memory blocks for multiple values",
    difficulty: "Beginner",
    resources: [
      {
        name: "W3Schools",
        title: "C++ Arrays",
        url: "https://www.w3schools.com/cpp/cpp_arrays.asp",
        type: "tutorial"
      },
      {
        name: "GeeksforGeeks",
        title: "Arrays in C/C++",
        url: "https://www.geeksforgeeks.org/arrays-in-c-cpp/",
        type: "article"
      },
      {
        name: "YouTube",
        title: "Arrays in C++ (Bro Code)",
        url: "https://www.youtube.com/watch?v=PyTK_g1l8V8",
        type: "video"
      }
    ],
    keyPoints: [
      "Arrays store multiple values of the same type",
      "Array indices start at 0",
      "Array name decays to pointer to first element"
    ]
  },

  linkedLists: {
    topic: "Linked Lists",
    description: "Dynamic data structure with nodes and pointers",
    difficulty: "Intermediate",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Linked List Data Structure",
        url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
        type: "article"
      },
      {
        name: "Visualgo",
        title: "Linked List Visualization",
        url: "https://visualgo.net/en/list",
        type: "interactive"
      },
      {
        name: "YouTube",
        title: "Linked Lists (CS50)",
        url: "https://www.youtube.com/watch?v=zQI3FyWm144",
        type: "video"
      },
      {
        name: "Programiz",
        title: "Linked List Tutorial",
        url: "https://www.programiz.com/dsa/linked-list",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "Each node contains data and a pointer to the next node",
      "Head pointer points to the first node",
      "Last node's next pointer is nullptr (null)"
    ]
  },

  binaryTrees: {
    topic: "Binary Trees",
    description: "Hierarchical data structure with left and right children",
    difficulty: "Intermediate",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Binary Tree Data Structure",
        url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
        type: "article"
      },
      {
        name: "Visualgo",
        title: "Binary Tree Visualization",
        url: "https://visualgo.net/en/bst",
        type: "interactive"
      },
      {
        name: "YouTube",
        title: "Binary Trees (Abdul Bari)",
        url: "https://www.youtube.com/watch?v=H5JubkIy_p8",
        type: "video"
      },
      {
        name: "Programiz",
        title: "Binary Tree Tutorial",
        url: "https://www.programiz.com/dsa/binary-tree",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "Each node has at most two children (left and right)",
      "Root is the topmost node",
      "Leaf nodes have no children"
    ]
  },

  structs: {
    topic: "Structs",
    description: "User-defined data types that group related variables",
    difficulty: "Beginner",
    resources: [
      {
        name: "W3Schools",
        title: "C++ Structures",
        url: "https://www.w3schools.com/cpp/cpp_structs.asp",
        type: "tutorial"
      },
      {
        name: "GeeksforGeeks",
        title: "Structures in C++",
        url: "https://www.geeksforgeeks.org/structures-in-cpp/",
        type: "article"
      },
      {
        name: "Programiz",
        title: "C++ Structures",
        url: "https://www.programiz.com/cpp-programming/structure",
        type: "tutorial"
      }
    ],
    keyPoints: [
      "Groups multiple variables under one name",
      "Access members using the dot (.) operator",
      "Use arrow (->) operator for pointers to structs"
    ]
  },

  vectors: {
    topic: "std::vector",
    description: "Dynamic array that can grow and shrink",
    difficulty: "Beginner",
    resources: [
      {
        name: "W3Schools",
        title: "C++ Vectors",
        url: "https://www.w3schools.com/cpp/cpp_vectors.asp",
        type: "tutorial"
      },
      {
        name: "GeeksforGeeks",
        title: "Vector in C++ STL",
        url: "https://www.geeksforgeeks.org/vector-in-cpp-stl/",
        type: "article"
      },
      {
        name: "CPlusPlus.com",
        title: "std::vector",
        url: "https://cplusplus.com/reference/vector/vector/",
        type: "reference"
      }
    ],
    keyPoints: [
      "Dynamic array that resizes automatically",
      "Use push_back() to add elements",
      "Use [] or at() to access elements"
    ]
  },

  smartPointers: {
    topic: "Smart Pointers",
    description: "Automatic memory management to prevent leaks",
    difficulty: "Advanced",
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Smart Pointers in C++",
        url: "https://www.geeksforgeeks.org/smart-pointers-cpp/",
        type: "article"
      },
      {
        name: "LearnCpp",
        title: "Introduction to Smart Pointers",
        url: "https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/",
        type: "tutorial"
      },
      {
        name: "YouTube",
        title: "Smart Pointers (The Cherno)",
        url: "https://www.youtube.com/watch?v=UOB7-B2MfwA",
        type: "video"
      }
    ],
    keyPoints: [
      "unique_ptr: single ownership, automatic cleanup",
      "shared_ptr: multiple ownership, reference counted",
      "Always prefer smart pointers over raw pointers"
    ]
  }
};

// LeetCode Pattern Resources
export const PATTERN_RESOURCES = {
  "Two Pointers": {
    resources: [
      {
        name: "LeetCode",
        title: "Two Pointers Pattern",
        url: "https://leetcode.com/tag/two-pointers/",
        type: "practice"
      },
      {
        name: "GeeksforGeeks",
        title: "Two Pointer Technique",
        url: "https://www.geeksforgeeks.org/two-pointers-technique/",
        type: "article"
      }
    ],
    explanation: "Use two pointers to traverse from different positions or speeds"
  },
  "Fast & Slow Pointers": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Floyd's Cycle Detection",
        url: "https://www.geeksforgeeks.org/floyds-cycle-finding-algorithm/",
        type: "article"
      },
      {
        name: "YouTube",
        title: "Floyd's Algorithm Explained",
        url: "https://www.youtube.com/watch?v=PvrxZaH_eZ4",
        type: "video"
      }
    ],
    explanation: "Slow pointer moves 1 step, fast moves 2 steps - meets at cycle"
  },
  "DFS": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Depth First Search",
        url: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
        type: "article"
      },
      {
        name: "Visualgo",
        title: "DFS Visualization",
        url: "https://visualgo.net/en/dfsbfs",
        type: "interactive"
      }
    ],
    explanation: "Go deep into one branch before exploring others"
  },
  "BFS": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Breadth First Search",
        url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
        type: "article"
      },
      {
        name: "Visualgo",
        title: "BFS Visualization",
        url: "https://visualgo.net/en/dfsbfs",
        type: "interactive"
      }
    ],
    explanation: "Explore all neighbors before going deeper"
  },
  "Binary Search": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Binary Search",
        url: "https://www.geeksforgeeks.org/binary-search/",
        type: "article"
      },
      {
        name: "Khan Academy",
        title: "Binary Search",
        url: "https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search",
        type: "tutorial"
      }
    ],
    explanation: "Divide search space in half each time - O(log n)"
  },
  "Stack": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Stack Data Structure",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
        type: "article"
      },
      {
        name: "Visualgo",
        title: "Stack Visualization",
        url: "https://visualgo.net/en/list",
        type: "interactive"
      }
    ],
    explanation: "Last In, First Out (LIFO) - like a stack of plates"
  },
  "Hash Map": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Hash Map in C++",
        url: "https://www.geeksforgeeks.org/map-associative-containers-the-c-standard-template-library-stl/",
        type: "article"
      },
      {
        name: "W3Schools",
        title: "C++ Maps",
        url: "https://www.w3schools.com/cpp/cpp_maps.asp",
        type: "tutorial"
      }
    ],
    explanation: "Key-value pairs with O(1) average lookup"
  },
  "DP - Fibonacci": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Dynamic Programming",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        type: "article"
      },
      {
        name: "YouTube",
        title: "Dynamic Programming (freeCodeCamp)",
        url: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
        type: "video"
      }
    ],
    explanation: "Break problem into overlapping subproblems"
  },
  "Kadane's Algorithm": {
    resources: [
      {
        name: "GeeksforGeeks",
        title: "Kadane's Algorithm",
        url: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
        type: "article"
      }
    ],
    explanation: "Find maximum subarray sum in O(n) time"
  }
};

// Detect which concept is relevant based on code
export function detectRelevantConcepts(code) {
  const concepts = [];
  const lowerCode = code.toLowerCase();

  if (lowerCode.includes('*') && (lowerCode.includes('new') || lowerCode.includes('int*') || lowerCode.includes('char*'))) {
    concepts.push('pointers');
  }
  if (lowerCode.includes('new ') || lowerCode.includes('malloc')) {
    concepts.push('memoryAllocation');
  }
  if (lowerCode.includes('delete') || lowerCode.includes('free(')) {
    concepts.push('memoryLeaks');
    concepts.push('danglingPointers');
  }
  if (lowerCode.includes('&') && !lowerCode.includes('&&')) {
    concepts.push('references');
  }
  if (lowerCode.includes('[') && lowerCode.includes(']')) {
    concepts.push('arrays');
  }
  if (lowerCode.includes('->next') || lowerCode.includes('listnode') || lowerCode.includes('node')) {
    concepts.push('linkedLists');
  }
  if (lowerCode.includes('->left') || lowerCode.includes('->right') || lowerCode.includes('treenode')) {
    concepts.push('binaryTrees');
  }
  if (lowerCode.includes('struct ') || lowerCode.includes('class ')) {
    concepts.push('structs');
  }
  if (lowerCode.includes('vector<') || lowerCode.includes('push_back')) {
    concepts.push('vectors');
  }
  if (lowerCode.includes('unique_ptr') || lowerCode.includes('shared_ptr')) {
    concepts.push('smartPointers');
  }

  // Always include stack vs heap for memory visualization
  if (concepts.length > 0) {
    concepts.push('stackVsHeap');
  }

  return [...new Set(concepts)]; // Remove duplicates
}

// Get resource icon
export function getResourceIcon(type) {
  switch (type) {
    case 'video': return '🎥';
    case 'article': return '📄';
    case 'tutorial': return '📚';
    case 'interactive': return '🎮';
    case 'reference': return '📖';
    case 'practice': return '💪';
    default: return '🔗';
  }
}

// Difficulty colors
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Beginner': return 'text-green-600 bg-green-100';
    case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
    case 'Advanced': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
