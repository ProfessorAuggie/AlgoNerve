import type { Step, SortingPayload } from '../algorithms/types';


interface SortingViewProps {
  step: Step;
}

export const SortingView: React.FC<SortingViewProps> = ({ step }) => {
  const payload = step.payload as SortingPayload;
  if (!payload || !payload.array) return null;

  const { array, comparing = [], swapping = [], sorted = [], pivot, left, right, mid } = payload;
  const maxVal = Math.max(...array, 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      <div className="flex-1 w-full flex items-end justify-center gap-2 max-w-2xl min-h-[300px] px-4 py-8">
        {array.map((val, idx) => {
          // Calculate heights
          const heightPercent = (val / maxVal) * 90; // max 90%
          
          // Determine status styles
          let barColorClass = 'bg-indigo-500/80 border-indigo-400';
          let glowClass = '';

          if (sorted.includes(idx)) {
            barColorClass = 'bg-emerald-500/80 border-emerald-400';
            glowClass = 'shadow-[0_0_10px_rgba(16,185,129,0.3)]';
          } else if (swapping.includes(idx)) {
            barColorClass = 'bg-rose-500 border-rose-400 animate-pulse';
            glowClass = 'shadow-[0_0_15px_rgba(244,63,94,0.5)]';
          } else if (comparing.includes(idx)) {
            barColorClass = 'bg-amber-500 border-amber-400';
            glowClass = 'shadow-[0_0_15px_rgba(245,158,11,0.5)]';
          } else if (val === pivot) {
            barColorClass = 'bg-fuchsia-500 border-fuchsia-400';
            glowClass = 'shadow-[0_0_12px_rgba(217,70,239,0.4)]';
          } else if (left !== undefined && right !== undefined && idx >= left && idx <= right) {
            // Highlighting current active subsegment in divide-and-conquer
            barColorClass = 'bg-indigo-600/40 dark:bg-indigo-600/40 border-indigo-500/60';
            if (idx === mid) {
              barColorClass = 'bg-cyan-600/70 border-cyan-500/80';
            }
          }

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full transition-all duration-300 relative group"
            >
              {/* Value Label */}
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {val}
              </span>

              {/* Graphical Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[48px] rounded-t-md border transition-all duration-300 ${barColorClass} ${glowClass}`}
              />

              {/* Index Label */}
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 mt-2">
                {idx}
              </span>

              {/* Highlight Badges */}
              {val === pivot && (
                <span className="absolute -bottom-6 text-[9px] bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800 px-1 rounded font-semibold whitespace-nowrap">
                  Pivot
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Indicators */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-indigo-500/80 border border-indigo-400" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-amber-500 border border-amber-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-rose-500 border border-rose-400" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-emerald-500/80 border border-emerald-400" />
          <span>Sorted</span>
        </div>
        {pivot !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-3.0 h-3.0 rounded bg-fuchsia-500 border border-fuchsia-400" />
            <span>Pivot</span>
          </div>
        )}
      </div>
    </div>
  );
};
