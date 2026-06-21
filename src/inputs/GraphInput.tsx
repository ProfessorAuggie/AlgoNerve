import React from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';

export const GraphInput: React.FC = () => {
  const { graphData, graphStartNode, setGraphStartNode, setGraphData } = useAlgorithmStore();

  const handleStartNodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphStartNode(e.target.value);
  };

  // Premade graphs
  const loadPreset = (presetName: 'default' | 'linear' | 'cycle') => {
    if (presetName === 'default') {
      setGraphData({
        nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }, { id: 'F' }],
        edges: [
          { source: 'A', target: 'B', weight: 4 },
          { source: 'A', target: 'C', weight: 2 },
          { source: 'B', target: 'D', weight: 5 },
          { source: 'C', target: 'D', weight: 8 },
          { source: 'C', target: 'E', weight: 10 },
          { source: 'D', target: 'E', weight: 2 },
          { source: 'D', target: 'F', weight: 6 },
          { source: 'E', target: 'F', weight: 3 },
        ],
        directed: false,
        weighted: true,
      });
      setGraphStartNode('A');
    } else if (presetName === 'linear') {
      setGraphData({
        nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }],
        edges: [
          { source: 'A', target: 'B', weight: 1 },
          { source: 'B', target: 'C', weight: 2 },
          { source: 'C', target: 'D', weight: 3 },
          { source: 'D', target: 'E', weight: 4 },
        ],
        directed: false,
        weighted: true,
      });
      setGraphStartNode('A');
    } else if (presetName === 'cycle') {
      setGraphData({
        nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }],
        edges: [
          { source: 'A', target: 'B', weight: 2 },
          { source: 'B', target: 'C', weight: 3 },
          { source: 'C', target: 'D', weight: 4 },
          { source: 'D', target: 'A', weight: 5 },
        ],
        directed: false,
        weighted: true,
      });
      setGraphStartNode('A');
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl backdrop-blur-sm shadow-md transition-colors duration-300">
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Graph Configuration</h4>
      
      {/* Start Node Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Start Node</label>
        <select
          value={graphStartNode}
          onChange={handleStartNodeChange}
          className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-violet-500 font-semibold transition-colors"
        >
          {graphData.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              Node {node.id}
            </option>
          ))}
        </select>
      </div>

      {/* Preset configurations */}
      <div className="flex flex-col gap-1 border-t border-zinc-200 dark:border-zinc-800 pt-2.5 mt-1">
        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Graph Presets</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => loadPreset('default')}
            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[10px] py-1 px-2 rounded transition-colors"
          >
            Mesh Default
          </button>
          <button
            onClick={() => loadPreset('linear')}
            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[10px] py-1 px-2 rounded transition-colors"
          >
            Linear Chain
          </button>
          <button
            onClick={() => loadPreset('cycle')}
            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[10px] py-1 px-2 rounded transition-colors"
          >
            Closed Ring
          </button>
        </div>
      </div>
    </div>
  );
};
