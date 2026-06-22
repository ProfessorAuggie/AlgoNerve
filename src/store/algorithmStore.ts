import { create } from 'zustand';
import type { Step, AlgorithmMeta } from '../algorithms/types';
import { ALGORITHM_REGISTRY } from '../algorithms/types';

import { generateBubbleSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps, generateHeapSortSteps, generateSelectionSortSteps, generatePigeonholeSortSteps } from '../algorithms/sorting';
import { generateLinearSearchSteps, generateBinarySearchSteps, generateTernarySearchSteps } from '../algorithms/searching';
import { generateStackSteps, generateQueueSteps, generateLinkedListSteps } from '../algorithms/datastructures';
import { generateBFSSteps, generateDFSSteps, generateDijkstraSteps, generateAStarSteps, generatePrimSteps, generateKruskalSteps } from '../algorithms/graph';
import { generateBSTInsertSteps, generateTraversalSteps, generateAVLSteps } from '../algorithms/tree';
import { generateFibonacciDPSteps, generateLCSSteps, generateEditDistanceSteps, generateKnapsackSteps, generateCoinChangeSteps } from '../algorithms/dp';
import { generateFactorialSteps, generateHanoiSteps } from '../algorithms/recursion';
import { generateNQueensSteps } from '../algorithms/backtracking';
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
import { CONCEPT_DATABASE, CATEGORY_LABELS } from '../algorithms/conceptDatabase';


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

      // Backtracking
      case 'n-queens':
        generated = generateNQueensSteps(Math.min(state.recursionN, 8)); // Bounded at 8 max for board visual sanity
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
        if (algo.mode === 'concept') {
          let concept = CONCEPT_DATABASE[algo.id];
          if (!concept) {
            const categoryName = CATEGORY_LABELS[algo.category] || algo.category;
            concept = {
              title: algo.name,
              categoryName,
              properties: [
                `Category: ${categoryName}`,
                `Best/Avg Time Complexity: ${algo.timeComplexity}`,
                `Auxiliary Space Complexity: ${algo.spaceComplexity}`,
                ...(algo.tags && algo.tags.length > 0 ? [`Keywords: ${algo.tags.join(', ')}`] : []),
              ],
              applications: [
                'Solving curriculum exercises, coding interviews, and competitive programming challenges.',
                'Optimizing system efficiency in real-world application pipelines.',
                'Learning structural operations of complex data structures and algorithmic designs.',
              ],
              explanation: algo.description || 'This algorithm is part of the CS curriculum study guide. Examine the details, complexity thresholds, and properties below.',
              operations: [
                { name: 'Time Complexity', complexity: algo.timeComplexity, desc: 'Calculated execution growth pattern relative to input size.' },
                { name: 'Space Complexity', complexity: algo.spaceComplexity, desc: 'Auxiliary memory overhead utilized during runtime execution.' },
              ],
            };
          }

          generated = [
            {
              id: 0,
              action: 'concept',
              description: `Overview of ${concept.title}: ${concept.explanation}`,
              codeLine: 1,
              payload: { stage: 'intro' },
            },
            {
              id: 1,
              action: 'concept',
              description: `Key Properties of ${concept.title}: ${concept.properties.join(' ')}`,
              codeLine: 2,
              payload: { stage: 'properties' },
            },
            {
              id: 2,
              action: 'concept',
              description: `Core Operations & Complexities: Time = ${algo.timeComplexity}, Space = ${algo.spaceComplexity}. Operations details are highlighted.`,
              codeLine: 3,
              payload: { stage: 'complexity' },
            },
            {
              id: 3,
              action: 'concept',
              description: `Applications of ${concept.title}: ${concept.applications.join(' ')}`,
              codeLine: 4,
              payload: { stage: 'applications' },
            },
            {
              id: 4,
              action: 'concept',
              description: `Completed conceptual walkthrough of ${concept.title}. Code execution paths and metrics can be analyzed.`,
              codeLine: 5,
              payload: { stage: 'summary' },
            },
          ];
        }
        break;
    }

    set({ steps: generated, currentStepIndex: 0 });
  }
}));
