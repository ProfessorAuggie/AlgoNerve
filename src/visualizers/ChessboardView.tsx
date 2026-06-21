import React from 'react';
import type { Step, BacktrackingPayload } from '../algorithms/types';

interface ChessboardViewProps {
  step: Step;
}

export const ChessboardView: React.FC<ChessboardViewProps> = ({ step }) => {
  const payload = step.payload as BacktrackingPayload;
  if (!payload || !payload.grid) return null;

  const { grid, row: activeRow, col: activeCol, solutionsCount = 0 } = payload;
  const n = grid.length;

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
                squareBg = 'bg-emerald-100 dark:bg-emerald-950/80';
                borderClass = 'border-emerald-500';
                cellContent = (
                  <span className="text-xl md:text-2xl select-none text-emerald-600 dark:text-emerald-400 font-bold" aria-label="Queen">
                    👑
                  </span>
                );
              } else if (isChecking) {
                squareBg = 'bg-amber-100 dark:bg-amber-950/60 animate-pulse';
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
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-600 dark:text-zinc-300">
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
