import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const ComplexityBadge: React.FC = () => {
  const { selectedAlgo } = useAlgorithmStore();
  if (!selectedAlgo) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl backdrop-blur-sm shadow-md transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/60 pb-3">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Complexity Details</h4>
        <span className="text-[10px] font-mono bg-violet-100 dark:bg-violet-950 text-violet-750 dark:text-violet-300 border border-violet-200 dark:border-violet-850/80 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {selectedAlgo.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 p-3 rounded-lg flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Time Complexity</span>
          <span className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">
            {selectedAlgo.timeComplexity}
          </span>
        </div>

        {/* Space Complexity */}
        <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 p-3 rounded-lg flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Space Complexity</span>
          <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
            {selectedAlgo.spaceComplexity}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/60 pt-3">
        {selectedAlgo.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {selectedAlgo.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-550 dark:text-zinc-400 px-2 py-0.5 rounded font-semibold"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
