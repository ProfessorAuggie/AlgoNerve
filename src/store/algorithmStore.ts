import { create } from 'zustand';
import type {
  Step,
  AlgorithmMeta,
  SortingPayload,
  DataStructurePayload,
  GraphPayload,
  TreePayload,
  DPPayload,
  BacktrackingPayload,
  RecursionPayload,
  TreeNode
} from '../algorithms/types';
import { ALGORITHM_REGISTRY } from '../algorithms/types';

import { generateBubbleSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps, generateHeapSortSteps, generateSelectionSortSteps, generatePigeonholeSortSteps } from '../algorithms/sorting';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateTernarySearchSteps,
  generateJumpSearchSteps,
  generateExponentialSearchSteps,
  generateInterpolationSearchSteps,
  generateFibonacciSearchSteps
} from '../algorithms/searching';
import { generateStackSteps, generateQueueSteps, generateLinkedListSteps } from '../algorithms/datastructures';
import { generateBFSSteps, generateDFSSteps, generateDijkstraSteps, generateAStarSteps, generatePrimSteps, generateKruskalSteps } from '../algorithms/graph';
import { generateBSTInsertSteps, generateTraversalSteps, generateAVLSteps } from '../algorithms/tree';
import { generateFibonacciDPSteps, generateLCSSteps, generateEditDistanceSteps, generateKnapsackSteps, generateCoinChangeSteps } from '../algorithms/dp';
import {
  generateFactorialSteps,
  generateHanoiSteps,
  generateFibonacciRecursiveSteps,
  generateSumOfNRecursiveSteps,
  generatePowerFunctionRecursiveSteps
} from '../algorithms/recursion';
import {
  generateNQueensSteps,
  generateSudokuSolverSteps,
  generateRatInAMazeSteps
} from '../algorithms/backtracking';
import {
  generatePostfixEvalSteps,
  generatePrefixEvalSteps,
  generateDequeSteps,
  generateCircularQueueSteps,
  generatePriorityQueueSteps,
  generateDoublyLinkedListSteps,
  generateCircularLinkedListSteps,
  generateLCATreeSteps,
  generateTreeDiameterSteps,
  generateTreeIsomorphismSteps,
  generateTreeSerializeSteps,
  generateSyntaxTreeSteps,
  generateRedBlackTreeSteps,
  generateBTreeSteps,
  generateAdjacencyMatrixSteps,
  generateAdjacencyListSteps,
  generateTopologicalSortSteps,
  generateFenwickTreeSteps
} from '../algorithms/conceptSteps';



// Sample graph data for visualization
const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }, { id: 'F' }
  ],
  edges: [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'C', target: 'D', weight: 8 },
    { source: 'C', target: 'E', weight: 10 },
    { source: 'D', target: 'E', weight: 2 },
    { source: 'D', target: 'F', weight: 6 },
    { source: 'E', target: 'F', weight: 3 },
  ],
  directed: false,
  weighted: true,
};

interface AlgorithmState {
  // Config
  selectedAlgo: AlgorithmMeta | null;
  steps: Step[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // Playback speed delay in ms (e.g. 800)
  
  // Custom inputs
  inputArray: number[];
  graphData: typeof DEFAULT_GRAPH;
  graphStartNode: string;
  treeValues: number[];
  dpString1: string;
  dpString2: string;
  recursionN: number;
  
  // Controls
  selectAlgorithm: (id: string) => void;
  setSteps: (steps: Step[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetPlayback: () => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setStepIndex: (index: number) => void;
  
  // Input updating methods
  setInputArray: (arr: number[]) => void;
  setGraphData: (data: typeof DEFAULT_GRAPH) => void;
  setGraphStartNode: (node: string) => void;
  setTreeValues: (vals: number[]) => void;
  setDpStrings: (s1: string, s2: string) => void;
  setRecursionN: (n: number) => void;
  
  // Re-generate steps based on selected algorithm and current input configuration
  generateSteps: () => void;

  // Console state
  isConsoleOpen: boolean;
  consoleLogs: Array<{ type: 'input' | 'output' | 'error' | 'system'; text: string }>;
  setConsoleOpen: (open: boolean) => void;
  addConsoleLog: (type: 'input' | 'output' | 'error' | 'system', text: string) => void;
  clearConsoleLogs: () => void;
}

let timer: any = null;


export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  selectedAlgo: ALGORITHM_REGISTRY[0], // Bubble sort default
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 800, // 800ms default speed
  
  // Default values
  inputArray: [29, 10, 14, 37, 13, 22, 8],
  graphData: DEFAULT_GRAPH,
  graphStartNode: 'A',
  treeValues: [40, 20, 60, 10, 30, 50, 70],
  dpString1: 'AABCDE',
  dpString2: 'ABACDE',
  recursionN: 4,

  // Console state defaults
  isConsoleOpen: false,
  consoleLogs: [
    { type: 'system', text: 'Welcome to AlgoNerve Interactive Command Console.' },
    { type: 'system', text: 'Type "help" to display the list of available commands.' }
  ],
  setConsoleOpen: (open) => set({ isConsoleOpen: open }),
  addConsoleLog: (type, text) => set((state) => ({ consoleLogs: [...state.consoleLogs, { type, text }] })),
  clearConsoleLogs: () => set({ consoleLogs: [] }),

  selectAlgorithm: (id: string) => {
    const algo = ALGORITHM_REGISTRY.find(a => a.id === id) || ALGORITHM_REGISTRY[0];
    set({ selectedAlgo: algo, currentStepIndex: 0, isPlaying: false });
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    get().generateSteps();
  },

  setSteps: (steps: Step[]) => set({ steps }),

  nextStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  resetPlayback: () => {
    set({ currentStepIndex: 0, isPlaying: false });
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
    
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    if (playing) {
      const run = () => {
        const { currentStepIndex, steps } = get();
        if (currentStepIndex < steps.length - 1) {
          get().nextStep();
        } else {
          set({ isPlaying: false });
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      };
      
      // Initial tick immediately
      run();
      
      timer = setInterval(() => {
        run();
      }, get().speed);
    }
  },

  setSpeed: (speed: number) => {
    set({ speed });
    const { isPlaying } = get();
    if (isPlaying) {
      // Re-trigger interval with new speed
      get().setIsPlaying(false);
      setTimeout(() => get().setIsPlaying(true), 50);
    }
  },

  setStepIndex: (index: number) => {
    const { steps } = get();
    const bounded = Math.max(0, Math.min(index, steps.length - 1));
    set({ currentStepIndex: bounded });
  },

  setInputArray: (arr: number[]) => {
    set({ inputArray: arr, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  setGraphData: (data: typeof DEFAULT_GRAPH) => {
    set({ graphData: data, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  setGraphStartNode: (node: string) => {
    set({ graphStartNode: node, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  setTreeValues: (vals: number[]) => {
    set({ treeValues: vals, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  setDpStrings: (s1: string, s2: string) => {
    set({ dpString1: s1, dpString2: s2, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  setRecursionN: (n: number) => {
    set({ recursionN: n, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  generateSteps: () => {
    const state = get();
    const algo = state.selectedAlgo;
    if (!algo) return;

    let generated: Step[] = [];

    switch (algo.id) {
      // Searching
      case 'linear-search':
        generated = generateLinearSearchSteps(state.inputArray, state.recursionN);
        break;
      case 'binary-search':
        generated = generateBinarySearchSteps(state.inputArray, state.recursionN);
        break;
      case 'ternary-search':
        generated = generateTernarySearchSteps(state.inputArray, state.recursionN);
        break;
      case 'jump-search':
        generated = generateJumpSearchSteps(state.inputArray, state.recursionN);
        break;
      case 'exponential-search':
        generated = generateExponentialSearchSteps(state.inputArray, state.recursionN);
        break;
      case 'interpolation-search':
        generated = generateInterpolationSearchSteps(state.inputArray, state.recursionN);
        break;
      case 'fibonacci-search':
        generated = generateFibonacciSearchSteps(state.inputArray, state.recursionN);
        break;

      // Sorting
      case 'bubble-sort':
        generated = generateBubbleSortSteps(state.inputArray);
        break;
      case 'selection-sort':
        generated = generateSelectionSortSteps(state.inputArray);
        break;
      case 'insertion-sort':
        generated = generateInsertionSortSteps(state.inputArray);
        break;
      case 'merge-sort':
        generated = generateMergeSortSteps(state.inputArray);
        break;
      case 'quick-sort':
        generated = generateQuickSortSteps(state.inputArray);
        break;
      case 'heap-sort':
        generated = generateHeapSortSteps(state.inputArray);
        break;
      case 'pigeonhole-sort':
        generated = generatePigeonholeSortSteps(state.inputArray);
        break;

      // Data Structures
      case 'stack-ops':
        generated = generateStackSteps(state.inputArray);
        break;
      case 'queue-ops':
        generated = generateQueueSteps(state.inputArray);
        break;
      case 'singly-linked-list':
        generated = generateLinkedListSteps(state.inputArray);
        break;
        
      // Graph
      case 'bfs':
        generated = generateBFSSteps(state.graphData, state.graphStartNode);
        break;
      case 'dfs':
        generated = generateDFSSteps(state.graphData, state.graphStartNode);
        break;
      case 'dijkstra':
        generated = generateDijkstraSteps(state.graphData, state.graphStartNode);
        break;
      case 'a-star':
        generated = generateAStarSteps(state.graphData, state.graphStartNode, 'F');
        break;
      case 'prim':
        generated = generatePrimSteps(state.graphData, state.graphStartNode);
        break;
      case 'kruskal':
        generated = generateKruskalSteps(state.graphData);
        break;

      // Tree
      case 'bst':
        // Generate steps by performing insertions sequentially, then doing inorder traversal
        let currentRoot: any = null;
        let insertStepsList: Step[] = [];
        
        // Build the BST tree step by step
        for (const val of state.treeValues) {
          const insertRes = generateBSTInsertSteps(currentRoot, val);
          currentRoot = insertRes.newRoot;
          insertStepsList = [...insertStepsList, ...insertRes.steps];
        }
        
        // Add BST default inorder traversal to show after initial build
        const traversalSteps = generateTraversalSteps(currentRoot, 'inorder');
        generated = [...insertStepsList, ...traversalSteps];
        break;
      case 'avl-tree':
        generated = generateAVLSteps(state.treeValues);
        break;

      // DP
      case 'fibonacci-dp':
        generated = generateFibonacciDPSteps(state.recursionN);
        break;
      case 'lcs':
        generated = generateLCSSteps(state.dpString1, state.dpString2);
        break;
      case 'edit-distance':
        generated = generateEditDistanceSteps(state.dpString1, state.dpString2);
        break;
      case 'knapsack-dp':
        generated = generateKnapsackSteps([1, 2, 3], [15, 20, 30], 5);
        break;
      case 'coin-change-dp':
        generated = generateCoinChangeSteps(state.recursionN);
        break;

      // Recursion
      case 'factorial':
        generated = generateFactorialSteps(state.recursionN);
        break;
      case 'tower-of-hanoi':
        generated = generateHanoiSteps(Math.min(state.recursionN, 6)); // Bounded at 6 max for visual sanity
        break;
      case 'fibonacci-recursive':
        generated = generateFibonacciRecursiveSteps(state.recursionN);
        break;
      case 'sum-of-n-recursive':
        generated = generateSumOfNRecursiveSteps(state.recursionN);
        break;
      case 'power-function-recursive':
        generated = generatePowerFunctionRecursiveSteps(state.recursionN);
        break;

      // Backtracking
      case 'n-queens':
        generated = generateNQueensSteps(Math.min(state.recursionN, 8)); // Bounded at 8 max for board visual sanity
        break;
      case 'sudoku-solver':
        generated = generateSudokuSolverSteps();
        break;
      case 'rat-in-a-maze':
        generated = generateRatInAMazeSteps();
        break;

      // 18 new interactive concept algorithms
      case 'postfix-eval':
        generated = generatePostfixEvalSteps(state.dpString1);
        break;
      case 'prefix-eval':
        generated = generatePrefixEvalSteps(state.dpString1);
        break;
      case 'double-ended-queue':
        generated = generateDequeSteps(state.inputArray);
        break;
      case 'circular-queue':
        generated = generateCircularQueueSteps(state.inputArray);
        break;
      case 'priority-queue':
        generated = generatePriorityQueueSteps(state.inputArray);
        break;
      case 'doubly-linked-list':
        generated = generateDoublyLinkedListSteps(state.inputArray);
        break;
      case 'circular-linked-list':
        generated = generateCircularLinkedListSteps(state.inputArray);
        break;
      case 'lca-tree':
        generated = generateLCATreeSteps(state.treeValues);
        break;
      case 'tree-diameter':
        generated = generateTreeDiameterSteps(state.treeValues);
        break;
      case 'tree-isomorphism':
        generated = generateTreeIsomorphismSteps(state.treeValues);
        break;
      case 'tree-serialize':
        generated = generateTreeSerializeSteps(state.treeValues);
        break;
      case 'syntax-tree':
        generated = generateSyntaxTreeSteps();
        break;
      case 'red-black-tree':
        generated = generateRedBlackTreeSteps(state.treeValues);
        break;
      case 'b-tree':
        generated = generateBTreeSteps(state.treeValues);
        break;
      case 'adjacency-matrix':
        generated = generateAdjacencyMatrixSteps(state.graphData);
        break;
      case 'adjacency-list':
        generated = generateAdjacencyListSteps(state.graphData);
        break;
      case 'topological-sort':
        generated = generateTopologicalSortSteps(state.graphData);
        break;
      case 'fenwick-tree':
        generated = generateFenwickTreeSteps(state.inputArray);
        break;

      default:
        // Generic Fallback Interactive Visualizer based on Category
        const name = algo.name;
        const category = algo.category;

        // 1. Array-based structures (Sorting / Searching / Hashing / Greedy / Bit Manipulation / Randomized / Strings / Segment Trees)
        if (
          category === 'searching' ||
          category === 'sorting' ||
          category === 'segmenttrees' ||
          category === 'hashing' ||
          category === 'greedy' ||
          category === 'bitmanipulation' ||
          category === 'randomized' ||
          category === 'strings'
        ) {
          const arr = [...state.inputArray];
          const n = arr.length;
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize ${name} on input array: [${arr.join(', ')}].`,
              codeLine: 1,
              payload: { array: arr, comparing: [], swapping: [], sorted: [] } as SortingPayload
            },
            {
              id: 1,
              action: 'compare',
              description: `${name} scanning: Comparing element at index 0 (${arr[0]}) and index 1 (${arr[1]}).`,
              codeLine: 2,
              payload: { array: arr, comparing: [0, 1], swapping: [], sorted: [] } as SortingPayload
            },
            {
              id: 2,
              action: 'swap',
              description: `${name} operation: Swapping/updating indices based on algorithmic conditions.`,
              codeLine: 3,
              payload: { array: arr, comparing: [], swapping: [0, 1], sorted: [] } as SortingPayload
            },
            {
              id: 3,
              action: 'progress',
              description: `${name} processing: Partitioning search bounds or index groupings.`,
              codeLine: 4,
              payload: { array: arr, comparing: [2, 3], swapping: [], sorted: [0] } as SortingPayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} execution complete. Final elements arranged.`,
              codeLine: 5,
              payload: { array: [...arr].sort((a,b) => a-b), comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i) } as SortingPayload
            }
          ];
        }
        // 2. Linear structures (Stack / Queue-Deque / Linked List)
        else if (category === 'stack' || category === 'queue-deque' || category === 'linkedlist') {
          const type = category === 'stack' ? 'stack' : category === 'queue-deque' ? 'queue' : 'linked-list';
          const arr = [...state.inputArray];
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize ${name} structure with elements: [${arr.join(', ')}].`,
              codeLine: 1,
              payload: { type, elements: arr, activeIndex: undefined, actionType: 'traverse' } as DataStructurePayload
            },
            {
              id: 1,
              action: 'traverse',
              description: `Traversing ${name} nodes. Inspecting item at head/front pointer (value: ${arr[0]}).`,
              codeLine: 2,
              payload: { type, elements: arr, activeIndex: 0, actionType: 'traverse' } as DataStructurePayload
            },
            {
              id: 2,
              action: 'peek',
              description: `Examine value at active position index 2 (value: ${arr[2]}).`,
              codeLine: 3,
              payload: { type, elements: arr, activeIndex: 2, actionType: 'peek' } as DataStructurePayload
            },
            {
              id: 3,
              action: 'push_pop',
              description: `Executing structural modification (insert/delete/push/pop) matching ${name} constraints.`,
              codeLine: 4,
              payload: { type, elements: arr.slice(1), activeIndex: undefined, actionType: 'pop' } as DataStructurePayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} datastructure operations completed successfully.`,
              codeLine: 5,
              payload: { type, elements: arr.slice(1), activeIndex: undefined, actionType: 'traverse' } as DataStructurePayload
            }
          ];
        }
        // 3. Graph structures (Graph Traversal / Shortest Path / MST / Topological / Connectivity / Cycle Detection / Network Flow / Advanced Graph / Geometry)
        else if (
          category === 'graphtraversal' ||
          category === 'shortestpath' ||
          category === 'mst' ||
          category === 'topological' ||
          category === 'connectivity' ||
          category === 'cycledetection' ||
          category === 'networkflow' ||
          category === 'advancedgraph' ||
          category === 'geometry'
        ) {
          const graph = state.graphData;
          const nodes = graph.nodes.map(n => n.id);
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize ${name} graph structure. Starting search at source node ${nodes[0]}.`,
              codeLine: 1,
              payload: { graph, visited: [], current: undefined } as GraphPayload
            },
            {
              id: 1,
              action: 'visit',
              description: `Visiting source node ${nodes[0]}. Discovering adjacent neighbors.`,
              codeLine: 2,
              payload: { graph, visited: [nodes[0]], current: nodes[0], queue: [nodes[0]] } as GraphPayload
            },
            {
              id: 2,
              action: 'traverse',
              description: `Traverse edge. Moving from node ${nodes[0]} to node ${nodes[1]}. Neighbors queued.`,
              codeLine: 3,
              payload: { graph, visited: [nodes[0], nodes[1]], current: nodes[1], queue: [nodes[1], nodes[2]] } as GraphPayload
            },
            {
              id: 3,
              action: 'update',
              description: `Evaluating edge weights. Updating shortest distance or connectivity lists.`,
              codeLine: 4,
              payload: { graph, visited: [nodes[0], nodes[1], nodes[2]], current: nodes[2], queue: [nodes[2]], path: [nodes[0], nodes[1]] } as GraphPayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} graph simulation finished. Path routes and component boundaries established.`,
              codeLine: 5,
              payload: { graph, visited: nodes, current: undefined, path: [nodes[0], nodes[1], nodes[3], nodes[5]] } as GraphPayload
            }
          ];
        }
        // 4. Tree structures (BST / Balanced Trees / Binary Trees)
        else if (category === 'bst' || category === 'balancedtrees' || category === 'binarytrees') {
          // Simple tree generator helper
          const buildSimpleTree = (): TreeNode => {
            return {
              id: 'node_40',
              value: 40,
              left: {
                id: 'node_20',
                value: 20,
                left: { id: 'node_10', value: 10, left: null, right: null, parent: 'node_20' },
                right: { id: 'node_30', value: 30, left: null, right: null, parent: 'node_20' },
                parent: 'node_40'
              },
              right: {
                id: 'node_60',
                value: 60,
                left: { id: 'node_50', value: 50, left: null, right: null, parent: 'node_60' },
                right: { id: 'node_70', value: 70, left: null, right: null, parent: 'node_60' },
                parent: 'node_40'
              },
              parent: null
            };
          };
          const root = buildSimpleTree();
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize binary tree visualization for ${name}. Root value is 40.`,
              codeLine: 1,
              payload: { root, current: null, visited: [] } as TreePayload
            },
            {
              id: 1,
              action: 'traverse',
              description: `Inspecting root node (value: 40). Comparing target search value.`,
              codeLine: 2,
              payload: { root, current: 'node_40', visited: [] } as TreePayload
            },
            {
              id: 2,
              action: 'traverse_left',
              description: `Traversing left subtree branch. Visited node (value: 20).`,
              codeLine: 3,
              payload: { root, current: 'node_20', visited: ['node_40'] } as TreePayload
            },
            {
              id: 3,
              action: 'traverse_right',
              description: `Checking child nodes. Restoring balance factors or extracting BST ranges.`,
              codeLine: 4,
              payload: { root, current: 'node_30', visited: ['node_40', 'node_20'] } as TreePayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} tree operation completed. Final structure balance validated.`,
              codeLine: 5,
              payload: { root, current: null, visited: ['node_40', 'node_20', 'node_30', 'node_10'] } as TreePayload
            }
          ];
        }
        // 5. Grid/DP structures (DP / Matrix / ML)
        else if (category === 'dp' || category === 'matrix' || category === 'ml') {
          const createEmptyTable = (r: number, c: number) => {
            return Array.from({ length: r }, () => Array(c).fill(0));
          };
          const rows = ['i=0', 'i=1', 'i=2', 'i=3', 'i=4'];
          const cols = ['j=0', 'j=1', 'j=2', 'j=3', 'j=4'];
          const table0 = createEmptyTable(5, 5);
          
          const table1 = createEmptyTable(5, 5);
          table1[0] = [1, 1, 1, 1, 1];
          table1[1][0] = 1;
          
          const table2 = createEmptyTable(5, 5);
          table2[0] = [1, 1, 1, 1, 1];
          table2[1] = [1, 2, 3, 4, 5];
          
          const table3 = createEmptyTable(5, 5);
          table3[0] = [1, 1, 1, 1, 1];
          table3[1] = [1, 2, 3, 4, 5];
          table3[2] = [1, 3, 6, 10, 15];
          table3[3] = [1, 4, 10, 20, 35];
          
          const table4 = createEmptyTable(5, 5);
          table4[0] = [1, 1, 1, 1, 1];
          table4[1] = [1, 2, 3, 4, 5];
          table4[2] = [1, 3, 6, 10, 15];
          table4[3] = [1, 4, 10, 20, 35];
          table4[4] = [1, 5, 15, 35, 70];

          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize Dynamic Programming / Matrix grid for ${name}. Allocating memory lookup table.`,
              codeLine: 1,
              payload: { table: table0, rows, cols, activeCell: undefined } as DPPayload
            },
            {
              id: 1,
              action: 'fill_base',
              description: `Fill base cases: row 0 and column 0 are initialized to 1.`,
              codeLine: 2,
              payload: { table: table1, rows, cols, activeCell: [0, 0] } as DPPayload
            },
            {
              id: 2,
              action: 'calculate_cell',
              description: `Computing cell values using transition equation: DP[i][j] = DP[i-1][j] + DP[i][j-1].`,
              codeLine: 3,
              payload: { table: table2, rows, cols, activeCell: [1, 1], dependsOn: [[0, 1], [1, 0]] } as DPPayload
            },
            {
              id: 3,
              action: 'propagate',
              description: `Propagating evaluations recursively. Updating weights or parsing subproblems.`,
              codeLine: 4,
              payload: { table: table3, rows, cols, activeCell: [3, 3], dependsOn: [[2, 3], [3, 2]] } as DPPayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} transition completed. Optimal return value is located at DP[4][4] (value: 70).`,
              codeLine: 5,
              payload: { table: table4, rows, cols, activeCell: undefined, result: 70 } as DPPayload
            }
          ];
        }
        // 6. Recursion / Math structures (Recursion / Number Theory / Parallel / Divide and Conquer)
        else if (category === 'recursion' || category === 'numbertheory' || category === 'parallel' || category === 'divideandconquer') {
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Invoke recursive call stack for ${name}(n = 3).`,
              codeLine: 1,
              payload: {
                callStack: [{ id: 'frame_1', funcName: name, args: { n: 3 } }],
                currentFrameId: 'frame_1'
              } as RecursionPayload
            },
            {
              id: 1,
              action: 'recurse',
              description: `Recursive branch: call ${name}(n = 2). Current stack depth is 2.`,
              codeLine: 2,
              payload: {
                callStack: [
                  { id: 'frame_1', funcName: name, args: { n: 3 } },
                  { id: 'frame_2', funcName: name, args: { n: 2 } }
                ],
                currentFrameId: 'frame_2'
              } as RecursionPayload
            },
            {
              id: 2,
              action: 'recurse_base',
              description: `Base case reached: call ${name}(n = 1). Resolving return value to 1.`,
              codeLine: 3,
              payload: {
                callStack: [
                  { id: 'frame_1', funcName: name, args: { n: 3 } },
                  { id: 'frame_2', funcName: name, args: { n: 2 } },
                  { id: 'frame_3', funcName: name, args: { n: 1 } }
                ],
                currentFrameId: 'frame_3'
              } as RecursionPayload
            },
            {
              id: 3,
              action: 'return',
              description: `Unwinding recursion call stack: returning computed results up the frame tree.`,
              codeLine: 4,
              payload: {
                callStack: [
                  { id: 'frame_1', funcName: name, args: { n: 3 } },
                  { id: 'frame_2', funcName: name, args: { n: 2 }, isReturning: true, returnValue: 2 }
                ],
                currentFrameId: 'frame_2'
              } as RecursionPayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} recursion unwound. Final optimization result calculated.`,
              codeLine: 5,
              payload: {
                callStack: [],
                result: 6
              } as RecursionPayload
            }
          ];
        }
        // 7. Backtracking / Grid Boards (Backtracking)
        else if (category === 'backtracking') {
          const createEmptyGrid = (size: number) => {
            return Array.from({ length: size }, () => Array(size).fill(0));
          };
          const grid0 = createEmptyGrid(4);
          
          const grid1 = createEmptyGrid(4);
          grid1[0][0] = 1;
          
          const grid2 = createEmptyGrid(4);
          grid2[0][0] = 1;
          grid2[1][0] = 2;
          
          const grid3 = createEmptyGrid(4);
          grid3[0][0] = 1;
          grid3[1][2] = 1;
          
          const grid4 = createEmptyGrid(4);
          grid4[0][1] = 1;
          grid4[1][3] = 1;
          grid4[2][0] = 1;
          grid4[3][2] = 1;

          generated = [
            {
              id: 0,
              action: 'init',
              description: `Initialize backtracking chessboard/grid for ${name}. Scanning valid cells.`,
              codeLine: 1,
              payload: { grid: grid0, currentQueens: [] } as BacktrackingPayload
            },
            {
              id: 1,
              action: 'place',
              description: `Placing item at index [0, 0]. Moving to next row boundary.`,
              codeLine: 2,
              payload: { grid: grid1, row: 1, col: 0, currentQueens: [[0, 0]] } as BacktrackingPayload
            },
            {
              id: 2,
              action: 'conflict',
              description: `Position [1, 0] has a constraint conflict! Backtracking to explore alternatives.`,
              codeLine: 3,
              payload: { grid: grid2, row: 1, col: 0, currentQueens: [[0, 0]] } as BacktrackingPayload
            },
            {
              id: 3,
              action: 'resolve',
              description: `Placing item at alternative cell position [1, 2]. Path is clear.`,
              codeLine: 4,
              payload: { grid: grid3, row: 1, col: 2, currentQueens: [[0, 0], [1, 2]] } as BacktrackingPayload
            },
            {
              id: 4,
              action: 'done',
              description: `${name} backtracking completed. Target search configuration found!`,
              codeLine: 5,
              payload: { grid: grid4, currentQueens: [[0, 1], [1, 3], [2, 0], [3, 2]] } as BacktrackingPayload
            }
          ];
        }
        // Fallback default
        else {
          generated = [
            {
              id: 0,
              action: 'init',
              description: `Interactive visualization of ${name} is initialized.`,
              codeLine: 1,
              payload: { array: state.inputArray, comparing: [], swapping: [] }
            }
          ];
        }
        break;
    }

    set({ steps: generated, currentStepIndex: 0 });
  }
}));
