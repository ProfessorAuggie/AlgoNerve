import React, { useState } from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const DPInput: React.FC = () => {
  const {
    selectedAlgo,
    dpString1,
    dpString2,
    recursionN,
    treeValues,
    setDpStrings,
    setRecursionN,
    setTreeValues,
  } = useAlgorithmStore();

  const [s1, setS1] = useState(dpString1);
  const [s2, setS2] = useState(dpString2);
  const [nVal, setNVal] = useState(recursionN);
  const [treeValStr, setTreeValStr] = useState(treeValues.join(', '));
  const [error, setError] = useState('');

  if (!selectedAlgo) return null;

  const isDPStringAlgo = selectedAlgo.id === 'lcs' || selectedAlgo.id === 'edit-distance';
  const isTreeAlgo = selectedAlgo.id === 'bst';
  const isRecursionAlgo = selectedAlgo.id === 'factorial' || selectedAlgo.id === 'tower-of-hanoi' || selectedAlgo.id === 'fibonacci-dp';

  const handleApplyStrings = () => {
    setError('');
    if (!s1 || !s2) {
      setError('Please provide two valid non-empty strings.');
      return;
    }
    if (s1.length > 7 || s2.length > 7) {
      setError('Limit strings to 7 characters for optimal visualization spacing.');
      return;
    }
    setDpStrings(s1.toUpperCase(), s2.toUpperCase());
  };

  const handleApplyRecursionN = () => {
    setError('');
    const num = Number(nVal);
    if (isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    if (selectedAlgo.id === 'fibonacci-dp' && (num < 2 || num > 12)) {
      setError('Limit Fibonacci n to between 2 and 12.');
      return;
    }

    if (selectedAlgo.id === 'factorial' && (num < 1 || num > 8)) {
      setError('Limit Factorial n to between 1 and 8.');
      return;
    }

    if (selectedAlgo.id === 'tower-of-hanoi' && (num < 2 || num > 6)) {
      setError('Limit Tower of Hanoi disks to between 2 and 6.');
      return;
    }

    setRecursionN(num);
  };

  const handleApplyTree = () => {
    setError('');
    const parsed = treeValStr
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map((x) => Number(x));

    if (parsed.some(isNaN)) {
      setError('Invalid numbers detected.');
      return;
    }

    if (parsed.length < 3 || parsed.length > 10) {
      setError('Please enter between 3 and 10 values for optimal rendering.');
      return;
    }

    if (parsed.some((x) => x < 1 || x > 99)) {
      setError('Please use values between 1 and 99.');
      return;
    }

    setTreeValues(parsed);
  };

  const handleRandomizeTree = () => {
    const size = Math.floor(Math.random() * 4) + 5; // 5 to 8 values
    const uniqueVals = new Set<number>();
    while (uniqueVals.size < size) {
      uniqueVals.add(Math.floor(Math.random() * 80) + 10);
    }
    const arr = Array.from(uniqueVals);
    setTreeValStr(arr.join(', '));
    setTreeValues(arr);
    setError('');
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl backdrop-blur-sm shadow-md transition-colors duration-300">
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Parameters Configuration</h4>

      {/* String Input */}
      {isDPStringAlgo && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">String 1</label>
              <input
                type="text"
                value={s1}
                onChange={(e) => setS1(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">String 2</label>
              <input
                type="text"
                value={s2}
                onChange={(e) => setS2(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
          {error && <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{error}</span>}
          <button
            onClick={handleApplyStrings}
            className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white font-medium text-xs py-1.5 rounded-lg transition-colors"
          >
            Apply Strings
          </button>
        </div>
      )}

      {/* BST Insert Input */}
      {isTreeAlgo && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">BST Insertion Order</label>
            <input
              type="text"
              value={treeValStr}
              onChange={(e) => setTreeValStr(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          {error && <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{error}</span>}
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyTree}
              className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white font-medium text-xs py-1.5 rounded-lg transition-colors"
            >
              Apply Order
            </button>
            <button
              onClick={handleRandomizeTree}
              className="bg-violet-600 hover:bg-violet-600 text-white font-medium text-xs py-1.5 px-3 rounded-lg transition-colors shadow-sm"
            >
              Randomize
            </button>
          </div>
        </div>
      )}

      {/* Recursion depth / item count Input */}
      {isRecursionAlgo && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              {selectedAlgo.id === 'tower-of-hanoi' ? 'Number of Disks' : 'Value of n'}
            </label>
            <input
              type="number"
              value={nVal}
              onChange={(e) => setNVal(Number(e.target.value))}
              className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          {error && <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{error}</span>}
          <button
            onClick={handleApplyRecursionN}
            className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white font-medium text-xs py-1.5 rounded-lg transition-colors"
          >
            Apply Value
          </button>
        </div>
      )}
    </div>
  );
};
