import type { Step, TreeNode, TreePayload } from './types';


// Helper to deep copy a tree
function cloneTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  return {
    id: root.id,
    value: root.value,
    left: cloneTree(root.left || null),
    right: cloneTree(root.right || null),
    height: root.height,
    parent: root.parent,
  };
}

function createTreeStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  root: TreeNode | null,
  current?: string | null,
  comparing?: string | null,
  visited?: string[],
  callStack?: string[],
  result?: number[]
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      root: cloneTree(root),
      current,
      comparing,
      visited: visited ? [...visited] : undefined,
      callStack: callStack ? [...callStack] : undefined,
      result: result ? [...result] : undefined,
    } as TreePayload,
  };
}

// ─── BST Insert & Traversals ──────────────────────────────────────────────────

export function generateBSTInsertSteps(initialRoot: TreeNode | null, newValue: number): { steps: Step[]; newRoot: TreeNode | null } {
  const steps: Step[] = [];
  let stepId = 0;
  let root = cloneTree(initialRoot);

  const newNodeId = `node-${Date.now()}-${newValue}`;
  const newNode: TreeNode = {
    id: newNodeId,
    value: newValue,
    left: null,
    right: null,
    parent: null,
  };

  if (!root) {
    root = newNode;
    steps.push(createTreeStep(stepId++, 'insert-root', `Tree is empty. Insert value ${newValue} as the root node.`, 1, root, newNodeId));
    return { steps, newRoot: root };
  }

  steps.push(createTreeStep(stepId++, 'start-insert', `Start BST insertion for value ${newValue} from the root node.`, 2, root, root.id));

  let current: TreeNode | null = root;
  let parentNode: TreeNode | null = null;

  while (current) {
    parentNode = current;
    steps.push(createTreeStep(stepId++, 'compare', `Compare value ${newValue} with current node ${current.value}.`, 3, root, current.id, current.id));

    if (newValue < current.value) {
      steps.push(createTreeStep(stepId++, 'move-left', `Since ${newValue} < ${current.value}, check the left child.`, 4, root, current.id));
      if (!current.left) {
        current.left = { ...newNode, parent: parentNode.id };
        steps.push(createTreeStep(stepId++, 'insert-left', `Left child is empty. Insert node ${newValue} here.`, 5, root, current.left.id));
        break;
      }
      current = current.left;
    } else {
      steps.push(createTreeStep(stepId++, 'move-right', `Since ${newValue} >= ${current.value}, check the right child.`, 6, root, current.id));
      if (!current.right) {
        current.right = { ...newNode, parent: parentNode.id };
        steps.push(createTreeStep(stepId++, 'insert-right', `Right child is empty. Insert node ${newValue} here.`, 7, root, current.right.id));
        break;
      }
      current = current.right;
    }
  }

  steps.push(createTreeStep(stepId++, 'done', `Finished BST insertion of value ${newValue}.`, 9, root));
  return { steps, newRoot: root };
}

// ─── BST Traversals ───────────────────────────────────────────────────────────

export function generateTraversalSteps(root: TreeNode | null, type: 'inorder' | 'preorder' | 'postorder'): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const visited: string[] = [];
  const result: number[] = [];
  const callStack: string[] = [];

  steps.push(createTreeStep(stepId++, 'init', `Start ${type} traversal. Root: ${root ? root.value : 'Empty'}.`, 1, root, root?.id, null, visited, callStack, result));

  function traverse(node: TreeNode | null) {
    if (!node) {
      steps.push(createTreeStep(stepId++, 'base-case', 'Encountered null node. Backtrack.', 2, root, null, null, visited, callStack, result));
      return;
    }

    callStack.push(`traverse(${node.value})`);
    steps.push(createTreeStep(stepId++, 'visit-node', `Call traversal on node ${node.value}. Push to recursion stack.`, 3, root, node.id, null, visited, callStack, result));

    if (type === 'preorder') {
      result.push(node.value);
      visited.push(node.id);
      steps.push(createTreeStep(stepId++, 'record-preorder', `Pre-order: Record node ${node.value} immediately.`, 4, root, node.id, null, visited, callStack, result));
    }

    // Traverse left
    steps.push(createTreeStep(stepId++, 'traverse-left', `Traverse left subtree of node ${node.value}.`, 5, root, node.id, null, visited, callStack, result));
    traverse(node.left || null);

    if (type === 'inorder') {
      result.push(node.value);
      visited.push(node.id);
      steps.push(createTreeStep(stepId++, 'record-inorder', `In-order: Record node ${node.value} after left subtree completes.`, 6, root, node.id, null, visited, callStack, result));
    }

    // Traverse right
    steps.push(createTreeStep(stepId++, 'traverse-right', `Traverse right subtree of node ${node.value}.`, 7, root, node.id, null, visited, callStack, result));
    traverse(node.right || null);

    if (type === 'postorder') {
      result.push(node.value);
      visited.push(node.id);
      steps.push(createTreeStep(stepId++, 'record-postorder', `Post-order: Record node ${node.value} after both subtrees complete.`, 8, root, node.id, null, visited, callStack, result));
    }

    callStack.pop();
    steps.push(createTreeStep(stepId++, 'return-node', `Finished node ${node.value}. Pop from recursion stack.`, 9, root, node.parent, null, visited, callStack, result));
  }

  traverse(root);
  steps.push(createTreeStep(stepId++, 'done', `${type} traversal complete! Traversals result: [${result.join(', ')}].`, 10, root, null, null, visited, callStack, result));
  return steps;
}

// ─── AVL Tree Balanced Rotations ─────────────────────────────────────────────

// Helper to get node height
function getHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return node.height ?? 1;
}

// Helper to get balance factor
function getBalance(node: TreeNode | null): number {
  if (!node) return 0;
  return getHeight(node.left || null) - getHeight(node.right || null);
}

// Update heights recursively
function updateHeights(node: TreeNode | null) {
  if (!node) return;
  updateHeights(node.left || null);
  updateHeights(node.right || null);
  node.height = Math.max(getHeight(node.left || null), getHeight(node.right || null)) + 1;
  node.balance = getBalance(node);
}

export function generateAVLSteps(initialValues: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  let root: TreeNode | null = null;

  function rotateRight(y: TreeNode): TreeNode {
    const x = y.left!;
    const T2 = x.right || null;

    steps.push(createTreeStep(
      stepId++,
      'rotate-right-prep',
      `Imbalance at node ${y.value} (balance = ${getBalance(y)}). Perform RIGHT rotation around node ${x.value}.`,
      3,
      root,
      y.id,
      x.id
    ));

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update parent pointers
    x.parent = y.parent;
    y.parent = x.id;
    if (T2) T2.parent = y.id;

    // Update heights
    y.height = Math.max(getHeight(y.left || null), getHeight(y.right || null)) + 1;
    x.height = Math.max(getHeight(x.left || null), getHeight(x.right || null)) + 1;
    y.balance = getBalance(y);
    x.balance = getBalance(x);

    return x;
  }

  function rotateLeft(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left || null;

    steps.push(createTreeStep(
      stepId++,
      'rotate-left-prep',
      `Imbalance at node ${x.value} (balance = ${getBalance(x)}). Perform LEFT rotation around node ${y.value}.`,
      4,
      root,
      x.id,
      y.id
    ));

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update parent pointers
    y.parent = x.parent;
    x.parent = y.id;
    if (T2) T2.parent = x.id;

    // Update heights
    x.height = Math.max(getHeight(x.left || null), getHeight(x.right || null)) + 1;
    y.height = Math.max(getHeight(y.left || null), getHeight(y.right || null)) + 1;
    x.balance = getBalance(x);
    y.balance = getBalance(y);

    return y;
  }

  function insert(node: TreeNode | null, val: number, parentId: string | null = null): TreeNode {
    if (!node) {
      const newNodeId = `avl-node-${stepId}-${val}`;
      const newNode: TreeNode = {
        id: newNodeId,
        value: val,
        left: null,
        right: null,
        height: 1,
        parent: parentId,
        balance: 0,
      };
      
      // Update global root reference temporarily for step visualization
      if (!root) root = newNode;

      steps.push(createTreeStep(
        stepId++,
        'avl-insert-leaf',
        `Insert value ${val} as a new leaf node under parent.`,
        1,
        root,
        newNodeId
      ));
      return newNode;
    }

    steps.push(createTreeStep(
      stepId++,
      'avl-compare',
      `Compare value ${val} with current node ${node.value}.`,
      2,
      root,
      node.id,
      node.id
    ));

    if (val < node.value) {
      node.left = insert(node.left || null, val, node.id);
    } else if (val > node.value) {
      node.right = insert(node.right || null, val, node.id);
    } else {
      return node; // Duplicate values not allowed in AVL Tree
    }

    // Update height of ancestor
    node.height = Math.max(getHeight(node.left || null), getHeight(node.right || null)) + 1;
    node.balance = getBalance(node);

    const balance = getBalance(node);

    // Rebalance cases:
    
    // 1. Left Left Case
    if (balance > 1 && val < node.left!.value) {
      const parentOfNode = node.parent;
      const isLeftChild = parentOfNode && root && findNode(root, parentOfNode)?.left?.id === node.id;

      const rotated = rotateRight(node);
      if (!parentOfNode) {
        root = rotated;
      } else {
        const p = findNode(root!, parentOfNode);
        if (p) {
          if (isLeftChild) p.left = rotated;
          else p.right = rotated;
        }
      }
      updateHeights(root);
      steps.push(createTreeStep(stepId++, 'avl-rebalanced', `Left-Left case resolved with Right Rotation. Tree is balanced.`, 5, root));
      return rotated;
    }

    // 2. Right Right Case
    if (balance < -1 && val > node.right!.value) {
      const parentOfNode = node.parent;
      const isLeftChild = parentOfNode && root && findNode(root, parentOfNode)?.left?.id === node.id;

      const rotated = rotateLeft(node);
      if (!parentOfNode) {
        root = rotated;
      } else {
        const p = findNode(root!, parentOfNode);
        if (p) {
          if (isLeftChild) p.left = rotated;
          else p.right = rotated;
        }
      }
      updateHeights(root);
      steps.push(createTreeStep(stepId++, 'avl-rebalanced', `Right-Right case resolved with Left Rotation. Tree is balanced.`, 6, root));
      return rotated;
    }

    // 3. Left Right Case
    if (balance > 1 && val > node.left!.value) {
      steps.push(createTreeStep(stepId++, 'avl-double-prep', `Left-Right case detected. First rotate left around child node ${node.left!.value}.`, 7, root, node.left!.id));
      
      node.left = rotateLeft(node.left!);
      updateHeights(root);
      
      const parentOfNode = node.parent;
      const isLeftChild = parentOfNode && root && findNode(root, parentOfNode)?.left?.id === node.id;

      const rotated = rotateRight(node);
      if (!parentOfNode) {
        root = rotated;
      } else {
        const p = findNode(root!, parentOfNode);
        if (p) {
          if (isLeftChild) p.left = rotated;
          else p.right = rotated;
        }
      }
      updateHeights(root);
      steps.push(createTreeStep(stepId++, 'avl-rebalanced', `Left-Right rotation resolved. Tree is balanced.`, 8, root));
      return rotated;
    }

    // 4. Right Left Case
    if (balance < -1 && val < node.right!.value) {
      steps.push(createTreeStep(stepId++, 'avl-double-prep', `Right-Left case detected. First rotate right around child node ${node.right!.value}.`, 9, root, node.right!.id));
      
      node.right = rotateRight(node.right!);
      updateHeights(root);

      const parentOfNode = node.parent;
      const isLeftChild = parentOfNode && root && findNode(root, parentOfNode)?.left?.id === node.id;

      const rotated = rotateLeft(node);
      if (!parentOfNode) {
        root = rotated;
      } else {
        const p = findNode(root!, parentOfNode);
        if (p) {
          if (isLeftChild) p.left = rotated;
          else p.right = rotated;
        }
      }
      updateHeights(root);
      steps.push(createTreeStep(stepId++, 'avl-rebalanced', `Right-Left rotation resolved. Tree is balanced.`, 10, root));
      return rotated;
    }

    return node;
  }

  // Helper search node
  function findNode(curr: TreeNode | null, id: string): TreeNode | null {
    if (!curr) return null;
    if (curr.id === id) return curr;
    return findNode(curr.left || null, id) || findNode(curr.right || null, id);
  }

  // Insert all values one-by-one, generating step frames
  for (const v of initialValues) {
    steps.push(createTreeStep(stepId++, 'avl-insert-start', `Begin insertion of value ${v}.`, 0, root));
    root = insert(root, v);
    updateHeights(root);
  }

  steps.push(createTreeStep(stepId++, 'done', `AVL Tree balancing completed for all keys!`, 11, root));
  return steps;
}

