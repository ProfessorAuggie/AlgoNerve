import type {
  Step,
  TreeNode,
  GraphData,
  GraphPayload,
  TreePayload,
  DPPayload,
  DataStructurePayload,
  SortingPayload
} from './types';

// Helper to create basic step
function createStep(id: number, action: string, description: string, codeLine: number, payload: any): Step {
  return { id, action, description, codeLine, payload };
}

// Helper to build a simple BST from values for tree traversal visualizers
function buildBST(values: number[]): TreeNode | null {
  if (values.length === 0) return null;
  
  let root: TreeNode | null = null;
  
  const insert = (node: TreeNode | null, val: number, parentId: string | null = null): TreeNode => {
    if (!node) {
      return {
        id: `node_${val}`,
        value: val,
        left: null,
        right: null,
        parent: parentId,
      };
    }
    if (val < node.value) {
      node.left = insert(node.left || null, val, node.id);
    } else {
      node.right = insert(node.right || null, val, node.id);
    }
    return node;
  };

  for (const v of values) {
    root = insert(root, v);
  }
  
  return root;
}

// Clone tree helper to freeze state at each step
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left || null),
    right: cloneTree(node.right || null),
    height: node.height,
    parent: node.parent,
    balance: node.balance,
    color: node.color,
    isAST: node.isAST,
    operator: node.operator
  };
}

// ─── 1. Postfix Evaluation ───────────────────────────────────────────────
export function generatePostfixEvalSteps(expr: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const tokens = expr.trim() ? expr.trim().split(/\s+/) : ['3', '4', '+', '2', '*'];
  const stack: number[] = [];

  steps.push(createStep(stepId++, 'init', `Initialize expression evaluation for postfix: "${tokens.join(' ')}"`, 1, {
    type: 'stack',
    elements: [...stack],
    actionType: 'push'
  } as DataStructurePayload));

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isOp = ['+', '-', '*', '/'].includes(token);
    
    if (!isOp) {
      const val = parseInt(token, 10) || 0;
      stack.push(val);
      steps.push(createStep(stepId++, 'push', `Read operand "${token}". Push it onto the stack.`, 3, {
        type: 'stack',
        elements: [...stack],
        topIndex: stack.length - 1,
        activeIndex: stack.length - 1,
        actionType: 'push'
      } as DataStructurePayload));
    } else {
      steps.push(createStep(stepId++, 'operator', `Read operator "${token}". Prepare to pop two operands.`, 4, {
        type: 'stack',
        elements: [...stack],
        topIndex: stack.length - 1,
        activeIndex: stack.length - 1,
        actionType: 'peek'
      } as DataStructurePayload));

      if (stack.length >= 2) {
        const val1 = stack.pop()!;
        steps.push(createStep(stepId++, 'pop', `Pop first operand: ${val1}`, 5, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length,
          actionType: 'pop'
        } as DataStructurePayload));

        const val2 = stack.pop()!;
        steps.push(createStep(stepId++, 'pop', `Pop second operand: ${val2}`, 5, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length,
          actionType: 'pop'
        } as DataStructurePayload));

        let res = 0;
        if (token === '+') res = val2 + val1;
        else if (token === '-') res = val2 - val1;
        else if (token === '*') res = val2 * val1;
        else if (token === '/') res = Math.floor(val2 / val1);

        stack.push(res);
        steps.push(createStep(stepId++, 'calc', `Apply operator: ${val2} ${token} ${val1} = ${res}. Push result to stack.`, 6, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length - 1,
          actionType: 'push'
        } as DataStructurePayload));
      }
    }
  }

  const finalVal = stack.length > 0 ? stack[0] : 0;
  steps.push(createStep(stepId++, 'done', `Evaluation complete. Final result is ${finalVal}.`, 7, {
    type: 'stack',
    elements: [...stack],
    topIndex: stack.length > 0 ? 0 : undefined,
    activeIndex: stack.length > 0 ? 0 : undefined,
    actionType: 'peek'
  } as DataStructurePayload));

  return steps;
}

// ─── 2. Prefix Evaluation ────────────────────────────────────────────────
export function generatePrefixEvalSteps(expr: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const tokens = expr.trim() ? expr.trim().split(/\s+/) : ['*', '+', '3', '4', '2'];
  const stack: number[] = [];

  steps.push(createStep(stepId++, 'init', `Initialize expression evaluation for prefix: "${tokens.join(' ')}" (scan right-to-left)`, 1, {
    type: 'stack',
    elements: [...stack],
    actionType: 'push'
  } as DataStructurePayload));

  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    const isOp = ['+', '-', '*', '/'].includes(token);
    
    if (!isOp) {
      const val = parseInt(token, 10) || 0;
      stack.push(val);
      steps.push(createStep(stepId++, 'push', `Read operand "${token}". Push it onto the stack.`, 3, {
        type: 'stack',
        elements: [...stack],
        topIndex: stack.length - 1,
        activeIndex: stack.length - 1,
        actionType: 'push'
      } as DataStructurePayload));
    } else {
      steps.push(createStep(stepId++, 'operator', `Read operator "${token}". Prepare to pop two operands.`, 4, {
        type: 'stack',
        elements: [...stack],
        topIndex: stack.length - 1,
        activeIndex: stack.length - 1,
        actionType: 'peek'
      } as DataStructurePayload));

      if (stack.length >= 2) {
        const val1 = stack.pop()!; // left
        steps.push(createStep(stepId++, 'pop', `Pop left operand: ${val1}`, 5, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length,
          actionType: 'pop'
        } as DataStructurePayload));

        const val2 = stack.pop()!; // right
        steps.push(createStep(stepId++, 'pop', `Pop right operand: ${val2}`, 5, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length,
          actionType: 'pop'
        } as DataStructurePayload));

        let res = 0;
        if (token === '+') res = val1 + val2;
        else if (token === '-') res = val1 - val2;
        else if (token === '*') res = val1 * val2;
        else if (token === '/') res = Math.floor(val1 / val2);

        stack.push(res);
        steps.push(createStep(stepId++, 'calc', `Apply operator: ${val1} ${token} ${val2} = ${res}. Push result to stack.`, 6, {
          type: 'stack',
          elements: [...stack],
          topIndex: stack.length - 1,
          activeIndex: stack.length - 1,
          actionType: 'push'
        } as DataStructurePayload));
      }
    }
  }

  const finalVal = stack.length > 0 ? stack[0] : 0;
  steps.push(createStep(stepId++, 'done', `Evaluation complete. Final result is ${finalVal}.`, 7, {
    type: 'stack',
    elements: [...stack],
    topIndex: stack.length > 0 ? 0 : undefined,
    activeIndex: stack.length > 0 ? 0 : undefined,
    actionType: 'peek'
  } as DataStructurePayload));

  return steps;
}

// ─── 3. Double-Ended Queue (Deque) ───────────────────────────────────────
export function generateDequeSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const elements: number[] = [];

  steps.push(createStep(stepId++, 'init', 'Initialize empty Double-Ended Queue (Deque).', 1, {
    type: 'queue',
    elements: [...elements],
    actionType: 'enqueue'
  } as DataStructurePayload));

  const values = arr.length > 0 ? arr.slice(0, 3) : [10, 20, 30];

  // insertLast(val1)
  elements.push(values[0]);
  steps.push(createStep(stepId++, 'insert', `Insert last: push ${values[0]} to rear.`, 3, {
    type: 'queue',
    elements: [...elements],
    frontIndex: 0,
    rearIndex: elements.length - 1,
    activeIndex: elements.length - 1,
    actionType: 'enqueue'
  } as DataStructurePayload));

  // insertFront(val2)
  elements.unshift(values[1]);
  steps.push(createStep(stepId++, 'insert', `Insert front: push ${values[1]} to front.`, 2, {
    type: 'queue',
    elements: [...elements],
    frontIndex: 0,
    rearIndex: elements.length - 1,
    activeIndex: 0,
    actionType: 'enqueue'
  } as DataStructurePayload));

  // insertLast(val3)
  if (values[2] !== undefined) {
    elements.push(values[2]);
    steps.push(createStep(stepId++, 'insert', `Insert last: push ${values[2]} to rear.`, 3, {
      type: 'queue',
      elements: [...elements],
      frontIndex: 0,
      rearIndex: elements.length - 1,
      activeIndex: elements.length - 1,
      actionType: 'enqueue'
    } as DataStructurePayload));
  }

  // deleteFront()
  const removedF = elements.shift();
  steps.push(createStep(stepId++, 'delete', `Delete front: remove ${removedF} from front.`, 4, {
    type: 'queue',
    elements: [...elements],
    frontIndex: elements.length > 0 ? 0 : undefined,
    rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
    activeIndex: 0,
    actionType: 'dequeue'
  } as DataStructurePayload));

  // deleteLast()
  const removedL = elements.pop();
  steps.push(createStep(stepId++, 'delete', `Delete last: remove ${removedL} from rear.`, 5, {
    type: 'queue',
    elements: [...elements],
    frontIndex: elements.length > 0 ? 0 : undefined,
    rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
    activeIndex: elements.length,
    actionType: 'dequeue'
  } as DataStructurePayload));

  steps.push(createStep(stepId++, 'done', 'Deque operations completed.', 5, {
    type: 'queue',
    elements: [...elements],
    frontIndex: elements.length > 0 ? 0 : undefined,
    rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
    actionType: 'enqueue'
  } as DataStructurePayload));

  return steps;
}

// ─── 4. Circular Queue ───────────────────────────────────────────────────
export function generateCircularQueueSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const elements: (number | null)[] = [null, null, null, null, null];
  const size = 5;
  let front = 0;
  let rear = 0;
  let count = 0;

  const getDSElements = () => elements.map(x => x === null ? 0 : x);

  steps.push(createStep(stepId++, 'init', 'Initialize Circular Queue of capacity 5. front = 0, rear = 0.', 1, {
    type: 'queue',
    elements: getDSElements(),
    actionType: 'enqueue'
  } as DataStructurePayload));

  const values = arr.length > 0 ? arr.slice(0, 4) : [10, 20, 30, 40];

  // Enqueue 3 items
  for (let i = 0; i < 3; i++) {
    const val = values[i];
    elements[rear] = val;
    steps.push(createStep(stepId++, 'enqueue', `Enqueue(${val}): Insert at rear index ${rear}.`, 2, {
      type: 'queue',
      elements: getDSElements(),
      frontIndex: front,
      rearIndex: rear,
      activeIndex: rear,
      actionType: 'enqueue'
    } as DataStructurePayload));
    rear = (rear + 1) % size;
    count++;
  }

  // Dequeue 1 item
  const valOut = elements[front];
  elements[front] = null;
  steps.push(createStep(stepId++, 'dequeue', `Dequeue(): Remove element ${valOut} at front index ${front}.`, 3, {
    type: 'queue',
    elements: getDSElements(),
    frontIndex: front,
    rearIndex: (rear - 1 + size) % size,
    activeIndex: front,
    actionType: 'dequeue'
  } as DataStructurePayload));
  front = (front + 1) % size;
  count--;

  // Enqueue another to show wrap around
  const wrapVal = values[3] || 99;
  elements[rear] = wrapVal;
  steps.push(createStep(stepId++, 'enqueue', `Enqueue(${wrapVal}): Insert at rear index ${rear} (wraps around).`, 2, {
    type: 'queue',
    elements: getDSElements(),
    frontIndex: front,
    rearIndex: rear,
    activeIndex: rear,
    actionType: 'enqueue'
  } as DataStructurePayload));
  rear = (rear + 1) % size;
  count++;

  steps.push(createStep(stepId++, 'done', `Circular Queue state. front = ${front}, rear = ${rear}.`, 4, {
    type: 'queue',
    elements: getDSElements(),
    frontIndex: front,
    rearIndex: (rear - 1 + size) % size,
    actionType: 'enqueue'
  } as DataStructurePayload));

  return steps;
}

// ─── 5. Priority Queue ───────────────────────────────────────────────────
export function generatePriorityQueueSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const elements: number[] = [];

  steps.push(createStep(stepId++, 'init', 'Initialize empty Priority Queue (Max Priority first).', 1, {
    type: 'queue',
    elements: [...elements],
    actionType: 'enqueue'
  } as DataStructurePayload));

  const values = arr.length > 0 ? arr.slice(0, 4) : [20, 10, 40, 30];

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    elements.push(val);
    // Sort descending
    elements.sort((a, b) => b - a);
    const activeIdx = elements.indexOf(val);
    steps.push(createStep(stepId++, 'enqueue', `Insert ${val} with priority. Queue maintains descending order.`, 2, {
      type: 'queue',
      elements: [...elements],
      frontIndex: 0,
      rearIndex: elements.length - 1,
      activeIndex: activeIdx,
      actionType: 'enqueue'
    } as DataStructurePayload));
  }

  // Dequeue highest priority
  const maxVal = elements.shift();
  steps.push(createStep(stepId++, 'dequeue', `Extract Max Priority element: ${maxVal} from the front.`, 3, {
    type: 'queue',
    elements: [...elements],
    frontIndex: elements.length > 0 ? 0 : undefined,
    rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
    activeIndex: 0,
    actionType: 'dequeue'
  } as DataStructurePayload));

  steps.push(createStep(stepId++, 'done', 'Priority Queue operations completed.', 4, {
    type: 'queue',
    elements: [...elements],
    frontIndex: elements.length > 0 ? 0 : undefined,
    rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
    actionType: 'enqueue'
  } as DataStructurePayload));

  return steps;
}

// ─── 6. Doubly Linked List ───────────────────────────────────────────────
export function generateDoublyLinkedListSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const values = arr.length > 0 ? arr.slice(0, 3) : [10, 20, 30];
  interface DLLNode {
    id: string;
    value: number;
    nextId: string | null;
    prevId?: string | null;
  }

  let nodes: DLLNode[] = [];
  let headId: string | null = null;

  const cloneNodes = () => nodes.map(n => ({ ...n }));

  steps.push(createStep(stepId++, 'init', 'Initialize empty Doubly Linked List.', 1, {
    type: 'linked-list',
    elements: [],
    nodes: [],
    headId: null,
    actionType: 'traverse'
  } as DataStructurePayload));

  // Insert elements
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const newId = `node_${val}`;
    
    if (nodes.length === 0) {
      nodes.push({ id: newId, value: val, nextId: null, prevId: null });
      headId = newId;
      steps.push(createStep(stepId++, 'insert', `Insert ${val} as head node.`, 2, {
        type: 'linked-list',
        elements: [val],
        nodes: cloneNodes(),
        headId,
        activeNodeId: newId,
        actionNodeId: newId,
        actionType: 'insert'
      } as DataStructurePayload));
    } else {
      const prevNode = nodes[nodes.length - 1];
      prevNode.nextId = newId;
      nodes.push({ id: newId, value: val, nextId: null, prevId: prevNode.id });

      steps.push(createStep(stepId++, 'insert', `Append ${val}: Link prev node ${prevNode.value} <-> new node ${val}.`, 2, {
        type: 'linked-list',
        elements: values.slice(0, i + 1),
        nodes: cloneNodes(),
        headId,
        activeNodeId: newId,
        actionNodeId: newId,
        actionType: 'insert'
      } as DataStructurePayload));
    }
  }

  // Traversal reverse demo
  if (nodes.length >= 2) {
    // Start at tail
    const tailNode = nodes[nodes.length - 1];
    steps.push(createStep(stepId++, 'traverse', `Reverse Traversal: Start at tail node ${tailNode.value}.`, 3, {
      type: 'linked-list',
      elements: nodes.map(n => n.value),
      nodes: cloneNodes(),
      headId,
      activeNodeId: tailNode.id,
      actionType: 'traverse'
    } as DataStructurePayload));

    // step back
    const secondNode = nodes[nodes.length - 2];
    steps.push(createStep(stepId++, 'traverse', `Traverse backward using prev pointer to node ${secondNode.value}.`, 3, {
      type: 'linked-list',
      elements: nodes.map(n => n.value),
      nodes: cloneNodes(),
      headId,
      activeNodeId: secondNode.id,
      actionType: 'traverse'
    } as DataStructurePayload));
  }

  steps.push(createStep(stepId++, 'done', 'Doubly Linked List operations completed.', 4, {
    type: 'linked-list',
    elements: nodes.map(n => n.value),
    nodes: cloneNodes(),
    headId,
    actionType: 'traverse'
  } as DataStructurePayload));

  return steps;
}

// ─── 7. Circular Linked List ─────────────────────────────────────────────
export function generateCircularLinkedListSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const values = arr.length > 0 ? arr.slice(0, 3) : [10, 20, 30];

  interface NodeItem {
    id: string;
    value: number;
    nextId: string | null;
  }

  let nodes: NodeItem[] = [];
  let headId: string | null = null;
  const cloneNodes = () => nodes.map(n => ({ ...n }));

  steps.push(createStep(stepId++, 'init', 'Initialize empty Circular Linked List.', 1, {
    type: 'linked-list',
    elements: [],
    nodes: [],
    headId: null,
    actionType: 'traverse'
  } as DataStructurePayload));

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const newId = `node_${val}`;

    if (nodes.length === 0) {
      nodes.push({ id: newId, value: val, nextId: newId }); // points to self
      headId = newId;
      steps.push(createStep(stepId++, 'insert', `Insert Head node ${val}. Point its next back to itself.`, 2, {
        type: 'linked-list',
        elements: [val],
        nodes: cloneNodes(),
        headId,
        activeNodeId: newId,
        actionNodeId: newId,
        actionType: 'insert'
      } as DataStructurePayload));
    } else {
      const tail = nodes[nodes.length - 1];
      tail.nextId = newId;
      nodes.push({ id: newId, value: val, nextId: headId }); // tail next points to head
      steps.push(createStep(stepId++, 'insert', `Insert ${val}. Update new node next to Head node ${nodes[0].value} (circular connection).`, 2, {
        type: 'linked-list',
        elements: values.slice(0, i + 1),
        nodes: cloneNodes(),
        headId,
        activeNodeId: newId,
        actionNodeId: newId,
        actionType: 'insert'
      } as DataStructurePayload));
    }
  }

  // Traverse and wrap around
  if (nodes.length >= 2) {
    let current = nodes[0];
    steps.push(createStep(stepId++, 'traverse', `Traverse: Start at Head node ${current.value}.`, 3, {
      type: 'linked-list',
      elements: nodes.map(n => n.value),
      nodes: cloneNodes(),
      headId,
      activeNodeId: current.id,
      actionType: 'traverse'
    } as DataStructurePayload));

    for (let i = 1; i <= nodes.length; i++) {
      const nextIndex = i % nodes.length;
      current = nodes[nextIndex];
      const desc = nextIndex === 0
        ? `Circular jump: tail next points back to Head node ${current.value}!`
        : `Traverse to next node: ${current.value}.`;

      steps.push(createStep(stepId++, 'traverse', desc, 3, {
        type: 'linked-list',
        elements: nodes.map(n => n.value),
        nodes: cloneNodes(),
        headId,
        activeNodeId: current.id,
        actionType: 'traverse'
      } as DataStructurePayload));
    }
  }

  steps.push(createStep(stepId++, 'done', 'Circular Linked List traversal completed.', 4, {
    type: 'linked-list',
    elements: nodes.map(n => n.value),
    nodes: cloneNodes(),
    headId,
    actionType: 'traverse'
  } as DataStructurePayload));

  return steps;
}

// ─── 8. Lowest Common Ancestor (LCA) ──────────────────────────────────────
export function generateLCATreeSteps(treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  
  const vals = treeValues.length >= 5 ? treeValues.slice(0, 6) : [40, 20, 60, 10, 30, 50];
  const root = buildBST(vals);
  
  // Choose LCA target nodes: 10 and 30
  const p = 10;
  const q = 30;

  steps.push(createStep(stepId++, 'init', `Find LCA of P = ${p} and Q = ${q}. Root is ${root?.value}.`, 1, {
    root: cloneTree(root),
    current: null,
    visited: []
  } as TreePayload));

  // Trace search down the tree
  steps.push(createStep(stepId++, 'check', `Check root node 40. Since P (${p}) and Q (${q}) are both smaller than 40, go left.`, 3, {
    root: cloneTree(root),
    current: 'node_40',
    visited: ['node_40']
  } as TreePayload));

  steps.push(createStep(stepId++, 'check', `Move to left child 20. Check: P (${p}) is smaller (left) and Q (${q}) is larger (right).`, 5, {
    root: cloneTree(root),
    current: 'node_20',
    visited: ['node_40', 'node_20']
  } as TreePayload));

  steps.push(createStep(stepId++, 'found', `Since target nodes branch in opposite directions under 20, node 20 is their Lowest Common Ancestor.`, 6, {
    root: cloneTree(root),
    current: 'node_20',
    visited: ['node_40', 'node_20'],
    result: [20]
  } as TreePayload));

  return steps;
}

// ─── 9. Tree Diameter ────────────────────────────────────────────────────
export function generateTreeDiameterSteps(treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const vals = treeValues.length >= 5 ? treeValues.slice(0, 7) : [40, 20, 60, 10, 30, 50, 70];
  const root = buildBST(vals);

  steps.push(createStep(stepId++, 'init', 'Initialize Tree Diameter search. Run DFS from root to find farthest node.', 1, {
    root: cloneTree(root),
    current: null,
    visited: []
  } as TreePayload));

  // DFS 1
  steps.push(createStep(stepId++, 'dfs1', 'Run DFS from root node 40. Visited right branch down to leaf 70.', 1, {
    root: cloneTree(root),
    current: 'node_70',
    visited: ['node_40', 'node_60', 'node_70']
  } as TreePayload));

  // Found node 70 as farthest
  steps.push(createStep(stepId++, 'dfs1-result', 'Farthest node from root is leaf node 70.', 2, {
    root: cloneTree(root),
    current: 'node_70',
    visited: ['node_70']
  } as TreePayload));

  // DFS 2
  steps.push(createStep(stepId++, 'dfs2', 'Run DFS from node 70 to find farthest node on opposite side.', 2, {
    root: cloneTree(root),
    current: 'node_10',
    visited: ['node_70', 'node_60', 'node_40', 'node_20', 'node_10']
  } as TreePayload));

  // Highlight path
  steps.push(createStep(stepId++, 'done', 'Farthest node found is 10. Longest path is 10 <-> 20 <-> 40 <-> 60 <-> 70. Diameter = 4 edges.', 2, {
    root: cloneTree(root),
    current: null,
    visited: ['node_70', 'node_60', 'node_40', 'node_20', 'node_10'],
    result: [10, 20, 40, 60, 70]
  } as TreePayload));

  return steps;
}

// ─── 10. Tree Isomorphism ────────────────────────────────────────────────
export function generateTreeIsomorphismSteps(treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const vals = treeValues.length >= 3 ? treeValues.slice(0, 3) : [40, 20, 60];
  const root = buildBST(vals);

  steps.push(createStep(stepId++, 'init', 'Compare two trees to see if they are Isomorphic (structurally identical via node swaps).', 1, {
    root: cloneTree(root),
    current: null,
    visited: []
  } as TreePayload));

  steps.push(createStep(stepId++, 'compare', 'Compare roots: both contain root value 40. Recurse to compare subtrees.', 3, {
    root: cloneTree(root),
    current: 'node_40',
    visited: ['node_40']
  } as TreePayload));

  steps.push(createStep(stepId++, 'compare', 'Check left child 20 and right child 60 match on both structures.', 4, {
    root: cloneTree(root),
    current: 'node_20',
    visited: ['node_40', 'node_20', 'node_60']
  } as TreePayload));

  steps.push(createStep(stepId++, 'done', 'Subtree structural mappings match. Trees are isomorphic.', 5, {
    root: cloneTree(root),
    current: null,
    visited: ['node_40', 'node_20', 'node_60'],
    result: [1]
  } as TreePayload));

  return steps;
}

// ─── 11. Tree Serialization & Deserialization ───────────────────────────
export function generateTreeSerializeSteps(treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const vals = treeValues.length >= 4 ? treeValues.slice(0, 4) : [40, 20, 60, 10];
  const root = buildBST(vals);

  steps.push(createStep(stepId++, 'init', 'Start DFS serialization to string representation.', 1, {
    root: cloneTree(root),
    current: null,
    visited: [],
    result: []
  } as TreePayload));

  // Serializer traversal states

  steps.push(createStep(stepId++, 'serialize', 'Serialize root: write 40.', 1, {
    root: cloneTree(root),
    current: 'node_40',
    visited: ['node_40'],
    result: [40]
  } as TreePayload));

  steps.push(createStep(stepId++, 'serialize', 'Traverse left: write 20.', 1, {
    root: cloneTree(root),
    current: 'node_20',
    visited: ['node_40', 'node_20'],
    result: [40, 20]
  } as TreePayload));

  steps.push(createStep(stepId++, 'serialize', 'Traverse left: write 10.', 1, {
    root: cloneTree(root),
    current: 'node_10',
    visited: ['node_40', 'node_20', 'node_10'],
    result: [40, 20, 10]
  } as TreePayload));

  // Serialize completed representation showing null boundaries (#)
  steps.push(createStep(stepId++, 'done', 'Serialization completed. Encoded sequence is: "40,20,10,#,#,#,60,#,#"', 1, {
    root: cloneTree(root),
    current: null,
    visited: ['node_40', 'node_20', 'node_10', 'node_60'],
    result: [40, 20, 10, 60] // display values
  } as TreePayload));

  return steps;
}

// ─── 12. Abstract Syntax Tree (AST) ──────────────────────────────────────
export function generateSyntaxTreeSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Build Syntax Tree for: (3 + 5) * 2
  // We model this by configuring TreeNode elements with operator/isAST properties
  const nodeMul: TreeNode = { id: 'ast_mul', value: 0, operator: '*', isAST: true, left: null, right: null };
  const nodeAdd: TreeNode = { id: 'ast_add', value: 0, operator: '+', isAST: true, left: null, right: null };
  const node3: TreeNode = { id: 'ast_3', value: 3, isAST: true, left: null, right: null };
  const node5: TreeNode = { id: 'ast_5', value: 5, isAST: true, left: null, right: null };
  const node2: TreeNode = { id: 'ast_2', value: 2, isAST: true, left: null, right: null };

  nodeMul.left = nodeAdd;
  nodeMul.right = node2;
  nodeAdd.left = node3;
  nodeAdd.right = node5;

  steps.push(createStep(stepId++, 'init', 'Evaluate Abstract Syntax Tree (AST) for: (3 + 5) * 2 in post-order.', 1, {
    root: cloneTree(nodeMul),
    current: null,
    visited: []
  } as TreePayload));

  steps.push(createStep(stepId++, 'eval', 'Traverse left subtree. Leaf node value is 3.', 3, {
    root: cloneTree(nodeMul),
    current: 'ast_3',
    visited: ['ast_3']
  } as TreePayload));

  steps.push(createStep(stepId++, 'eval', 'Traverse right sibling. Leaf node value is 5.', 3, {
    root: cloneTree(nodeMul),
    current: 'ast_5',
    visited: ['ast_3', 'ast_5']
  } as TreePayload));

  // Compute addition
  const nodeAddResult = cloneTree(nodeMul);
  nodeAddResult!.left!.value = 8; // result of (3+5)
  steps.push(createStep(stepId++, 'eval-operator', 'Evaluate operator (+): 3 + 5 = 8. Update parent node value.', 5, {
    root: nodeAddResult,
    current: 'ast_add',
    visited: ['ast_3', 'ast_5', 'ast_add'],
    result: [8]
  } as TreePayload));

  steps.push(createStep(stepId++, 'eval', 'Traverse right sibling of root. Leaf node value is 2.', 3, {
    root: nodeAddResult,
    current: 'ast_2',
    visited: ['ast_3', 'ast_5', 'ast_add', 'ast_2'],
    result: [8]
  } as TreePayload));

  // Compute multiplication
  const finalTree = cloneTree(nodeMul);
  finalTree!.left!.value = 8;
  finalTree!.value = 16; // result of 8*2
  steps.push(createStep(stepId++, 'done', 'Evaluate operator (*): 8 * 2 = 16. Final AST output is 16.', 5, {
    root: finalTree,
    current: 'ast_mul',
    visited: ['ast_3', 'ast_5', 'ast_add', 'ast_2', 'ast_mul'],
    result: [8, 2, 16]
  } as TreePayload));

  return steps;
}

// ─── 13. Red-Black Tree ──────────────────────────────────────────────────
export function generateRedBlackTreeSteps(treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Insert values sequentially showing color configurations and balances
  const vals = treeValues.length >= 3 ? treeValues.slice(0, 3) : [20, 10, 30];
  
  // Step 1: Empty Tree
  steps.push(createStep(stepId++, 'init', 'Initialize empty Red-Black Tree.', 1, {
    root: null,
    current: null,
    visited: []
  } as TreePayload));

  // Insert 20 (Root is BLACK)
  const rootNode: TreeNode = { id: 'node_20', value: vals[0], color: 'BLACK', left: null, right: null };
  steps.push(createStep(stepId++, 'insert', `Insert root node ${vals[0]}. Root is colored BLACK.`, 2, {
    root: cloneTree(rootNode),
    current: 'node_20',
    visited: ['node_20']
  } as TreePayload));

  // Insert 10 (Left child is RED)
  rootNode.left = { id: 'node_10', value: vals[1], color: 'RED', parent: 'node_20', left: null, right: null };
  steps.push(createStep(stepId++, 'insert', `Insert left child ${vals[1]}. Default node insertions are colored RED.`, 3, {
    root: cloneTree(rootNode),
    current: 'node_10',
    visited: ['node_20', 'node_10']
  } as TreePayload));

  // Insert 30 (Right child is RED)
  if (vals[2] !== undefined) {
    rootNode.right = { id: 'node_30', value: vals[2], color: 'RED', parent: 'node_20', left: null, right: null };
    steps.push(createStep(stepId++, 'insert', `Insert right child ${vals[2]} as RED. Properties match: no double-red conflicts.`, 3, {
      root: cloneTree(rootNode),
      current: 'node_30',
      visited: ['node_20', 'node_10', 'node_30']
    } as TreePayload));
  }

  steps.push(createStep(stepId++, 'done', 'Red-Black Tree insertions completed. Constraints satisfied.', 4, {
    root: cloneTree(rootNode),
    current: null,
    visited: []
  } as TreePayload));

  return steps;
}

// ─── 14. B-Tree ──────────────────────────────────────────────────────────
export function generateBTreeSteps(_treeValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Since B-Trees have nodes with multiple values, we can model a multi-key node balance split using standard TreeNode fields
  const bNodeRoot: TreeNode = { id: 'b_node_root', value: 20, balance: 20, left: null, right: null }; // Represent keys via value/balance
  steps.push(createStep(stepId++, 'init', 'B-Tree insertion: start by placing keys into root node. (Root maximum keys: 3)', 1, {
    root: cloneTree(bNodeRoot),
    current: null,
    visited: []
  } as TreePayload));

  // Fill keys
  const filledRoot: TreeNode = {
    id: 'b_node_root',
    value: 10, // Left key
    balance: 20, // Middle key (simulate multiple keys)
    left: null,
    right: null
  };

  steps.push(createStep(stepId++, 'insert', 'Insert key 10. Node holds keys: [10, 20].', 2, {
    root: cloneTree(filledRoot),
    current: 'b_node_root',
    visited: ['b_node_root']
  } as TreePayload));

  // Node is split when full (Insert 30, split occurs)
  const splitRoot: TreeNode = { id: 'b_node_new_root', value: 20, left: null, right: null };
  const leftChild: TreeNode = { id: 'b_node_left', value: 10, parent: 'b_node_new_root', left: null, right: null };
  const rightChild: TreeNode = { id: 'b_node_right', value: 30, parent: 'b_node_new_root', left: null, right: null };
  splitRoot.left = leftChild;
  splitRoot.right = rightChild;

  steps.push(createStep(stepId++, 'split', 'Insert key 30. Keys exceed size threshold. Split node: promote middle element 20 as parent.', 3, {
    root: cloneTree(splitRoot),
    current: 'b_node_new_root',
    visited: ['b_node_new_root']
  } as TreePayload));

  steps.push(createStep(stepId++, 'done', 'B-Tree insertion completed.', 4, {
    root: cloneTree(splitRoot),
    current: null,
    visited: []
  } as TreePayload));

  return steps;
}

// ─── 15. Adjacency Matrix ────────────────────────────────────────────────
export function generateAdjacencyMatrixSteps(graphData: GraphData): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const nodeIds = graphData.nodes.map(n => n.id);
  const v = nodeIds.length;
  
  // Matrix Table initialized to 0
  const matrix: number[][] = Array(v).fill(null).map(() => Array(v).fill(0));

  steps.push(createStep(stepId++, 'init', 'Initialize empty Adjacency Matrix filled with 0s.', 1, {
    table: matrix.map(row => [...row]),
    rows: nodeIds,
    cols: nodeIds,
    activeCell: undefined
  } as DPPayload));

  // Fill edges
  for (let i = 0; i < graphData.edges.length; i++) {
    const edge = graphData.edges[i];
    const uIdx = nodeIds.indexOf(edge.source);
    const vIdx = nodeIds.indexOf(edge.target);
    const w = edge.weight !== undefined ? edge.weight : 1;

    if (uIdx !== -1 && vIdx !== -1) {
      matrix[uIdx][vIdx] = w;
      steps.push(createStep(stepId++, 'addEdge', `Add edge: ${edge.source} -> ${edge.target} with weight ${w}.`, 4, {
        table: matrix.map(row => [...row]),
        rows: nodeIds,
        cols: nodeIds,
        activeCell: [uIdx, vIdx]
      } as DPPayload));

      if (!graphData.directed) {
        matrix[vIdx][uIdx] = w;
        steps.push(createStep(stepId++, 'addEdge', `Add back edge: ${edge.target} -> ${edge.source} with weight ${w} (undirected).`, 5, {
          table: matrix.map(row => [...row]),
          rows: nodeIds,
          cols: nodeIds,
          activeCell: [vIdx, uIdx]
        } as DPPayload));
      }
    }
  }

  steps.push(createStep(stepId++, 'done', 'Adjacency Matrix construction completed.', 6, {
    table: matrix.map(row => [...row]),
    rows: nodeIds,
    cols: nodeIds,
    result: graphData.edges.length
  } as DPPayload));

  return steps;
}

// ─── 16. Adjacency List ──────────────────────────────────────────────────
export function generateAdjacencyListSteps(graphData: GraphData): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const nodeIds = graphData.nodes.map(n => n.id);
  const v = nodeIds.length;

  // Initialize adjacency list as flat rows representing lists
  const table: number[][] = Array(v).fill(null).map(() => []);
  const listDetails: string[] = Array(v).fill('Empty list');

  const getRowsLabel = () => nodeIds.map((id, idx) => `${id} -> ${listDetails[idx]}`);

  steps.push(createStep(stepId++, 'init', 'Initialize empty Adjacency List array of size V.', 1, {
    table: table.map(row => [...row]),
    rows: getRowsLabel(),
    cols: ['Neighbors']
  } as DPPayload));

  // Add connections
  for (let i = 0; i < graphData.edges.length; i++) {
    const edge = graphData.edges[i];
    const uIdx = nodeIds.indexOf(edge.source);
    const vIdx = nodeIds.indexOf(edge.target);
    const w = edge.weight !== undefined ? edge.weight : 1;

    if (uIdx !== -1 && vIdx !== -1) {
      table[uIdx].push(vIdx);
      listDetails[uIdx] = table[uIdx].map(idx => `${nodeIds[idx]}(w:${w})`).join(' -> ');

      steps.push(createStep(stepId++, 'addEdge', `Append neighbor: add (${edge.target}, weight:${w}) to list ${edge.source}.`, 4, {
        table: table.map(row => [...row]),
        rows: getRowsLabel(),
        cols: ['Neighbors'],
        activeCell: [uIdx, 0]
      } as DPPayload));

      if (!graphData.directed) {
        table[vIdx].push(uIdx);
        listDetails[vIdx] = table[vIdx].map(idx => `${nodeIds[idx]}(w:${w})`).join(' -> ');

        steps.push(createStep(stepId++, 'addEdge', `Append back neighbor: add (${edge.source}, weight:${w}) to list ${edge.target} (undirected).`, 4, {
          table: table.map(row => [...row]),
          rows: getRowsLabel(),
          cols: ['Neighbors'],
          activeCell: [vIdx, 0]
        } as DPPayload));
      }
    }
  }

  steps.push(createStep(stepId++, 'done', 'Adjacency List construction completed.', 5, {
    table: table.map(row => [...row]),
    rows: getRowsLabel(),
    cols: ['Neighbors'],
    result: graphData.edges.length
  } as DPPayload));

  return steps;
}

// ─── 17. Topological Sort ────────────────────────────────────────────────
export function generateTopologicalSortSteps(graphData: GraphData): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Force directed graph for topological sort
  const graph: GraphData = {
    ...graphData,
    directed: true
  };

  const nodes = graph.nodes.map(n => n.id);
  const edges = graph.edges;

  // Step 1: Calculate indegrees
  const indegree: Record<string, number> = {};
  for (const n of nodes) indegree[n] = 0;
  for (const e of edges) {
    indegree[e.target] = (indegree[e.target] || 0) + 1;
  }

  steps.push(createStep(stepId++, 'init', 'Topological Sort (Kahn\'s Algorithm): compute in-degrees for all vertices.', 2, {
    graph,
    visited: [],
    queue: [],
    distances: { ...indegree } // Display in-degree in place of distances!
  } as GraphPayload));

  // Find vertices with in-degree 0
  const queue: string[] = [];
  for (const n of nodes) {
    if (indegree[n] === 0) queue.push(n);
  }

  steps.push(createStep(stepId++, 'find-zero', `Queue initial vertices with in-degree = 0: [${queue.join(', ')}]`, 3, {
    graph,
    visited: [],
    queue: [...queue],
    distances: { ...indegree }
  } as GraphPayload));

  const result: string[] = [];
  const visited: string[] = [];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    visited.push(curr);
    result.push(curr);

    steps.push(createStep(stepId++, 'dequeue', `Dequeue vertex ${curr}. Add to sorted order list.`, 4, {
      graph,
      visited: [...visited],
      queue: [...queue],
      current: curr,
      distances: { ...indegree }
    } as GraphPayload));

    // Reduce neighbor indegrees
    const neighbors: string[] = [];
    for (const e of edges) {
      if (e.source === curr) {
        neighbors.push(e.target);
        indegree[e.target]--;
        
        steps.push(createStep(stepId++, 'reduce-indegree', `Reduce in-degree of neighbor ${e.target} to ${indegree[e.target]}.`, 5, {
          graph,
          visited: [...visited],
          queue: [...queue],
          current: curr,
          distances: { ...indegree }
        } as GraphPayload));

        if (indegree[e.target] === 0) {
          queue.push(e.target);
          steps.push(createStep(stepId++, 'queue-neighbor', `In-degree of ${e.target} reached 0. Push it to queue.`, 5, {
            graph,
            visited: [...visited],
            queue: [...queue],
            current: curr,
            distances: { ...indegree }
          } as GraphPayload));
        }
      }
    }
  }

  steps.push(createStep(stepId++, 'done', `Topological sorting complete. Linear order is: ${result.join(' -> ')}`, 6, {
    graph,
    visited: [...visited],
    queue: [...queue],
    distances: { ...indegree },
    path: [...result]
  } as GraphPayload));

  return steps;
}

// ─── 18. Fenwick Tree ────────────────────────────────────────────────────
export function generateFenwickTreeSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const array = arr.length > 0 ? arr.slice(0, 5) : [3, 2, -1, 6, 5];
  const n = array.length;
  
  // BIT is 1-indexed, size n + 1
  const tree = Array(n + 1).fill(0);

  steps.push(createStep(stepId++, 'init', `Initialize Fenwick Tree (Binary Indexed Tree) for array [${array.join(', ')}].`, 1, {
    array: [0, ...tree], // display indices
    comparing: [],
    swapping: []
  } as SortingPayload));

  // Build tree
  for (let i = 1; i <= n; i++) {
    const val = array[i - 1];
    let idx = i;
    
    steps.push(createStep(stepId++, 'update-start', `Update element at index ${i} with value ${val}.`, 1, {
      array: [0, ...tree],
      comparing: [idx]
    } as SortingPayload));

    while (idx <= n) {
      tree[idx] += val;
      const prevIdx = idx;
      
      steps.push(createStep(stepId++, 'update', `Add ${val} to tree[${idx}] = ${tree[idx]}. Jump to next dependent index: idx += (idx & -idx) = ${idx + (idx & -idx)}.`, 1, {
        array: [0, ...tree],
        swapping: [prevIdx]
      } as SortingPayload));

      idx += idx & -idx;
    }
  }

  steps.push(createStep(stepId++, 'done', `Fenwick Tree construction completed. BIT array is [${tree.join(', ')}].`, 1, {
    array: [0, ...tree],
    sorted: Array.from({ length: n + 1 }, (_, i) => i)
  } as SortingPayload));

  return steps;
}
