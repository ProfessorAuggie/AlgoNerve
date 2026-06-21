import type { Step, GraphData, GraphPayload } from './types';


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
  path?: string[]
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
