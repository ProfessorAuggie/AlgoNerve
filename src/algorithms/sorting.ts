import type { Step, SortingPayload } from './types';

export type SortOrder = 'asc' | 'desc';


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
export function generateBubbleSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  for (let i = 0; i < n - 1; i++) {
    steps.push(createSortingStep(stepId++, 'outer-loop', `Outer loop iteration ${i + 1}: pass through elements up to index ${n - 1 - i}.`, 2, array, [], [], []));
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) and array[${j + 1}] (${array[j + 1]}).`, 4, array, [j, j + 1], [], []));
      
      const shouldSwap = order === 'asc' ? array[j] > array[j + 1] : array[j] < array[j + 1];
      if (shouldSwap) {
        // Swap
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        
        const cmp = order === 'asc' ? '>' : '<';
        steps.push(createSortingStep(stepId++, 'swap', `Since ${temp} ${cmp} ${array[j]}, swap them.`, 5, array, [], [j, j + 1], []));
      }
    }
    // Element at index n - 1 - i is sorted
    const sortedSoFar = Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx);
    steps.push(createSortingStep(stepId++, 'sorted', `Element at index ${n - 1 - i} is now in its final position.`, 6, array, [], [], sortedSoFar));
  }

  // Final sorted step
  steps.push(createSortingStep(stepId++, 'done', `Bubble Sort complete! The array is fully sorted in ${orderLabel} order.`, 8, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Insertion Sort ──────────────────────────────────────────────────────────
export function generateInsertionSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    steps.push(createSortingStep(stepId++, 'outer-loop', `Pick element array[${i}] (${key}) as the key to insert.`, 2, array, [i], [], []));

    const cmpFn = order === 'asc' ? () => array[j] > key : () => array[j] < key;
    const cmpOp = order === 'asc' ? '>' : '<';
    while (j >= 0 && cmpFn()) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare key (${key}) with array[${j}] (${array[j]}). Since ${array[j]} ${cmpOp} ${key}, shift array[${j}] to the right.`, 4, array, [j, j + 1], [], []));
      
      array[j + 1] = array[j];
      j--;
      
      steps.push(createSortingStep(stepId++, 'shift', `Shift element and move pointer left.`, 5, array, [], [j + 1, j + 2], []));
    }
    
    array[j + 1] = key;
    steps.push(createSortingStep(stepId++, 'insert', `Insert key (${key}) at index ${j + 1}.`, 7, array, [], [j + 1], []));
  }

  steps.push(createSortingStep(stepId++, 'done', `Insertion Sort complete! The array is fully sorted in ${orderLabel} order.`, 9, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Merge Sort ──────────────────────────────────────────────────────────────
export function generateMergeSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  function merge(left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;
    
    steps.push(createSortingStep(stepId++, 'merge-start', `Merge subarrays [${left}...${mid}] and [${mid + 1}...${right}]`, 3, array, [], [], [], undefined, left, right, mid));

    while (i <= mid && j <= right) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare element at index ${i} (${array[i]}) and index ${j} (${array[j]})`, 5, array, [i, j], [], [], undefined, left, right, mid));
      if (order === 'asc' ? array[i] <= array[j] : array[i] >= array[j]) {
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
  steps.push(createSortingStep(stepId++, 'done', `Merge Sort complete! Sorted in ${orderLabel} order.`, 10, array, [], [], Array.from({ length: array.length }, (_, idx) => idx)));
  return steps;
}

// ─── Quick Sort ──────────────────────────────────────────────────────────────
export function generateQuickSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  function partition(low: number, high: number): number {
    const pivot = array[high];
    steps.push(createSortingStep(stepId++, 'pivot', `Choose pivot element array[${high}] (${pivot}).`, 3, array, [], [], [], pivot, low, high));
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) with pivot (${pivot}).`, 4, array, [j], [], [], pivot, low, high));
      const shouldSwap = order === 'asc' ? array[j] < pivot : array[j] > pivot;
      if (shouldSwap) {
        i++;
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        const cmp = order === 'asc' ? '<' : '>';
        steps.push(createSortingStep(stepId++, 'swap', `Swap array[${i}] (${array[i]}) and array[${j}] (${array[j]}) since ${array[i]} ${cmp} pivot.`, 5, array, [], [i, j], [], pivot, low, high));
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
  steps.push(createSortingStep(stepId++, 'done', `Quick Sort complete! Sorted in ${orderLabel} order.`, 8, array, [], [], Array.from({ length: array.length }, (_, idx) => idx)));
  return steps;
}

// ─── Heap Sort ───────────────────────────────────────────────────────────────
export function generateHeapSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  const heapType = order === 'asc' ? 'max' : 'min';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push(createSortingStep(stepId++, 'heapify-compare', `Heapify sub-tree at index ${i}. Left child: ${left < size ? left : 'none'}, Right child: ${right < size ? right : 'none'}.`, 3, array, [i], [], []));

    if (left < size && (order === 'asc' ? array[left] > array[largest] : array[left] < array[largest])) {
      largest = left;
    }

    if (right < size && (order === 'asc' ? array[right] > array[largest] : array[right] < array[largest])) {
      largest = right;
    }

    if (largest !== i) {
      const swap = array[i];
      array[i] = array[largest];
      array[largest] = swap;

      const childType = order === 'asc' ? 'larger' : 'smaller';
      steps.push(createSortingStep(stepId++, 'heapify-swap', `Swap parent index ${i} (${swap}) with ${childType} child index ${largest} (${array[i]}).`, 4, array, [], [i, largest], []));
      heapify(size, largest);
    }
  }

  // Build heap
  steps.push(createSortingStep(stepId++, 'build-heap', `Phase 1: Build ${heapType}-heap structure from the input array.`, 2, array, [], [], []));
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract from heap
  const extremeLabel = order === 'asc' ? 'maximum' : 'minimum';
  steps.push(createSortingStep(stepId++, 'extract-start', `Phase 2: Repeatedly extract the ${extremeLabel} element (root) and heapify.`, 5, array, [], [], []));
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
  steps.push(createSortingStep(stepId++, 'done', `Heap Sort complete! Sorted in ${orderLabel} order.`, 8, array, [], [], [...sorted]));
  return steps;
}

// ─── Selection Sort ──────────────────────────────────────────────────────────
export function generateSelectionSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  const extremeLabel = order === 'asc' ? 'minimum' : 'maximum';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(createSortingStep(stepId++, 'outer-loop', `Outer loop iteration ${i + 1}: Find the ${extremeLabel} element in subarray from index ${i} to ${n - 1}. Set ${extremeLabel} index to ${i}.`, 2, array, [i], [], Array.from({ length: i }, (_, idx) => idx)));

    for (let j = i + 1; j < n; j++) {
      steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j}] (${array[j]}) with current ${extremeLabel} array[${minIdx}] (${array[minIdx]}).`, 4, array, [j, minIdx], [], Array.from({ length: i }, (_, idx) => idx)));

      const isBetter = order === 'asc' ? array[j] < array[minIdx] : array[j] > array[minIdx];
      if (isBetter) {
        minIdx = j;
        steps.push(createSortingStep(stepId++, 'new-min', `Found a new ${extremeLabel} element (${array[j]}) at index ${j}. Update ${extremeLabel} index.`, 5, array, [minIdx], [], Array.from({ length: i }, (_, idx) => idx)));
      }
    }

    if (minIdx !== i) {
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
      steps.push(createSortingStep(stepId++, 'swap', `Swap array[${i}] (${temp}) with the ${extremeLabel} element array[${minIdx}] (${array[i]}).`, 7, array, [], [i, minIdx], Array.from({ length: i }, (_, idx) => idx)));
    } else {
      steps.push(createSortingStep(stepId++, 'no-swap', `The ${extremeLabel} element is already at index ${i}. No swap needed.`, 8, array, [], [], Array.from({ length: i }, (_, idx) => idx)));
    }

    // Element at index i is sorted
    const sortedSoFar = Array.from({ length: i + 1 }, (_, idx) => idx);
    steps.push(createSortingStep(stepId++, 'sorted', `Element at index ${i} (${array[i]}) is now in its final position.`, 9, array, [], [], sortedSoFar));
  }

  steps.push(createSortingStep(stepId++, 'done', `Selection Sort complete! The array is fully sorted in ${orderLabel} order.`, 11, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Pigeonhole Sort ─────────────────────────────────────────────────────────
export function generatePigeonholeSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  if (n === 0) return [];

  // Step 1: Initial state
  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

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
  if (order === 'asc') {
    for (let h = 0; h < range; h++) {
      while (holes[h].length > 0) {
        const val = holes[h].shift()!;
        array[index] = val;
        sortedIndices.push(index);
        steps.push(createSortingStep(stepId++, 'restore', `Pop ${val} from hole ${h} and write to array index ${index}.`, 10, array, [], [index], [...sortedIndices]));
        index++;
      }
    }
  } else {
    for (let h = range - 1; h >= 0; h--) {
      while (holes[h].length > 0) {
        const val = holes[h].shift()!;
        array[index] = val;
        sortedIndices.push(index);
        steps.push(createSortingStep(stepId++, 'restore', `Pop ${val} from hole ${h} and write to array index ${index}.`, 10, array, [], [index], [...sortedIndices]));
        index++;
      }
    }
  }

  steps.push(createSortingStep(stepId++, 'done', `Pigeonhole Sort complete! The array is fully sorted in ${orderLabel} order.`, 13, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Shell Sort ─────────────────────────────────────────────────────────────
export function generateShellSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(createSortingStep(stepId++, 'gap-change', `Compare elements with gap distance of ${gap}.`, 2, array, [], [], []));

    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;
      steps.push(createSortingStep(stepId++, 'compare', `Pick array[${i}] (${temp}) as current key to insert.`, 3, array, [i], [], []));

      while (j >= gap && (order === 'asc' ? array[j - gap] > temp : array[j - gap] < temp)) {
        steps.push(createSortingStep(stepId++, 'compare', `Compare array[${j - gap}] (${array[j - gap]}) with key (${temp}). Since it's greater, shift array[${j - gap}] to index ${j}.`, 4, array, [j - gap, j], [], []));
        array[j] = array[j - gap];
        j -= gap;
        steps.push(createSortingStep(stepId++, 'shift', `Shift element and move index left by gap.`, 5, array, [], [j, j + gap], []));
      }
      array[j] = temp;
      steps.push(createSortingStep(stepId++, 'insert', `Place key (${temp}) at index ${j}.`, 6, array, [], [j], []));
    }
  }

  steps.push(createSortingStep(stepId++, 'done', `Shell Sort complete! The array is fully sorted in ${orderLabel} order.`, 8, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Counting Sort ───────────────────────────────────────────────────────────
export function generateCountingSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  if (n === 0) return [];

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  // Find max element
  let max = array[0];
  for (let i = 1; i < n; i++) {
    if (array[i] > max) max = array[i];
  }
  max = Math.min(Math.max(max, 0), 100); // safety cap

  steps.push(createSortingStep(stepId++, 'compare', `Scan array to find maximum element: max = ${max}. Range is [0, ${max}].`, 2, array, [], [], []));

  const count = Array(max + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const val = array[i];
    if (val >= 0 && val <= max) {
      count[val]++;
      steps.push(createSortingStep(stepId++, 'count', `Increment count for value ${val}: count[${val}] = ${count[val]}.`, 4, array, [i], [], []));
    }
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  steps.push(createSortingStep(stepId++, 'prefix-sums', 'Accumulate prefix sums in count array to determine final element positions.', 6, array, [], [], []));

  const output = Array(n).fill(0);
  const sortedIndices: number[] = [];
  if (order === 'asc') {
    for (let i = n - 1; i >= 0; i--) {
      const val = array[i];
      if (val >= 0 && val <= max) {
        const pos = count[val] - 1;
        output[pos] = val;
        count[val]--;
        sortedIndices.push(pos);
        steps.push(createSortingStep(stepId++, 'place', `Place value ${val} from index ${i} to sorted index ${pos} using count[${val}].`, 8, [...output], [i], [pos], [...sortedIndices]));
      }
    }
  } else {
    // For descending: reverse the output by mapping position
    const descOutput = Array(n).fill(0);
    const descCount = [...count];
    // Rebuild prefix sums in reverse
    const revCount = Array(max + 1).fill(0);
    revCount[max] = descCount[max];
    for (let i = max - 1; i >= 0; i--) {
      revCount[i] = revCount[i + 1] + (descCount[i] - (i > 0 ? descCount[i - 1] : 0));
    }
    for (let i = n - 1; i >= 0; i--) {
      const val = array[i];
      if (val >= 0 && val <= max) {
        const pos = revCount[val] - 1;
        descOutput[pos] = val;
        revCount[val]--;
        sortedIndices.push(pos);
        steps.push(createSortingStep(stepId++, 'place', `Place value ${val} from index ${i} to sorted index ${pos} (descending).`, 8, [...descOutput], [i], [pos], [...sortedIndices]));
      }
    }
    for (let i = 0; i < n; i++) output[i] = descOutput[i];
  }

  steps.push(createSortingStep(stepId++, 'done', `Counting Sort complete! Output array is fully sorted in ${orderLabel} order.`, 10, output, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Radix Sort ──────────────────────────────────────────────────────────────
export function generateRadixSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  let array = [...arr];
  const n = array.length;
  let stepId = 0;

  if (n === 0) return [];

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  let max = Math.max(...array);
  max = Math.max(max, 1);

  steps.push(createSortingStep(stepId++, 'compare', `Find maximum value ${max} to determine number of digits.`, 2, array, [], [], []));

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push(createSortingStep(stepId++, 'digit-pass', `Sorting elements by digit position: 10^${Math.log10(exp)} place.`, 4, array, [], [], []));

    const output = Array(n).fill(0);
    const count = Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(array[i] / exp) % 10;
      count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const val = array[i];
      const digit = Math.floor(val / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = val;
      count[digit]--;
      steps.push(createSortingStep(stepId++, 'place', `Place ${val} at sorted position ${pos} based on digit ${digit}.`, 6, [...output], [i], [pos], []));
    }

    array = [...output];
    steps.push(createSortingStep(stepId++, 'digit-sorted', `Sorted pass complete for digit exponent ${exp}. Current array state updated.`, 8, array, [], [], []));
  }

  // If descending, reverse the final array
  if (order === 'desc') {
    array.reverse();
    steps.push(createSortingStep(stepId++, 'reverse', 'Reversing the array for descending order.', 9, array, [], [], []));
  }
  steps.push(createSortingStep(stepId++, 'done', `Radix Sort complete! The array is fully sorted in ${orderLabel} order.`, 10, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}

// ─── Bucket Sort ─────────────────────────────────────────────────────────────
export function generateBucketSortSteps(arr: number[], order: SortOrder = 'asc'): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  if (n === 0) return [];

  const orderLabel = order === 'asc' ? 'ascending' : 'descending';
  steps.push(createSortingStep(stepId++, 'init', `Initial state: array is unsorted. Sorting in ${orderLabel} order.`, 1, array, [], [], []));

  let min = array[0];
  let max = array[0];
  for (let i = 1; i < n; i++) {
    if (array[i] < min) min = array[i];
    if (array[i] > max) max = array[i];
  }

  steps.push(createSortingStep(stepId++, 'compare', `Found min: ${min}, max: ${max}. Creating buckets.`, 2, array, [], [], []));

  const bucketCount = Math.max(Math.floor(Math.sqrt(n)), 3);
  const buckets: number[][] = Array(bucketCount).fill(null).map(() => []);

  const range = max - min;
  for (let i = 0; i < n; i++) {
    const val = array[i];
    let bucketIdx = Math.floor(((val - min) / (range || 1)) * (bucketCount - 1));
    bucketIdx = Math.min(Math.max(bucketIdx, 0), bucketCount - 1);
    buckets[bucketIdx].push(val);
    steps.push(createSortingStep(stepId++, 'place', `Distribute value ${val} from index ${i} into bucket ${bucketIdx}.`, 4, array, [i], [], []));
  }

  let index = 0;
  const sortedIndices: number[] = [];
  const bucketIter = order === 'asc'
    ? Array.from({ length: bucketCount }, (_, i) => i)
    : Array.from({ length: bucketCount }, (_, i) => bucketCount - 1 - i);
  for (const b of bucketIter) {
    if (buckets[b].length > 0) {
      steps.push(createSortingStep(stepId++, 'sort-bucket', `Sorting bucket ${b} containing: [${buckets[b].join(', ')}].`, 6, array, [], [], []));
      buckets[b].sort((x, y) => order === 'asc' ? x - y : y - x);

      while (buckets[b].length > 0) {
        const val = buckets[b].shift()!;
        array[index] = val;
        sortedIndices.push(index);
        steps.push(createSortingStep(stepId++, 'gather', `Gather value ${val} from bucket ${b} to output index ${index}.`, 8, [...array], [], [index], [...sortedIndices]));
        index++;
      }
    }
  }

  steps.push(createSortingStep(stepId++, 'done', `Bucket Sort complete! The array is fully sorted in ${orderLabel} order.`, 10, array, [], [], Array.from({ length: n }, (_, idx) => idx)));
  return steps;
}
