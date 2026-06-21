import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

export const Player: React.FC = () => {
  const {
    isPlaying,
    currentStepIndex,
    steps,
    nextStep,
    prevStep,
    resetPlayback,
    setIsPlaying,
  } = useAlgorithmStore();

  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex === steps.length - 1 || steps.length === 0;

  return (
    <div className="flex items-center gap-3">
      {/* Reset */}
      <button
        onClick={resetPlayback}
        disabled={isAtStart}
        className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 transition-all duration-200"
        title="Reset Playback (R)"
        aria-label="Reset Playback"
      >
        <RotateCcw size={16} />
      </button>

      {/* Step Back */}
      <button
        onClick={prevStep}
        disabled={isAtStart}
        className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 transition-all duration-200"
        title="Previous Step (Left Arrow)"
        aria-label="Previous Step"
      >
        <SkipBack size={16} />
      </button>

      {/* Play / Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        disabled={steps.length === 0}
        className={`p-3.5 rounded-xl border font-semibold flex items-center justify-center transition-all duration-300 shadow-md ${
          isPlaying
            ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-500 shadow-amber-950/40'
            : 'bg-violet-650 border-violet-550 text-white hover:bg-violet-600 shadow-violet-950/40'
        } disabled:opacity-40`}
        title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
        aria-label={isPlaying ? 'Pause Playback' : 'Start Playback'}
      >
        {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
      </button>

      {/* Step Forward */}
      <button
        onClick={nextStep}
        disabled={isAtEnd}
        className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 transition-all duration-200"
        title="Next Step (Right Arrow)"
        aria-label="Next Step"
      >
        <SkipForward size={16} />
      </button>
    </div>
  );
};
