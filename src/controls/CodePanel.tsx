import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

// Pseudocode mapping for all supported algorithms
const PSEUDOCODE_REGISTRY: Record<string, string[]> = {
  'bubble-sort': [
    'procedure bubbleSort(A : list of sortable items)',
    '  n := length(A)',
    '  for i := 0 to n-2 do',
    '    for j := 0 to n-i-2 do',
    '      if A[j] > A[j+1] then',
    '        swap(A[j], A[j+1])',
    '      end if',
    '    end for',
    '  end for',
    'end procedure',
  ],
  'insertion-sort': [
    'procedure insertionSort(A : list of sortable items)',
    '  for i := 1 to length(A)-1 do',
    '    key := A[i]',
    '    j := i - 1',
    '    while j >= 0 and A[j] > key do',
    '      A[j+1] := A[j]',
    '      j := j - 1',
    '    end while',
    '    A[j+1] := key',
    '  end for',
    'end procedure',
  ],
  'merge-sort': [
    'procedure mergeSort(A : list, left, right)',
    '  if left < right then',
    '    mid := floor((left + right) / 2)',
    '    mergeSort(A, left, mid)',
    '    mergeSort(A, mid + 1, right)',
    '    merge(A, left, mid, right)',
    '  end if',
    'end procedure',
    'procedure merge(A, left, mid, right)',
    '  // Copy and merge subarrays sequentially',
  ],
  'quick-sort': [
    'procedure quickSort(A : list, low, high)',
    '  if low < high then',
    '    pivotIndex := partition(A, low, high)',
    '    quickSort(A, low, pivotIndex - 1)',
    '    quickSort(A, pivotIndex + 1, high)',
    '  end if',
    'end procedure',
    'procedure partition(A, low, high)',
    '  // Place pivot element in sorted position',
  ],
  'heap-sort': [
    'procedure heapSort(A : list)',
    '  buildMaxHeap(A) // Rearrange array',
    '  for i := length(A)-1 down to 1 do',
    '    swap(A[0], A[i]) // Extract max root',
    '    heapify(A, i, 0) // Restore heap property',
    '  end for',
    'end procedure',
  ],
  bfs: [
    'procedure BFS(G, start_node)',
    '  let Q be a queue',
    '  Q.enqueue(start_node) and mark visited',
    '  while Q is not empty do',
    '    current := Q.dequeue()',
    '    for each neighbor N of current do',
    '      if N is not visited then',
    '        mark N visited and Q.enqueue(N)',
    '      end if',
    '    end for',
    '  end while',
    'end procedure',
  ],
  dfs: [
    'procedure DFS(G, start_node)',
    '  let S be a stack',
    '  S.push(start_node)',
    '  while S is not empty do',
    '    current := S.pop()',
    '    if current is not visited then',
    '      mark current as visited',
    '      for each neighbor N of current do',
    '        if N is not visited then S.push(N)',
    '      end for',
    '    end if',
    '  end while',
    'end procedure',
  ],
  dijkstra: [
    'procedure Dijkstra(G, start_node)',
    '  dist[start_node] := 0, all others := infinity',
    '  while unvisited is not empty do',
    '    u := node with min dist in unvisited',
    '    mark u as visited',
    '    for each neighbor v of u do',
    '      alt := dist[u] + weight(u, v)',
    '      if alt < dist[v] then',
    '        dist[v] := alt, prev[v] := u',
    '      end if',
    '    end for',
    '  end while',
    'end procedure',
  ],
  bst: [
    'procedure insertBST(root, val)',
    '  if root is null return Node(val)',
    '  if val < root.value then',
    '    root.left := insertBST(root.left, val)',
    '  else',
    '    root.right := insertBST(root.right, val)',
    '  end if',
    '  return root',
    'end procedure',
  ],
  'fibonacci-dp': [
    'procedure fibonacciDP(n)',
    '  let F be an array of size n+1',
    '  F[0] := 0, F[1] := 1 // Base cases',
    '  for i := 2 to n do',
    '    F[i] := F[i-1] + F[i-2]',
    '  end for',
    '  return F[n]',
    'end procedure',
  ],
  lcs: [
    'procedure LCS(s1, s2)',
    '  let dp be an (m+1) x (n+1) matrix',
    '  initialize base cases to 0',
    '  for i := 1 to m do',
    '    for j := 1 to n do',
    '      if s1[i-1] == s2[j-1] then',
    '        dp[i][j] := dp[i-1][j-1] + 1',
    '      else',
    '        dp[i][j] := max(dp[i-1][j], dp[i][j-1])',
    '      end if',
    '    end for',
    '  end for',
    '  return backtrackLCS(dp, s1, s2)',
  ],
  'edit-distance': [
    'procedure editDistance(s1, s2)',
    '  let dp be an (m+1) x (n+1) matrix',
    '  initialize base cases: dp[i][0] := i, dp[0][j] := j',
    '  for i := 1 to m do',
    '    for j := 1 to n do',
    '      if s1[i-1] == s2[j-1] then',
    '        dp[i][j] := dp[i-1][j-1]',
    '      else',
    '        dp[i][j] := min(Replace: dp[i-1][j-1], Insert: dp[i][j-1], Delete: dp[i-1][j]) + 1',
    '      end if',
    '    end for',
    '  end for',
    '  return dp[m][n]',
  ],
  factorial: [
    'procedure factorial(n)',
    '  if n <= 1 return 1 // Base case',
    '  subResult := factorial(n - 1)',
    '  result := n * subResult',
    '  return result',
    'end procedure',
  ],
  'tower-of-hanoi': [
    'procedure hanoi(n, source, target, aux)',
    '  if n == 1 then',
    '    move disk 1 from source to target',
    '    return',
    '  end if',
    '  hanoi(n - 1, source, aux, target)',
    '  move disk n from source to target',
    '  hanoi(n - 1, aux, target, source)',
    'end procedure',
  ],
  'a-star': [
    'procedure AStar(G, start, end)',
    '  gScore[start] := 0, fScore[start] := h(start)',
    '  while openSet is not empty do',
    '    current := node in openSet with min fScore',
    '    if current == end return reconstructPath(current)',
    '    for each neighbor of current do',
    '      tentative_g := gScore[current] + dist(current, neighbor)',
    '      if tentative_g < gScore[neighbor] then',
    '        prev[neighbor] := current, gScore[neighbor] := tentative_g',
    '        fScore[neighbor] := tentative_g + h(neighbor)',
    '      end if',
    '    end for',
    '  end while',
    'end procedure',
  ],
  prim: [
    'procedure Prim(G, start_node)',
    '  keys[start_node] := 0, all others := infinity',
    '  while unvisited is not empty do',
    '    u := extractMinKeyNode(unvisited)',
    '    add u to MST',
    '    for each neighbor v of u do',
    '      if weight(u, v) < keys[v] then',
    '        keys[v] := weight(u, v), parent[v] := u',
    '      end if',
    '    end for',
    '  end while',
    'end procedure',
  ],
  kruskal: [
    'procedure Kruskal(G)',
    '  sort G.edges by weight ascending',
    '  initialize Disjoint Sets (Union-Find) for nodes',
    '  for each edge (u, v) in sorted_edges do',
    '    if find(u) != find(v) then',
    '      add (u, v) to MST',
    '      union(u, v)',
    '    end if',
    '  end for',
    'end procedure',
  ],
  'avl-tree': [
    'procedure insertAVL(node, val)',
    '  node := insertBST(node, val)',
    '  updateHeight(node)',
    '  balance := getBalance(node)',
    '  if balance > 1 and val < node.left.val then return rotateRight(node)',
    '  if balance < -1 and val > node.right.val then return rotateLeft(node)',
    '  if balance > 1 and val > node.left.val then leftRotate(node.left), rightRotate(node)',
    '  if balance < -1 and val < node.right.val then rightRotate(node.right), leftRotate(node)',
    '  return node',
    'end procedure',
  ],
  'knapsack-dp': [
    'procedure Knapsack(weights, values, capacity W)',
    '  initialize dp[(n+1)][(W+1)] matrix to -1',
    '  set base cases dp[i][0] := 0, dp[0][j] := 0',
    '  for i := 1 to n do',
    '    for w := 1 to W do',
    '      if weight[i-1] <= w then',
    '        dp[i][w] := max(dp[i-1][w], dp[i-1][w-weight[i-1]] + value[i-1])',
    '      else',
    '        dp[i][w] := dp[i-1][w]',
    '      end if',
    '    end for',
    '  end for',
    '  return backtrackItemsSelected(dp)',
  ],
  'n-queens': [
    'procedure solveNQueens(board, col)',
    '  if col >= N then return true // Solution found',
    '  for row := 0 to N-1 do',
    '    if isSafe(board, row, col) then',
    '      placeQueen(board, row, col)',
    '      if solveNQueens(board, col + 1) return true',
    '      removeQueen(board, row, col) // Backtrack',
    '    end if',
    '  end for',
    '  return false',
    'end procedure',
  ],
};


export const CodePanel: React.FC = () => {
  const { selectedAlgo, steps, currentStepIndex } = useAlgorithmStore();

  if (!selectedAlgo) return null;

  const lines = PSEUDOCODE_REGISTRY[selectedAlgo.id] || [];
  const currentStep = steps[currentStepIndex];
  const highlightedLine = currentStep ? currentStep.codeLine : -1;

  return (
    <div className="w-full flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
        <h4 className="text-xs uppercase font-mono font-semibold text-zinc-400 tracking-wider">
          Pseudocode Execution
        </h4>
        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded">
          Sync Active
        </span>
      </div>

      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[300px]">
        <pre className="space-y-0.5">
          {lines.map((line, idx) => {
            // Line numbering starts at 1
            const lineNum = idx + 1;
            const isHighlighted = lineNum === highlightedLine;

            // Simple indentation rendering check
            const indentSpaces = line.search(/\S/);
            const indentPadding = indentSpaces > 0 ? ' '.repeat(indentSpaces) : '';
            const lineText = line.trim();

            return (
              <div
                key={idx}
                className={`flex w-full items-center py-0.5 px-2 rounded transition-colors duration-200 ${
                  isHighlighted
                    ? 'bg-violet-950/80 text-violet-300 font-semibold border-l-2 border-violet-500 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/20'
                }`}
              >
                {/* Line number spacer */}
                <span className="text-zinc-600 select-none mr-4 w-4 text-right">
                  {lineNum}
                </span>

                {/* Code body */}
                <span>
                  {indentPadding}
                  {lineText}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
