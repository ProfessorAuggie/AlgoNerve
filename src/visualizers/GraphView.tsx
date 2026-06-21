import type { Step, GraphPayload } from '../algorithms/types';


interface GraphViewProps {
  step: Step;
}

// Clean static positioning for standard nodes to make traversal perfectly readable without physics jitter.
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 100, y: 150 },
  B: { x: 250, y: 80 },
  C: { x: 250, y: 220 },
  D: { x: 400, y: 80 },
  E: { x: 400, y: 220 },
  F: { x: 550, y: 150 },
};

export const GraphView: React.FC<GraphViewProps> = ({ step }) => {
  const payload = step.payload as GraphPayload;
  if (!payload || !payload.graph) return null;

  const { graph, visited = [], queue = [], stack = [], current, distances = {}, previous = {} } = payload;
  const { nodes, edges } = graph;

  // Fallback position calculation for arbitrary new custom nodes
  const getPosition = (id: string, index: number, total: number) => {
    if (NODE_POSITIONS[id]) return NODE_POSITIONS[id];
    
    // Position dynamically in a circle if no predefined coordinate
    const angle = (index / total) * 2 * Math.PI;
    const radius = 120;
    const centerX = 300;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 backdrop-blur-sm">
      <div className="relative w-full flex-1 min-h-[350px] flex items-center justify-center">
        <svg viewBox="0 0 650 300" className="w-full h-full max-w-[650px] overflow-visible">
          {/* Arrow markers for directed graphs */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#52525b" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
          </defs>

          {/* Render Connections (Edges) */}
          {edges.map((edge, idx) => {
            const fromPos = NODE_POSITIONS[edge.source] || getPosition(edge.source, 0, nodes.length);
            const toPos = NODE_POSITIONS[edge.target] || getPosition(edge.target, 0, nodes.length);
            
            const isSourceCurrent = current === edge.source;
            const isTargetCurrent = current === edge.target;
            const isTraversed = visited.includes(edge.source) && visited.includes(edge.target);
            const isPath = previous[edge.target] === edge.source || previous[edge.source] === edge.target;

            let strokeColor = '#3f3f46'; // zinc-700
            let strokeWidth = 2;
            let strokeDash = '';

            if (isPath) {
              strokeColor = '#10b981'; // emerald-500
              strokeWidth = 3;
            } else if (isSourceCurrent || isTargetCurrent) {
              strokeColor = '#a78bfa'; // violet-400
              strokeWidth = 2.5;
              strokeDash = '4,4';
            } else if (isTraversed) {
              strokeColor = '#4f46e5'; // indigo-600
              strokeWidth = 2;
            }

            // Edge coordinates
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={`edge-${idx}`} className="transition-all duration-300">
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={graph.directed ? `url(#${isPath || isSourceCurrent ? 'arrow-active' : 'arrow'})` : undefined}
                  className="transition-all duration-300"
                />
                
                {/* Weight Labels */}
                {edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-12"
                      y="-10"
                      width="24"
                      height="16"
                      rx="3"
                      fill="#18181b"
                      stroke="#27272a"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-mono font-semibold fill-zinc-400"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node, idx) => {
            const pos = getPosition(node.id, idx, nodes.length);
            
            const isCurrent = current === node.id;
            const isVisited = visited.includes(node.id);
            const inQueue = queue.includes(node.id);
            const inStack = stack.includes(node.id);

            let fill = '#18181b'; // zinc-900
            let stroke = '#3f3f46'; // zinc-700
            let strokeWidth = 2;
            let filter = '';

            if (isCurrent) {
              fill = '#8b5cf6'; // brand violet
              stroke = '#c4b5fd';
              strokeWidth = 3;
              filter = 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))';
            } else if (inQueue) {
              fill = '#f59e0b'; // amber-500
              stroke = '#fcd34d';
            } else if (inStack) {
              fill = '#ec4899'; // pink-500
              stroke = '#fbcfe8';
            } else if (isVisited) {
              fill = '#10b981'; // emerald-500
              stroke = '#6ee7b7';
            }

            const dist = distances[node.id];
            const distText = dist === Infinity ? '∞' : dist !== undefined ? dist.toString() : '';

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer group transition-all duration-300"
                style={{ filter }}
              >
                {/* Outer Glow Circle */}
                <circle
                  r="24"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-300"
                />

                {/* Node Identifier */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-white select-none"
                >
                  {node.id}
                </text>

                {/* Distance badges for Dijkstra */}
                {distText !== '' && (
                  <g transform="translate(0, -32)">
                    <rect
                      x="-18"
                      y="-8"
                      width="36"
                      height="15"
                      rx="3"
                      fill="#27272a"
                      stroke="#3f3f46"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-mono fill-zinc-300 font-bold"
                    >
                      d={distText}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal State Stack/Queue Panel */}
      {(queue.length > 0 || stack.length > 0) && (
        <div className="w-full flex items-center justify-start gap-4 px-4 py-2 bg-zinc-900/60 rounded-lg border border-zinc-800 font-mono text-xs">
          <span className="text-zinc-500 uppercase font-semibold">
            {queue.length > 0 ? 'Queue' : 'Stack'}:
          </span>
          <div className="flex gap-2 items-center overflow-x-auto py-1">
            {(queue.length > 0 ? queue : stack).map((item, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded text-white font-bold ${
                  queue.length > 0 ? 'bg-amber-500/80 border border-amber-400' : 'bg-pink-500/80 border border-pink-400'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-800/60 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-[#8b5cf6] border border-violet-400" />
          <span className="text-zinc-300">Active Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-[#10b981] border border-emerald-400" />
          <span className="text-zinc-300">Visited</span>
        </div>
        {queue.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3.0 h-3.0 rounded bg-amber-500 border border-amber-300" />
            <span className="text-zinc-300">Queued</span>
          </div>
        )}
        {stack.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3.0 h-3.0 rounded bg-pink-500 border border-pink-300" />
            <span className="text-zinc-300">On Stack</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-3.0 h-3.0 rounded bg-zinc-900 border border-zinc-700" />
          <span className="text-zinc-300">Unvisited</span>
        </div>
      </div>
    </div>
  );
};
