import React, { useState, useEffect } from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const ArrayInput: React.FC = () => {
  const { inputArray, setInputArray, selectedAlgo, recursionN, setRecursionN } = useAlgorithmStore();
  const [inputValue, setInputValue] = useState(inputArray.join(', '));
  const [targetInput, setTargetInput] = useState(recursionN.toString());

  useEffect(() => {
    setTargetInput(recursionN.toString());
  }, [recursionN]);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetInput(val);
    if (val !== '') {
      const parsed = Number(val);
      if (!isNaN(parsed)) {
        setRecursionN(parsed);
      }
    }
  };
  const [error, setError] = useState('');

  const handleUpdate = () => {
    setError('');
    const parsed = inputValue
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map((x) => Number(x));

    if (parsed.some(isNaN)) {
      setError('Invalid numbers detected. Please provide comma-separated values.');
      return;
    }

    if (parsed.length < 3 || parsed.length > 15) {
      setError('Please provide between 3 and 15 values for optimal visual rendering.');
      return;
    }

    if (parsed.some((x) => x < 1 || x > 100)) {
      setError('Please use values between 1 and 100.');
      return;
    }

    setInputArray(parsed);
  };

  const handleRandomize = () => {
    const size = Math.floor(Math.random() * 8) + 6; // 6 to 13 items
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10);
    setInputValue(randomArray.join(', '));
    setInputArray(randomArray);
    setError('');
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl backdrop-blur-sm shadow-md transition-colors duration-300">
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Input Array Configuration</h4>
      
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-800 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
          placeholder="e.g. 29, 10, 14, 37, 13"
        />
        {error && <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{error}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white font-medium text-xs py-1.5 px-3 rounded-lg transition-colors"
        >
          Apply Array
        </button>
        <button
          onClick={handleRandomize}
          className="bg-violet-600 hover:bg-violet-600 text-white font-medium text-xs py-1.5 px-3 rounded-lg transition-colors shadow-sm"
        >
          Randomize
        </button>
      </div>

      {selectedAlgo?.category === 'searching' && (
        <div className="flex flex-col gap-1.5 border-t border-zinc-200 dark:border-zinc-800/60 pt-3">
          <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Search Target Value</label>
          <input
            type="number"
            value={targetInput}
            onChange={handleTargetChange}
            className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-800 dark:text-white focus:outline-none focus:border-violet-500 transition-colors w-24"
          />
        </div>
      )}
    </div>
  );
};
