import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ALGORITHM_REGISTRY } from '../algorithms/types';
import type { AlgorithmCategory } from '../algorithms/types';

import { useAlgorithmStore } from '../store/algorithmStore';
import {
  Sparkles,
  Code,
  Cpu,
  Layers,
  Search,
  HelpCircle,
  Repeat,
  Undo,
  SquareStack,
  RefreshCw,
  Link as LinkIcon,
  Scale,
  Type,
  Hash,
  Share2,
  Navigation,
  RotateCw,
  Grid,
  Coins,
  Split,
  FileText,
  Percent,
  Table,
  Shapes,
  Activity,
  Shuffle,
  Brain,
  Workflow
} from 'lucide-react';
import { ThemeToggle } from '../controls/ThemeToggle';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectAlgorithm } = useAlgorithmStore();
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = "AlgoNerve";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'An interactive algorithm visualizer animating recursion stacks, dynamic programming tables, sorting operations, and graph traversals in real-time.');
    }
  }, []);

  const categories: { key: AlgorithmCategory | 'all'; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Sparkles },
    { key: 'searching', label: 'Searching', icon: Search },
    { key: 'sorting', label: 'Sorting', icon: Layers },
    { key: 'recursion', label: 'Recursion', icon: Repeat },
    { key: 'backtracking', label: 'Backtracking', icon: Undo },
    { key: 'stack', label: 'Stack', icon: SquareStack },
    { key: 'queue-deque', label: 'Queue & Deque', icon: RefreshCw },
    { key: 'linkedlist', label: 'Linked List', icon: LinkIcon },
    { key: 'binarytrees', label: 'Binary Trees', icon: Workflow },
    { key: 'bst', label: 'BSTs', icon: Code },
    { key: 'balancedtrees', label: 'Balanced Trees', icon: Scale },
    { key: 'heap', label: 'Heaps & Priority Queues', icon: Hash },
    { key: 'trie', label: 'Tries', icon: Type },
    { key: 'hashing', label: 'Hashing', icon: Hash },
    { key: 'graphtraversal', label: 'Graph Traversal', icon: Share2 },
    { key: 'shortestpath', label: 'Shortest Path', icon: Navigation },
    { key: 'mst', label: 'Minimum Spanning Tree', icon: Share2 },
    { key: 'topological', label: 'Topological Sort', icon: Table },
    { key: 'connectivity', label: 'Graph Connectivity', icon: Workflow },
    { key: 'cycledetection', label: 'Cycle Detection', icon: RotateCw },
    { key: 'dp', label: 'Dynamic Programming', icon: Grid },
    { key: 'greedy', label: 'Greedy Algorithms', icon: Coins },
    { key: 'divideandconquer', label: 'Divide & Conquer', icon: Split },
    { key: 'strings', label: 'String Algorithms', icon: FileText },
    { key: 'bitmanipulation', label: 'Bit Manipulation', icon: Cpu },
    { key: 'numbertheory', label: 'Number Theory', icon: Percent },
    { key: 'matrix', label: 'Matrix', icon: Table },
    { key: 'geometry', label: 'Computational Geometry', icon: Shapes },
    { key: 'networkflow', label: 'Network Flow', icon: Activity },
    { key: 'segmenttrees', label: 'Segment & Fenwick Trees', icon: Code },
    { key: 'advancedgraph', label: 'Advanced Graph', icon: Share2 },
    { key: 'randomized', label: 'Randomized', icon: Shuffle },
    { key: 'parallel', label: 'Parallel & Distributed', icon: Cpu },
    { key: 'ml', label: 'Machine Learning', icon: Brain },
  ];

  const filteredAlgos = ALGORITHM_REGISTRY.filter((algo) => {
    const matchesCategory = activeCategory === 'all' || algo.category === activeCategory;
    const matchesSearch =
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (id: string) => {
    selectAlgorithm(id);
    navigate(`/visualize/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col relative overflow-x-hidden transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/5 dark:bg-violet-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/5 dark:bg-emerald-900/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 z-10 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-600 dark:from-violet-400 dark:via-indigo-300 dark:to-emerald-400 select-none">
            AlgoNerve
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/documentation"
            className="text-xs text-zinc-555 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Documentation
          </Link>
          <button className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 font-semibold text-xs py-2 px-4 rounded-xl transition-all duration-300">
            Interactive Console
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-200/50 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 mb-6 shadow-sm">
          <Sparkles size={12} className="text-violet-600 dark:text-violet-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Interactive Playback & State Inspection
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6 leading-tight text-zinc-900 dark:text-white">
          Visualize algorithms in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-600 dark:from-violet-400 dark:via-indigo-300 dark:to-emerald-400">
            Real Time
          </span>
        </h1>

        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mb-12 leading-relaxed">
          Step into recursion stacks, watch DP memory grids compile, debug graph traversals, and animate sorting operations. A high-performance simulation platform.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-5xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                  isSelected
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20 scale-105'
                    : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-white' : 'text-zinc-500 dark:text-zinc-500'} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="w-full max-w-xl mb-12 relative group z-20">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-400 dark:text-zinc-500 group-focus-within:text-violet-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for algorithms..."
            className="w-full pl-11 pr-12 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent text-zinc-900 dark:text-white text-sm shadow-sm transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Algorithm Selection Grid or Empty State */}
        {filteredAlgos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/20 dark:bg-zinc-900/10 backdrop-blur-sm max-w-md w-full mb-16">
            <HelpCircle className="text-zinc-400 dark:text-zinc-600 mb-3 animate-bounce" size={32} />
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm mb-1">No algorithms found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              No results match "{searchQuery}". Try selecting another category or typing another keyword.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col items-center">
            {categories
              .filter((c) => c.key !== 'all')
              .map((cat) => {
                // If filtering by a single category, skip other categories
                if (activeCategory !== 'all' && activeCategory !== cat.key) return null;

                const catAlgos = filteredAlgos.filter((algo) => algo.category === cat.key);
                if (catAlgos.length === 0) return null;

                const CatIcon = cat.icon;

                return (
                  <div key={cat.key} className="w-full mb-12 text-left">
                    {/* Category Header */}
                    <div className="w-full flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-6">
                      <CatIcon size={16} className="text-violet-600 dark:text-violet-400" />
                      <h2 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider font-mono">
                        {cat.label}
                      </h2>
                      <span className="text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full ml-auto">
                        {catAlgos.length} {catAlgos.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {catAlgos.map((algo) => (
                        <div
                          key={algo.id}
                          onClick={() => handleSelect(algo.id)}
                          className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between items-start text-left relative group overflow-hidden h-full min-h-[190px] transition-all"
                        >
                          {/* Card glow effect */}
                          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-3xl pointer-events-none group-hover:bg-violet-600/10 transition-colors" />

                          <div className="w-full flex justify-between items-start mb-4">
                            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {algo.category}
                            </span>
                            
                            {/* Complexity badge */}
                            <div className="flex flex-col items-end font-mono text-[10px] text-zinc-500">
                              <span>Time: <strong className="text-zinc-700 dark:text-zinc-300">{algo.timeComplexity}</strong></span>
                              <span>Space: <strong className="text-zinc-700 dark:text-zinc-300">{algo.spaceComplexity}</strong></span>
                            </div>
                          </div>

                          <h3 className="font-bold text-lg text-zinc-800 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {algo.name}
                          </h3>
                          
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            {algo.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {algo.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/60 text-zinc-500 px-2 py-0.5 rounded font-semibold"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 py-6 text-center text-xs font-mono text-zinc-500 dark:text-zinc-600 z-10 bg-zinc-50 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
        © 2026 AlgoNerve. Created by <a href="https://www.linkedin.com/in/professorauggie/" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">Vaibhav Kushwaha</a>. All Rights Reserved.
        <span className="mx-2">|</span>
        <a href="https://professor-auggie.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">Portfolio</a>
        <span className="mx-2">|</span>
        <a href="https://github.com/ProfessorAuggie" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">GitHub</a>
      </footer>
    </div>
  );
};;
