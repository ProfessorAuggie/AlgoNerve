import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlgorithmStore } from '../store/algorithmStore';
import { ALGORITHM_REGISTRY } from '../algorithms/types';
import { X, Terminal, CornerDownLeft, Trash2 } from 'lucide-react';

export const InteractiveConsole: React.FC = () => {
  const navigate = useNavigate();
  const {
    isConsoleOpen,
    setConsoleOpen,
    consoleLogs,
    addConsoleLog,
    clearConsoleLogs,
    selectedAlgo,
    selectAlgorithm,
    setIsPlaying,
    nextStep,
    prevStep,
    resetPlayback,
    setSpeed,
    setInputArray,
  } = useAlgorithmStore();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, isConsoleOpen]);

  // Focus input on console open
  useEffect(() => {
    if (isConsoleOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isConsoleOpen]);

  // Global key bindings to toggle console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle console with backtick
      if (e.key === '`') {
        const activeEl = document.activeElement;
        const isTyping =
          activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'SELECT' ||
            activeEl.tagName === 'TEXTAREA');

        // Allow backtick toggle if not typing in other inputs, OR if typing inside our own console input
        if (!isTyping || activeEl === inputRef.current) {
          e.preventDefault();
          setConsoleOpen(!isConsoleOpen);
        }
      }

      // Close console with Escape
      if (e.key === 'Escape' && isConsoleOpen) {
        e.preventDefault();
        setConsoleOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConsoleOpen, setConsoleOpen]);

  if (!isConsoleOpen) return null;

  const processCommand = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Add to input logs
    addConsoleLog('input', trimmed);

    // Save to local history
    const nextHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 50);
    setHistory(nextHistory);
    setHistoryIdx(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        addConsoleLog('system', 'Available Commands:');
        addConsoleLog('output', '  help                         - Show this help manual');
        addConsoleLog('output', '  list [category]              - List all algorithms (filter by category)');
        addConsoleLog('output', '  search <query>               - Search algorithms by name or tag');
        addConsoleLog('output', '  visualize <algo-id>          - Select and open algorithm visualizer');
        addConsoleLog('output', '  play                         - Start visualizer auto-playback');
        addConsoleLog('output', '  pause                        - Pause visualizer playback');
        addConsoleLog('output', '  next / step                  - Step forward exactly 1 step');
        addConsoleLog('output', '  prev / back                  - Step backward exactly 1 step');
        addConsoleLog('output', '  reset                        - Reset playback to step 0');
        addConsoleLog('output', '  speed <ms>                   - Set simulation speed delay in milliseconds');
        addConsoleLog('output', '  input <val1,val2,...>        - Update custom array inputs');
        addConsoleLog('output', '  theme <light|dark|toggle>    - View or toggle interface theme');
        addConsoleLog('output', '  clear                        - Clear terminal history output');
        addConsoleLog('output', '  exit / close                 - Close the interactive console drawer');
        break;

      case 'list': {
        const categoryFilter = args[0]?.toLowerCase();
        let listAlgos = ALGORITHM_REGISTRY;
        
        if (categoryFilter) {
          listAlgos = ALGORITHM_REGISTRY.filter(
            a => a.category.toLowerCase().includes(categoryFilter)
          );
        }

        if (listAlgos.length === 0) {
          addConsoleLog('error', `No algorithms found matching category "${categoryFilter}".`);
        } else {
          addConsoleLog('system', `Supported Algorithms (${listAlgos.length} items):`);
          listAlgos.forEach(a => {
            addConsoleLog(
              'output',
              `  • ${a.id.padEnd(25)} | ${a.name.padEnd(30)} [${a.category}]`
            );
          });
        }
        break;
      }

      case 'search': {
        if (args.length === 0) {
          addConsoleLog('error', 'Usage: search <query-text>');
          break;
        }
        const query = args.join(' ').toLowerCase();
        const results = ALGORITHM_REGISTRY.filter(
          a =>
            a.name.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query) ||
            a.tags.some(t => t.toLowerCase().includes(query))
        );

        if (results.length === 0) {
          addConsoleLog('error', `No algorithms found matching "${query}".`);
        } else {
          addConsoleLog('system', `Search results for "${query}" (${results.length} found):`);
          results.forEach(a => {
            addConsoleLog('output', `  • ${a.id} - ${a.name} (${a.category})`);
          });
        }
        break;
      }

      case 'visualize':
      case 'run': {
        if (args.length === 0) {
          addConsoleLog('error', 'Usage: visualize <algo-id> (e.g. visualize binary-search)');
          break;
        }
        const id = args[0];
        const algo = ALGORITHM_REGISTRY.find(a => a.id === id);

        if (!algo) {
          addConsoleLog('error', `Algorithm "${id}" not found. Type "list" to view all IDs.`);
        } else {
          addConsoleLog('system', `Loading ${algo.name} visualizer...`);
          selectAlgorithm(algo.id);
          navigate(`/visualize/${algo.id}`);
          // Close console on small screens or keep open
          // setConsoleOpen(false);
        }
        break;
      }

      case 'play':
        if (!selectedAlgo) {
          addConsoleLog('error', 'No active algorithm visualizer loaded.');
        } else {
          setIsPlaying(true);
          addConsoleLog('system', 'Playback started.');
        }
        break;

      case 'pause':
        if (!selectedAlgo) {
          addConsoleLog('error', 'No active algorithm visualizer loaded.');
        } else {
          setIsPlaying(false);
          addConsoleLog('system', 'Playback paused.');
        }
        break;

      case 'next':
      case 'step':
        if (!selectedAlgo) {
          addConsoleLog('error', 'No active algorithm visualizer loaded.');
        } else {
          nextStep();
          addConsoleLog('system', 'Stepped forward.');
        }
        break;

      case 'prev':
      case 'back':
        if (!selectedAlgo) {
          addConsoleLog('error', 'No active algorithm visualizer loaded.');
        } else {
          prevStep();
          addConsoleLog('system', 'Stepped backward.');
        }
        break;

      case 'reset':
        if (!selectedAlgo) {
          addConsoleLog('error', 'No active algorithm visualizer loaded.');
        } else {
          resetPlayback();
          addConsoleLog('system', 'Playback reset to initial step.');
        }
        break;

      case 'speed': {
        if (args.length === 0) {
          addConsoleLog('error', 'Usage: speed <ms_delay> (e.g. speed 500)');
          break;
        }
        const ms = parseInt(args[0], 10);
        if (isNaN(ms) || ms <= 0) {
          addConsoleLog('error', 'Speed delay must be a positive integer.');
        } else {
          setSpeed(ms);
          addConsoleLog('system', `Playback speed set to ${ms}ms delay.`);
        }
        break;
      }

      case 'input': {
        if (args.length === 0) {
          addConsoleLog('error', 'Usage: input <num1,num2,...> or input [num1,num2,...]');
          break;
        }
        
        let cleaned = args.join('').replace(/[\[\]]/g, '');
        const nums = cleaned
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n));

        if (nums.length === 0) {
          addConsoleLog('error', 'No valid numeric values parsed.');
        } else {
          setInputArray(nums);
          addConsoleLog('system', `Custom array updated: [${nums.join(', ')}]`);
        }
        break;
      }

      case 'theme': {
        const option = args[0]?.toLowerCase();
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

        if (!option) {
          addConsoleLog('system', `Current theme: ${currentTheme}`);
          break;
        }

        let target: 'dark' | 'light';
        if (option === 'toggle') {
          target = currentTheme === 'dark' ? 'light' : 'dark';
        } else if (option === 'dark' || option === 'light') {
          target = option;
        } else {
          addConsoleLog('error', 'Usage: theme <light|dark|toggle>');
          break;
        }

        if (target === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        localStorage.setItem('theme', target);
        window.dispatchEvent(new Event('theme-changed'));

        addConsoleLog('system', `Theme set to ${target}.`);
        break;
      }

      case 'clear':
        clearConsoleLogs();
        break;

      case 'exit':
      case 'close':
      case 'quit':
        setConsoleOpen(false);
        break;

      default:
        addConsoleLog('error', `Unknown command "${command}". Type "help" for a list of available commands.`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] md:w-[600px] bg-zinc-950/95 dark:bg-zinc-950/98 border-l border-zinc-800 text-zinc-300 font-mono text-xs z-50 flex flex-col shadow-2xl transition-transform duration-300 animate-slide-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-violet-400 font-semibold tracking-wide">
          <Terminal size={16} className="animate-pulse" />
          <span>Interactive Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => clearConsoleLogs()}
            className="p-1 rounded text-zinc-550 hover:bg-zinc-800 hover:text-white transition-colors"
            title="Clear logs"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setConsoleOpen(false)}
            className="p-1 rounded text-zinc-550 hover:bg-zinc-800 hover:text-white transition-colors"
            title="Close console"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Output Console Logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin select-text">
        {consoleLogs.map((log, index) => {
          if (log.type === 'input') {
            return (
              <div key={index} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold select-none">algonerve $&gt;</span>
                <span className="text-zinc-100 whitespace-pre-wrap">{log.text}</span>
              </div>
            );
          } else if (log.type === 'system') {
            return (
              <div key={index} className="text-violet-400 font-medium whitespace-pre-wrap mt-2 first:mt-0">
                {log.text}
              </div>
            );
          } else if (log.type === 'error') {
            return (
              <div key={index} className="text-red-400 font-semibold whitespace-pre-wrap">
                Error: {log.text}
              </div>
            );
          } else {
            return (
              <div key={index} className="text-zinc-400 whitespace-pre-wrap leading-relaxed pl-4">
                {log.text}
              </div>
            );
          }
        })}
        <div ref={logsEndRef} />
      </div>

      {/* Input Field Prompt */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
        <span className="text-emerald-500 font-bold select-none">algonerve $&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type commands here... (e.g. "help")'
          className="flex-1 bg-transparent outline-none border-none text-zinc-100 placeholder-zinc-700 caret-emerald-500 w-full"
        />
        <div className="flex items-center gap-1 text-[10px] text-zinc-650 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded select-none">
          <span>Enter</span>
          <CornerDownLeft size={10} />
        </div>
      </div>
    </div>
  );
};
