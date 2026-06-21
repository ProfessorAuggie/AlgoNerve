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
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 backdrop-blur-sm">
      <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4 min-h-[300px]">
        <table className="border-collapse font-mono text-sm max-w-full">
          <thead>
            <tr>
              {/* Top-left corner spacer */}
              <th className="p-3 border border-zinc-800 bg-zinc-950/60 text-zinc-500 font-bold">
                DP
              </th>
              {cols.map((col, idx) => (
                <th
                  key={`col-header-${idx}`}
                  className="p-3 border border-zinc-800 bg-zinc-900 text-zinc-400 font-semibold text-center min-w-[50px]"
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
                <td className="p-3 border border-zinc-800 bg-zinc-900 text-zinc-400 font-semibold text-center">
                  {rows[rIdx] || rIdx}
                </td>
                
                {/* Data Cells */}
                {rowArr.map((val, cIdx) => {
                  const active = isActive(rIdx, cIdx);
                  const dep = isDependency(rIdx, cIdx);
                  const hasValue = val !== -1;

                  let cellClass = 'text-zinc-500';
                  let bgClass = 'bg-zinc-950/20';
                  let borderClass = 'border-zinc-850';

                  if (active) {
                    cellClass = 'text-white font-bold scale-105';
                    bgClass = 'bg-violet-600/90 glow-indigo ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-950';
                    borderClass = 'border-violet-400';
                  } else if (dep) {
                    cellClass = 'text-amber-300 font-semibold';
                    bgClass = 'bg-amber-950/40 border-amber-600/80';
                    borderClass = 'border-amber-500';
                  } else if (hasValue) {
                    cellClass = 'text-emerald-400 font-medium';
                    bgClass = 'bg-emerald-950/10';
                  }

                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`p-3 border text-center transition-all duration-200 ${cellClass} ${bgClass} ${borderClass}`}
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
        <div className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-sm font-semibold">
          Result: {result}
        </div>
      )}

      {/* Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-800/60 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-violet-600 ring-2 ring-violet-400" />
          <span className="text-zinc-300">Active Cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-amber-950/60 border border-amber-500" />
          <span className="text-zinc-300">Dependency (Read)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-emerald-950/20 border border-emerald-900" />
          <span className="text-zinc-300">Calculated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-zinc-950/20 border border-zinc-800" />
          <span className="text-zinc-300">Uncomputed</span>
        </div>
      </div>
    </div>
  );
};
