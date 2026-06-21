# 🧠 AlgoNerve: Interactive Algorithm Visualizer

**AlgoNerve** is a premium, production-grade interactive algorithm visualization platform built using Vite, React, TypeScript, Zustand, Tailwind CSS, and D3.js. Instead of treating algorithms like abstract formulas, AlgoNerve animates their internal execution logic, stack frames, variables, dynamic programming tables, and graphs in real-time.

Designed for software engineers, students, and educators, it provides step-by-step state inspection to demystify complex problem-solving patterns.

---

## 🌟 Key Features

- **20+ Algorithms Visualized**: Custom step-generators for Sorting, Graph theory, Trees, Dynamic Programming, Recursion, and Backtracking.
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

### 1. Sorting Algorithms
- **Bubble Sort**: Pairwise comparisons and element swaps.
- **Insertion Sort**: Shifting unsorted keys into correct sorted divisions.
- **Merge Sort**: Divide-and-conquer splitting and merging steps.
- **Quick Sort**: Partition tracking around chosen pivot index.
- **Heap Sort**: Build max-heap and extract root elements.

### 2. Graph Theory
- **Breadth-First Search (BFS)**: Level-order traversal using queue tracking.
- **Depth-First Search (DFS)**: Depth traversal utilizing call stack tracking.
- **Dijkstra's Algorithm**: Single-source shortest path tracking using distance grids.
- **A\* Search**: Heuristic-guided grid path calculations.
- **Prim's Algorithm**: MST (Minimum Spanning Tree) greedy expansion.
- **Kruskal's Algorithm**: Edge sorting and Disjoint Set Union operations.

### 3. Binary Search Trees & AVL
- **BST Insertion & Search**: Value comparisons and branch insertion paths.
- **BST Traversals**: Inorder, Preorder, and Postorder recursive logs.
- **AVL Tree Balancing**: Tree height rebalancing and left/right single/double rotations.

### 4. Dynamic Programming (DP)
- **Fibonacci DP**: Comparison between recursion stack vs dynamic programming tabulation.
- **Longest Common Subsequence (LCS)**: String character match compilation and alignment backtrack path.
- **Edit Distance**: Cost matrix computations for Insert, Delete, and Replace actions.
- **0/1 Knapsack**: DP tabulation and backtracking item selections.

### 5. Recursion & Backtracking
- **Factorial**: Recursive depth stacks showing active returns.
- **Tower of Hanoi**: Disk movements across Pegs A, B, and C.
- **N-Queens Backtracking**: Valid row-column checks and recursive backtracking state shifts.

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
