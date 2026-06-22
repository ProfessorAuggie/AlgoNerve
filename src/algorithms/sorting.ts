import type { Step, SortingPayload } from './types';


// Helper to create a sorting step
function createSortingStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  array: number[],
  comparing?: number[],
  swapping?: number[],
  sorted?: number[],
  pivot?: number,
  left?: number,
  right?: number,
  mid?: number
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      array: [...array],
      comparing,
      swapping,
      sorted,
      pivot,
      left,
      right,
      mid,
    } as SortingPayload,
  };
}

// ─── Bubble Sort ─────────────────────────────────────────────────────────────
export function generateBubbleSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  for (let i = 0; i < n - 1; i++) {
    steps.push(createSortingStep(stepId++, 'outer-loop', `Outer loop iteration ${i + 1}: pass through elements up to index ${n - 1 - i}.`, 2, array, [], [], []));
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) and array[${j + 1}] (${array[j + 1]}).`, 4, array, [j, j + 1], [], []));
      
      if (array[j] > array[j + 1]) {
        // Swap
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        
        steps.push(createSortingStep(stepId++, 'swap', `Since ${temp} > ${array[j]}, swap them.`, 5, array, [], [j, j + 1], []));
      }
    }
    // Element at index n - 1 - i is sorted
    const sortedSoFar = Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx);
    steps.push(createSortingStep(stepId++, 'sorted', `Element at index ${n - 1 - i} is now in its final position.`, 6, array, [], [], sortedSoFar));
  }

  // Final sorted step
  steps.push(createSortingStep(stepId++, 'done', 'Bubble Sort complete! The array is fully sorted.', 8, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Insertion Sort ──────────────────────────────────────────────────────────
export function generateInsertionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    steps.push(createSortingStep(stepId++, 'outer-loop', `Pick element array[${i}] (${key}) as the key to insert.`, 2, array, [i], [], []));

    while (j >= 0 && array[j] > key) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare key (${key}) with array[${j}] (${array[j]}). Since ${array[j]} > ${key}, shift array[${j}] to the right.`, 4, array, [j, j + 1], [], []));
      
      array[j + 1] = array[j];
      j--;
      
      steps.push(createSortingStep(stepId++, 'shift', `Shift element and move pointer left.`, 5, array, [], [j + 1, j + 2], []));
    }
    
    array[j + 1] = key;
    steps.push(createSortingStep(stepId++, 'insert', `Insert key (${key}) at index ${j + 1}.`, 7, array, [], [j + 1], []));
  }

  steps.push(createSortingStep(stepId++, 'done', 'Insertion Sort complete! The array is fully sorted.', 9, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Merge Sort ──────────────────────────────────────────────────────────────
export function generateMergeSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  function merge(left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;
    
    steps.push(createSortingStep(stepId++, 'merge-start', `Merge subarrays [${left}...${mid}] and [${mid + 1}...${right}]`, 3, array, [], [], [], undefined, left, right, mid));

    while (i <= mid && j <= right) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare element at index ${i} (${array[i]}) and index ${j} (${array[j]})`, 5, array, [i, j], [], [], undefined, left, right, mid));
      if (array[i] <= array[j]) {
        temp.push(array[i++]);
      } else {
        temp.push(array[j++]);
      }
    }

    while (i <= mid) {
      steps.push(createSortingStep(stepId++, 'copy-left', `Copy remaining element at index ${i} (${array[i]}) from left subarray`, 6, array, [i], [], [], undefined, left, right, mid));
      temp.push(array[i++]);
    }

    while (j <= right) {
      steps.push(createSortingStep(stepId++, 'copy-right', `Copy remaining element at index ${j} (${array[j]}) from right subarray`, 7, array, [j], [], [], undefined, left, right, mid));
      temp.push(array[j++]);
    }

    for (let k = 0; k < temp.length; k++) {
      array[left + k] = temp[k];
    }
    
    steps.push(createSortingStep(stepId++, 'merge-end', `Merged results written back to the array: [${temp.join(', ')}]`, 9, array, [], [], Array.from({ length: right - left + 1 }, (_, idx) => left + idx), undefined, left, right, mid));
  }

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    steps.push(createSortingStep(stepId++, 'split', `Divide: split subarray [${left}...${right}] into [${left}...${mid}] and [${mid + 1}...${right}]`, 2, array, [], [], [], undefined, left, right, mid));
    
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSort(0, array.length - 1);
  steps.push(createSortingStep(stepId++, 'done', 'Merge Sort complete!', 10, array, [], [], Array.from({ length: array.length }, (_, idx) => idx)));
  return steps;
}

// ─── Quick Sort ──────────────────────────────────────────────────────────────
export function generateQuickSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  function partition(low: number, high: number): number {
    const pivot = array[high];
    steps.push(createSortingStep(stepId++, 'pivot', `Choose pivot element array[${high}] (${pivot}).`, 3, array, [], [], [], pivot, low, high));
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) with pivot (${pivot}).`, 4, array, [j], [], [], pivot, low, high));
      if (array[j] < pivot) {
        i++;
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        steps.push(createSortingStep(stepId++, 'swap', `Swap array[${i}] (${array[i]}) and array[${j}] (${array[j]}) since ${array[i]} < pivot.`, 5, array, [], [i, j], [], pivot, low, high));
      }
    }
    const temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;
    steps.push(createSortingStep(stepId++, 'partition-end', `Place pivot (${pivot}) at its correct sorted position at index ${i + 1}.`, 6, array, [], [i + 1, high], [i + 1], pivot, low, high));
    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      steps.push(createSortingStep(stepId++, 'single-element', `Subarray of size 1 at index ${low} is sorted by default.`, 2, array, [], [], [low]));
    }
  }

  quickSort(0, array.length - 1);
  steps.push(createSortingStep(stepId++, 'done', 'Quick Sort complete!', 8, array, [], [], Array.from({ length: array.length }, (_, idx) => idx)));
  return steps;
}

// ─── Heap Sort ───────────────────────────────────────────────────────────────
export function generateHeapSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push(createSortingStep(stepId++, 'heapify-compare', `Heapify sub-tree at index ${i}. Left child: ${left < size ? left : 'none'}, Right child: ${right < size ? right : 'none'}.`, 3, array, [i], [], []));

    if (left < size && array[left] > array[largest]) {
      largest = left;
    }

    if (right < size && array[right] > array[largest]) {
      largest = right;
    }

    if (largest !== i) {
      const swap = array[i];
      array[i] = array[largest];
      array[largest] = swap;

      steps.push(createSortingStep(stepId++, 'heapify-swap', `Swap parent index ${i} (${swap}) with larger child index ${largest} (${array[i]}).`, 4, array, [], [i, largest], []));
      heapify(size, largest);
    }
  }

  // Build heap
  steps.push(createSortingStep(stepId++, 'build-heap', 'Phase 1: Build max-heap structure from the input array.', 2, array, [], [], []));
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract from heap
  steps.push(createSortingStep(stepId++, 'extract-start', 'Phase 2: Repeatedly extract the maximum element (root) and heapify.', 5, array, [], [], []));
  const sorted: number[] = [];
  for (let i = n - 1; i > 0; i--) {
    const max = array[0];
    array[0] = array[i];
    array[i] = max;
    
    sorted.push(i);
    steps.push(createSortingStep(stepId++, 'extract', `Swap root index 0 (${max}) with end element at index ${i} (${array[0]}). The end element is now sorted.`, 6, array, [], [0, i], [...sorted]));
    
    heapify(i, 0);
  }

  sorted.push(0);
  steps.push(createSortingStep(stepId++, 'done', 'Heap Sort complete!', 8, array, [], [], [...sorted]));
  return steps;
}

// ─── Selection Sort ──────────────────────────────────────────────────────────
export function generateSelectionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(createSortingStep(stepId++, 'outer-loop', `Outer loop iteration ${i + 1}: Find the minimum element in subarray from index ${i} to ${n - 1}. Set minimum index to ${i}.`, 2, array, [i], [], Array.from({ length: i }, (_, idx) => idx)));

    for (let j = i + 1; j < n; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) with current minimum array[${minIdx}] (${array[minIdx]}).`, 4, array, [j, minIdx], [], Array.from({ length: i }, (_, idx) => idx)));

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push(createSortingStep(stepId++, 'new-min', `Found a new minimum element (${array[j]}) at index ${j}. Update minimum index.`, 5, array, [minIdx], [], Array.from({ length: i }, (_, idx) => idx)));
      }
    }

    if (minIdx !== i) {
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
      steps.push(createSortingStep(stepId++, 'swap', `Swap array[${i}] (${temp}) with the minimum element array[${minIdx}] (${array[i]}).`, 7, array, [], [i, minIdx], Array.from({ length: i }, (_, idx) => idx)));
    } else {
      steps.push(createSortingStep(stepId++, 'no-swap', `The minimum element is already at index ${i}. No swap needed.`, 8, array, [], [], Array.from({ length: i }, (_, idx) => idx)));
    }

    // Element at index i is sorted
    const sortedSoFar = Array.from({ length: i + 1 }, (_, idx) => idx);
    steps.push(createSortingStep(stepId++, 'sorted', `Element at index ${i} (${array[i]}) is now in its final position.`, 9, array, [], [], sortedSoFar));
  }

  steps.push(createSortingStep(stepId++, 'done', 'Selection Sort complete! The array is fully sorted.', 11, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Pigeonhole Sort ─────────────────────────────────────────────────────────
export function generatePigeonholeSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  if (n === 0) return [];

  // Step 1: Initial state
  steps.push(createSortingStep(stepId++, 'init', 'Initial state: array is unsorted.', 1, array, [], [], []));

  // Find min and max
  let min = array[0];
  let max = array[0];
  steps.push(createSortingStep(stepId++, 'compare', `Scan first element array[0] (${array[0]}): set initial min = ${min}, max = ${max}.`, 2, array, [0], [], []));

  for (let i = 1; i < n; i++) {
    steps.push(createSortingStep(stepId++, 'compare', `Compare array[${i}] (${array[i]}) with current min (${min}) and max (${max}).`, 2, array, [i], [], []));
    if (array[i] < min) {
      min = array[i];
      steps.push(createSortingStep(stepId++, 'compare', `New minimum found: ${min}.`, 2, array, [i], [], []));
    }
    if (array[i] > max) {
      max = array[i];
      steps.push(createSortingStep(stepId++, 'compare', `New maximum found: ${max}.`, 2, array, [i], [], []));
    }
  }

  const range = max - min + 1;
  steps.push(createSortingStep(stepId++, 'range', `Found min: ${min}, max: ${max}. Range size is ${range} holes.`, 3, array, [], [], []));

  // Initialize holes
  const holes: number[][] = Array(range).fill(null).map(() => []);

  // Place elements in holes
  for (let i = 0; i < n; i++) {
    const val = array[i];
    const holeIdx = val - min;
    holes[holeIdx].push(val);
    steps.push(createSortingStep(stepId++, 'place', `Place value ${val} from index ${i} into pigeonhole [${val} - ${min}] = hole ${holeIdx}.`, 5, array, [i], [], []));
  }

  // Put elements back
  let index = 0;
  const sortedIndices: number[] = [];
  for (let h = 0; h < range; h++) {
    while (holes[h].length > 0) {
      const val = holes[h].shift()!;
      array[index] = val;
      sortedIndices.push(index);
      
      steps.push(createSortingStep(stepId++, 'restore', `Pop ${val} from hole ${h} and write to array index ${index}.`, 10, array, [], [index], [...sortedIndices]));
      index++;
    }
  }

  steps.push(createSortingStep(stepId++, 'done', 'Pigeonhole Sort complete! The array is fully sorted.', 13, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}
