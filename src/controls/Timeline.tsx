import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const Timeline: React.FC = () => {
  const { currentStepIndex, steps, setStepIndex } = useAlgorithmStore();

  const totalSteps = steps.length;
  const isEnabled = totalSteps > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStepIndex(parseInt(e.target.value, 10));
  };

  return (
    <div className="w-full flex items-center gap-4">
      {/* Slider */}
      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentStepIndex}
        onChange={handleChange}
        disabled={!isEnabled}
        className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Playback timeline"
      />

      {/* Numeric Indicator */}
      <div className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg min-w-[90px] text-center select-none shadow-sm transition-colors duration-300">
        {isEnabled ? (
          <>
            Step <span className="text-zinc-900 dark:text-white">{currentStepIndex + 1}</span> / {totalSteps}
          </>
        ) : (
          '0 / 0'
        )}
      </div>
    </div>
  );
};
