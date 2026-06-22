import type { Step, TreeNode, TreePayload } from '../algorithms/types';


interface TreeViewProps {
  step: Step;
}

interface RenderNode {
  id: string;
  value: number;
  x: number;
  y: number;
  left?: RenderNode | null;
  right?: RenderNode | null;
  parentId?: string | null;
  balance?: number;
  color?: 'RED' | 'BLACK';
  isAST?: boolean;
  operator?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({ step }) => {
  const payload = step.payload as TreePayload;
  if (!payload) return null;

  const { root, current, comparing, visited = [], result = [], callStack = [] } = payload;

  // Recursively calculate node positions for rendering
  // width: horizontal span of the node's subtree
  const layoutTree = (
    node: TreeNode | null,
    x: number,
    y: number,
    levelHeight: number,
    horizontalGap: number
  ): RenderNode | null => {
    if (!node) return null;

    const renderNode: RenderNode = {
      id: node.id,
      value: node.value,
      x,
      y,
      parentId: node.parent,
      balance: node.balance,
      color: node.color,
      isAST: node.isAST,
      operator: node.operator
    };

    if (node.left) {
      renderNode.left = layoutTree(node.left, x - horizontalGap, y + levelHeight, levelHeight, horizontalGap * 0.5);
    }
    if (node.right) {
      renderNode.right = layoutTree(node.right, x + horizontalGap, y + levelHeight, levelHeight, horizontalGap * 0.5);
    }

    return renderNode;
  };


  // Build list of all flat nodes and edges for easy SVG looping
  const nodesList: RenderNode[] = [];
  const edgesList: { source: RenderNode; target: RenderNode }[] = [];

  const traverseAndFlatten = (node: RenderNode | null) => {
    if (!node) return;
    nodesList.push(node);

    if (node.left) {
      edgesList.push({ source: node, target: node.left });
      traverseAndFlatten(node.left);
    }
    if (node.right) {
      edgesList.push({ source: node, target: node.right });
      traverseAndFlatten(node.right);
    }
  };

  // SVG parameters
  const width = 650;
  const height = 300;
  const rootX = width / 2;
  const rootY = 40;
  const levelHeight = 60;
  const initialGap = 130;

  const renderRoot = layoutTree(root, rootX, rootY, levelHeight, initialGap);
  traverseAndFlatten(renderRoot);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm transition-colors duration-300">
      <div className="relative w-full flex-1 min-h-[350px] flex items-center justify-center overflow-x-auto overflow-y-hidden select-none scrollbar-none">
        {nodesList.length === 0 ? (
          <div className="text-zinc-500 font-medium text-sm">Tree is empty. Add values to build a BST.</div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[550px] max-w-[650px] overflow-visible">
            {/* Draw connections */}
            {edgesList.map((edge, idx) => {
              const isSourceCurrent = current === edge.source.id;
              const isTargetCurrent = current === edge.target.id;
              const isSourceVisited = visited.includes(edge.source.id);
              const isTargetVisited = visited.includes(edge.target.id);
              
              let edgeClass = 'stroke-zinc-300 dark:stroke-zinc-800';
              let strokeWidth = 2;
              let strokeDash = '';

              if (isTargetCurrent && isSourceCurrent) {
                edgeClass = 'stroke-violet-400';
                strokeWidth = 3;
              } else if (isTargetVisited && isSourceVisited) {
                edgeClass = 'stroke-emerald-500';
                strokeWidth = 2;
              } else if (isTargetCurrent || isSourceCurrent) {
                edgeClass = 'stroke-violet-400';
                strokeWidth = 2;
                strokeDash = '3,3';
              }

              return (
                <line
                  key={`tree-edge-${idx}`}
                  x1={edge.source.x}
                  y1={edge.source.y}
                  x2={edge.target.x}
                  y2={edge.target.y}
                  className={`${edgeClass} transition-all duration-300`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                />
              );
            })}

            {/* Draw nodes */}
            {nodesList.map((node) => {
              const isCurrent = current === node.id;
              const isComparing = comparing === node.id;
              const isVisited = visited.includes(node.id);

              let circleClass = 'fill-white dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-700';
              let strokeWidth = 2;
              let filter = '';

              if (node.color === 'RED') {
                circleClass = 'fill-rose-600 stroke-rose-450 dark:stroke-rose-500';
              } else if (node.color === 'BLACK') {
                circleClass = 'fill-zinc-800 stroke-zinc-700 dark:fill-zinc-900 dark:stroke-zinc-800';
              }

              if (isComparing) {
                circleClass = 'fill-amber-500 stroke-amber-300 dark:stroke-amber-400';
                strokeWidth = 3;
                filter = 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))';
              } else if (isCurrent) {
                circleClass = 'fill-violet-500 stroke-violet-300 dark:stroke-violet-400';
                strokeWidth = 3;
                filter = 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))';
              } else if (isVisited) {
                if (node.color) {
                  strokeWidth = 3.5;
                } else {
                  circleClass = 'fill-emerald-500 stroke-emerald-400 dark:stroke-emerald-400';
                }
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300"
                  style={{ filter }}
                >
                  <circle
                    r="20"
                    className={`${circleClass} transition-all duration-300`}
                    strokeWidth={strokeWidth}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-xs font-bold select-none ${
                      isCurrent || isComparing || isVisited || node.color === 'RED' || node.color === 'BLACK'
                        ? 'fill-white font-bold'
                        : 'fill-zinc-800 dark:fill-zinc-200'
                    }`}
                  >
                    {node.isAST && node.operator !== undefined ? node.operator : node.value}
                  </text>
                  
                  {node.balance !== undefined && (
                    <text
                      y="-28"
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-cyan-600 dark:fill-cyan-400 font-mono"
                    >
                      bal={node.balance}
                    </text>
                  )}
                </g>
              );

            })}
          </svg>
        )}
      </div>

      {/* Traversal Output Results & Call Stack */}
      {result.length > 0 && (
        <div className="w-full flex flex-col gap-2 mt-4 px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-mono transition-colors duration-300">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase font-semibold">Output:</span>
            <div className="flex gap-1.5 flex-wrap">
              {result.map((val, idx) => (
                <span key={idx} className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  {val}
                </span>
              ))}
            </div>
          </div>
          {callStack.length > 0 && (
            <div className="flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-800/60 pt-2 mt-1">
              <span className="text-zinc-500 uppercase font-semibold">Recursion Stack:</span>
              <div className="flex gap-1 overflow-x-auto">
                {callStack.map((frame, idx) => (
                  <span key={idx} className="bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/80 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                    {frame}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-medium text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#8b5cf6] border border-violet-400" />
          <span>Current Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#10b981] border border-emerald-400" />
          <span>Traversed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700" />
          <span>Default</span>
        </div>
      </div>
    </div>
  );
};
