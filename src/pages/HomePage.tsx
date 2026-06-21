import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHM_REGISTRY } from '../algorithms/types';
import type { AlgorithmCategory } from '../algorithms/types';

import { useAlgorithmStore } from '../store/algorithmStore';
import { Sparkles, Terminal, Code, Cpu, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectAlgorithm } = useAlgorithmStore();
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory | 'all'>('all');

  const categories: { key: AlgorithmCategory | 'all'; label: string; icon: any }[] = [
    { key: 'all', label: 'All Algorithms', icon: Sparkles },
    { key: 'sorting', label: 'Sorting', icon: Layers },
    { key: 'graph', label: 'Graph Theory', icon: Cpu },
    { key: 'tree', label: 'Trees & BSTs', icon: Code },
    { key: 'dp', label: 'Dynamic Programming', icon: Terminal },
    { key: 'recursion', label: 'Recursion', icon: Terminal },
  ];

  const filteredAlgos = ALGORITHM_REGISTRY.filter(
    (algo) => activeCategory === 'all' || algo.category === activeCategory
  );

  const handleSelect = (id: string) => {
    selectAlgorithm(id);
    navigate(`/visualize/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between border-b border-zinc-900 z-10">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 select-none">
            AlgoNerve
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Documentation
          </a>
          <button className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-semibold text-xs py-2 px-4 rounded-xl transition-all duration-300">
            Interactive Console
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-850 rounded-full text-zinc-400 mb-6 shadow-sm">
          <Sparkles size={12} className="text-violet-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Interactive Playback & State Inspection
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6 leading-tight">
          Visualize algorithms in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
            Real Time
          </span>
        </h1>

        <p className="text-sm md:text-base text-zinc-400 max-w-xl mb-12 leading-relaxed">
          Step into recursion stacks, watch DP memory grids compile, debug graph traversals, and animate sorting operations. A high-performance simulation platform.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16 max-w-2xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                  isSelected
                    ? 'bg-violet-650 border-violet-550 text-white shadow-md shadow-violet-950/40 scale-105'
                    : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-white' : 'text-zinc-500'} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Algorithm Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {filteredAlgos.map((algo) => (
            <div
              key={algo.id}
              onClick={() => handleSelect(algo.id)}
              className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between items-start text-left relative group overflow-hidden"
            >
              {/* Card glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-3xl pointer-events-none group-hover:bg-violet-600/10 transition-colors" />

              <div className="w-full flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono bg-zinc-950 text-zinc-500 border border-zinc-850 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {algo.category}
                </span>
                
                {/* Complexity badge */}
                <div className="flex flex-col items-end font-mono text-[10px] text-zinc-500">
                  <span>Time: <strong className="text-zinc-300">{algo.timeComplexity}</strong></span>
                  <span>Space: <strong className="text-zinc-300">{algo.spaceComplexity}</strong></span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-violet-400 transition-colors">
                {algo.name}
              </h3>
              
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {algo.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {algo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono bg-zinc-950/60 border border-zinc-850/60 text-zinc-500 px-2 py-0.5 rounded font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 py-6 text-center text-xs font-mono text-zinc-600 z-10 bg-zinc-950/80 backdrop-blur-md">
        © 2026 AlgoNerve. Created by <a href="https://www.linkedin.com/in/professorauggie/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 hover:underline">Vaibhav Kushwaha</a>. All Rights Reserved.
      </footer>

    </div>
  );
};
