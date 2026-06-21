import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlgorithmStore } from '../store/algorithmStore';
import { SortingView } from '../visualizers/SortingView';
import { GraphView } from '../visualizers/GraphView';
import { TreeView } from '../visualizers/TreeView';
import { DPView } from '../visualizers/DPView';
import { RecursionView } from '../visualizers/RecursionView';
import { ChessboardView } from '../visualizers/ChessboardView';


import { Player } from '../controls/Player';
import { SpeedControl } from '../controls/SpeedControl';
import { Timeline } from '../controls/Timeline';
import { NarrationPanel } from '../controls/NarrationPanel';
import { CodePanel } from '../controls/CodePanel';
import { ComplexityBadge } from '../controls/ComplexityBadge';

import { ArrayInput } from '../inputs/ArrayInput';
import { GraphInput } from '../inputs/GraphInput';
import { DPInput } from '../inputs/DPInput';

import { ChevronLeft, HelpCircle } from 'lucide-react';


export const VisualizerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedAlgo,
    selectAlgorithm,
    steps,
    currentStepIndex,
    isPlaying,
    setIsPlaying,
    nextStep,
    prevStep,
    resetPlayback,
  } = useAlgorithmStore();

  // Route fallback or algorithm loading
  useEffect(() => {
    if (id) {
      selectAlgorithm(id);
    }
  }, [id, selectAlgorithm]);

  // Keyboard Shortcuts Setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside text fields/inputs
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'KeyR':
          e.preventDefault();
          resetPlayback();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, setIsPlaying, nextStep, prevStep, resetPlayback]);

  if (!selectedAlgo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-mono text-zinc-500 text-xs">
        Loading visualizer context...
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  // Map active visualization categories to their views
  const renderVisualizer = () => {
    if (!currentStep) return null;
    switch (selectedAlgo.category) {
      case 'sorting':
        return <SortingView step={currentStep} />;
      case 'graph':
        return <GraphView step={currentStep} />;
      case 'tree':
        return <TreeView step={currentStep} />;
      case 'dp':
        return <DPView step={currentStep} />;
      case 'recursion':
        return <RecursionView step={currentStep} />;
      case 'backtracking':
        return <ChessboardView step={currentStep} />;
      default:
        return null;
    }
  };

  // Map active category inputs
  const renderInputs = () => {
    switch (selectedAlgo.category) {
      case 'sorting':
        return <ArrayInput />;
      case 'graph':
        return <GraphInput />;
      case 'tree':
      case 'dp':
      case 'recursion':
      case 'backtracking':
        return <DPInput />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-violet-900/5 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <header className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">{selectedAlgo.name}</h2>
              <span className="text-[9px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {selectedAlgo.category}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Real-Time Traversal Visualizer</span>
          </div>
        </div>

        {/* Short info/help guides */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <div className="hidden md:flex items-center gap-3 border-r border-zinc-900 pr-4">
            <span><kbd className="bg-zinc-900 px-1 rounded text-zinc-400">Space</kbd> Play/Pause</span>
            <span><kbd className="bg-zinc-900 px-1 rounded text-zinc-400">←</kbd> Prev</span>
            <span><kbd className="bg-zinc-900 px-1 rounded text-zinc-400">→</kbd> Next</span>
            <span><kbd className="bg-zinc-900 px-1 rounded text-zinc-400">R</kbd> Reset</span>
          </div>
          <HelpCircle size={15} className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
        </div>
      </header>

      {/* Core split layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 overflow-hidden">
        {/* Left Visualizer Dashboard Panel (2 cols) */}
        <section className="lg:col-span-2 flex flex-col gap-6 h-full justify-between">
          <div className="flex-1 min-h-[350px] relative">
            {renderVisualizer()}
          </div>

          {/* Bottom control hub */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm shadow-md flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Player />
              <SpeedControl />
            </div>
            
            <div className="w-full">
              <Timeline />
            </div>

            <div className="w-full">
              <NarrationPanel />
            </div>
          </div>
        </section>

        {/* Right Details Config Panel (1 col) */}
        <section className="flex flex-col gap-6 h-full justify-start">
          {renderInputs()}
          <CodePanel />
          <ComplexityBadge />
        </section>
      </main>

      {/* Mini footer */}
      <footer className="w-full border-t border-zinc-900 py-4 text-center text-[10px] font-mono text-zinc-700 bg-zinc-950/80 backdrop-blur-sm mt-auto z-10">
        AlgoNerve Visualizer Dashboard • Accessibly optimized with narration feeds
      </footer>

    </div>
  );
};
