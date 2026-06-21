// ─── Core Step Interface ────────────────────────────────────────────────────

export interface Step {
  id: number;
  action: string;
  description: string;
  codeLine: number;
  payload: any;
}


// ─── Sorting ────────────────────────────────────────────────────────────────

export interface SortingPayload {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  left?: number;
  right?: number;
  mid?: number;
}

// ─── Graph ──────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
  weighted?: boolean;
}

export interface GraphPayload {
  graph: GraphData;
  visited: string[];
  queue?: string[];
  stack?: string[];
  current?: string;
  distances?: Record<string, number>;
  previous?: Record<string, string | null>;
  path?: string[];
  mstEdges?: GraphEdge[];
}

// ─── Tree ───────────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  height?: number;
  parent?: string | null;
  balance?: number;
}

export interface TreePayload {
  root: TreeNode | null;
  current?: string | null;
  visited?: string[];
  callStack?: string[];
  result?: number[];
  comparing?: string | null;
  rotationType?: string;
}

// ─── Dynamic Programming ────────────────────────────────────────────────────

export interface DPPayload {
  table: number[][];
  rows?: string[];
  cols?: string[];
  activeCell?: [number, number];
  dependsOn?: Array<[number, number]>;
  result?: number;
  memo?: Record<string, number>;
}

// ─── Backtracking (N-Queens) ────────────────────────────────────────────────

export interface BacktrackingPayload {
  grid: number[][]; // 0 for empty, 1 for queen, 2 for conflict/checked
  row?: number;
  col?: number;
  solutionsCount?: number;
  currentQueens?: Array<[number, number]>;
}

// ─── Recursion ──────────────────────────────────────────────────────────────

export interface StackFrame {
  id: string;
  funcName: string;
  args: Record<string, unknown>;
  returnValue?: unknown;
  isReturning?: boolean;
}

export interface RecursionPayload {
  callStack: StackFrame[];
  currentFrameId?: string;
  result?: unknown;
  disks?: Array<{ disk: number; peg: string }>;
  pegs?: { A: number[]; B: number[]; C: number[] };
}

// ─── Data Structures ────────────────────────────────────────────────────────
export interface DataStructurePayload {
  type: 'stack' | 'queue' | 'linked-list';
  elements: number[];
  nodes?: Array<{ id: string; value: number; nextId: string | null; prevId?: string | null }>;
  headId?: string | null;
  topIndex?: number;
  frontIndex?: number;
  rearIndex?: number;
  activeIndex?: number;
  activeNodeId?: string | null;
  actionNodeId?: string | null;
  actionType?: 'push' | 'pop' | 'peek' | 'enqueue' | 'dequeue' | 'traverse' | 'insert' | 'delete';
}

// ─── Algorithm Metadata ─────────────────────────────────────────────────────

export type AlgorithmCategory = 'sorting' | 'searching' | 'datastructures' | 'graph' | 'tree' | 'dp' | 'recursion' | 'backtracking';

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  tags: string[];
  mode?: 'interactive' | 'concept'; // 'interactive' is default if omitted
}

export const ALGORITHM_REGISTRY: AlgorithmMeta[] = [
  // Searching
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Sequentially checks each element of the list until a match is found.',
    tags: ['array', 'search', 'sequential'],
    mode: 'interactive',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Finds the position of a target value within a sorted array by dividing search interval in half.',
    tags: ['array', 'search', 'divide-and-conquer', 'sorted'],
    mode: 'interactive',
  },
  // Sorting
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent elements that are in the wrong order.',
    tags: ['simple', 'in-place', 'stable'],
    mode: 'interactive',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
    tags: ['simple', 'in-place', 'unstable'],
    mode: 'interactive',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the sorted array one element at a time by insertion.',
    tags: ['simple', 'in-place', 'stable', 'adaptive'],
    mode: 'interactive',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides array in half, sorts each half, then merges them.',
    tags: ['divide-and-conquer', 'stable', 'recursive'],
    mode: 'interactive',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Partitions array around a pivot element recursively.',
    tags: ['divide-and-conquer', 'in-place', 'recursive'],
    mode: 'interactive',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Builds a max-heap then extracts elements one by one.',
    tags: ['in-place', 'heap', 'selection'],
    mode: 'interactive',
  },
  // Data Structures
  {
    id: 'stack-ops',
    name: 'Stack Operations',
    category: 'datastructures',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'Visualize Push, Pop, and Peek operations on a Last-In-First-Out (LIFO) stack.',
    tags: ['array', 'stack', 'lifo', 'push', 'pop'],
    mode: 'interactive',
  },
  {
    id: 'queue-ops',
    name: 'Queue Operations',
    category: 'datastructures',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'Visualize Enqueue and Dequeue operations on a First-In-First-Out (FIFO) queue.',
    tags: ['array', 'queue', 'fifo', 'enqueue', 'dequeue'],
    mode: 'interactive',
  },
  {
    id: 'singly-linked-list',
    name: 'Singly Linked List',
    category: 'datastructures',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Visualize linked nodes connected sequentially, showing search, insertion, and deletion.',
    tags: ['linked-list', 'nodes', 'pointers', 'sequential'],
    mode: 'interactive',
  },
  {
    id: 'postfix-eval',
    name: 'Postfix Evaluation (Polish)',
    category: 'datastructures',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Evaluation of mathematical expressions in Postfix (Reverse Polish) notation using a Stack.',
    tags: ['stack', 'expression', 'postfix', 'polish'],
    mode: 'concept',
  },
  {
    id: 'prefix-eval',
    name: 'Prefix Evaluation (Polish)',
    category: 'datastructures',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Evaluation of mathematical expressions in Prefix notation using a Stack.',
    tags: ['stack', 'expression', 'prefix', 'polish'],
    mode: 'concept',
  },
  {
    id: 'double-ended-queue',
    name: 'Double-Ended Queue (Deque)',
    category: 'datastructures',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'A queue where insertion and deletion can occur at both front and rear ends.',
    tags: ['queue', 'deque', 'double-ended'],
    mode: 'concept',
  },
  {
    id: 'circular-queue',
    name: 'Circular Queue',
    category: 'datastructures',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'A linear queue that wraps around the end of the array to reuse empty slots.',
    tags: ['queue', 'circular', 'ring-buffer'],
    mode: 'concept',
  },
  {
    id: 'priority-queue',
    name: 'Priority Queue',
    category: 'datastructures',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    description: 'An abstract data type where elements have priorities, served highest priority first.',
    tags: ['queue', 'heap', 'priority'],
    mode: 'concept',
  },
  {
    id: 'doubly-linked-list',
    name: 'Doubly Linked List',
    category: 'datastructures',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Nodes containing values and two pointers pointing to the next and previous nodes.',
    tags: ['linked-list', 'doubly-linked', 'pointers'],
    mode: 'concept',
  },
  {
    id: 'circular-linked-list',
    name: 'Circular Linked List',
    category: 'datastructures',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'A linked list where the last node points back to the first node, forming a loop.',
    tags: ['linked-list', 'circular', 'pointers'],
    mode: 'concept',
  },
  // Graph
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores all neighbors at the current depth before going deeper.',
    tags: ['graph', 'queue', 'shortest-path'],
    mode: 'interactive',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible before backtracking.',
    tags: ['graph', 'stack', 'recursive'],
    mode: 'interactive',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Finds shortest paths from a source to all other nodes.',
    tags: ['graph', 'weighted', 'shortest-path', 'greedy'],
    mode: 'interactive',
  },
  {
    id: 'a-star',
    name: 'A* Search Algorithm',
    category: 'graph',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    description: 'Heuristic-guided shortest path search algorithm.',
    tags: ['graph', 'heuristic', 'shortest-path'],
    mode: 'interactive',
  },
  {
    id: 'prim',
    name: "Prim's MST Algorithm",
    category: 'graph',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    description: 'Greedy algorithm to find a Minimum Spanning Tree for a weighted graph.',
    tags: ['graph', 'mst', 'greedy'],
    mode: 'interactive',
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST Algorithm",
    category: 'graph',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    description: 'Builds a Minimum Spanning Tree by sorting edges and using Disjoint Set.',
    tags: ['graph', 'mst', 'union-find'],
    mode: 'interactive',
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Linear ordering of vertices in a DAG such that for every directed edge uv, u comes before v.',
    tags: ['graph', 'dag', 'ordering'],
    mode: 'concept',
  },
  {
    id: 'adjacency-matrix',
    name: 'Adjacency Matrix Representation',
    category: 'graph',
    timeComplexity: 'O(V²)',
    spaceComplexity: 'O(V²)',
    description: 'A 2D array representation of a graph where indices indicate edge presence and weight.',
    tags: ['graph', 'matrix', 'representation'],
    mode: 'concept',
  },
  {
    id: 'adjacency-list',
    name: 'Adjacency List Representation',
    category: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    description: 'An array of lists representing the vertices connected to each vertex in the graph.',
    tags: ['graph', 'list', 'representation'],
    mode: 'concept',
  },
  // Tree
  {
    id: 'bst',
    name: 'BST Insert & Traverse',
    category: 'tree',
    timeComplexity: 'O(log n) avg',
    spaceComplexity: 'O(n)',
    description: 'Insert values into a BST and visualize in/pre/post-order traversals.',
    tags: ['tree', 'binary-search', 'recursive'],
    mode: 'interactive',
  },
  {
    id: 'avl-tree',
    name: 'AVL Tree (Rotations)',
    category: 'tree',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    description: 'Self-balancing BST using Left, Right, Left-Right, and Right-Left rotations.',
    tags: ['tree', 'self-balancing', 'rotations'],
    mode: 'interactive',
  },
  {
    id: 'red-black-tree',
    name: 'Red-Black Tree',
    category: 'tree',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    description: 'A self-balancing binary search tree where each node has a color attribute (Red or Black).',
    tags: ['tree', 'self-balancing', 'red-black'],
    mode: 'concept',
  },
  {
    id: 'b-tree',
    name: 'B-Tree',
    category: 'tree',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    description: 'A self-balancing search tree designed to work well on direct-access storage devices.',
    tags: ['tree', 'self-balancing', 'multi-way'],
    mode: 'concept',
  },
  {
    id: 'trie-tree',
    name: 'Trie (Prefix Tree)',
    category: 'tree',
    timeComplexity: 'O(key_length)',
    spaceComplexity: 'O(alphabet_size * key_length * N)',
    description: 'An search tree used for storing associative keys (usually strings) dynamically.',
    tags: ['tree', 'prefix', 'strings'],
    mode: 'concept',
  },
  {
    id: 'segment-tree',
    name: 'Segment Tree',
    category: 'tree',
    timeComplexity: 'O(log n) query/update',
    spaceComplexity: 'O(n)',
    description: 'A tree data structure used for storing information about intervals or segments.',
    tags: ['tree', 'interval', 'query'],
    mode: 'concept',
  },
  {
    id: 'fenwick-tree',
    name: 'Fenwick Tree (BIT)',
    category: 'tree',
    timeComplexity: 'O(log n) query/update',
    spaceComplexity: 'O(n)',
    description: 'Binary Indexed Tree for efficient prefix sum calculations and frequency updates.',
    tags: ['tree', 'prefix-sum', 'query'],
    mode: 'concept',
  },
  {
    id: 'lca-tree',
    name: 'Lowest Common Ancestor (LCA)',
    category: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Finds the lowest node in a tree that has both given nodes as descendants.',
    tags: ['tree', 'lca', 'ancestor'],
    mode: 'concept',
  },
  {
    id: 'tree-diameter',
    name: 'Tree Diameter',
    category: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Finds the length of the longest path between any two nodes in a tree.',
    tags: ['tree', 'diameter', 'path'],
    mode: 'concept',
  },
  {
    id: 'tree-isomorphism',
    name: 'Tree Isomorphism',
    category: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Determines if two trees are structurally identical regardless of node values/order.',
    tags: ['tree', 'isomorphism', 'structure'],
    mode: 'concept',
  },
  {
    id: 'tree-serialize',
    name: 'Tree Serialize / Deserialize',
    category: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Convert a tree structure into string format and reconstruct the tree back.',
    tags: ['tree', 'serialization', 'dfs'],
    mode: 'concept',
  },
  {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    category: 'tree',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'An algorithm used for lossless data compression using prefix-free code trees.',
    tags: ['tree', 'greedy', 'compression'],
    mode: 'concept',
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    category: 'tree',
    timeComplexity: 'O(depth)',
    spaceComplexity: 'O(nodes)',
    description: 'A tree structure representing choices and their potential outcomes for classification.',
    tags: ['tree', 'classification', 'ml'],
    mode: 'concept',
  },
  {
    id: 'syntax-tree',
    name: 'Abstract Syntax Tree (AST)',
    category: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Represents the hierarchical syntactic structure of source code written in a programming language.',
    tags: ['tree', 'compiler', 'parsing'],
    mode: 'concept',
  },
  // DP
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci (DP)',
    category: 'dp',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Computes Fibonacci sequence using memoization/tabulation.',
    tags: ['dp', 'memoization', 'tabulation'],
    mode: 'interactive',
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    description: 'Finds the longest subsequence common to two strings.',
    tags: ['dp', 'strings', '2D-table'],
    mode: 'interactive',
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'dp',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    description: 'Minimum operations to transform one string into another.',
    tags: ['dp', 'strings', '2D-table', 'levenshtein'],
    mode: 'interactive',
  },
  {
    id: 'knapsack-dp',
    name: '0/1 Knapsack (DP)',
    category: 'dp',
    timeComplexity: 'O(n × W)',
    spaceComplexity: 'O(n × W)',
    description: 'Maximize item values in a knapsack of limited weight capacity W.',
    tags: ['dp', 'optimization', '2D-table'],
    mode: 'interactive',
  },
  // Recursion
  {
    id: 'factorial',
    name: 'Factorial (Recursion)',
    category: 'recursion',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Demonstrates recursive call stack with factorial computation.',
    tags: ['recursion', 'call-stack', 'classic'],
    mode: 'interactive',
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'recursion',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    description: 'Move disks between pegs using recursive decomposition.',
    tags: ['recursion', 'classic', 'divide-and-conquer'],
    mode: 'interactive',
  },
  // Backtracking
  {
    id: 'n-queens',
    name: 'N-Queens (Backtracking)',
    category: 'backtracking',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    description: 'Place N non-attacking queens on an N×N chessboard.',
    tags: ['backtracking', 'recursion', 'chessboard'],
    mode: 'interactive',
  },
];

