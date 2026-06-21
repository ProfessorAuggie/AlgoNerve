import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const SpeedControl: React.FC = () => {
  const { speed, setSpeed } = useAlgorithmStore();

  // Speed configs: delay in ms mapping to display multiplier
  const speeds = [
    { label: '0.5x', delay: 1500 },
    { label: '1x', delay: 800 },
    { label: '2x', delay: 400 },
    { label: '4x', delay: 150 },
  ];

  return (
    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
      {speeds.map((s) => {
        const isActive = speed === s.delay;
        return (
          <button
            key={s.label}
            onClick={() => setSpeed(s.delay)}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-zinc-800 text-violet-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};
