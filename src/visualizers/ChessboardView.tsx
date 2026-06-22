import React from 'react';
import type { Step, BacktrackingPayload } from '../algorithms/types';
import { useAlgorithmStore } from '../store/algorithmStore';

interface ChessboardViewProps {
  step: Step;
}

export const ChessboardView: React.FC<ChessboardViewProps> = ({ step }) => {
  const selectedAlgo = useAlgorithmStore(state => state.selectedAlgo);
  const algoId = selectedAlgo?.id || 'n-queens';

  const payload = step.payload as BacktrackingPayload;
  if (!payload || !payload.grid) return null;

  const {
    grid,
    row: activeRow,
    col: activeCol,
    solutionsCount = 0,
    initialGrid,
    conflictCell
  } = payload;
  
  const n = grid.length;

  // ─── 1. Sudoku Solver View ────────────────────────────────────────────────
  if (algoId === 'sudoku-solver') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
        <div className="flex-1 w-full flex items-center justify-center min-h-[300px] p-4">
          <div
            style={{
              gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
              width: '100%',
              maxWidth: '380px',
            }}
            className="grid gap-0.5 border-2 border-zinc-400 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-950 p-1 rounded-lg transition-colors"
          >
            {grid.map((rowArr, rIdx) =>
              rowArr.map((cellVal, cIdx) => {
                const isInitial = initialGrid && initialGrid[rIdx]?.[cIdx] !== 0;
                const isActive = activeRow === rIdx && activeCol === cIdx;
                const isConflict = conflictCell && conflictCell[0] === rIdx && conflictCell[1] === cIdx;

                let cellBg = 'bg-zinc-50 dark:bg-zinc-900';
                let textColor = 'text-zinc-800 dark:text-zinc-200';
                let borderClasses = 'border-transparent';

                if (isInitial) {
                  cellBg = 'bg-zinc-200/60 dark:bg-zinc-850/80 text-zinc-500 dark:text-zinc-450';
                  textColor = 'text-zinc-500 dark:text-zinc-450 font-bold';
                } else if (isConflict) {
                  cellBg = 'bg-rose-100 dark:bg-rose-950/60 animate-pulse';
                  textColor = 'text-rose-600 dark:text-rose-400 font-extrabold';
                  borderClasses = 'border-rose-500';
                } else if (isActive) {
                  cellBg = 'bg-violet-100 dark:bg-violet-950/65';
                  textColor = 'text-violet-600 dark:text-violet-400 font-bold';
                  borderClasses = 'border-violet-500';
                } else if (cellVal !== 0) {
                  cellBg = 'bg-emerald-50 dark:bg-emerald-950/20';
                  textColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
                }

                // Add thicker border lines for Sudoku 3x3 subdivisions
                const borderR = (cIdx === 2 || cIdx === 5) ? 'border-r-2 border-r-zinc-400 dark:border-r-zinc-700' : '';
                const borderB = (rIdx === 2 || rIdx === 5) ? 'border-b-2 border-b-zinc-400 dark:border-b-zinc-700' : '';

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{ aspectRatio: '1/1' }}
                    className={`border flex items-center justify-center rounded text-sm md:text-base transition-all duration-200 ${cellBg} ${borderClasses} ${borderR} ${borderB} ${textColor}`}
                  >
                    {cellVal !== 0 ? cellVal : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full flex items-center justify-between gap-4 mt-4 px-4 py-2 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono transition-colors">
          <span className="text-zinc-500 font-semibold uppercase">Sudoku Solver</span>
          <span className="text-violet-650 dark:text-violet-400 font-bold">
            {activeRow !== undefined && activeCol !== undefined
              ? `Checking: [Row ${activeRow + 1}, Col ${activeCol + 1}]`
              : 'Done'}
          </span>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-650 dark:text-zinc-350">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-750" />
            <span>Pre-filled (fixed)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-400" />
            <span>Placed by Solver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-violet-100 dark:bg-violet-950/65 border border-violet-500" />
            <span>Current Cell</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-500" />
            <span>Conflict Detected</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. Rat in a Maze View ────────────────────────────────────────────────
  if (algoId === 'rat-in-a-maze') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
        <div className="flex-1 w-full flex items-center justify-center min-h-[300px] p-4">
          <div
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
              width: '100%',
              maxWidth: `${n * 50}px`,
            }}
            className="grid gap-1 border border-zinc-300 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-950 p-1.5 rounded-lg transition-colors"
          >
            {grid.map((rowArr, rIdx) =>
              rowArr.map((cellVal, cIdx) => {
                const isWall = cellVal === 1;
                const isRat = activeRow === rIdx && activeCol === cIdx;
                const isPath = cellVal === 3;
                const isDeadEnd = cellVal === 4;
                const isCheese = rIdx === n - 1 && cIdx === n - 1;

                let cellBg = 'bg-zinc-50 dark:bg-zinc-900';
                let borderClass = 'border-transparent';
                let cellContent = null;

                if (isWall) {
                  cellBg = 'bg-zinc-700 dark:bg-zinc-800 border-zinc-650';
                } else if (isRat) {
                  cellBg = 'bg-amber-100 dark:bg-amber-955/40 ring-2 ring-amber-500';
                  cellContent = <span className="text-2xl select-none animate-bounce" role="img" aria-label="rat">🐭</span>;
                } else if (isCheese) {
                  cellBg = 'bg-emerald-50 dark:bg-emerald-950/30';
                  cellContent = <span className="text-2xl select-none" role="img" aria-label="cheese">🧀</span>;
                } else if (isPath) {
                  cellBg = 'bg-emerald-100/50 dark:bg-emerald-950/30 border-emerald-500';
                  cellContent = <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />;
                } else if (isDeadEnd) {
                  cellBg = 'bg-rose-50 dark:bg-rose-955/15 border-rose-300/30';
                  cellContent = <span className="text-xs font-bold text-rose-500/80">✕</span>;
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{ aspectRatio: '1/1' }}
                    className={`border flex items-center justify-center rounded-md transition-all duration-200 ${cellBg} ${borderClass}`}
                  >
                    {cellContent}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full flex items-center justify-between gap-4 mt-4 px-4 py-2 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono transition-colors">
          <span className="text-zinc-500 font-semibold uppercase">Rat in a Maze</span>
          <span className="text-amber-650 dark:text-amber-400 font-bold">
            {activeRow !== undefined && activeCol !== undefined
              ? `Position: [Row ${activeRow + 1}, Col ${activeCol + 1}]`
              : 'Done'}
          </span>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-650 dark:text-zinc-355">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐭</span>
            <span>Rat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧀</span>
            <span>Cheese (Goal)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Current Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-zinc-700 dark:bg-zinc-800" />
            <span>Wall / Obstacle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-500">✕</span>
            <span>Dead end / Backtracked</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. Chessboard / N-Queens View (Default) ──────────────────────────────
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      <div className="flex-1 w-full flex items-center justify-center min-h-[300px] p-4">
        {/* Render Chessboard Grid */}
        <div
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: `${n * 45}px`,
          }}
          className="grid gap-0.5 border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg transition-colors"
        >
          {grid.map((rowArr, rIdx) =>
            rowArr.map((cellVal, cIdx) => {
              // Alternating square colors
              const isDark = (rIdx + cIdx) % 2 === 1;
              const isQueen = cellVal === 1;
              const isChecking = cellVal === 2;
              
              const isActive = activeRow === rIdx && activeCol === cIdx;

              let squareBg = isDark ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-zinc-50 dark:bg-zinc-700/60';
              let borderClass = 'border-transparent';
              let cellContent = null;

              if (isQueen) {
                squareBg = 'bg-emerald-100 dark:bg-emerald-955/40';
                borderClass = 'border-emerald-500';
                cellContent = (
                  <span className="text-xl md:text-2xl select-none text-emerald-600 dark:text-emerald-400 font-bold" aria-label="Queen">
                    👑
                  </span>
                );
              } else if (isChecking) {
                squareBg = 'bg-amber-100 dark:bg-amber-955/30 animate-pulse';
                borderClass = 'border-amber-500';
                cellContent = (
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                    ?
                  </span>
                );
              } else if (isActive) {
                squareBg = 'bg-violet-100 dark:bg-violet-950/80';
                borderClass = 'border-violet-400';
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  style={{ aspectRatio: '1/1' }}
                  className={`border flex items-center justify-center rounded transition-all duration-200 ${squareBg} ${borderClass}`}
                >
                  {cellContent}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Solutions count indicator */}
      <div className="w-full flex items-center justify-between gap-4 mt-4 px-4 py-2 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono transition-colors">
        <span className="text-zinc-500 font-semibold uppercase">Chessboard: {n}x{n}</span>
        <span className="text-emerald-650 dark:text-emerald-400 font-bold">Solutions Found: {solutionsCount}</span>
      </div>

      {/* Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-650 dark:text-zinc-350">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 flex items-center justify-center text-[8px]">👑</div>
          <span>Queen placed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 border border-amber-500 flex items-center justify-center text-[8px]">?</div>
          <span>Checking conflicts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
          <span>Dark square</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-zinc-50 dark:bg-zinc-700/60 border border-zinc-200 dark:border-zinc-600" />
          <span>Light square</span>
        </div>
      </div>
    </div>
  );
};
