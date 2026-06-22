import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { BookOpen, Layers, Settings, Award } from 'lucide-react';

import { CONCEPT_DATABASE, CATEGORY_LABELS } from '../algorithms/conceptDatabase';

export const ConceptView: React.FC = () => {
  const { selectedAlgo, currentStepIndex, steps } = useAlgorithmStore();
  if (!selectedAlgo) return null;

  let concept = CONCEPT_DATABASE[selectedAlgo.id];

  if (!concept) {
    const categoryName = CATEGORY_LABELS[selectedAlgo.category] || selectedAlgo.category;
    concept = {
      title: selectedAlgo.name,
      categoryName,
      properties: [
        `Category: ${categoryName}`,
        `Best/Avg Time Complexity: ${selectedAlgo.timeComplexity}`,
        `Auxiliary Space Complexity: ${selectedAlgo.spaceComplexity}`,
        ...(selectedAlgo.tags && selectedAlgo.tags.length > 0 ? [`Keywords: ${selectedAlgo.tags.join(', ')}`] : []),
      ],
      applications: [
        'Solving curriculum exercises, coding interviews, and competitive programming challenges.',
        'Optimizing system execution efficiency in real-world application pipelines.',
        'Learning structural operations of complex data structures and algorithmic designs.',
      ],
      explanation: selectedAlgo.description || 'This algorithm is part of the CS curriculum study guide. Examine the details, complexity thresholds, and properties below.',
      operations: [
        { name: 'Time Complexity', complexity: selectedAlgo.timeComplexity, desc: 'Calculated execution growth pattern relative to input size.' },
        { name: 'Space Complexity', complexity: selectedAlgo.spaceComplexity, desc: 'Auxiliary memory overhead utilized during runtime execution.' },
      ],
    };
  }

  const currentStep = steps[currentStepIndex];
  const activeStage = currentStep?.payload?.stage || 'all';

  const isIntroActive = activeStage === 'intro' || activeStage === 'all' || activeStage === 'summary';
  const isPropertiesActive = activeStage === 'properties' || activeStage === 'all' || activeStage === 'summary';
  const isComplexityActive = activeStage === 'complexity' || activeStage === 'all' || activeStage === 'summary';
  const isApplicationsActive = activeStage === 'applications' || activeStage === 'all' || activeStage === 'summary';

  const introClass = isIntroActive
    ? 'border-violet-500/60 dark:border-violet-500/60 bg-violet-500/5 ring-1 ring-violet-500/10 shadow-[0_0_12px_rgba(139,92,246,0.1)] scale-[1.005]'
    : 'opacity-30 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20';

  const propertiesClass = isPropertiesActive
    ? 'border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.1)] p-4 rounded-xl border'
    : 'opacity-30 p-4 rounded-xl border border-transparent';

  const applicationsClass = isApplicationsActive
    ? 'border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.1)] p-4 rounded-xl border'
    : 'opacity-30 p-4 rounded-xl border border-transparent';

  const complexityClass = isComplexityActive
    ? 'border-violet-500/40 bg-violet-500/5 ring-1 ring-violet-500/10 shadow-[0_0_12px_rgba(139,92,246,0.1)] p-4 rounded-xl border'
    : 'opacity-30 p-4 rounded-xl border border-transparent';

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-280px)] transition-colors duration-300 scrollbar-thin">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
        <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
          {concept.categoryName}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {concept.title}
        </h2>
      </div>

      {/* Core Explanation */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 mb-6 ${introClass}`}>
        <BookOpen size={16} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <strong>How it works:</strong> {concept.explanation}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Key Properties */}
        <div className={`transition-all duration-300 ${propertiesClass}`}>
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Layers size={13} className="text-indigo-600 dark:text-indigo-400" />
            Key Properties
          </h3>
          <ul className="flex flex-col gap-2 pl-1.5">
            {concept.properties.map((prop, idx) => (
              <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed list-none flex items-start gap-2">
                <span className="text-indigo-500 font-bold shrink-0">•</span>
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real-world Applications */}
        <div className={`transition-all duration-300 ${applicationsClass}`}>
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Award size={13} className="text-emerald-650 dark:text-emerald-400" />
            Applications
          </h3>
          <ul className="flex flex-col gap-2 pl-1.5">
            {concept.applications.map((app, idx) => (
              <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed list-none flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Primary Operations & Complexity Table */}
      {concept.operations && concept.operations.length > 0 && (
        <div className={`transition-all duration-300 ${complexityClass}`}>
          <h3 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
            <Settings size={13} className="text-violet-600 dark:text-violet-400" />
            Core Operations & Complexities
          </h3>
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100/50 dark:bg-zinc-950/40">
                  <th className="px-4 py-2">Operation</th>
                  <th className="px-4 py-2 text-center">Complexity</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {concept.operations.map((op, idx) => (
                  <tr key={idx} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/20 dark:hover:bg-zinc-950/10">
                    <td className="px-4 py-2.5 font-bold font-mono text-zinc-800 dark:text-zinc-200">{op.name}</td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-violet-600 dark:text-violet-400">{op.complexity}</td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400 leading-normal">{op.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Footer hint */}
      <div className="mt-auto pt-6 text-[10px] font-mono text-zinc-400 text-center">
        Interactive animation in development • Inspect code and metrics on the right.
      </div>
    </div>
  );
};
