import type { Step, RecursionPayload } from '../algorithms/types';


interface RecursionViewProps {
  step: Step;
}

export const RecursionView: React.FC<RecursionViewProps> = ({ step }) => {
  const payload = step.payload as RecursionPayload;
  if (!payload) return null;

  const { callStack = [], currentFrameId, result, pegs } = payload;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      {/* Hanoi Visualization */}
      {pegs ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[220px] sm:min-h-[300px]">
          <div className="flex justify-around items-end w-full max-w-lg h-[200px] relative pb-6">
            {/* Render Pegs */}
            {(['A', 'B', 'C'] as const).map((pegKey) => {
              const diskArray = pegs[pegKey];
              return (
                <div key={pegKey} className="flex flex-col items-center relative w-1/3 h-full">
                  {/* Peg Rod */}
                  <div className="absolute w-2 h-full bg-zinc-400 dark:bg-zinc-700 rounded-t-md bottom-0 transition-colors" />
                  
                  {/* Disks */}
                  <div className="absolute bottom-0 flex flex-col-reverse items-center w-full z-10">
                    {diskArray.map((diskVal, dIdx) => {
                      // Width multiplier: disk width gets wider as value is larger
                      const widthPercent = 30 + diskVal * 12; // base 30% + 12% per value
                      
                      // Harmonious spectrum colors for disks
                      const diskColors = [
                        'bg-rose-500 border-rose-400 shadow-rose-950/20',
                        'bg-amber-500 border-amber-400 shadow-amber-950/20',
                        'bg-emerald-500 border-emerald-400 shadow-emerald-950/20',
                        'bg-cyan-500 border-cyan-400 shadow-cyan-950/20',
                        'bg-indigo-500 border-indigo-400 shadow-indigo-950/20',
                        'bg-fuchsia-500 border-fuchsia-400 shadow-fuchsia-950/20',
                      ];
                      
                      const colorClass = diskColors[(diskVal - 1) % diskColors.length];

                      return (
                        <div
                          key={`disk-${dIdx}`}
                          style={{ width: `${widthPercent}%` }}
                          className={`h-6 rounded-md border flex items-center justify-center text-[10px] font-bold text-zinc-950 shadow-md transition-all duration-300 ${colorClass}`}
                        >
                          {diskVal}
                        </div>
                      );
                    })}
                  </div>

                  {/* Peg Base Label */}
                  <div className="absolute -bottom-8 font-mono text-xs font-bold bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 transition-colors">
                    Peg {pegKey}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Call Stack Frame Visualization */
        <div className="flex-1 w-full flex items-center justify-center min-h-[220px] sm:min-h-[300px] p-4">
          {callStack.length === 0 ? (
            <div className="text-zinc-500 font-mono text-sm">Call stack empty.</div>
          ) : (
            <div className="flex flex-col-reverse gap-2 w-full max-w-sm max-h-[280px] overflow-y-auto pr-2">
              {callStack.map((frame, idx) => {
                const isActive = frame.id === currentFrameId;
                const isReturning = frame.isReturning;
                
                let borderClass = 'border-zinc-200 dark:border-zinc-800';
                let bgClass = 'bg-zinc-100 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400';
                let actionText = '';

                if (isActive && isReturning) {
                  borderClass = 'border-emerald-500';
                  bgClass = 'bg-emerald-100 dark:bg-emerald-955/30 text-emerald-700 dark:text-emerald-300';
                  actionText = `→ Returns ${frame.returnValue}`;
                } else if (isActive) {
                  borderClass = 'border-violet-500';
                  bgClass = 'bg-violet-100 dark:bg-violet-955/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/30';
                  actionText = 'Active Execution';
                } else if (isReturning) {
                  borderClass = 'border-emerald-500/50 dark:border-emerald-600/50';
                  bgClass = 'bg-emerald-100/40 dark:bg-emerald-955/10 text-emerald-650 dark:text-emerald-450';
                  actionText = `Returns ${frame.returnValue}`;
                }

                return (
                  <div
                    key={frame.id}
                    className={`flex items-center justify-between p-3 border rounded-lg font-mono text-xs transition-all duration-300 ${borderClass} ${bgClass}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">
                        {frame.funcName}({Object.entries(frame.args).map(([k, v]) => `${k}=${v}`).join(', ')})
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Depth: {idx + 1}
                      </span>
                    </div>
                    {actionText && (
                      <span className="font-semibold text-[10px] bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 transition-colors">
                        {actionText}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Result Indicator */}
      {result !== undefined && (
        <div className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-emerald-100/40 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 font-mono text-sm font-semibold transition-colors">
          Final Output: {String(result)}
        </div>
      )}

      {/* Hanoi Legend */}
      {pegs && (
        <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Peg A: Source</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Peg B: Auxiliary</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Peg C: Destination</span>
          </div>
        </div>
      )}
    </div>
  );
};
