import type { Step, SortingPayload } from './types';

// Helper to create a searching step
function createSearchingStep(
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

// ─── Linear Search ───────────────────────────────────────────────────────────
export function generateLinearSearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const array = [...arr];
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Searching for target ${target} in the array.`,
      1,
      array,
      [],
      [],
      []
    )
  );

  let foundIdx = -1;
  for (let i = 0; i < n; i++) {
    steps.push(
      createSearchingStep(
        stepId++,
        'compare',
        `Checking index ${i}: Compare array[${i}] (${array[i]}) with target ${target}.`,
        3,
        array,
        [i],
        [],
        []
      )
    );

    if (array[i] === target) {
      foundIdx = i;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} found at index ${i}!`,
          4,
          array,
          [],
          [],
          [i]
        )
      );
      break;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Finished scanning the array. Target ${target} was not found.`,
        6,
        array,
        [],
        [],
        []
      )
    );
  } else {
    // Final step
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Linear Search complete. Target found at index ${foundIdx}.`,
        7,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Binary Search ──────────────────────────────────────────────────────────
export function generateBinarySearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  // Binary search requires a sorted array; we sort it to guarantee validity
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target}.`,
      1,
      array,
      [],
      [],
      [],
      undefined,
      0,
      n - 1
    )
  );

  let left = 0;
  let right = n - 1;
  let foundIdx = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(
      createSearchingStep(
        stepId++,
        'midpoint',
        `Calculate mid index: Math.floor((${left} + ${right}) / 2) = ${mid}. Mid value is array[${mid}] (${array[mid]}).`,
        3,
        array,
        [],
        [],
        [],
        undefined,
        left,
        right,
        mid
      )
    );

    steps.push(
      createSearchingStep(
        stepId++,
        'compare',
        `Compare mid value array[${mid}] (${array[mid]}) with target ${target}.`,
        4,
        array,
        [mid],
        [],
        [],
        undefined,
        left,
        right,
        mid
      )
    );

    if (array[mid] === target) {
      foundIdx = mid;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} matches array[${mid}] (${array[mid]}). Target found!`,
          5,
          array,
          [],
          [],
          [mid],
          undefined,
          left,
          right,
          mid
        )
      );
      break;
    } else if (array[mid] < target) {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-right',
          `Since array[${mid}] (${array[mid]}) < target ${target}, search right half: set left pointer to mid + 1 (${mid + 1}).`,
          7,
          array,
          [],
          [],
          [],
          undefined,
          mid + 1,
          right
        )
      );
      left = mid + 1;
    } else {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-left',
          `Since array[${mid}] (${array[mid]}) > target ${target}, search left half: set right pointer to mid - 1 (${mid - 1}).`,
          9,
          array,
          [],
          [],
          [],
          undefined,
          left,
          mid - 1
        )
      );
      right = mid - 1;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Search range empty (left > right). Target ${target} was not found.`,
        11,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Binary Search complete. Target found at index ${foundIdx}.`,
        12,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Ternary Search ─────────────────────────────────────────────────────────
export function generateTernarySearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  // Ternary search requires a sorted array; we sort it to guarantee validity
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target}.`,
      2,
      array,
      [],
      [],
      [],
      undefined,
      0,
      n - 1
    )
  );

  let left = 0;
  let right = n - 1;
  let foundIdx = -1;

  while (left <= right) {
    const third = Math.floor((right - left) / 3);
    const mid1 = left + third;
    const mid2 = right - third;

    steps.push(
      createSearchingStep(
        stepId++,
        'midpoint',
        `Calculate midpoints: mid1 = ${left} + floor((${right} - ${left}) / 3) = ${mid1}, mid2 = ${right} - floor((${right} - ${left}) / 3) = ${mid2}.`,
        4,
        array,
        [],
        [],
        [],
        undefined,
        left,
        right,
        mid1
      )
    );

    steps.push(
      createSearchingStep(
        stepId++,
        'compare',
        `Compare midpoints: array[mid1] (${array[mid1]}) and array[mid2] (${array[mid2]}) with target ${target}.`,
        6,
        array,
        [mid1, mid2],
        [],
        [],
        undefined,
        left,
        right,
        mid1
      )
    );

    if (array[mid1] === target) {
      foundIdx = mid1;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} matches array[mid1] (${array[mid1]}). Target found!`,
          6,
          array,
          [],
          [],
          [mid1],
          undefined,
          left,
          right,
          mid1
        )
      );
      break;
    }

    if (array[mid2] === target) {
      foundIdx = mid2;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} matches array[mid2] (${array[mid2]}). Target found!`,
          7,
          array,
          [],
          [],
          [mid2],
          undefined,
          left,
          right,
          mid2
        )
      );
      break;
    }

    if (target < array[mid1]) {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-left',
          `Since target ${target} < array[mid1] (${array[mid1]}), search left third: set right to mid1 - 1 (${mid1 - 1}).`,
          8,
          array,
          [],
          [],
          [],
          undefined,
          left,
          mid1 - 1
        )
      );
      right = mid1 - 1;
    } else if (target > array[mid2]) {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-right',
          `Since target ${target} > array[mid2] (${array[mid2]}), search right third: set left to mid2 + 1 (${mid2 + 1}).`,
          9,
          array,
          [],
          [],
          [],
          undefined,
          mid2 + 1,
          right
        )
      );
      left = mid2 + 1;
    } else {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-middle',
          `Since array[mid1] < target < array[mid2], search middle third: set left to mid1 + 1 (${mid1 + 1}) and right to mid2 - 1 (${mid2 - 1}).`,
          10,
          array,
          [],
          [],
          [],
          undefined,
          mid1 + 1,
          mid2 - 1
        )
      );
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Search range empty (left > right). Target ${target} was not found.`,
        12,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Ternary Search complete. Target found at index ${foundIdx}.`,
        13,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Jump Search ─────────────────────────────────────────────────────────────
export function generateJumpSearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;
  const block = Math.floor(Math.sqrt(n));

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target} using Jump Search with block size √${n} ≈ ${block}.`,
      1,
      array,
      [],
      [],
      []
    )
  );

  let prev = 0;
  let curr = block;

  // Jumping phase
  while (curr < n && array[Math.min(curr, n) - 1] < target) {
    steps.push(
      createSearchingStep(
        stepId++,
        'jump',
        `Checking block boundary index ${Math.min(curr, n) - 1} value (${array[Math.min(curr, n) - 1]}). Since it's less than ${target}, jump to next block.`,
        3,
        array,
        [Math.min(curr, n) - 1],
        [],
        [],
        undefined,
        prev,
        Math.min(curr, n) - 1
      )
    );
    prev = curr;
    curr += block;
  }

  steps.push(
    createSearchingStep(
      stepId++,
      'jump-limit',
      `Target ${target} is within block range [${prev}, ${Math.min(curr, n) - 1}]. Commencing linear search.`,
      5,
      array,
      [],
      [],
      [],
      undefined,
      prev,
      Math.min(curr, n) - 1
    )
  );

  let foundIdx = -1;
  for (let i = prev; i < Math.min(curr, n); i++) {
    steps.push(
      createSearchingStep(
        stepId++,
        'compare',
        `Checking index ${i}: Compare array[${i}] (${array[i]}) with target ${target}.`,
        7,
        array,
        [i],
        [],
        [],
        undefined,
        prev,
        Math.min(curr, n) - 1
      )
    );

    if (array[i] === target) {
      foundIdx = i;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} found at index ${i}!`,
          8,
          array,
          [],
          [],
          [i]
        )
      );
      break;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Linear scan completed. Target ${target} was not found.`,
        10,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Jump Search complete. Target found at index ${foundIdx}.`,
        11,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Exponential Search ──────────────────────────────────────────────────────
export function generateExponentialSearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target} using Exponential Search.`,
      1,
      array,
      [],
      [],
      []
    )
  );

  if (n === 0) {
    steps.push(createSearchingStep(stepId++, 'not-found', 'Array is empty.', 2, array));
    return steps;
  }

  // Check first element
  steps.push(
    createSearchingStep(
      stepId++,
      'compare',
      `Checking index 0: Compare array[0] (${array[0]}) with target ${target}.`,
      3,
      array,
      [0]
    )
  );

  if (array[0] === target) {
    steps.push(
      createSearchingStep(
        stepId++,
        'found',
        `Target ${target} found at index 0!`,
        4,
        array,
        [],
        [],
        [0]
      )
    );
    return steps;
  }

  let i = 1;
  while (i < n && array[i] <= target) {
    steps.push(
      createSearchingStep(
        stepId++,
        'exponential-step',
        `Range doubling: checking index ${i} value (${array[i]}). Since it's <= target ${target}, double search bound index.`,
        6,
        array,
        [i],
        [],
        [],
        undefined,
        0,
        i
      )
    );
    i = i * 2;
  }

  const left = Math.floor(i / 2);
  const right = Math.min(i, n - 1);

  steps.push(
    createSearchingStep(
      stepId++,
      'range-determined',
      `Search range determined: target ${target} lies within [${left}, ${right}]. Commencing Binary Search in this range.`,
      8,
      array,
      [],
      [],
      [],
      undefined,
      left,
      right
    )
  );

  // Binary search in determined range
  let foundIdx = -1;
  let low = left;
  let high = right;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push(
      createSearchingStep(
        stepId++,
        'midpoint',
        `Binary search mid index: low=${low}, high=${high} => mid=${mid} (value: ${array[mid]}).`,
        10,
        array,
        [],
        [],
        [],
        undefined,
        low,
        high,
        mid
      )
    );

    if (array[mid] === target) {
      foundIdx = mid;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target found at index ${mid}!`,
          11,
          array,
          [],
          [],
          [mid]
        )
      );
      break;
    } else if (array[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Binary search range empty. Target ${target} was not found.`,
        13,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Exponential Search complete. Target found at index ${foundIdx}.`,
        14,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Interpolation Search ────────────────────────────────────────────────────
export function generateInterpolationSearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target} using Interpolation Search.`,
      1,
      array,
      [],
      [],
      []
    )
  );

  let low = 0;
  let high = n - 1;
  let foundIdx = -1;

  while (low <= high && target >= array[low] && target <= array[high]) {
    if (low === high) {
      if (array[low] === target) {
        foundIdx = low;
      }
      break;
    }

    // Estimate position using interpolation formula
    const pos = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));

    steps.push(
      createSearchingStep(
        stepId++,
        'probe',
        `Probing index estimated via formula: pos = ${low} + ((${target} - ${array[low]}) * (${high} - ${low})) / (${array[high]} - ${array[low]}) = ${pos}. Value at pos is ${array[pos]}.`,
        3,
        array,
        [pos],
        [],
        [],
        undefined,
        low,
        high,
        pos
      )
    );

    if (array[pos] === target) {
      foundIdx = pos;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} matches array[${pos}] (${array[pos]}). Target found!`,
          4,
          array,
          [],
          [],
          [pos]
        )
      );
      break;
    }

    if (array[pos] < target) {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-right',
          `Since array[${pos}] (${array[pos]}) < target ${target}, search right partition: set low to ${pos + 1}.`,
          6,
          array,
          [],
          [],
          [],
          undefined,
          pos + 1,
          high
        )
      );
      low = pos + 1;
    } else {
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-left',
          `Since array[${pos}] (${array[pos]}) > target ${target}, search left partition: set high to ${pos - 1}.`,
          8,
          array,
          [],
          [],
          [],
          undefined,
          low,
          pos - 1
        )
      );
      high = pos - 1;
    }
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Search boundaries crossed or out of range. Target ${target} was not found.`,
        10,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Interpolation Search complete. Target found at index ${foundIdx}.`,
        11,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

// ─── Fibonacci Search ────────────────────────────────────────────────────────
export function generateFibonacciSearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const array = [...arr].sort((a, b) => a - b);
  const n = array.length;
  let stepId = 0;

  steps.push(
    createSearchingStep(
      stepId++,
      'init',
      `Initial state: Sorted array. Searching for target ${target} using Fibonacci Search.`,
      1,
      array,
      [],
      [],
      []
    )
  );

  // Initialize Fibonacci numbers
  let fibM2 = 0; // (m-2)th Fibonacci number
  let fibM1 = 1; // (m-1)th Fibonacci number
  let fibM = fibM2 + fibM1; // mth Fibonacci number

  while (fibM < n) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM = fibM2 + fibM1;
  }

  let offset = -1;
  let foundIdx = -1;

  while (fibM > 1) {
    const i = Math.min(offset + fibM2, n - 1);

    steps.push(
      createSearchingStep(
        stepId++,
        'compare',
        `Checking Fibonacci index index = min(offset + fibM2, n-1) => min(${offset} + ${fibM2}, ${n - 1}) = ${i}. Comparing array[${i}] (${array[i]}) with target ${target}.`,
        3,
        array,
        [i]
      )
    );

    if (array[i] < target) {
      // Move Fibonacci numbers down 1 stage. Cut search space from offset to i
      fibM = fibM1;
      fibM1 = fibM2;
      fibM2 = fibM - fibM1;
      offset = i;
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-right',
          `Since array[${i}] (${array[i]}) < target ${target}, move offset to ${i}.`,
          5,
          array,
          [],
          [],
          [],
          undefined,
          offset + 1,
          n - 1
        )
      );
    } else if (array[i] > target) {
      // Move Fibonacci numbers down 2 stages
      fibM = fibM2;
      fibM1 = fibM1 - fibM2;
      fibM2 = fibM - fibM1;
      steps.push(
        createSearchingStep(
          stepId++,
          'narrow-left',
          `Since array[${i}] (${array[i]}) > target ${target}, search left of split.`,
          7,
          array,
          [],
          [],
          [],
          undefined,
          offset + 1,
          i - 1
        )
      );
    } else {
      foundIdx = i;
      steps.push(
        createSearchingStep(
          stepId++,
          'found',
          `Target ${target} matches array[${i}] (${array[i]}). Target found!`,
          9,
          array,
          [],
          [],
          [i]
        )
      );
      break;
    }
  }

  // Check last element if applicable
  if (fibM1 === 1 && offset + 1 < n && array[offset + 1] === target) {
    foundIdx = offset + 1;
    steps.push(
      createSearchingStep(
        stepId++,
        'found',
        `Checking remaining single slot: Target found at index ${offset + 1}!`,
        11,
        array,
        [],
        [],
        [offset + 1]
      )
    );
  }

  if (foundIdx === -1) {
    steps.push(
      createSearchingStep(
        stepId++,
        'not-found',
        `Fibonacci interval collapsed. Target ${target} was not found.`,
        13,
        array,
        [],
        [],
        []
      )
    );
  } else {
    steps.push(
      createSearchingStep(
        stepId++,
        'done',
        `Fibonacci Search complete. Target found at index ${foundIdx}.`,
        14,
        array,
        [],
        [],
        [foundIdx]
      )
    );
  }

  return steps;
}

