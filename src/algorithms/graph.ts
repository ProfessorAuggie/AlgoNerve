import type { Step, GraphData, GraphPayload, GraphEdge } from './types';

function createGraphStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  graph: GraphData,
  visited: string[],
  queue?: string[],
  stack?: string[],
  current?: string,
  distances?: Record<string, number>,
  previous?: Record<string, string | null>,
  path?: string[],
  mstEdges?: GraphEdge[]
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      graph,
      visited: [...visited],
      queue: queue ? [...queue] : undefined,
      stack: stack ? [...stack] : undefined,
      current,
      distances: distances ? { ...distances } : undefined,
      previous: previous ? { ...previous } : undefined,
      path: path ? [...path] : undefined,
      mstEdges: mstEdges ? [...mstEdges] : undefined,
    } as GraphPayload,
  };
}


// Helper to get neighbors
function getNeighbors(graph: GraphData, nodeId: string): { node: string; weight: number }[] {
  const neighbors: { node: string; weight: number }[] = [];
  for (const edge of graph.edges) {
    if (edge.source === nodeId) {
      neighbors.push({ node: edge.target, weight: edge.weight ?? 1 });
    } else if (!graph.directed && edge.target === nodeId) {
      neighbors.push({ node: edge.source, weight: edge.weight ?? 1 });
    }
  }
  return neighbors;
}

// ─── Breadth-First Search (BFS) ──────────────────────────────────────────────
export function generateBFSSteps(graph: GraphData, startNode: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const queue: string[] = [];

  steps.push(createGraphStep(stepId++, 'init', `Start BFS from node ${startNode}. Initialize empty visited set and queue.`, 1, graph, visited, queue));

  queue.push(startNode);
  visited.push(startNode);
  steps.push(createGraphStep(stepId++, 'enqueue', `Enqueue and mark start node ${startNode} as visited.`, 2, graph, visited, queue, undefined, startNode));

  while (queue.length > 0) {
    const current = queue.shift()!;
    steps.push(createGraphStep(stepId++, 'dequeue', `Dequeue node ${current} and examine its neighbors.`, 4, graph, visited, queue, undefined, current));

    const neighbors = getNeighbors(graph, current);
    for (const neighborInfo of neighbors) {
      const neighbor = neighborInfo.node;
      steps.push(createGraphStep(stepId++, 'check-neighbor', `Check neighbor node ${neighbor}.`, 5, graph, visited, queue, undefined, current));
      
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        queue.push(neighbor);
        steps.push(createGraphStep(stepId++, 'enqueue-neighbor', `Neighbor ${neighbor} is unvisited. Visit it and enqueue.`, 6, graph, visited, queue, undefined, current));
      } else {
        steps.push(createGraphStep(stepId++, 'already-visited', `Neighbor ${neighbor} is already visited. Skip.`, 7, graph, visited, queue, undefined, current));
      }
    }
  }

  steps.push(createGraphStep(stepId++, 'done', 'BFS complete! All reachable nodes have been traversed.', 9, graph, visited, queue));
  return steps;
}

// ─── Depth-First Search (DFS) ────────────────────────────────────────────────
export function generateDFSSteps(graph: GraphData, startNode: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const stack: string[] = [];

  steps.push(createGraphStep(stepId++, 'init', `Start DFS from node ${startNode}. Initialize stack and visited tracker.`, 1, graph, visited, undefined, stack));

  stack.push(startNode);
  steps.push(createGraphStep(stepId++, 'push', `Push start node ${startNode} onto stack.`, 2, graph, visited, undefined, stack, startNode));

  while (stack.length > 0) {
    const current = stack.pop()!;
    steps.push(createGraphStep(stepId++, 'pop', `Pop node ${current} from stack to process.`, 4, graph, visited, undefined, stack, current));

    if (!visited.includes(current)) {
      visited.push(current);
      steps.push(createGraphStep(stepId++, 'visit', `Mark node ${current} as visited.`, 5, graph, visited, undefined, stack, current));

      const neighbors = getNeighbors(graph, current);
      // Reverse neighbors to push in correct alphabetical order
      for (const neighborInfo of neighbors.reverse()) {
        const neighbor = neighborInfo.node;
        steps.push(createGraphStep(stepId++, 'check-neighbor', `Check neighbor ${neighbor} of node ${current}.`, 6, graph, visited, undefined, stack, current));
        
        if (!visited.includes(neighbor)) {
          stack.push(neighbor);
          steps.push(createGraphStep(stepId++, 'push-neighbor', `Neighbor ${neighbor} is unvisited. Push it onto stack.`, 7, graph, visited, undefined, stack, current));
        }
      }
    } else {
      steps.push(createGraphStep(stepId++, 'already-visited', `Node ${current} is already visited. Skip.`, 9, graph, visited, undefined, stack, current));
    }
  }

  steps.push(createGraphStep(stepId++, 'done', 'DFS complete! Traversed all accessible nodes.', 11, graph, visited, undefined, stack));
  return steps;
}

// ─── Dijkstra's Algorithm ────────────────────────────────────────────────────
export function generateDijkstraSteps(graph: GraphData, startNode: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisitedNodes = graph.nodes.map(n => n.id);

  // Initialize
  for (const node of graph.nodes) {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    previous[node.id] = null;
  }

  steps.push(createGraphStep(
    stepId++,
    'init',
    `Initialize distances: distance to ${startNode} is 0, all other distances are ∞.`,
    1,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    distances,
    previous
  ));

  while (unvisitedNodes.length > 0) {
    // Find node with minimum distance
    let current: string | null = null;
    let minDistance = Infinity;

    for (const node of unvisitedNodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || minDistance === Infinity) {
      steps.push(createGraphStep(
        stepId++,
        'no-reach',
        'Remaining unvisited nodes are unreachable. Terminate search.',
        3,
        graph,
        visited,
        undefined,
        undefined,
        undefined,
        distances,
        previous
      ));
      break;
    }

    // Remove from unvisited nodes list
    const index = unvisitedNodes.indexOf(current);
    if (index > -1) {
      unvisitedNodes.splice(index, 1);
    }

    visited.push(current);
    steps.push(createGraphStep(
      stepId++,
      'select-min',
      `Select node ${current} with minimum tentative distance (${minDistance}) from unvisited set.`,
      4,
      graph,
      visited,
      undefined,
      undefined,
      current,
      distances,
      previous
    ));

    const neighbors = getNeighbors(graph, current);
    for (const neighborInfo of neighbors) {
      const neighbor = neighborInfo.node;
      const weight = neighborInfo.weight;
      
      if (visited.includes(neighbor)) {
        steps.push(createGraphStep(
          stepId++,
          'skip-visited-neighbor',
          `Neighbor ${neighbor} is already visited. Skip.`,
          5,
          graph,
          visited,
          undefined,
          undefined,
          current,
          distances,
          previous
        ));
        continue;
      }

      const alt = distances[current] + weight;
      steps.push(createGraphStep(
        stepId++,
        'check-relaxation',
        `Check path to neighbor ${neighbor} via node ${current}. Path length: ${distances[current]} + ${weight} = ${alt}. Current distance: ${distances[neighbor]}.`,
        6,
        graph,
        visited,
        undefined,
        undefined,
        current,
        distances,
        previous
      ));

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
        steps.push(createGraphStep(
          stepId++,
          'relax',
          `New shorter path to ${neighbor} found! Update distance to ${alt} and previous node to ${current}.`,
          7,
          graph,
          visited,
          undefined,
          undefined,
          current,
          distances,
          previous
        ));
      }
    }
  }

  steps.push(createGraphStep(
    stepId++,
    'done',
    "Dijkstra's shortest path calculations complete!",
    9,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    distances,
    previous
  ));

  return steps;
}

// Heuristic straight line distance mappings to node 'F' for standard coordinate node sets.
const HEURISTICS: Record<string, number> = {
  A: 450,
  B: 308,
  C: 308,
  D: 165,
  E: 165,
  F: 0,
};

// ─── A* Search Algorithm ─────────────────────────────────────────────────────
export function generateAStarSteps(graph: GraphData, startNode: string, endNode: string = 'F'): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const gScores: Record<string, number> = {};
  const fScores: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const openSet: string[] = [startNode];

  for (const node of graph.nodes) {
    gScores[node.id] = Infinity;
    fScores[node.id] = Infinity;
    previous[node.id] = null;
  }

  gScores[startNode] = 0;
  fScores[startNode] = HEURISTICS[startNode] || 0;

  steps.push(createGraphStep(
    stepId++,
    'init',
    `Initialize A* Search from node ${startNode} to target ${endNode}. Set start node g(start) = 0 and f(start) = h(start) = ${fScores[startNode]}.`,
    1,
    graph,
    visited,
    openSet,
    undefined,
    undefined,
    gScores,
    previous
  ));

  while (openSet.length > 0) {
    // Find node in openSet with lowest fScore
    let current = openSet[0];
    let minF = fScores[current];
    for (const node of openSet) {
      if (fScores[node] < minF) {
        minF = fScores[node];
        current = node;
      }
    }

    steps.push(createGraphStep(
      stepId++,
      'select-min-f',
      `Select node ${current} with minimum f(x) = ${fScores[current]} from open list.`,
      3,
      graph,
      visited,
      openSet,
      undefined,
      current,
      gScores,
      previous
    ));

    if (current === endNode) {
      // Reconstruct path
      const path: string[] = [];
      let temp: string | null = current;
      while (temp) {
        path.unshift(temp);
        temp = previous[temp];
      }

      visited.push(current);
      steps.push(createGraphStep(
        stepId++,
        'done',
        `Goal node ${endNode} reached! Shortest path: [${path.join(' → ')}]. Cost: ${gScores[endNode]}.`,
        8,
        graph,
        visited,
        openSet,
        undefined,
        current,
        gScores,
        previous,
        path
      ));
      return steps;
    }

    // Move current from openSet to closedSet
    const idx = openSet.indexOf(current);
    openSet.splice(idx, 1);
    visited.push(current);

    const neighbors = getNeighbors(graph, current);
    for (const nInfo of neighbors) {
      const neighbor = nInfo.node;
      const weight = nInfo.weight;

      if (visited.includes(neighbor)) {
        steps.push(createGraphStep(
          stepId++,
          'skip-visited',
          `Neighbor ${neighbor} is already evaluated (in closed list). Skip.`,
          5,
          graph,
          visited,
          openSet,
          undefined,
          current,
          gScores,
          previous
        ));
        continue;
      }

      const tentativeG = gScores[current] + weight;
      
      steps.push(createGraphStep(
        stepId++,
        'check-relaxation',
        `Evaluate neighbor ${neighbor}. Calculated tentative g(${neighbor}) = g(${current}) + ${weight} = ${tentativeG}.`,
        6,
        graph,
        visited,
        openSet,
        undefined,
        current,
        gScores,
        previous
      ));

      if (tentativeG < gScores[neighbor]) {
        previous[neighbor] = current;
        gScores[neighbor] = tentativeG;
        const h = HEURISTICS[neighbor] || 0;
        fScores[neighbor] = tentativeG + h;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }

        steps.push(createGraphStep(
          stepId++,
          'relax',
          `Shorter route to ${neighbor} found via ${current}! Update g(${neighbor}) = ${tentativeG}, f(${neighbor}) = g(${tentativeG}) + h(${h}) = ${fScores[neighbor]}. Add to open list.`,
          7,
          graph,
          visited,
          openSet,
          undefined,
          current,
          gScores,
          previous
        ));
      }
    }
  }

  steps.push(createGraphStep(
    stepId++,
    'fail',
    `Open set is empty but target ${endNode} was not reached. No path exists.`,
    9,
    graph,
    visited,
    openSet,
    undefined,
    undefined,
    gScores,
    previous
  ));

  return steps;
}

// ─── Prim's MST Algorithm ────────────────────────────────────────────────────
export function generatePrimSteps(graph: GraphData, startNode: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const mstEdges: GraphEdge[] = [];
  const remainingNodes = graph.nodes.map(n => n.id);

  // Distances to MST
  const keys: Record<string, number> = {};
  const parent: Record<string, string | null> = {};

  for (const node of graph.nodes) {
    keys[node.id] = Infinity;
    parent[node.id] = null;
  }

  keys[startNode] = 0;

  steps.push(createGraphStep(
    stepId++,
    'init',
    `Start Prim's MST from node ${startNode}. Initialize keys to ∞ and parent to null.`,
    1,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    keys,
    undefined,
    undefined,
    mstEdges
  ));

  while (visited.length < graph.nodes.length) {
    // Select vertex with min key among unvisited
    let minKey = Infinity;
    let u = '';
    for (const node of remainingNodes) {
      if (!visited.includes(node) && keys[node] < minKey) {
        minKey = keys[node];
        u = node;
      }
    }

    if (!u) break;

    visited.push(u);
    
    // Add selected edge to MST list
    if (parent[u]) {
      mstEdges.push({ source: parent[u]!, target: u, weight: minKey });
    }

    steps.push(createGraphStep(
      stepId++,
      'add-to-mst',
      `Extract vertex ${u} with minimum key (${minKey}) and add it to the MST.`,
      4,
      graph,
      visited,
      undefined,
      undefined,
      u,
      keys,
      undefined,
      undefined,
      mstEdges
    ));

    const neighbors = getNeighbors(graph, u);
    for (const nInfo of neighbors) {
      const v = nInfo.node;
      const weight = nInfo.weight;

      if (!visited.includes(v)) {
        steps.push(createGraphStep(
          stepId++,
          'check-edge',
          `Evaluate edge (${u} - ${v}) with weight ${weight}. Key at ${v} is currently ${keys[v]}.`,
          5,
          graph,
          visited,
          undefined,
          undefined,
          u,
          keys,
          undefined,
          undefined,
          mstEdges
        ));

        if (weight < keys[v]) {
          keys[v] = weight;
          parent[v] = u;

          steps.push(createGraphStep(
            stepId++,
            'update-key',
            `Edge weight ${weight} < keys[${v}] (${keys[v]}). Update keys[${v}] = ${weight} and parent[${v}] = ${u}.`,
            6,
            graph,
            visited,
            undefined,
            undefined,
            u,
            keys,
            undefined,
            undefined,
            mstEdges
          ));
        }
      }
    }
  }

  steps.push(createGraphStep(
    stepId++,
    'done',
    `Prim's MST complete! Constructed minimum spanning tree with ${mstEdges.length} edges.`,
    8,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    keys,
    undefined,
    undefined,
    mstEdges
  ));

  return steps;
}

// ─── Kruskal's MST Algorithm ─────────────────────────────────────────────────
export function generateKruskalSteps(graph: GraphData): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const visited: string[] = [];
  const mstEdges: GraphEdge[] = [];
  
  // Sort edges by weight
  const sortedEdges = [...graph.edges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  // Disjoint set parent map
  const parent: Record<string, string> = {};
  for (const node of graph.nodes) {
    parent[node.id] = node.id;
  }

  function find(id: string): string {
    if (parent[id] === id) return id;
    return find(parent[id]);
  }

  function union(root1: string, root2: string) {
    parent[root1] = root2;
  }

  steps.push(createGraphStep(
    stepId++,
    'init',
    `Start Kruskal's MST. Sort all ${sortedEdges.length} edges by ascending weight. Initialize disjoint set clusters.`,
    1,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    mstEdges
  ));

  for (const edge of sortedEdges) {
    const rootU = find(edge.source);
    const rootV = find(edge.target);

    steps.push(createGraphStep(
      stepId++,
      'evaluate-edge',
      `Examine edge (${edge.source} - ${edge.target}) with weight ${edge.weight}. Roots check: find(${edge.source}) = ${rootU}, find(${edge.target}) = ${rootV}.`,
      3,
      graph,
      visited,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      mstEdges
    ));

    if (rootU !== rootV) {
      union(rootU, rootV);
      mstEdges.push(edge);
      
      // Update visited nodes for visual feedback
      if (!visited.includes(edge.source)) visited.push(edge.source);
      if (!visited.includes(edge.target)) visited.push(edge.target);

      steps.push(createGraphStep(
        stepId++,
        'union-edge',
        `No cycle created by adding this edge (different root clusters). Union roots and add edge (${edge.source} - ${edge.target}) to the MST.`,
        4,
        graph,
        visited,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mstEdges
      ));
    } else {
      steps.push(createGraphStep(
        stepId++,
        'cycle-detected',
        `Adding edge (${edge.source} - ${edge.target}) would cause a cycle (same root cluster: ${rootU}). Discard edge.`,
        5,
        graph,
        visited,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mstEdges
      ));
    }
  }

  steps.push(createGraphStep(
    stepId++,
    'done',
    `Kruskal's MST complete! Minimum spanning tree constructed.`,
    7,
    graph,
    visited,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    mstEdges
  ));

  return steps;
}

