import type { Step, DPPayload } from '../algorithms/types';

interface DPViewProps {
  step: Step;
}

export const DPView: React.FC<DPViewProps> = ({ step }) => {
  const payload = step.payload as DPPayload;
  if (!payload || !payload.table) return null;


  const { table, rows = [], cols = [], activeCell, dependsOn = [], result } = payload;

  const isDependency = (r: number, c: number) => {
    return dependsOn.some(([depR, depC]) => depR === r && depC === c);
  };

  const isActive = (r: number, c: number) => {
    return activeCell && activeCell[0] === r && activeCell[1] === c;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4 min-h-[300px]">
        <table className="border-collapse font-mono text-sm max-w-full">
          <thead>
            <tr>
              {/* Top-left corner spacer */}
              <th className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 text-zinc-500 font-bold transition-colors">
                DP
              </th>
              {cols.map((col, idx) => (
                <th
                  key={`col-header-${idx}`}
                  className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-semibold text-center min-w-[50px] transition-colors"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((rowArr, rIdx) => (
              <tr key={`row-${rIdx}`}>
                {/* Row Header */}
                <td className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 font-semibold text-center transition-colors">
                  {rows[rIdx] || rIdx}
                </td>
                
                {/* Data Cells */}
                {rowArr.map((val, cIdx) => {
                  const active = isActive(rIdx, cIdx);
                  const dep = isDependency(rIdx, cIdx);
                  const hasValue = val !== -1;

                  let cellClass = 'text-zinc-400 dark:text-zinc-500';
                  let bgClass = 'bg-zinc-100/20 dark:bg-zinc-950/20';
                  let borderClass = 'border-zinc-200 dark:border-zinc-850';

                  if (active) {
                    cellClass = 'text-white font-bold scale-105';
                    bgClass = 'bg-violet-650 dark:bg-violet-600/90 glow-indigo ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950';
                    borderClass = 'border-violet-400';
                  } else if (dep) {
                    cellClass = 'text-amber-800 dark:text-amber-300 font-semibold';
                    bgClass = 'bg-amber-100 dark:bg-amber-955/40 border-amber-600/80';
                    borderClass = 'border-amber-500';
                  } else if (hasValue) {
                    cellClass = 'text-emerald-700 dark:text-emerald-400 font-medium';
                    bgClass = 'bg-emerald-100/30 dark:bg-emerald-950/10';
                  }

                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`p-3 border text-center transition-all duration-205 ${cellClass} ${bgClass} ${borderClass}`}
                    >
                      {hasValue ? val : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Result Indicator badge if DP is complete */}
      {result !== undefined && (
        <div className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-emerald-100/40 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 font-mono text-sm font-semibold transition-colors">
          Result: {result}
        </div>
      )}

      {/* Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-650 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-violet-600 ring-2 ring-violet-400" />
          <span>Active Cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-500" />
          <span>Dependency (Read)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-500/30 dark:border-emerald-900" />
          <span>Calculated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-zinc-100/20 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800" />
          <span>Uncomputed</span>
        </div>
      </div>
    </div>
  );
};
