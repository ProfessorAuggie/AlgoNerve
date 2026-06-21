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
}

// ─── Tree ───────────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  height?: number;
  parent?: string | null;
}

export interface TreePayload {
  root: TreeNode | null;
  current?: string | null;
  visited?: string[];
  callStack?: string[];
  result?: number[];
  comparing?: string | null;
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

// ─── Algorithm Metadata ─────────────────────────────────────────────────────

export type AlgorithmCategory = 'sorting' | 'graph' | 'tree' | 'dp' | 'recursion';

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  tags: string[];
}

export const ALGORITHM_REGISTRY: AlgorithmMeta[] = [
  // Sorting
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly swaps adjacent elements that are in the wrong order.',
    tags: ['simple', 'in-place', 'stable'],
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the sorted array one element at a time by insertion.',
    tags: ['simple', 'in-place', 'stable', 'adaptive'],
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides array in half, sorts each half, then merges them.',
    tags: ['divide-and-conquer', 'stable', 'recursive'],
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Partitions array around a pivot element recursively.',
    tags: ['divide-and-conquer', 'in-place', 'recursive'],
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Builds a max-heap then extracts elements one by one.',
    tags: ['in-place', 'heap', 'selection'],
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
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible before backtracking.',
    tags: ['graph', 'stack', 'recursive'],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Finds shortest paths from a source to all other nodes.',
    tags: ['graph', 'weighted', 'shortest-path', 'greedy'],
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
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    description: 'Finds the longest subsequence common to two strings.',
    tags: ['dp', 'strings', '2D-table'],
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'dp',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    description: 'Minimum operations to transform one string into another.',
    tags: ['dp', 'strings', '2D-table', 'levenshtein'],
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
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'recursion',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    description: 'Move disks between pegs using recursive decomposition.',
    tags: ['recursion', 'classic', 'divide-and-conquer'],
  },
];
