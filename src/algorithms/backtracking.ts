import type { Step, BacktrackingPayload } from './types';

function createBacktrackingStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  grid: number[][],
  row?: number,
  col?: number,
  solutionsCount?: number,
  currentQueens?: Array<[number, number]>
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      grid: grid.map(r => [...r]),
      row,
      col,
      solutionsCount,
      currentQueens: currentQueens ? [...currentQueens] : undefined,
    } as BacktrackingPayload,
  };
}

// ─── N-Queens Backtracking ──────────────────────────────────────────────────
export function generateNQueensSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Initialize empty chessboard grid (N x N)
  const grid: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const currentQueens: Array<[number, number]> = [];
  let solutionsCount = 0;

  steps.push(createBacktrackingStep(
    stepId++,
    'init',
    `Initialize empty ${n}x${n} chessboard. We must place ${n} non-attacking queens.`,
    1,
    grid,
    undefined,
    undefined,
    solutionsCount,
    currentQueens
  ));

  function isSafe(r: number, c: number): boolean {
    // Check row/column conflicts
    for (const [qr, qc] of currentQueens) {
      if (qr === r || qc === c) return false;
      // Check diagonal conflicts
      if (Math.abs(qr - r) === Math.abs(qc - c)) return false;
    }
    return true;
  }

  function solve(col: number): boolean {
    if (col >= n) {
      solutionsCount++;
      steps.push(createBacktrackingStep(
        stepId++,
        'solution-found',
        `Solution #${solutionsCount} found! All ${n} queens placed successfully.`,
        2,
        grid,
        undefined,
        col,
        solutionsCount,
        currentQueens
      ));
      return true;
    }

    steps.push(createBacktrackingStep(
      stepId++,
      'process-col',
      `Examine column ${col} to find a safe row placement.`,
      3,
      grid,
      undefined,
      col,
      solutionsCount,
      currentQueens
    ));

    let solvedAny = false;
    for (let row = 0; row < n; row++) {
      grid[row][col] = 2; // Indicate active checking cell
      steps.push(createBacktrackingStep(
        stepId++,
        'check-placement',
        `Test placing queen at [Row ${row}, Col ${col}]. Checking conflicts...`,
        4,
        grid,
        row,
        col,
        solutionsCount,
        currentQueens
      ));

      if (isSafe(row, col)) {
        grid[row][col] = 1; // Place Queen
        currentQueens.push([row, col]);
        steps.push(createBacktrackingStep(
          stepId++,
          'place-queen',
          `Position [Row ${row}, Col ${col}] is safe. Place queen and proceed to column ${col + 1}.`,
          5,
          grid,
          row,
          col,
          solutionsCount,
          currentQueens
        ));

        // Recurse to next column
        const res = solve(col + 1);
        if (res) {
          solvedAny = true;
        }

        // Backtrack
        grid[row][col] = 0;
        currentQueens.pop();
        steps.push(createBacktrackingStep(
          stepId++,
          'backtrack',
          `Backtracking: remove queen from [Row ${row}, Col ${col}] to search other placements.`,
          7,
          grid,
          row,
          col,
          solutionsCount,
          currentQueens
        ));
      } else {
        grid[row][col] = 0; // Clear temporary check state
        steps.push(createBacktrackingStep(
          stepId++,
          'conflict',
          `Conflict detected at [Row ${row}, Col ${col}]. Skip.`,
          6,
          grid,
          row,
          col,
          solutionsCount,
          currentQueens
        ));
      }
    }

    return solvedAny;
  }

  solve(0);

  steps.push(createBacktrackingStep(
    stepId++,
    'done',
    `N-Queens search complete! Found total of ${solutionsCount} solutions.`,
    9,
    grid,
    undefined,
    undefined,
    solutionsCount,
    currentQueens
  ));

  return steps;
}
