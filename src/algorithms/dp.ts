import type { Step, DPPayload } from './types';


function createDPStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  table: number[][],
  rows?: string[],
  cols?: string[],
  activeCell?: [number, number],
  dependsOn?: Array<[number, number]>,
  result?: number
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      table: table.map(r => [...r]),
      rows,
      cols,
      activeCell,
      dependsOn,
      result,
    } as DPPayload,
  };
}

// ─── Fibonacci (DP) ──────────────────────────────────────────────────────────
export function generateFibonacciDPSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // We visualize a 1D table as a 1x(n+1) matrix for DPView compatibility
  const table = [Array(n + 1).fill(-1)];
  const cols = Array.from({ length: n + 1 }, (_, i) => `F(${i})`);
  const rows = ['Fibonacci'];

  steps.push(createDPStep(stepId++, 'init', `Initialize a DP table of size ${n + 1} with -1 to represent uncomputed values.`, 1, table, rows, cols));

  // Base cases
  table[0][0] = 0;
  steps.push(createDPStep(stepId++, 'base-case', 'Base case F(0) = 0.', 2, table, rows, cols, [0, 0]));

  if (n >= 1) {
    table[0][1] = 1;
    steps.push(createDPStep(stepId++, 'base-case', 'Base case F(1) = 1.', 3, table, rows, cols, [0, 1]));
  }

  for (let i = 2; i <= n; i++) {
    steps.push(createDPStep(
      stepId++,
      'compute-step',
      `F(${i}) depends on the sum of the previous two cells F(${i-1}) and F(${i-2}).`,
      5,
      table,
      rows,
      cols,
      [0, i],
      [[0, i - 1], [0, i - 2]]
    ));

    table[0][i] = table[0][i - 1] + table[0][i - 2];
    steps.push(createDPStep(
      stepId++,
      'fill-cell',
      `Calculate F(${i}) = F(${i-1}) + F(${i-2}) = ${table[0][i - 1]} + ${table[0][i - 2]} = ${table[0][i]}.`,
      6,
      table,
      rows,
      cols,
      [0, i],
      [[0, i - 1], [0, i - 2]]
    ));
  }

  steps.push(createDPStep(stepId++, 'done', `Finished! The ${n}-th Fibonacci number is F(${n}) = ${table[0][n]}.`, 8, table, rows, cols, [0, n], undefined, table[0][n]));
  return steps;
}

// ─── Longest Common Subsequence (LCS) ────────────────────────────────────────
export function generateLCSSteps(s1: string, s2: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const m = s1.length;
  const n = s2.length;

  // Initialize (m+1) x (n+1) grid table
  const table: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(-1));
  const rows = ['Ø', ...s1.split('')];
  const cols = ['Ø', ...s2.split('')];

  steps.push(createDPStep(stepId++, 'init', 'Initialize DP table dimensions. Set all cells to -1.', 1, table, rows, cols));

  // Initialize base cases: first row and first column to 0
  for (let i = 0; i <= m; i++) {
    table[i][0] = 0;
  }
  for (let j = 0; j <= n; j++) {
    table[0][j] = 0;
  }
  steps.push(createDPStep(stepId++, 'base-cases', 'Initialize base cases: LCS of any string with empty string Ø is 0.', 2, table, rows, cols));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];

      if (char1 === char2) {
        steps.push(createDPStep(
          stepId++,
          'check-match',
          `Characters match: s1[${i-1}] ('${char1}') === s2[${j-1}] ('${char2}'). Calculate value from diagonal index [${i-1}, ${j-1}] + 1.`,
          4,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j - 1]]
        ));

        table[i][j] = table[i - 1][j - 1] + 1;
        steps.push(createDPStep(
          stepId++,
          'fill-match',
          `Write value to cell [${i}, ${j}] = ${table[i - 1][j - 1]} + 1 = ${table[i][j]}.`,
          5,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j - 1]]
        ));
      } else {
        steps.push(createDPStep(
          stepId++,
          'check-mismatch',
          `Characters do not match: s1[${i-1}] ('${char1}') !== s2[${j-1}] ('${char2}'). Value is max(above cell [${i-1}, ${j}], left cell [${i}, ${j-1}]).`,
          7,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j], [i, j - 1]]
        ));

        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
        steps.push(createDPStep(
          stepId++,
          'fill-mismatch',
          `Write value to cell [${i}, ${j}] = max(${table[i - 1][j]}, ${table[i][j - 1]}) = ${table[i][j]}.`,
          8,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j], [i, j - 1]]
        ));
      }
    }
  }

  // Backtrack to find LCS string
  const lcsLength = table[m][n];
  const lcsCells: Array<[number, number]> = [];
  let backtrackStr = '';
  let bi = m;
  let bj = n;

  steps.push(createDPStep(
    stepId++,
    'backtrack-start',
    `Backtrack from bottom-right cell [${m}, ${n}] (LCS length = ${lcsLength}) to construct the LCS string.`,
    10,
    table,
    rows,
    cols,
    [m, n]
  ));

  while (bi > 0 && bj > 0) {
    if (s1[bi - 1] === s2[bj - 1]) {
      lcsCells.push([bi, bj]);
      backtrackStr = s1[bi - 1] + backtrackStr;
      const prevBi = bi;
      const prevBj = bj;
      bi--;
      bj--;
      steps.push(createDPStep(
        stepId++,
        'backtrack-match',
        `Match found: '${s1[prevBi - 1]}'. Add to subsequence. Move diagonally to [${bi}, ${bj}]. Current LCS: "${backtrackStr}"`,
        11,
        table,
        rows,
        cols,
        [prevBi, prevBj],
        [[bi, bj]]
      ));
    } else if (table[bi - 1][bj] >= table[bi][bj - 1]) {
      const prevBi = bi;
      const prevBj = bj;
      bi--;
      steps.push(createDPStep(
        stepId++,
        'backtrack-move',
        `No match. Move up to [${bi}, ${bj}] (above cell has higher/equal value).`,
        12,
        table,
        rows,
        cols,
        [prevBi, prevBj],
        [[bi, bj]]
      ));
    } else {
      const prevBi = bi;
      const prevBj = bj;
      bj--;
      steps.push(createDPStep(
        stepId++,
        'backtrack-move',
        `No match. Move left to [${bi}, ${bj}] (left cell has higher value).`,
        12,
        table,
        rows,
        cols,
        [prevBi, prevBj],
        [[bi, bj]]
      ));
    }
  }

  steps.push(createDPStep(
    stepId++,
    'done',
    `LCS traversal complete! Longest Common Subsequence: "${backtrackStr}" (Length ${lcsLength}).`,
    14,
    table,
    rows,
    cols,
    [m, n],
    lcsCells,
    lcsLength
  ));

  return steps;
}

// ─── Edit Distance (Levenshtein) ─────────────────────────────────────────────
export function generateEditDistanceSteps(s1: string, s2: string): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const m = s1.length;
  const n = s2.length;

  const table: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(-1));
  const rows = ['Ø', ...s1.split('')];
  const cols = ['Ø', ...s2.split('')];

  steps.push(createDPStep(stepId++, 'init', 'Initialize DP table dimensions. Set all cells to -1.', 1, table, rows, cols));

  // Initialize base cases: row 0 and col 0 represent insert/delete counts
  for (let i = 0; i <= m; i++) {
    table[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    table[0][j] = j;
  }
  steps.push(createDPStep(stepId++, 'base-cases', 'Initialize base cases: cost of transforming any string to/from empty string Ø is the length of that string.', 2, table, rows, cols));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];

      if (char1 === char2) {
        steps.push(createDPStep(
          stepId++,
          'check-match',
          `Characters match: s1[${i-1}] ('${char1}') === s2[${j-1}] ('${char2}'). Cost is same as diagonal cell [${i-1}, ${j-1}].`,
          4,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j - 1]]
        ));

        table[i][j] = table[i - 1][j - 1];
        steps.push(createDPStep(
          stepId++,
          'fill-match',
          `Write value to cell [${i}, ${j}] = ${table[i - 1][j - 1]} (no operation cost).`,
          5,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j - 1]]
        ));
      } else {
        steps.push(createDPStep(
          stepId++,
          'check-mismatch',
          `Characters do not match: '${char1}' !== '${char2}'. Find min of cell above (Delete), left (Insert), and diagonal (Replace), then add 1.`,
          7,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j], [i, j - 1], [i - 1, j - 1]]
        ));

        const replace = table[i - 1][j - 1];
        const insert = table[i][j - 1];
        const del = table[i - 1][j];

        table[i][j] = Math.min(replace, insert, del) + 1;
        steps.push(createDPStep(
          stepId++,
          'fill-mismatch',
          `Write value to cell [${i}, ${j}] = min(Replace: ${replace}, Insert: ${insert}, Delete: ${del}) + 1 = ${table[i][j]}.`,
          8,
          table,
          rows,
          cols,
          [i, j],
          [[i - 1, j], [i, j - 1], [i - 1, j - 1]]
        ));
      }
    }
  }

  steps.push(createDPStep(
    stepId++,
    'done',
    `Edit Distance complete! Minimum operations to transform "${s1}" to "${s2}" is ${table[m][n]}.`,
    10,
    table,
    rows,
    cols,
    [m, n],
    undefined,
    table[m][n]
  ));

  return steps;
}
