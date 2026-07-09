import React, { useState, useRef, useEffect } from 'react';
import type { Step, SortingPayload } from '../algorithms/types';
import { useAlgorithmStore } from '../store/algorithmStore';
import { ArrowDownUp, BarChart3, GitCompareArrows, CheckCircle2, Eye } from 'lucide-react';

interface SortingViewProps {
  step: Step;
}

export const SortingView: React.FC<SortingViewProps> = ({ step }) => {
  const payload = step.payload as SortingPayload;
  const { steps, currentStepIndex } = useAlgorithmStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset selection when step changes
  useEffect(() => {
    setSelectedIdx(null);
  }, [currentStepIndex]);

  if (!payload || !payload.array) return null;

  const { array, comparing = [], swapping = [], sorted = [], pivot, left, right, mid } = payload;
  const maxVal = Math.max(...array, 1);

  // Count comparisons and swaps up to current step
  let compareCount = 0;
  let swapCount = 0;
  for (let i = 0; i <= currentStepIndex && i < steps.length; i++) {
    const s = steps[i];
    if (s.action === 'compare' || s.action === 'heapify-compare') compareCount++;
    if (s.action === 'swap' || s.action === 'heapify-swap' || s.action === 'extract') swapCount++;
  }

  // Determine operation type for the badge
  const getOperationBadge = () => {
    switch (step.action) {
      case 'init': return { label: 'Initialize', color: 'bg-zinc-500', icon: <BarChart3 size={11} /> };
      case 'compare': case 'heapify-compare': return { label: 'Comparing', color: 'bg-amber-500', icon: <Eye size={11} /> };
      case 'swap': case 'heapify-swap': return { label: 'Swapping', color: 'bg-rose-500', icon: <ArrowDownUp size={11} /> };
      case 'done': return { label: 'Complete', color: 'bg-emerald-500', icon: <CheckCircle2 size={11} /> };
      case 'pivot': return { label: 'Pivot Selected', color: 'bg-fuchsia-500', icon: <GitCompareArrows size={11} /> };
      case 'outer-loop': return { label: 'Next Pass', color: 'bg-indigo-500', icon: <BarChart3 size={11} /> };
      case 'sorted': return { label: 'Element Placed', color: 'bg-emerald-500', icon: <CheckCircle2 size={11} /> };
      case 'insert': case 'shift': return { label: 'Inserting', color: 'bg-sky-500', icon: <ArrowDownUp size={11} /> };
      case 'split': return { label: 'Dividing', color: 'bg-cyan-500', icon: <GitCompareArrows size={11} /> };
      case 'merge-start': case 'merge-end': return { label: 'Merging', color: 'bg-violet-500', icon: <GitCompareArrows size={11} /> };
      default: return { label: step.action.replace(/-/g, ' '), color: 'bg-zinc-500', icon: <BarChart3 size={11} /> };
    }
  };

  const opBadge = getOperationBadge();
  const isDone = step.action === 'done';

  // Get bar status string for tooltip
  const getBarStatus = (idx: number): string => {
    if (sorted.includes(idx)) return 'Sorted ✓';
    if (swapping.includes(idx)) return 'Swapping ⇄';
    if (comparing.includes(idx)) return 'Comparing 👁';
    if (array[idx] === pivot) return 'Pivot ◆';
    if (left !== undefined && right !== undefined && idx >= left && idx <= right) {
      if (idx === mid) return 'Midpoint';
      return 'Active Range';
    }
    return 'Unsorted';
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300 relative overflow-hidden"
    >
      {/* Done celebration overlay */}
      {isDone && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent animate-fade-in" />
        </div>
      )}

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${opBadge.color} shadow-sm transition-all duration-300 animate-badge-in`}>
            {opBadge.icon}
            <span className="uppercase tracking-wider">{opBadge.label}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-2 py-0.5 rounded-md font-bold">
            <Eye size={10} />
            {compareCount}
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded-md font-bold">
            <ArrowDownUp size={10} />
            {swapCount}
          </span>
        </div>
      </div>

      {/* Main bar area */}
      <div className="flex-1 w-full flex items-end justify-center gap-1.5 sm:gap-2 max-w-2xl min-h-[200px] sm:min-h-[280px] px-2 py-4 relative">
        {/* Swap direction arrows between swapping bars */}
        {swapping.length === 2 && (
          <div className="absolute top-2 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className="flex items-center gap-1 text-rose-500 dark:text-rose-400 animate-swap-arrow">
              <ArrowDownUp size={16} className="animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Swap</span>
            </div>
          </div>
        )}

        {array.map((val, idx) => {
          const heightPercent = Math.max((val / maxVal) * 88, 4); // min 4% height for visibility
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedIdx === idx;
          const isSorted = sorted.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isComparing = comparing.includes(idx);
          const isPivot = val === pivot;
          const isInRange = left !== undefined && right !== undefined && idx >= left && idx <= right;
          const isMid = idx === mid;

          // Build bar gradient and styling
          let barStyle: React.CSSProperties = {};
          let barColorClass = '';
          let glowClass = '';
          let ringClass = '';
          let labelColorClass = 'text-zinc-500 dark:text-zinc-400';

          if (isSorted) {
            barStyle = { background: 'linear-gradient(to top, #059669, #10b981, #34d399)' };
            glowClass = 'shadow-[0_0_12px_rgba(16,185,129,0.35)]';
            labelColorClass = 'text-emerald-600 dark:text-emerald-400';
          } else if (isSwapping) {
            barStyle = { background: 'linear-gradient(to top, #be123c, #f43f5e, #fb7185)' };
            glowClass = 'shadow-[0_0_18px_rgba(244,63,94,0.5)]';
            ringClass = 'ring-2 ring-rose-400/60 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900';
            labelColorClass = 'text-rose-600 dark:text-rose-400';
          } else if (isComparing) {
            barStyle = { background: 'linear-gradient(to top, #b45309, #f59e0b, #fbbf24)' };
            glowClass = 'shadow-[0_0_18px_rgba(245,158,11,0.5)]';
            ringClass = 'ring-2 ring-amber-400/60 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900';
            labelColorClass = 'text-amber-600 dark:text-amber-400';
          } else if (isPivot) {
            barStyle = { background: 'linear-gradient(to top, #a21caf, #d946ef, #e879f9)' };
            glowClass = 'shadow-[0_0_14px_rgba(217,70,239,0.4)]';
            labelColorClass = 'text-fuchsia-600 dark:text-fuchsia-400';
          } else if (isInRange) {
            if (isMid) {
              barStyle = { background: 'linear-gradient(to top, #0e7490, #06b6d4, #22d3ee)' };
            } else {
              barStyle = { background: 'linear-gradient(to top, #3730a3, #6366f1, #818cf8)' };
              barColorClass = 'opacity-60';
            }
          } else {
            barStyle = { background: 'linear-gradient(to top, #3730a3, #6366f1, #818cf8)' };
          }

          // Hover/selected ring
          if (isHovered && !isSwapping && !isComparing) {
            ringClass = 'ring-2 ring-violet-400/50 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900';
          }
          if (isSelected) {
            ringClass = 'ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900';
          }

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
            >
              {/* Tooltip on hover */}
              {(isHovered || isSelected) && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-tooltip-in">
                  <div className="bg-zinc-900 dark:bg-zinc-800 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-lg shadow-xl border border-zinc-700 whitespace-nowrap">
                    <div className="font-bold text-[11px]">Value: {val}</div>
                    <div className="text-zinc-400">Index: {idx}</div>
                    <div className={`font-semibold ${
                      isSorted ? 'text-emerald-400' : 
                      isSwapping ? 'text-rose-400' : 
                      isComparing ? 'text-amber-400' : 
                      isPivot ? 'text-fuchsia-400' : 'text-zinc-400'
                    }`}>{getBarStatus(idx)}</div>
                  </div>
                  <div className="w-2 h-2 bg-zinc-900 dark:bg-zinc-800 border-r border-b border-zinc-700 rotate-45 mx-auto -mt-1" />
                </div>
              )}

              {/* Value Label */}
              <span className={`text-xs font-bold mb-1 transition-all duration-300 ${labelColorClass} ${
                isHovered || isSelected ? 'scale-110 opacity-100' : 'opacity-70'
              }`}>
                {val}
              </span>

              {/* Graphical Bar */}
              <div
                style={{ height: `${heightPercent}%`, ...barStyle }}
                className={`w-full max-w-[48px] rounded-t-md border border-white/10 transition-all duration-500 ease-out cursor-pointer ${barColorClass} ${glowClass} ${ringClass} ${
                  isSwapping ? 'animate-swap-pulse' : ''
                } ${isComparing ? 'animate-compare-glow' : ''} ${
                  isDone && isSorted ? 'animate-sorted-pop' : ''
                } ${isHovered ? 'brightness-110' : ''}`}
              >
                {/* Inner shimmer overlay for active bars */}
                {(isSwapping || isComparing) && (
                  <div className="w-full h-full rounded-t-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                )}
              </div>

              {/* Index Label */}
              <span className={`text-[10px] font-mono mt-2 transition-all duration-300 ${
                isHovered || isSelected ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 dark:text-zinc-500'
              }`}>
                {idx}
              </span>

              {/* Highlight Badges */}
              {isPivot && (
                <span className="absolute -bottom-6 text-[8px] bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap animate-badge-in">
                  PIVOT
                </span>
              )}
              {isMid && !isPivot && isInRange && (
                <span className="absolute -bottom-6 text-[8px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap animate-badge-in">
                  MID
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison line between comparing elements */}
      {comparing.length === 2 && (
        <div className="w-full max-w-2xl px-6 flex items-center justify-center -mt-1 mb-1">
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 animate-fade-in">
            <span className="text-[10px] font-bold font-mono">
              {array[comparing[0]]}
            </span>
            <GitCompareArrows size={12} className="mx-1 animate-pulse" />
            <span className="text-[10px] font-bold font-mono">
              {array[comparing[1]]}
            </span>
          </div>
        </div>
      )}

      {/* Legend Indicators */}
      <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-1.5 cursor-default group/legend">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#3730a3] to-[#818cf8] border border-indigo-400/30 group-hover/legend:scale-110 transition-transform" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-default group/legend">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#b45309] to-[#fbbf24] border border-amber-400/30 group-hover/legend:scale-110 transition-transform" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-default group/legend">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#be123c] to-[#fb7185] border border-rose-400/30 group-hover/legend:scale-110 transition-transform" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-default group/legend">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#059669] to-[#34d399] border border-emerald-400/30 group-hover/legend:scale-110 transition-transform" />
          <span>Sorted</span>
        </div>
        {pivot !== undefined && (
          <div className="flex items-center gap-1.5 cursor-default group/legend">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#a21caf] to-[#e879f9] border border-fuchsia-400/30 group-hover/legend:scale-110 transition-transform" />
            <span>Pivot</span>
          </div>
        )}
      </div>
    </div>
  );
};
