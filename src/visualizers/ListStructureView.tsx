import React from 'react';
import type { Step, DataStructurePayload } from '../algorithms/types';

interface ListStructureViewProps {
  step: Step;
}

export const ListStructureView: React.FC<ListStructureViewProps> = ({ step }) => {
  const payload = step.payload as DataStructurePayload;
  if (!payload) return null;

  const {
    type,
    elements = [],
    nodes = [],
    topIndex,
    frontIndex,
    rearIndex,
    activeIndex,
    activeNodeId,
    actionNodeId,
    actionType,
    headId,
  } = payload;

  const renderStack = () => {
    // Render stack vertically (bottom of stack is index 0, top of stack is elements.length - 1)
    const reversedElements = [...elements].reverse();
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[220px] sm:min-h-[300px] py-6">
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Stack (LIFO - Last In First Out)
        </div>
        
        {/* Stack Container representation */}
        <div className="relative w-48 border-b-4 border-x-4 border-zinc-400 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-950/20 rounded-b-2xl p-4 flex flex-col justify-end gap-2.5 min-h-[220px]">
          {elements.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-zinc-400 dark:text-zinc-600 animate-pulse">
              Empty Stack
            </div>
          ) : (
            reversedElements.map((val, idx) => {
              const originalIndex = elements.length - 1 - idx;
              const isTop = originalIndex === topIndex;
              const isActive = originalIndex === activeIndex;

              let cardBg = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800';
              let glow = '';

              if (isActive) {
                if (actionType === 'pop') {
                  cardBg = 'bg-rose-500 border-rose-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(244,63,94,0.4)]';
                } else if (actionType === 'peek') {
                  cardBg = 'bg-amber-500 border-amber-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(245,158,11,0.4)]';
                } else {
                  cardBg = 'bg-violet-600 border-violet-500 text-white';
                  glow = 'shadow-[0_0_12px_rgba(124,58,237,0.4)]';
                }
              }

              return (
                <div
                  key={originalIndex}
                  className={`w-full py-3 rounded-xl border text-center font-bold text-sm relative transition-all duration-300 ${cardBg} ${glow} flex items-center justify-center`}
                >
                  <span className={isActive ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}>
                    {val}
                  </span>
                  
                  {/* index label */}
                  <span className={`absolute left-3 text-[9px] font-mono font-normal ${isActive ? 'text-white/80' : 'text-zinc-400'}`}>
                    [{originalIndex}]
                  </span>

                  {/* Top Pointer */}
                  {isTop && (
                    <span className="absolute -right-16 flex items-center gap-1.5 animate-bounce">
                      <span className="text-zinc-800 dark:text-zinc-200 text-xs font-bold font-mono">← Top</span>
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderQueue = () => {
    // Render queue horizontally
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[220px] sm:min-h-[300px] py-6 px-4">
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">
          Queue (FIFO - First In First Out)
        </div>

        <div className="w-full max-w-2xl flex items-center gap-2 border-y-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100/10 dark:bg-zinc-950/10 py-6 px-4 rounded-xl min-h-[140px] relative overflow-x-auto">
          {elements.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-zinc-400 dark:text-zinc-600 animate-pulse">
              Empty Queue
            </div>
          ) : (
            elements.map((val, idx) => {
              const isFront = idx === frontIndex;
              const isRear = idx === rearIndex;
              const isActive = idx === activeIndex;

              let cardBg = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800';
              let glow = '';

              if (isActive) {
                if (actionType === 'dequeue') {
                  cardBg = 'bg-rose-500 border-rose-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(244,63,94,0.4)]';
                } else {
                  cardBg = 'bg-violet-600 border-violet-500 text-white';
                  glow = 'shadow-[0_0_12px_rgba(124,58,237,0.4)]';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center relative shrink-0">
                  {/* Element Block */}
                  <div
                    className={`w-20 h-16 rounded-xl border text-center font-bold text-base transition-all duration-300 ${cardBg} ${glow} flex flex-col items-center justify-center`}
                  >
                    <span className={isActive ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}>
                      {val}
                    </span>
                    <span className={`text-[8px] font-mono font-normal mt-0.5 ${isActive ? 'text-white/70' : 'text-zinc-400'}`}>
                      idx: {idx}
                    </span>
                  </div>

                  {/* Front/Rear pointers */}
                  <div className="absolute top-18 flex flex-col items-center gap-0.5">
                    {isFront && (
                      <span className="text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5 rounded shadow-sm">
                        ▲ Front
                      </span>
                    )}
                    {isRear && (
                      <span className="text-[9px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 px-1.5 py-0.5 rounded shadow-sm mt-1">
                        ▲ Rear
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderLinkedList = () => {
    const isDoubly = nodes.some(n => n.hasOwnProperty('prevId') || n.prevId !== undefined);
    const isCircular = nodes.length > 0 && nodes[nodes.length - 1].nextId === headId;
    const listTitle = isDoubly ? 'Doubly Linked List' : isCircular ? 'Circular Linked List' : 'Singly Linked List';

    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[220px] sm:min-h-[300px] py-6 px-4 overflow-x-auto">
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-wider shrink-0">
          {listTitle}
        </div>

        <div className="flex items-center gap-1 min-h-[140px] px-4 w-full justify-start md:justify-center overflow-x-auto py-4">
          {/* Head Indicator */}
          <div className="flex flex-col items-center justify-center mr-3 shrink-0">
            <span className="text-xs font-mono font-extrabold text-violet-600 dark:text-violet-400 mb-1">Head</span>
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 border border-violet-300 dark:border-violet-850 flex items-center justify-center text-violet-700 dark:text-violet-300 font-extrabold text-sm">
              H
            </div>
            {/* arrow right */}
            <span className="text-zinc-400 mt-1">↓</span>
          </div>

          {nodes.length === 0 ? (
            <div className="text-xs font-mono text-zinc-400 dark:text-zinc-600 animate-pulse">
              Null (List is empty)
            </div>
          ) : (
            nodes.map((node, idx) => {
              const isActive = node.id === activeNodeId;
              const isAction = node.id === actionNodeId;

              let cardBg = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800';
              let glow = '';

              if (isActive) {
                if (actionType === 'delete') {
                  cardBg = 'bg-rose-500 border-rose-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(244,63,94,0.4)]';
                } else if (actionType === 'insert') {
                  cardBg = 'bg-emerald-500 border-emerald-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(16,185,129,0.4)]';
                } else {
                  cardBg = 'bg-amber-500 border-amber-400 text-white';
                  glow = 'shadow-[0_0_12px_rgba(245,158,11,0.4)]';
                }
              } else if (isAction) {
                cardBg = 'bg-violet-600/10 border-violet-500 text-violet-600 dark:text-violet-400';
                glow = 'shadow-[0_0_10px_rgba(124,58,237,0.2)] border-dashed border-2 animate-pulse';
              }

              return (
                <React.Fragment key={node.id}>
                  {/* Linked List Node */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`flex rounded-xl border overflow-hidden transition-all duration-300 ${cardBg} ${glow} shadow-sm`}
                    >
                      {/* Value Compartment */}
                      <div className="px-4 py-3 flex flex-col items-center justify-center min-w-[50px] border-r border-zinc-200 dark:border-zinc-800">
                        <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {node.value}
                        </span>
                        <span className={`text-[7px] font-mono mt-0.5 ${isActive ? 'text-white/70' : 'text-zinc-400'}`}>
                          val
                        </span>
                      </div>

                      {/* Pointer Compartment */}
                      <div className="px-2.5 py-3 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/40 text-[9px] font-mono min-w-[36px]">
                        <span className={isActive ? 'text-white' : 'text-violet-600 dark:text-violet-450 font-bold'}>
                          {node.nextId ? '•' : 'Ø'}
                        </span>
                        <span className={`text-[7px] ${isActive ? 'text-white/70' : 'text-zinc-400'}`}>
                          next
                        </span>
                      </div>
                    </div>

                    {/* Active Node Highlighter Flag */}
                    {isActive && (
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 border border-zinc-700 px-1 py-0.5 rounded shadow mt-1.5 animate-pulse shrink-0">
                        {actionType || 'Active'}
                      </span>
                    )}
                  </div>

                  {/* SVG / Connector Arrow to next node */}
                  {idx < nodes.length - 1 ? (
                    <div className="w-10 flex items-center justify-center shrink-0">
                      <svg className="w-full h-6 text-zinc-400 dark:text-zinc-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 40 24">
                        {isDoubly ? (
                          <path d="M8 12h24M14 6l-6 6 6 6M26 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <path d="M0 12h32M24 6l8 6-8 6" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 flex items-center justify-center text-xs font-mono font-extrabold text-zinc-450 dark:text-zinc-550 shrink-0 select-none">
                      → {isCircular ? 'Head' : 'Null'}
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      {type === 'stack' && renderStack()}
      {type === 'queue' && renderQueue()}
      {type === 'linked-list' && renderLinkedList()}

      {/* Action panel legend summary */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-violet-600 border border-violet-500" />
          <span>Insert/Push/Enqueue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
          <span>Compare/Peek/Traverse</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-rose-500 border border-rose-400" />
          <span>Delete/Pop/Dequeue</span>
        </div>
      </div>
    </div>
  );
};
