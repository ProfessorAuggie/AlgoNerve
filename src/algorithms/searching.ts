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
