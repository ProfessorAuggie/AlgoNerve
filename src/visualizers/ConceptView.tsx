import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { BookOpen, HelpCircle, Layers, Settings, Award } from 'lucide-react';

interface ConceptData {
  title: string;
  categoryName: string;
  properties: string[];
  applications: string[];
  explanation: string;
  operations: { name: string; complexity: string; desc: string }[];
}

const CONCEPT_DATABASE: Record<string, ConceptData> = {
  'postfix-eval': {
    title: 'Postfix Notation Evaluation',
    categoryName: 'Data Structures (Stack)',
    properties: [
      'Also known as Reverse Polish Notation (RPN).',
      'Operators follow their operands (e.g., 3 4 + instead of 3 + 4).',
      'Eliminates the need for operator precedence rules and parentheses.',
    ],
    applications: [
      'Calculators (e.g., HP calculators) use RPN for efficient expression parsing.',
      'Compiler design for evaluating parsed mathematical expressions.',
      'Virtual machine expression evaluation stacks.',
    ],
    explanation:
      'We scan the expression from left to right. When an operand is encountered, it is pushed onto the stack. When an operator is encountered, the top two operands are popped from the stack, the operator is applied to them, and the result is pushed back onto the stack.',
    operations: [
      { name: 'Scan Operand', complexity: 'O(1)', desc: 'Push the operand onto the evaluation stack.' },
      { name: 'Scan Operator', complexity: 'O(1) amortized', desc: 'Pop two items, apply operator, and push result.' },
      { name: 'Final Result', complexity: 'O(1)', desc: 'Pop the final value left in the stack.' },
    ],
  },
  'prefix-eval': {
    title: 'Prefix Notation Evaluation',
    categoryName: 'Data Structures (Stack)',
    properties: [
      'Also known as Polish Notation.',
      'Operators precede their operands (e.g., + 3 4 instead of 3 + 4).',
      'Evaluated from right to left using a Stack.',
    ],
    applications: [
      'LISP and other prefix-based functional languages use this syntax directly.',
      'Expression parsing in syntax parsing engines.',
    ],
    explanation:
      'We scan the expression from right to left. When an operand is encountered, it is pushed onto the stack. When an operator is encountered, the top two operands are popped from the stack (the first pop as left operand, second as right), the operator is applied, and the result is pushed back.',
    operations: [
      { name: 'Right-to-Left Scan', complexity: 'O(n)', desc: 'Scan tokens from right to left.' },
      { name: 'Process Operator', complexity: 'O(1)', desc: 'Pop operands, execute operation, push result back.' },
    ],
  },
  'double-ended-queue': {
    title: 'Double-Ended Queue (Deque)',
    categoryName: 'Data Structures (Queue)',
    properties: [
      'Allows insertion and deletion at both front and rear ends.',
      'Combines properties of both Stacks and Queues.',
      'Can be implemented using circular array or doubly linked list.',
    ],
    applications: [
      'Undo/Redo history buffers (adds to rear, deletes from rear/front).',
      'A-Steal scheduling algorithms in multi-threaded runtimes.',
      'Web browser history list back/forward navigation.',
    ],
    explanation:
      'A Deque supports pushFront, pushBack, popFront, and popBack. It is highly versatile. A Restricted Deque might disallow insertion at one end (input-restricted) or deletion at one end (output-restricted).',
    operations: [
      { name: 'Insert Front/Back', complexity: 'O(1)', desc: 'Add item to the front or back boundary.' },
      { name: 'Delete Front/Back', complexity: 'O(1)', desc: 'Remove item from the front or back boundary.' },
    ],
  },
  'circular-queue': {
    title: 'Circular Queue (Ring Buffer)',
    categoryName: 'Data Structures (Queue)',
    properties: [
      'Avoids index wastage in linear array implementation.',
      'The last element connects back to the first element.',
      'Maintains Front and Rear pointers with modulo arithmetic.',
    ],
    applications: [
      'Traffic light controllers running in circular cycles.',
      'Audio buffers and multimedia streaming systems.',
      'CPU task scheduling in round-robin fashion.',
    ],
    explanation:
      'In a linear queue, when elements are dequeued, empty spots at the front cannot be reused without shifting. A Circular Queue wraps around (index = (index + 1) % size), solving index wastage completely.',
    operations: [
      { name: 'Enqueue', complexity: 'O(1)', desc: 'Insert element at (rear + 1) % size if queue is not full.' },
      { name: 'Dequeue', complexity: 'O(1)', desc: 'Remove element at front, and increment front = (front + 1) % size.' },
    ],
  },
  'priority-queue': {
    title: 'Priority Queue',
    categoryName: 'Data Structures (Queue)',
    properties: [
      'Elements are associated with priorities.',
      'Highest priority elements are dequeued first.',
      'Usually implemented using a Binary Heap for optimal efficiency.',
    ],
    applications: [
      'Dijkstra Shortest Path algorithm (extracts minimum distance node).',
      'Huffman Coding tree construction.',
      'Bandwidth management and router packet scheduling.',
    ],
    explanation:
      'Unlike a standard FIFO queue, a Priority Queue sorts elements. If two elements have the same priority, they are served according to their ordering in the queue.',
    operations: [
      { name: 'Insert Element', complexity: 'O(log n)', desc: 'Add element to heap and heapify up.' },
      { name: 'Extract Max/Min', complexity: 'O(log n)', desc: 'Remove root element, replace with last element, and heapify down.' },
      { name: 'Peek Max/Min', complexity: 'O(1)', desc: 'Return the root element without removing it.' },
    ],
  },
  'doubly-linked-list': {
    title: 'Doubly Linked List (DLL)',
    categoryName: 'Data Structures (Linked List)',
    properties: [
      'Each node contains a prev pointer, a next pointer, and data.',
      'Allows bidirectional traversal (forward and backward).',
      'Provides O(1) node deletion if node reference is known.',
    ],
    applications: [
      'LRU Cache implementation (along with Hash Map).',
      'Text editors (line buffers, navigating cursor back and forth).',
      'Undo/redo list navigation.',
    ],
    explanation:
      'DLL takes slightly more memory than Singly Linked List due to the extra `prev` pointer. However, it simplifies deletions, node insertions before a node, and reverse list traversals.',
    operations: [
      { name: 'Insert Head/Tail', complexity: 'O(1)', desc: 'Create node and adjust pointers at boundaries.' },
      { name: 'Delete Node', complexity: 'O(1)', desc: 'Bypass node by updating node.prev.next and node.next.prev.' },
    ],
  },
  'circular-linked-list': {
    title: 'Circular Linked List',
    categoryName: 'Data Structures (Linked List)',
    properties: [
      'The tail node next pointer references the head node.',
      'No node points to null (no terminal boundary).',
      'Can be singly circular or doubly circular.',
    ],
    applications: [
      'Multiplayer game turns (turns loop endlessly from player to player).',
      'Buffer pools in media players running continuous looping playlists.',
      'Time-sharing operating systems scheduler cycles.',
    ],
    explanation:
      'Because the list forms a ring, any node can act as a starting point. Traversal loop termination must check if the current pointer wraps back to the head node.',
    operations: [
      { name: 'Traversal', complexity: 'O(n)', desc: 'Scan elements until pointer returns to start node.' },
      { name: 'Insert Tail', complexity: 'O(1) or O(n)', desc: 'Insert node and set tail.next = head.' },
    ],
  },
  'topological-sort': {
    title: 'Topological Sort',
    categoryName: 'Graph Algorithms',
    properties: [
      'Applies to Directed Acyclic Graphs (DAGs) only.',
      'A linear ordering of vertices representing dependencies.',
      'Can be computed using DFS (Kahn\'s Algorithm uses BFS/Indegrees).',
    ],
    applications: [
      'Task scheduling and build systems (e.g., resolving file build order).',
      'Package management dependency resolution (e.g., npm, pip).',
      'Instruction scheduling in compilers.',
    ],
    explanation:
      'For every directed edge u → v, vertex u must appear before vertex v in the ordering. If the graph contains a cycle, a topological sort is impossible.',
    operations: [
      { name: 'Kahn\'s Algorithm', complexity: 'O(V + E)', desc: 'BFS starting from vertices with indegree = 0.' },
      { name: 'DFS-based Sort', complexity: 'O(V + E)', desc: 'Run DFS, push vertices onto a stack after exploring all neighbors, then pop stack.' },
    ],
  },
  'adjacency-matrix': {
    title: 'Adjacency Matrix',
    categoryName: 'Graph Representations',
    properties: [
      'A 2D array of size V × V.',
      'Cell values indicate weight (or 1/0 for presence/absence of edge).',
      'Symmetric matrix for undirected graphs.',
    ],
    applications: [
      'Dense graphs where number of edges is close to V².',
      'Fast edge weight queries (O(1) time complexity).',
      'Transition matrices in Markov chains.',
    ],
    explanation:
      'Representing a graph with V vertices. If an edge exists between vertex i and vertex j, matrix[i][j] is set. While indexing is O(1), iterating over node neighbors takes O(V) time.',
    operations: [
      { name: 'Query Edge', complexity: 'O(1)', desc: 'Check matrix[i][j] status.' },
      { name: 'Space Required', complexity: 'O(V²)', desc: 'Memory allocated is quadratic to vertices count.' },
    ],
  },
  'adjacency-list': {
    title: 'Adjacency List',
    categoryName: 'Graph Representations',
    properties: [
      'An array of lists of size V.',
      'Each list item represents a neighbor node.',
      'Extremely memory efficient for sparse graphs (E << V²).',
    ],
    applications: [
      'Sparse graphs (most real-world network, social networks).',
      'Graph traversals (BFS/DFS) since neighbors are directly accessible.',
    ],
    explanation:
      'Vertices are indexed. Each index points to a linked list, array, or vector containing the neighboring nodes. Iterating over all adjacent nodes takes time proportional to the degree of the vertex.',
    operations: [
      { name: 'Query Edge', complexity: 'O(deg(V))', desc: 'Scan neighbor list of vertex V.' },
      { name: 'Space Required', complexity: 'O(V + E)', desc: 'Linear memory matching structural sizes.' },
    ],
  },
  'red-black-tree': {
    title: 'Red-Black Tree',
    categoryName: 'Tree Data Structures',
    properties: [
      'A self-balancing binary search tree.',
      'Nodes are colored Red or Black.',
      'Root and leaves (NIL) are black; red nodes cannot have red children.',
      'Simple path from node to descendant leaves contains same black-height.',
    ],
    applications: [
      'Java HashMap (resolves collision lists exceeding threshold).',
      'C++ STL containers (map, set, multimap, multiset).',
      'Process scheduler queue in Linux kernel (Completely Fair Scheduler).',
    ],
    explanation:
      'Ensures height is always logarithmic (h <= 2 log(n + 1)). Rotations and color recolor operations occur during insertions and deletions to restore Red-Black properties.',
    operations: [
      { name: 'Search / Find', complexity: 'O(log n)', desc: 'Standard BST search.' },
      { name: 'Insert Node', complexity: 'O(log n)', desc: 'BST insertion followed by color flips and rotations.' },
      { name: 'Delete Node', complexity: 'O(log n)', desc: 'BST deletion followed by balancing operations.' },
    ],
  },
  'b-tree': {
    title: 'B-Tree',
    categoryName: 'Tree Data Structures',
    properties: [
      'Self-balancing search tree where nodes can have more than two children.',
      'Keys are sorted within nodes.',
      'Optimized for systems reading large blocks of data.',
    ],
    applications: [
      'Relational Databases index files (e.g., MySQL InnoDB, PostgreSQL).',
      'File systems (e.g., NTFS, HFS+, ext4 directory indexes).',
    ],
    explanation:
      'B-Trees are shallow and broad. Instead of binary paths, nodes hold up to M children, reducing storage page-reads (I/O operations) significantly in disk systems.',
    operations: [
      { name: 'Search Key', complexity: 'O(log n)', desc: 'Binary search inside nodes, tree traversal down.' },
      { name: 'Insert Key', complexity: 'O(log n)', desc: 'Insert into node, split node if keys exceed size.' },
    ],
  },
  'trie-tree': {
    title: 'Trie (Prefix Tree)',
    categoryName: 'Tree Data Structures',
    properties: [
      'An ordered tree storing keys associated with strings.',
      'All descendants of a node share a common prefix.',
      'Keys are not stored in nodes, but by the path taken.',
    ],
    applications: [
      'Search engine autocomplete suggestion bars.',
      'IP routing prefix lookups in network routers.',
      'Spell checkers and dictionary validation.',
    ],
    explanation:
      'Each node contains a dictionary/array of alphabet size. Traversing from root spells out prefix sequences. Extensively used for word suggestions and dictionary matching.',
    operations: [
      { name: 'Insert Word', complexity: 'O(L)', desc: 'Insert string of length L into character paths.' },
      { name: 'Search Prefix', complexity: 'O(L)', desc: 'Query paths matching prefix string.' },
    ],
  },
  'segment-tree': {
    title: 'Segment Tree',
    categoryName: 'Tree Data Structures',
    properties: [
      'Used to answer interval query ranges (e.g., sum, min, max, gcd).',
      'Leaves store actual array elements; nodes store computed range values.',
      'Static structure built in O(n) time.',
    ],
    applications: [
      'Dynamic range queries over mutable arrays.',
      'Computational geometry range searches.',
    ],
    explanation:
      'Segments represent subsets of array indices. Range query runs by combining overlapping node ranges, avoiding linear scans.',
    operations: [
      { name: 'Build Tree', complexity: 'O(n)', desc: 'Construct recursively from array.' },
      { name: 'Range Query', complexity: 'O(log n)', desc: 'Query interval values.' },
      { name: 'Point Update', complexity: 'O(log n)', desc: 'Modify value and updates parents.' },
    ],
  },
  'fenwick-tree': {
    title: 'Fenwick Tree (Binary Indexed Tree - BIT)',
    categoryName: 'Tree Data Structures',
    properties: [
      'Calculates prefix sums in logarithmic time.',
      'Extremely memory efficient (represented as an array of size N + 1).',
      'Requires bit manipulation (least significant bit operations).',
    ],
    applications: [
      'Cumulative frequency counts.',
      'Grid coordinate range sum query algorithms.',
      'Inversion counts in arrays.',
    ],
    explanation:
      'Fenwick Trees are faster than Segment Trees and use less storage. It stores range sums where each index holds a sum of a segment whose length matches the index\'s powers of 2.',
    operations: [
      { name: 'Prefix Sum Query', complexity: 'O(log n)', desc: 'Fetch sum from index 1 to i by stripping set bits.' },
      { name: 'Point Add/Update', complexity: 'O(log n)', desc: 'Add value to index i, update dependent indices by adding lowest set bit.' },
    ],
  },
  'lca-tree': {
    title: 'Lowest Common Ancestor (LCA)',
    categoryName: 'Tree Algorithms',
    properties: [
      'LCA of nodes u and v is the deepest node that has both as descendants.',
      'Forms the foundation of path query problems in trees.',
      'Can be computed efficiently via Binary Lifting or RMQ.',
    ],
    applications: [
      'Path queries in hierarchical structures (organizational charts, directory paths).',
      'Phylogenetic evolutionary tree analysis.',
    ],
    explanation:
      'Finding LCA between u and v can be done in O(N) by traversing. With precomputation (Binary Lifting), LCA queries run in O(log N) time.',
    operations: [
      { name: 'Binary Lifting Query', complexity: 'O(log n)', desc: 'Query LCA by jumping nodes using powers-of-two tables.' },
      { name: 'Euler Tour + RMQ', complexity: 'O(1)', desc: 'Convert tree traversal to array, query range min.' },
    ],
  },
  'tree-diameter': {
    title: 'Tree Diameter (Width)',
    categoryName: 'Tree Algorithms',
    properties: [
      'Length of the longest path between any two leaf nodes in a tree.',
      'Computed using two sweeps of BFS/DFS or dynamic programming.',
    ],
    applications: [
      'Network layout designs to determine the maximum communication latency.',
      'Tree structure analysis.',
    ],
    explanation:
      'Can be found using two traversals: 1) Run DFS from an arbitrary node to find farthest node X. 2) Run DFS from X to find farthest node Y. The path between X and Y is the diameter.',
    operations: [
      { name: 'Two-Pass DFS/BFS', complexity: 'O(V + E)', desc: 'Run traversals from arbitrary and then farthest nodes.' },
      { name: 'DP-based Search', complexity: 'O(V)', desc: 'Compute max height of subtrees at each node.' },
    ],
  },
  'tree-isomorphism': {
    title: 'Tree Isomorphism',
    categoryName: 'Tree Algorithms',
    properties: [
      'Checks if two trees can be mapped to be structurally identical.',
      'Can be solved in linear time (AHU Algorithm).',
      'Utilizes node tree canonical hashing.',
    ],
    applications: [
      'Organic chemistry compound matching (checking structural identical formulas).',
      'Database schema hierarchical comparison.',
    ],
    explanation:
      'AHU represents subtree structures as canonical string names or hashes. Bottom-up sorting of node names produces a unique identifier. If identifiers match, the trees are isomorphic.',
    operations: [
      { name: 'AHU Tree Center Find', complexity: 'O(V)', desc: 'Find center nodes of trees.' },
      { name: 'Canonical Encoding', complexity: 'O(V log V)', desc: 'Compile tree names by sorting child strings.' },
    ],
  },
  'tree-serialize': {
    title: 'Tree Serialization & Deserialization',
    categoryName: 'Tree Algorithms',
    properties: [
      'Serialization: Convert tree to format (string, array) for saving/transmitting.',
      'Deserialization: Reconstruct original tree structure from serial format.',
      'Can use DFS (Pre-order/Post-order) or BFS (Level-order) strategies.',
    ],
    applications: [
      'IPC message passing or JSON API transfers.',
      'Storing folder hierarchies or DOM states on disk.',
    ],
    explanation:
      'We traversal-trace elements, representing null nodes with tags (e.g. "#", "null"). Deserialization parses the sequence recursively to rebuild parent-child links.',
    operations: [
      { name: 'Serialize DFS', complexity: 'O(n)', desc: 'Encode node list with marker tags.' },
      { name: 'Deserialize DFS', complexity: 'O(n)', desc: 'Rebuild tree node links parsing string stream.' },
    ],
  },
  'huffman-coding': {
    title: 'Huffman Coding',
    categoryName: 'Tree Applications & Greedy',
    properties: [
      'A lossless data compression algorithm.',
      'Generates variable-length prefix codes.',
      'Frequent characters are assigned shorter code representations.',
    ],
    applications: [
      'JPEG images compression algorithms.',
      'MP3 audio files compression routines.',
      'GZIP, PKZIP, and DEFLATE file compression pipelines.',
    ],
    explanation:
      'A frequency table is compiled. A priority queue merges the two lowest-frequency trees repeatedly to form a parent node. The final binary tree assigns 0 (left branch) and 1 (right branch) sequences to build character codes.',
    operations: [
      { name: 'Build Tree', complexity: 'O(n log n)', desc: 'Queue mergers of lowest frequency nodes.' },
      { name: 'Decompress Data', complexity: 'O(L)', desc: 'Traverse code branches from root.' },
    ],
  },
  'decision-tree': {
    title: 'Decision Tree',
    categoryName: 'Tree Applications & Machine Learning',
    properties: [
      'A classification and prediction model.',
      'Nodes represent conditions, branches represent splits, leaves represent labels.',
      'Splits are calculated using Information Gain or Gini Impurity.',
    ],
    applications: [
      'Classification systems (credit scoring, loan approvals).',
      'Diagnostic helper systems.',
      'Ensemble methods (Random Forest, Gradient Boosted Trees).',
    ],
    explanation:
      'Traversing from root down conditions checks inputs. In ML, tree construction recursively divides datasets to maximize group homogeneities.',
    operations: [
      { name: 'Inference traversal', complexity: 'O(depth)', desc: 'Follow decision conditions downwards.' },
    ],
  },
  'syntax-tree': {
    title: 'Abstract Syntax Tree (AST)',
    categoryName: 'Tree Applications & Compilers',
    properties: [
      'Represents hierarchical syntax rules of program source code.',
      'Omits structural noise (parentheses, semicolons, separators).',
      'Each node acts as an operand or operator in execution syntax.',
    ],
    applications: [
      'Compilers and parsers (generating assembly, byte-code).',
      'Linter checking systems (ESLint) and syntax highlighters.',
      'Code formatter scripts (Prettier).',
    ],
    explanation:
      'A Parser processes tokens output by a Lexer to build an AST. The AST is then walked by compiler phases to optimize, compile, or lint code.',
    operations: [
      { name: 'Parse Tree Construction', complexity: 'O(n)', desc: 'Analyze token structures.' },
      { name: 'AST Traversal Visitor', complexity: 'O(n)', desc: 'Walk trees to compile/optimize/validate node syntax.' },
    ],
  },
};

export const ConceptView: React.FC = () => {
  const { selectedAlgo } = useAlgorithmStore();
  if (!selectedAlgo) return null;

  const concept = CONCEPT_DATABASE[selectedAlgo.id];

  if (!concept) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
        <HelpCircle size={32} className="text-zinc-400 dark:text-zinc-650 animate-pulse mb-3" />
        <h2 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-2">{selectedAlgo.name}</h2>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 text-center max-w-sm">
          Interactive visualizer animation and concept cards for this algorithm are in active development.
          Explore the pseudocode and complexity metrics on the right panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-280px)] transition-colors duration-300 scrollbar-thin">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 dark:border-zinc-850 pb-4 mb-5">
        <span className="text-[10px] font-mono font-bold text-violet-650 dark:text-violet-400 uppercase tracking-widest">
          {concept.categoryName}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {concept.title}
        </h2>
      </div>

      {/* Core Explanation */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/40 dark:bg-violet-950/10 border border-violet-100/60 dark:border-violet-900/20 mb-6">
        <BookOpen size={16} className="text-violet-650 dark:text-violet-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <strong>How it works:</strong> {concept.explanation}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Key Properties */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Layers size={13} className="text-indigo-650 dark:text-indigo-400" />
            Key Properties
          </h3>
          <ul className="flex flex-col gap-2 pl-1.5">
            {concept.properties.map((prop, idx) => (
              <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed list-none flex items-start gap-2">
                <span className="text-indigo-500 font-bold shrink-0">•</span>
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real-world Applications */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Award size={13} className="text-emerald-650 dark:text-emerald-400" />
            Applications
          </h3>
          <ul className="flex flex-col gap-2 pl-1.5">
            {concept.applications.map((app, idx) => (
              <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed list-none flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Primary Operations & Complexity Table */}
      {concept.operations && concept.operations.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Settings size={13} className="text-violet-650 dark:text-violet-400" />
            Core Operations & Complexities
          </h3>
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-850 text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100/50 dark:bg-zinc-950/40">
                  <th className="px-4 py-2">Operation</th>
                  <th className="px-4 py-2 text-center">Complexity</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850 text-xs">
                {concept.operations.map((op, idx) => (
                  <tr key={idx} className="text-zinc-700 dark:text-zinc-350 hover:bg-zinc-100/20 dark:hover:bg-zinc-950/10">
                    <td className="px-4 py-2.5 font-bold font-mono text-zinc-805 dark:text-zinc-250">{op.name}</td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-violet-600 dark:text-violet-400">{op.complexity}</td>
                    <td className="px-4 py-2.5 text-zinc-550 dark:text-zinc-400 leading-normal">{op.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Footer hint */}
      <div className="mt-auto pt-6 text-[10px] font-mono text-zinc-400 text-center">
        Interactive animation in development • Inspect code and metrics on the right.
      </div>
    </div>
  );
};
