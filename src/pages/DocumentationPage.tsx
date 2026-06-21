import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Cpu, Settings, Keyboard, Accessibility, User, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../controls/ThemeToggle';
import { ALGORITHM_REGISTRY } from '../algorithms/types';

export const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'algorithms' | 'controls' | 'shortcuts' | 'accessibility' | 'setup' | 'creator'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'algorithms' as const, label: 'Supported Algorithms', icon: Cpu },
    { id: 'controls' as const, label: 'Playback & Controls', icon: Settings },
    { id: 'shortcuts' as const, label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'accessibility' as const, label: 'Accessibility (A11y)', icon: Accessibility },
    { id: 'setup' as const, label: 'Local Configuration', icon: HelpCircle },
    { id: 'creator' as const, label: 'Developer Credits', icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/5 dark:bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/5 dark:bg-emerald-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-zinc-905 dark:text-white">AlgoNerve</h2>
              <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-950 text-violet-750 dark:text-violet-300 border border-violet-200 dark:border-violet-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Documentation
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Platform Guide & Algorithm Library Reference</span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Split Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 z-10 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <nav className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-900 md:pr-6 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold border transition-all duration-200 whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-550/20 scale-102'
                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-zinc-550 dark:text-zinc-500'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Content Section Panel */}
        <section className="flex-1 bg-white/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-6 md:p-8 rounded-2xl backdrop-blur-sm shadow-md overflow-y-auto max-h-[calc(100vh-170px)] transition-colors duration-300">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Overview & Vision</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Platform Identity: AlgoNerve Visualization Engine</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                <strong>AlgoNerve</strong> is a premier, high-fidelity algorithm visualization environment built for developers, educators, and software engineer candidates. Instead of treating algorithms like abstract formulas, AlgoNerve animates their internal execution logic, memory mutations, stack operations, and path traversals in real-time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-xl bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850">
                  <h3 className="font-bold text-xs uppercase text-violet-600 dark:text-violet-400 mb-2 font-mono">🧠 Live State Inspection</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Watch the variables change, stacks grow, queue indices align, and distance vectors update in real-time.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850">
                  <h3 className="font-bold text-xs uppercase text-emerald-600 dark:text-emerald-400 mb-2 font-mono">⏱️ Playback Control</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Scrub through execution history with step-by-step resolution. Pause, rewind, speed up (up to 4x), or play step-by-step.
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                The visualizer is accessibly optimized, utilizing trace logs, dynamic step narratives, and keyboard bindings to guarantee full accessibility controls on multiple desktop and mobile devices.
              </p>
            </div>
          )}

          {/* 2. SUPPORTED ALGORITHMS */}
          {activeTab === 'algorithms' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Supported Algorithms Registry</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Current Count: 40+ Algorithms & Layout Engines</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              
              <div className="flex flex-col gap-6">
                {(['searching', 'sorting', 'datastructures', 'graph', 'tree', 'dp', 'recursion', 'backtracking'] as const).map((cat) => {
                  const items = ALGORITHM_REGISTRY.filter((x) => x.category === cat);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={cat} className="flex flex-col gap-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-violet-650 dark:text-violet-400 font-mono border-b border-zinc-200 dark:border-zinc-800 pb-1">
                        {cat === 'dp' 
                          ? 'Dynamic Programming' 
                          : cat === 'datastructures' 
                          ? 'Data Structures' 
                          : cat === 'searching' 
                          ? 'Searching' 
                          : cat}
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {items.map((algo) => (
                          <div
                            key={algo.id}
                            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{algo.name}</span>
                              <span className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">{algo.description}</span>
                            </div>
                            <div className="flex items-center gap-3 font-mono text-[10px] shrink-0 text-zinc-550 dark:text-zinc-500">
                              <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded">
                                Time: <strong className="text-zinc-850 dark:text-zinc-300">{algo.timeComplexity}</strong>
                              </span>
                              <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded">
                                Space: <strong className="text-zinc-850 dark:text-zinc-300">{algo.spaceComplexity}</strong>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CONTROLS */}
          {activeTab === 'controls' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Playback & Controls Guide</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Control Dashboard Operations</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              
              <div className="space-y-4 text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                <p>
                  Every algorithm execution compiles into a state sequence list of **Steps**. The control board allows traversing this timeline interactively:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Reset:</strong> Rewinds back to step 0 and pauses playback.</li>
                  <li><strong>Step Backward:</strong> Moves back exactly 1 step (great for observing trace states).</li>
                  <li><strong>Play/Pause:</strong> Toggles auto-playback. The delay between steps is guided by the Speed controller.</li>
                  <li><strong>Step Forward:</strong> Resolves the next step immediately.</li>
                  <li><strong>Speed Controller (0.5x to 4x):</strong> Alters speed delay (from 1500ms down to 150ms per step transition).</li>
                  <li><strong>Timeline Slider:</strong> Scrub directly to any point in execution. Shows current step index out of total steps.</li>
                  <li><strong>Pseudocode Panel:</strong> Highlights the corresponding active pseudocode line for each step.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Keyboard Shortcuts</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Desktop Bindings Reference</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 font-mono text-zinc-500">
                      <th className="py-2.5 pr-4">Shortcut Key</th>
                      <th className="py-2.5">Action Triggered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-150 dark:border-zinc-850/60">
                      <td className="py-3 pr-4 font-mono font-bold"><kbd className="bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-350">Spacebar</kbd></td>
                      <td className="py-3 text-zinc-650 dark:text-zinc-400 font-medium">Toggle playback (Play / Pause)</td>
                    </tr>
                    <tr className="border-b border-zinc-150 dark:border-zinc-850/60">
                      <td className="py-3 pr-4 font-mono font-bold"><kbd className="bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-350">Left Arrow</kbd></td>
                      <td className="py-3 text-zinc-650 dark:text-zinc-400 font-medium">Step backward exactly one step</td>
                    </tr>
                    <tr className="border-b border-zinc-150 dark:border-zinc-850/60">
                      <td className="py-3 pr-4 font-mono font-bold"><kbd className="bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-350">Right Arrow</kbd></td>
                      <td className="py-3 text-zinc-650 dark:text-zinc-400 font-medium">Step forward exactly one step</td>
                    </tr>
                    <tr className="border-b border-zinc-150 dark:border-zinc-850/60">
                      <td className="py-3 pr-4 font-mono font-bold"><kbd className="bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-350">R</kbd></td>
                      <td className="py-3 text-zinc-650 dark:text-zinc-400 font-medium">Reset execution timeline to start</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ACCESSIBILITY */}
          {activeTab === 'accessibility' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Accessibility Features (A11y)</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Accessible Rich Internet Applications Standard</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />

              <div className="space-y-4 text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                <p>
                  AlgoNerve has been designed from the ground up to support accessible usage and screen-reader assistance:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>ARIALive Region (`aria-live="polite"`):</strong> The Narration Panel contains trace statements that read out status updates during visual state transitions (e.g. <em>"Comparing values at index 0 and 1"</em>, <em>"Placed Queen in row 0, column 1"</em>). Screen readers parse these updates immediately.
                  </li>
                  <li>
                    <strong>Focus Boundaries:</strong> Config parameters are optimized to ignore hotkey captures when text boxes are in focus, preventing keys like Space or Arrow keys from shifting layout viewports.
                  </li>
                  <li>
                    <strong>Contrast & Color Schemes:</strong> Dynamic themes utilize HSL variables (Indigo, Violet, Emerald, Amber, Rose) with sufficient contrast targets to maximize legibility.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 6. SETUP */}
          {activeTab === 'setup' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Local Configuration</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Vite + TypeScript Local Environment</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />

              <div className="space-y-4 text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-mono">
                <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850">
                  <p className="text-xs text-zinc-450 uppercase mb-2 font-bold tracking-wider font-sans">Prerequisites</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Node.js (v18+) and npm/yarn installed.</p>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-zinc-455 uppercase font-bold tracking-wider font-sans">1. Clone Repository & Install</p>
                    <pre className="text-xs text-violet-600 dark:text-violet-400 overflow-x-auto whitespace-pre-wrap p-1.5 mt-1 rounded bg-zinc-200/50 dark:bg-zinc-900/60">
                      git clone https://github.com/ProfessorAuggie/AlgoNerve.git{"\n"}
                      cd AlgoNerve{"\n"}
                      npm install
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-455 uppercase font-bold tracking-wider font-sans">2. Run Dev Server</p>
                    <pre className="text-xs text-violet-600 dark:text-violet-400 overflow-x-auto whitespace-pre-wrap p-1.5 mt-1 rounded bg-zinc-200/50 dark:bg-zinc-900/60">
                      npm run dev
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-455 uppercase font-bold tracking-wider font-sans">3. Build production bundle</p>
                    <pre className="text-xs text-violet-600 dark:text-violet-400 overflow-x-auto whitespace-pre-wrap p-1.5 mt-1 rounded bg-zinc-200/50 dark:bg-zinc-900/60">
                      npm run build
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. CREATOR CREDITS */}
          {activeTab === 'creator' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">Developer Credits</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">Creator Biography & LinkedIn Integration</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />

              <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 via-indigo-400 to-emerald-400 flex items-center justify-center font-bold text-white text-3xl shadow-md select-none shrink-0">
                  VK
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">Vaibhav Kushwaha</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-3">Software Engineer | Full-Stack & Systems Developer</p>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed mb-4">
                    Vaibhav is a software engineer passionate about developer tooling, backend microservices, performance tuning, and interactive educational visualizations. He built AlgoNerve to bridge the gap between algorithmic theory and visual state execution tracing.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/professorauggie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-violet-650 hover:bg-violet-600 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all duration-300 shadow-md shadow-violet-950/30"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 py-6 text-center text-xs font-mono text-zinc-550 dark:text-zinc-600 z-10 bg-zinc-50 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
        © 2026 AlgoNerve. Created by <a href="https://www.linkedin.com/in/professorauggie/" target="_blank" rel="noopener noreferrer" className="text-violet-650 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline">Vaibhav Kushwaha</a>. All Rights Reserved.
      </footer>
    </div>
  );
};
