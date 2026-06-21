import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAlgorithmStore } from '../store/algorithmStore';
import { SortingView } from '../visualizers/SortingView';
import { GraphView } from '../visualizers/GraphView';
import { TreeView } from '../visualizers/TreeView';
import { DPView } from '../visualizers/DPView';
import { RecursionView } from '../visualizers/RecursionView';
import { ChessboardView } from '../visualizers/ChessboardView';
import { ListStructureView } from '../visualizers/ListStructureView';
import { ConceptView } from '../visualizers/ConceptView';


import { Player } from '../controls/Player';
import { SpeedControl } from '../controls/SpeedControl';
import { Timeline } from '../controls/Timeline';
import { NarrationPanel } from '../controls/NarrationPanel';
import { CodePanel } from '../controls/CodePanel';
import { ComplexityBadge } from '../controls/ComplexityBadge';
import { ThemeToggle } from '../controls/ThemeToggle';

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
    if (selectedAlgo.mode === 'concept') {
      return <ConceptView />;
    }
    if (!currentStep) return null;
    switch (selectedAlgo.category) {
      case 'searching':
      case 'sorting':
        return <SortingView step={currentStep} />;
      case 'datastructures':
        return <ListStructureView step={currentStep} />;
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
    if (selectedAlgo.mode === 'concept') {
      return (
        <div className="p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl backdrop-blur-sm shadow-md transition-colors duration-300">
          <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider mb-2 font-mono">Concept Mode</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
            Input customization is disabled because this algorithm is running in concept exploration mode. Refer to the properties, applications, and pseudocode to review its behavior.
          </p>
        </div>
      );
    }
    switch (selectedAlgo.category) {
      case 'searching':
      case 'sorting':
      case 'datastructures':
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-violet-900/5 dark:bg-violet-900/10 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-zinc-900 dark:text-white">{selectedAlgo.name}</h2>
              <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {selectedAlgo.category}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono">Real-Time Traversal Visualizer</span>
          </div>
        </div>

        {/* Short info/help guides */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          {selectedAlgo.mode !== 'concept' && (
            <div className="hidden md:flex items-center gap-3 border-r border-zinc-200 dark:border-zinc-900 pr-4">
              <span><kbd className="bg-zinc-200 dark:bg-zinc-900 px-1 rounded text-zinc-600 dark:text-zinc-400">Space</kbd> Play/Pause</span>
              <span><kbd className="bg-zinc-200 dark:bg-zinc-900 px-1 rounded text-zinc-600 dark:text-zinc-400">←</kbd> Prev</span>
              <span><kbd className="bg-zinc-200 dark:bg-zinc-900 px-1 rounded text-zinc-600 dark:text-zinc-400">→</kbd> Next</span>
              <span><kbd className="bg-zinc-200 dark:bg-zinc-900 px-1 rounded text-zinc-600 dark:text-zinc-400">R</kbd> Reset</span>
            </div>
          )}
          <Link
            to="/documentation"
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-colors"
            title="Open Documentation"
          >
            Documentation
          </Link>
          <HelpCircle size={15} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer transition-colors" />
          <ThemeToggle />
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
          {selectedAlgo.mode !== 'concept' ? (
            <div className="bg-white/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm shadow-md flex flex-col gap-4 transition-colors duration-300">
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
          ) : (
            <div className="bg-white/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm shadow-md flex flex-col items-center justify-center py-6 px-4 transition-colors duration-300 text-center">
              <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">
                Conceptual Mode Active
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-md font-sans">
                This algorithm runs in conceptual overview mode. Read the properties, applications, and pseudocode. Step simulation is disabled.
              </p>
            </div>
          )}
        </section>

        {/* Right Details Config Panel (1 col) */}
        <section className="flex flex-col gap-6 h-full justify-start">
          {renderInputs()}
          <CodePanel />
          <ComplexityBadge />
        </section>
      </main>

      <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 py-4 text-center text-[10px] font-mono text-zinc-500 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-950/80 backdrop-blur-sm mt-auto z-10 transition-colors duration-300">
        © 2026 AlgoNerve. Created by <a href="https://www.linkedin.com/in/professorauggie/" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">Vaibhav Kushwaha</a>. All Rights Reserved.
        <span className="mx-2">|</span>
        <a href="https://professor-auggie.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">Portfolio</a>
        <span className="mx-2">|</span>
        <a href="https://github.com/ProfessorAuggie" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">GitHub</a>
      </footer>
    </div>
  );
};
