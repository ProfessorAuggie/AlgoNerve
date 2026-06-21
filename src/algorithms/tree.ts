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
