import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const NarrationPanel: React.FC = () => {
  const { currentStepIndex, steps } = useAlgorithmStore();
  const currentStep = steps[currentStepIndex];

  const description = currentStep?.description || 'Press Play or step forward to start visualizer.';

  return (
    <div className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 shadow-inner backdrop-blur-sm transition-colors duration-300">
      <h3 className="text-xs uppercase font-mono font-semibold text-zinc-500 mb-1.5 tracking-wider">
        Narration / Trace Logs
      </h3>
      
      {/* Live region for accessibility screen reader announcements */}
      <div
        id="algo-narration"
        aria-live="polite"
        className="text-sm text-zinc-805 dark:text-zinc-200 font-medium leading-relaxed font-sans min-h-[40px]"
      >
        {description}
      </div>
    </div>
  );
};
