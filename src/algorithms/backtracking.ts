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

// ─── Sudoku Solver ──────────────────────────────────────────────────────────
export function generateSudokuSolverSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // Mostly-solved 9x9 Sudoku board
  const grid: number[][] = [
    [5, 3, 0, 6, 7, 8, 9, 1, 2],
    [6, 0, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 0, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 0, 3, 5],
    [3, 4, 5, 0, 8, 6, 1, 7, 9]
  ];

  const initialGrid = grid.map(r => [...r]);

  steps.push({
    id: stepId++,
    action: 'init',
    description: 'Initialize Sudoku Solver with a 9x9 grid. Gray numbers are pre-filled.',
    codeLine: 1,
    payload: {
      grid: grid.map(r => [...r]),
      initialGrid: initialGrid.map(r => [...r]),
      conflictCell: null
    } as BacktrackingPayload
  });

  // Find conflicts
  function getConflict(r: number, c: number, val: number): [number, number] | null {
    // Check row
    for (let col = 0; col < 9; col++) {
      if (col !== c && grid[r][col] === val) return [r, col];
    }
    // Check col
    for (let row = 0; row < 9; row++) {
      if (row !== r && grid[row][c] === val) return [row, c];
    }
    // Check 3x3 box
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let row = br; row < br + 3; row++) {
      for (let col = bc; col < bc + 3; col++) {
        if ((row !== r || col !== c) && grid[row][col] === val) return [row, col];
      }
    }
    return null;
  }

  function solve(): boolean {
    // Find empty cell
    let r = -1;
    let c = -1;
    let foundEmpty = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) {
          r = i;
          c = j;
          foundEmpty = true;
          break;
        }
      }
      if (foundEmpty) break;
    }

    if (!foundEmpty) {
      return true; // Solved!
    }

    steps.push({
      id: stepId++,
      action: 'select-cell',
      description: `Select empty cell at [Row ${r + 1}, Col ${c + 1}] to solve.`,
      codeLine: 2,
      payload: {
        grid: grid.map(rowArr => [...rowArr]),
        row: r,
        col: c,
        initialGrid: initialGrid.map(rowArr => [...rowArr]),
        conflictCell: null
      } as BacktrackingPayload
    });

    for (let num = 1; num <= 9; num++) {
      // Try placing num
      grid[r][c] = num;
      
      const conflict = getConflict(r, c, num);

      if (!conflict) {
        steps.push({
          id: stepId++,
          action: 'place-digit',
          description: `Digit ${num} is valid at [Row ${r + 1}, Col ${c + 1}]. Try placing it.`,
          codeLine: 6,
          payload: {
            grid: grid.map(rowArr => [...rowArr]),
            row: r,
            col: c,
            initialGrid: initialGrid.map(rowArr => [...rowArr]),
            conflictCell: null
          } as BacktrackingPayload
        });

        if (solve()) {
          return true;
        }

        // Backtrack
        grid[r][c] = 0;
        steps.push({
          id: stepId++,
          action: 'backtrack',
          description: `Path failed. Backtrack: clear [Row ${r + 1}, Col ${c + 1}] and try next number.`,
          codeLine: 8,
          payload: {
            grid: grid.map(rowArr => [...rowArr]),
            row: r,
            col: c,
            initialGrid: initialGrid.map(rowArr => [...rowArr]),
            conflictCell: null
          } as BacktrackingPayload
        });
      } else {
        // Conflict
        steps.push({
          id: stepId++,
          action: 'conflict',
          description: `Conflict! Cannot place ${num} at [Row ${r + 1}, Col ${c + 1}] due to duplicate at [Row ${conflict[0] + 1}, Col ${conflict[1] + 1}].`,
          codeLine: 5,
          payload: {
            grid: grid.map(rowArr => [...rowArr]),
            row: r,
            col: c,
            initialGrid: initialGrid.map(rowArr => [...rowArr]),
            conflictCell: [conflict[0], conflict[1]]
          } as BacktrackingPayload
        });
        grid[r][c] = 0; // reset
      }
    }

    return false;
  }

  const success = solve();

  steps.push({
    id: stepId++,
    action: 'done',
    description: success ? 'Sudoku solved successfully!' : 'No solution found for this Sudoku grid.',
    codeLine: 12,
    payload: {
      grid: grid.map(rowArr => [...rowArr]),
      initialGrid: initialGrid.map(rowArr => [...rowArr]),
      conflictCell: null
    } as BacktrackingPayload
  });

  return steps;
}

// ─── Rat in a Maze ──────────────────────────────────────────────────────────
export function generateRatInAMazeSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  // 5x5 Maze grid
  // 0: Walkable, 1: Wall
  const maze: number[][] = [
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0]
  ];

  const n = maze.length;
  // Visited grid for visualization
  // 0: Empty, 1: Wall, 2: Current Rat, 3: Path, 4: Backtracked Dead-end
  const grid = maze.map(row => [...row]);

  steps.push({
    id: stepId++,
    action: 'init',
    description: 'Initialize Rat in a Maze solver. Rat starts at [0,0], Cheese is at [4,4].',
    codeLine: 1,
    payload: {
      grid: grid.map(r => [...r]),
      row: 0,
      col: 0
    } as BacktrackingPayload
  });

  function isSafe(r: number, c: number): boolean {
    return r >= 0 && r < n && c >= 0 && c < n && grid[r][c] === 0;
  }

  function solve(r: number, c: number): boolean {
    // If reached destination
    if (r === n - 1 && c === n - 1) {
      grid[r][c] = 3; // Mark destination as path
      steps.push({
        id: stepId++,
        action: 'solution-found',
        description: 'Cheese reached! Rat found the exit path.',
        codeLine: 2,
        payload: {
          grid: grid.map(row => [...row]),
          row: r,
          col: c
        } as BacktrackingPayload
      });
      return true;
    }

    // Mark current cell as visited path (3)
    grid[r][c] = 3;
    steps.push({
      id: stepId++,
      action: 'move',
      description: `Move rat to cell [Row ${r + 1}, Col ${c + 1}].`,
      codeLine: 3,
      payload: {
        grid: grid.map(row => [...row]),
        row: r,
        col: c
      } as BacktrackingPayload
    });

    // Define directions: Down, Right, Up, Left
    const dirs = [
      { dr: 1, dc: 0, name: 'Down' },
      { dr: 0, dc: 1, name: 'Right' },
      { dr: -1, dc: 0, name: 'Up' },
      { dr: 0, dc: -1, name: 'Left' }
    ];

    for (const dir of dirs) {
      const nextR = r + dir.dr;
      const nextC = c + dir.dc;

      steps.push({
        id: stepId++,
        action: 'check-cell',
        description: `Check if moving ${dir.name} to [Row ${nextR + 1}, Col ${nextC + 1}] is valid.`,
        codeLine: 5,
        payload: {
          grid: grid.map(row => [...row]),
          row: nextR,
          col: nextC
        } as BacktrackingPayload
      });

      if (isSafe(nextR, nextC)) {
        if (solve(nextR, nextC)) {
          return true;
        }
      }
    }

    // Backtrack: mark current cell as dead-end (4)
    grid[r][c] = 4;
    steps.push({
      id: stepId++,
      action: 'backtrack',
      description: `No valid moves from [Row ${r + 1}, Col ${c + 1}]. Backtrack rat.`,
      codeLine: 9,
      payload: {
        grid: grid.map(row => [...row]),
        row: r,
        col: c
      } as BacktrackingPayload
    });

    return false;
  }

  const success = solve(0, 0);

  steps.push({
    id: stepId++,
    action: 'done',
    description: success ? 'Maze search complete! Solved.' : 'No solution exists for this maze layout.',
    codeLine: 11,
    payload: {
      grid: grid.map(row => [...row]),
      row: undefined,
      col: undefined
    } as BacktrackingPayload
  });

  return steps;
}
