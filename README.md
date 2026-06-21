# 🧠 AlgoNerve: Interactive Algorithm Visualizer

**AlgoNerve** is a premium, production-grade interactive algorithm visualization platform built using Vite, React, TypeScript, Zustand, Tailwind CSS, and D3.js. Instead of treating algorithms like abstract formulas, AlgoNerve animates their internal execution logic, stack frames, variables, dynamic programming tables, and graphs in real-time.

Designed for software engineers, students, and educators, it provides step-by-step state inspection to demystify complex problem-solving patterns.

---

## 🌟 Key Features

- **40+ Algorithms & Layout Engines**: Step-by-step interactive animations and premium concept views for Searching, Sorting, Data Structures, Graph Theory, Binary Search Trees, Dynamic Programming, and Recursion/Backtracking.
- **Interactive Control Board**: Play/pause simulation, adjust speed dynamically (from 0.5x delay to 4x fast-forward), and scrub directly through the execution timeline.
- **Live State Narration**: Trace panel updates with a narration feed that updates status variables accessibly.
- **Sync Pseudocode Panel**: Highlights the exact line of code currently executing in real-time.
- **Full Theme Toggle Support**: Harmonious Dark and Light themes using Tailwind CSS and HSL tailwinds.
- **Cross-Platform Responsive Design**: Fluidly optimized for iPhone, Android, Windows, Mac, and mobile browser desktop modes.
- **Keyboard Shortcuts**: Complete desktop navigation bindings.

---

## 🛠️ Technology Stack

- **Framework**: Vite + React (v18) + TypeScript
- **State Management**: Zustand (highly-performant, atomic store transitions)
- **Styling**: Tailwind CSS (v3) + PostCSS
- **Animations & SVGs**: Custom SVG rendering and D3 coordinate structures
- **Icons**: Lucide React

---

## 📚 Supported Algorithms Registry

### 1. Searching Algorithms
- **Linear Search** (Interactive): Scan elements one-by-one to find a matching target value.
- **Binary Search** (Interactive): Search a sorted range by repeatedly dividing the search range in half.

### 2. Sorting Algorithms
- **Bubble Sort** (Interactive): Pairwise comparisons and element swaps.
- **Selection Sort** (Interactive): Repeatedly select the minimum element and place at boundaries.
- **Insertion Sort** (Interactive): Shifting unsorted keys into correct sorted divisions.
- **Merge Sort** (Interactive): Divide-and-conquer splitting and merging steps.
- **Quick Sort** (Interactive): Partition tracking around chosen pivot index.
- **Heap Sort** (Interactive): Build max-heap and extract root elements.

### 3. Data Structures
- **Stack Operations** (Interactive): Push, Pop, and Peek actions on a LIFO stack.
- **Queue Operations** (Interactive): Enqueue, Dequeue, and Front/Rear markers on a FIFO queue.
- **Singly Linked List** (Interactive): Insert, delete, and traverse node blocks connected sequentially.
- **Postfix Evaluation** (Concept): Using a stack to evaluate Reverse Polish mathematical expressions.
- **Prefix Evaluation** (Concept): Scanning mathematical expressions right-to-left using a stack.
- **Double-Ended Queue (Deque)** (Concept): Insert/delete from both front and rear ends of a queue.
- **Circular Queue (Ring Buffer)** (Concept): Wrapping index pointers using modulo division to avoid slot wastage.
- **Priority Queue** (Concept): Elements retrieved based on heap-based priorities.
- **Doubly Linked List** (Concept): Bidirectional node traversal using next and prev pointer attributes.
- **Circular Linked List** (Concept): End node pointing back to head, forming a circular sequence loop.

### 4. Graph Theory & Representations
- **Breadth-First Search (BFS)** (Interactive): Level-order traversal using queue tracking.
- **Depth-First Search (DFS)** (Interactive): Depth traversal utilizing call stack tracking.
- **Dijkstra's Algorithm** (Interactive): Single-source shortest path tracking using distance grids.
- **A\* Search** (Interactive): Heuristic-guided grid path calculations.
- **Prim's Algorithm** (Interactive): MST (Minimum Spanning Tree) greedy expansion.
- **Kruskal's Algorithm** (Interactive): Edge sorting and Disjoint Set Union operations.
- **Topological Sort** (Concept): Graph sorting representing task dependency trees in DAGs.
- **Adjacency Matrix** (Concept): Quadratic 2D array representing edge weight records.
- **Adjacency List** (Concept): Vertex-linked lists storing connected neighborhood maps.

### 5. Binary Trees, AVL & Advanced Trees
- **BST Insertion & Search** (Interactive): Value comparisons and branch insertion paths.
- **AVL Tree Balancing** (Interactive): Height balance updates and left/right single/double rotations.
- **Red-Black Tree** (Concept): Self-balancing BST using Red/Black colored node rules.
- **B-Tree** (Concept): High-order self-balancing trees designed for page-disk reads in databases.
- **Trie (Prefix Tree)** (Concept): Alphabet path mapping optimized for word suggestion systems.
- **Segment Tree** (Concept): Interval structure answering dynamic range queries.
- **Fenwick Tree (BIT)** (Concept): Binary indexed tree for prefix sum updates.
- **Lowest Common Ancestor (LCA)** (Concept): Deeper node ancestor of two given leaves.
- **Tree Diameter** (Concept): Length of the longest path between any leaf pair in a tree.
- **Tree Isomorphism** (Concept): Checking structural equality mapping between tree sets.
- **Serialization & Deserialization** (Concept): Tracing tree nodes into streams and rebuilding them.
- **Huffman Coding** (Concept): Priority-based prefix tree compilation for data compression.
- **Decision Tree** (Concept): Conditional branches classifying classifications.
- **Abstract Syntax Tree (AST)** (Concept): Hierarchical parser representations of code syntax.

### 6. Dynamic Programming (DP)
- **Fibonacci DP** (Interactive): Tabulation vs recursive call stack computation comparison.
- **Longest Common Subsequence (LCS)** (Interactive): Subsequence character mapping matrix alignment.
- **Edit Distance** (Interactive): Levinshtein calculation cost vectors (Replace, Insert, Delete).
- **0/1 Knapsack** (Interactive): Capacity item optimizations using DP grids.

### 7. Recursion & Backtracking
- **Factorial** (Interactive): Recursive depth stacks showing active returns.
- **Tower of Hanoi** (Interactive): Disk movements across Pegs A, B, and C.
- **N-Queens Backtracking** (Interactive): Valid row-column checks and recursive backtracking state shifts.

---

## ⌨️ Desktop Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Spacebar` | Toggle simulation auto-playback (Play / Pause) |
| `Left Arrow` | Step backward exactly 1 step |
| `Right Arrow` | Step forward exactly 1 step |
| `R` | Reset simulation timeline to step 0 |

---

## 🚀 Local Installation & Setup

Ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ProfessorAuggie/AlgoNerve.git
cd AlgoNerve
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 3. Build Production Bundle
To compile and build the static output files for hosting (e.g. on Vercel):
```bash
npm run build
```

---

## ♿ Accessibility & Optimizations

- **ARIALive Assistive Narration**: Trace outputs update via an `aria-live="polite"` region, enabling screen-reader compatibility during playback.
- **Input Focus Safeguards**: Keyboard controls automatically bypass hotkey captures when focus lies inside input forms, preventing page displacement.
- **Platform Agnostic Viewports**: View visualizers comfortably on desktop displays, Android phones, iPhones, and tablets.

---

## 👨‍💻 Creator & Credits

Designed and developed by **Vaibhav Kushwaha**.
- **LinkedIn**: [https://www.linkedin.com/in/professorauggie/](https://www.linkedin.com/in/professorauggie/)
- **GitHub**: [https://github.com/ProfessorAuggie](https://github.com/ProfessorAuggie)
