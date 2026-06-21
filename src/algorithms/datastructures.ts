import type { Step, DataStructurePayload } from './types';

// Helper to create a datastructure step
function createDSStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  payload: DataStructurePayload
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload,
  };
}

// ─── Stack Operations Step Generator ────────────────────────────────────────
export function generateStackSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const elements: number[] = [];

  // 1. Init empty stack
  steps.push(
    createDSStep(stepId++, 'init', 'Initialize empty stack. Top is null (-1).', 1, {
      type: 'stack',
      elements: [...elements],
      actionType: 'push',
    })
  );

  // 2. Push elements
  const valuesToPush = arr.length > 0 ? arr.slice(0, 4) : [10, 20, 30, 40];
  
  for (let i = 0; i < valuesToPush.length; i++) {
    const val = valuesToPush[i];
    elements.push(val);
    steps.push(
      createDSStep(stepId++, 'push', `Push ${val} onto the stack. Elements count: ${elements.length}.`, 2, {
        type: 'stack',
        elements: [...elements],
        topIndex: elements.length - 1,
        activeIndex: elements.length - 1,
        actionType: 'push',
      })
    );
  }

  // 3. Peek top element
  if (elements.length > 0) {
    steps.push(
      createDSStep(stepId++, 'peek', `Peek top element: ${elements[elements.length - 1]} at index ${elements.length - 1}.`, 3, {
        type: 'stack',
        elements: [...elements],
        topIndex: elements.length - 1,
        activeIndex: elements.length - 1,
        actionType: 'peek',
      })
    );
  }

  // 4. Pop elements
  const popCount = Math.min(2, elements.length);
  for (let i = 0; i < popCount; i++) {
    const popped = elements.pop();
    steps.push(
      createDSStep(stepId++, 'pop', `Pop element ${popped} from the stack.`, 4, {
        type: 'stack',
        elements: [...elements],
        topIndex: elements.length > 0 ? elements.length - 1 : undefined,
        activeIndex: elements.length > 0 ? elements.length - 1 : undefined,
        actionType: 'pop',
      })
    );

    // Peek new top if available
    if (elements.length > 0) {
      steps.push(
        createDSStep(stepId++, 'peek', `New stack top is ${elements[elements.length - 1]} at index ${elements.length - 1}.`, 5, {
          type: 'stack',
          elements: [...elements],
          topIndex: elements.length - 1,
          activeIndex: elements.length - 1,
          actionType: 'peek',
        })
      );
    }
  }

  steps.push(
    createDSStep(stepId++, 'done', 'Stack operations complete!', 6, {
      type: 'stack',
      elements: [...elements],
      topIndex: elements.length > 0 ? elements.length - 1 : undefined,
      actionType: 'peek',
    })
  );

  return steps;
}

// ─── Queue Operations Step Generator ────────────────────────────────────────
export function generateQueueSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const elements: number[] = [];

  // 1. Init empty queue
  steps.push(
    createDSStep(stepId++, 'init', 'Initialize empty queue. Front and Rear are null (-1).', 1, {
      type: 'queue',
      elements: [...elements],
      actionType: 'enqueue',
    })
  );

  // 2. Enqueue elements
  const valuesToEnqueue = arr.length > 0 ? arr.slice(0, 4) : [10, 20, 30, 40];
  for (let i = 0; i < valuesToEnqueue.length; i++) {
    const val = valuesToEnqueue[i];
    elements.push(val);
    steps.push(
      createDSStep(stepId++, 'enqueue', `Enqueue ${val} at the rear of the queue.`, 2, {
        type: 'queue',
        elements: [...elements],
        frontIndex: 0,
        rearIndex: elements.length - 1,
        activeIndex: elements.length - 1,
        actionType: 'enqueue',
      })
    );
  }

  // 3. Dequeue elements
  const dequeueCount = Math.min(2, elements.length);
  for (let i = 0; i < dequeueCount; i++) {
    const dequeued = elements.shift();
    steps.push(
      createDSStep(stepId++, 'dequeue', `Dequeue element ${dequeued} from the front of the queue.`, 4, {
        type: 'queue',
        elements: [...elements],
        frontIndex: elements.length > 0 ? 0 : undefined,
        rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
        activeIndex: 0,
        actionType: 'dequeue',
      })
    );
  }

  steps.push(
    createDSStep(stepId++, 'done', 'Queue operations complete!', 5, {
      type: 'queue',
      elements: [...elements],
      frontIndex: elements.length > 0 ? 0 : undefined,
      rearIndex: elements.length > 0 ? elements.length - 1 : undefined,
      actionType: 'enqueue',
    })
  );

  return steps;
}

// ─── Singly Linked List Step Generator ──────────────────────────────────────
export function generateLinkedListSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Let's model nodes. Node: { id, value, nextId }
  const values = arr.length > 0 ? arr.slice(0, 4) : [10, 20, 30];
  interface NodeItem {
    id: string;
    value: number;
    nextId: string | null;
  }

  let nodes: NodeItem[] = [];
  let headId: string | null = null;

  // Helpers to copy node states
  const cloneNodes = () => nodes.map(n => ({ ...n }));

  // 1. Initialize List
  steps.push(
    createDSStep(stepId++, 'init', 'Initialize empty linked list. Head is null.', 1, {
      type: 'linked-list',
      elements: [],
      nodes: [],
      headId: null,
      actionType: 'traverse',
    })
  );

  // 2. Insert nodes sequentially
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const newId = `node_${val}`;
    
    if (nodes.length === 0) {
      // First node (head)
      const newNode = { id: newId, value: val, nextId: null };
      nodes.push(newNode);
      headId = newId;

      steps.push(
        createDSStep(stepId++, 'insert', `Insert ${val} at head. Point Head to new node.`, 2, {
          type: 'linked-list',
          elements: values.slice(0, i + 1),
          nodes: cloneNodes(),
          headId,
          activeNodeId: newId,
          actionNodeId: newId,
          actionType: 'insert',
        })
      );
    } else {
      // Append node: Traverse to the end first to find tail node
      const currentListElements = values.slice(0, i + 1);
      
      // Step: Start traversal from head
      let currentId = headId;
      steps.push(
        createDSStep(stepId++, 'traverse', `Append ${val}: Start traversal at Head node (${nodes.find(n => n.id === headId)?.value}).`, 3, {
          type: 'linked-list',
          elements: currentListElements,
          nodes: cloneNodes(),
          headId,
          activeNodeId: headId,
          actionType: 'traverse',
        })
      );

      // Traversal simulation
      while (currentId !== null) {
        const currNode = nodes.find(n => n.id === currentId)!;
        if (currNode.nextId === null) {
          // Found tail
          break;
        }
        currentId = currNode.nextId;
        steps.push(
          createDSStep(stepId++, 'traverse', `Traverse to next node: (${nodes.find(n => n.id === currentId)?.value}).`, 3, {
            type: 'linked-list',
            elements: currentListElements,
            nodes: cloneNodes(),
            headId,
            activeNodeId: currentId,
            actionType: 'traverse',
          })
        );
      }

      // Append
      const tailNode = nodes.find(n => n.id === currentId)!;
      tailNode.nextId = newId;
      const newNode = { id: newId, value: val, nextId: null };
      nodes.push(newNode);

      steps.push(
        createDSStep(stepId++, 'insert', `Set tail node ${tailNode.value}.next to point to new node ${val}.`, 4, {
          type: 'linked-list',
          elements: currentListElements,
          nodes: cloneNodes(),
          headId,
          activeNodeId: newId,
          actionNodeId: newId,
          actionType: 'insert',
        })
      );
    }
  }

  // 3. Traversal (Complete list search/traverse demo)
  if (nodes.length > 0) {
    steps.push(
      createDSStep(stepId++, 'traverse-start', 'Start traversing the final linked list from head.', 5, {
        type: 'linked-list',
        elements: values,
        nodes: cloneNodes(),
        headId,
        activeNodeId: headId,
        actionType: 'traverse',
      })
    );

    let tempId = headId;
    while (tempId !== null) {
      const node = nodes.find(n => n.id === tempId)!;
      tempId = node.nextId;
      if (tempId !== null) {
        steps.push(
          createDSStep(stepId++, 'traverse-next', `Move to next node: ${nodes.find(n => n.id === tempId)?.value}.`, 5, {
            type: 'linked-list',
            elements: values,
            nodes: cloneNodes(),
            headId,
            activeNodeId: tempId,
            actionType: 'traverse',
          })
        );
      }
    }
  }

  // 4. Deletion demo (delete second node if list has >= 3 nodes)
  if (nodes.length >= 3) {
    const nodeToDeleteVal = values[1];
    const nodeToDeleteId = `node_${nodeToDeleteVal}`;
    const firstNode = nodes[0];
    const secondNode = nodes[1];
    const thirdNode = nodes[2];

    steps.push(
      createDSStep(stepId++, 'delete-start', `Find and delete node containing value ${nodeToDeleteVal}. Start scanning from Head.`, 6, {
        type: 'linked-list',
        elements: values,
        nodes: cloneNodes(),
        headId,
        activeNodeId: firstNode.id,
        actionNodeId: nodeToDeleteId,
        actionType: 'traverse',
      })
    );

    steps.push(
      createDSStep(stepId++, 'delete-match', `Node matched: ${secondNode.value}. Bypass it by linking predecessor (${firstNode.value}) directly to successor (${thirdNode.value}).`, 7, {
        type: 'linked-list',
        elements: values,
        nodes: cloneNodes(),
        headId,
        activeNodeId: nodeToDeleteId,
        actionNodeId: nodeToDeleteId,
        actionType: 'traverse',
      })
    );

    // Bypass
    firstNode.nextId = thirdNode.id;
    // Remove secondNode from list
    nodes = nodes.filter(n => n.id !== nodeToDeleteId);

    steps.push(
      createDSStep(stepId++, 'delete', `Node ${nodeToDeleteVal} deleted. Memory deallocated.`, 8, {
        type: 'linked-list',
        elements: values.filter(v => v !== nodeToDeleteVal),
        nodes: cloneNodes(),
        headId,
        activeNodeId: firstNode.id,
        actionType: 'delete',
      })
    );
  }

  steps.push(
    createDSStep(stepId++, 'done', 'Linked list operations complete!', 9, {
      type: 'linked-list',
      elements: nodes.map(n => n.value),
      nodes: cloneNodes(),
      headId,
      actionType: 'traverse',
    })
  );

  return steps;
}
