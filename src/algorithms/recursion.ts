import type { Step, StackFrame, RecursionPayload } from './types';


function createRecursionStep(
  id: number,
  action: string,
  description: string,
  codeLine: number,
  callStack: StackFrame[],
  currentFrameId?: string,
  result?: unknown,
  pegs?: { A: number[]; B: number[]; C: number[] }
): Step {
  return {
    id,
    action,
    description,
    codeLine,
    payload: {
      callStack: callStack.map(f => ({ ...f })),
      currentFrameId,
      result,
      pegs: pegs ? { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] } : undefined,
    } as RecursionPayload,
  };
}

// ─── Factorial (Recursion) ──────────────────────────────────────────────────
export function generateFactorialSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const callStack: StackFrame[] = [];

  steps.push(createRecursionStep(stepId++, 'init', `Start computing ${n}! recursively.`, 1, callStack));

  function factorial(val: number): number {
    const frameId = `frame-${stepId}-${val}`;
    const frame: StackFrame = {
      id: frameId,
      funcName: 'factorial',
      args: { n: val },
    };

    callStack.push(frame);
    steps.push(createRecursionStep(
      stepId++,
      'call',
      `Call factorial(${val}). Push new stack frame to execution context.`,
      2,
      callStack,
      frameId
    ));

    // Base case
    if (val <= 1) {
      frame.returnValue = 1;
      frame.isReturning = true;
      steps.push(createRecursionStep(
        stepId++,
        'base-case',
        `Base case hit: n = ${val} <= 1. Return 1.`,
        3,
        callStack,
        frameId
      ));
      callStack.pop();
      return 1;
    }

    // Recursive call
    steps.push(createRecursionStep(
      stepId++,
      'recurse',
      `n = ${val} > 1. Compute factorial(${val - 1}) before computing ${val} * factorial(${val - 1}).`,
      5,
      callStack,
      frameId
    ));

    const subResult = factorial(val - 1);

    // Re-push a returning indicator of this frame since we popped children
    // Wait, to keep stack visual intact, we rebuild stack view state of parent returning
    const parentFrameIndex = callStack.findIndex(f => f.id === frameId);
    if (parentFrameIndex !== -1) {
      callStack[parentFrameIndex].returnValue = val * subResult;
      callStack[parentFrameIndex].isReturning = true;
    }

    const answer = val * subResult;
    steps.push(createRecursionStep(
      stepId++,
      'multiply',
      `Resolve call: factorial(${val}) = ${val} * factorial(${val - 1}) = ${val} * ${subResult} = ${answer}. Return ${answer}.`,
      6,
      callStack,
      frameId
    ));

    callStack.pop();
    return answer;
  }

  const finalAns = factorial(n);
  steps.push(createRecursionStep(stepId++, 'done', `Finished! Result of ${n}! is ${finalAns}.`, 8, callStack, undefined, finalAns));
  return steps;
}

// ─── Tower of Hanoi ──────────────────────────────────────────────────────────
export function generateHanoiSteps(numDisks: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const callStack: StackFrame[] = [];

  // Initialize pegs
  const pegs = {
    A: Array.from({ length: numDisks }, (_, i) => numDisks - i), // [3, 2, 1] for 3 disks
    B: [] as number[],
    C: [] as number[],
  };

  steps.push(createRecursionStep(
    stepId++,
    'init',
    `Set up Hanoi puzzle with ${numDisks} disks on Peg A. Target: Move all disks to Peg C.`,
    1,
    callStack,
    undefined,
    undefined,
    pegs
  ));

  function moveDisks(n: number, fromPeg: 'A' | 'B' | 'C', toPeg: 'A' | 'B' | 'C', auxPeg: 'A' | 'B' | 'C') {
    const frameId = `hanoi-${stepId}-${n}-${fromPeg}-${toPeg}`;
    const frame: StackFrame = {
      id: frameId,
      funcName: 'moveDisks',
      args: { n, from: fromPeg, to: toPeg, aux: auxPeg },
    };

    callStack.push(frame);
    steps.push(createRecursionStep(
      stepId++,
      'call',
      `Call moveDisks(n=${n}, from=${fromPeg}, to=${toPeg}, aux=${auxPeg}).`,
      2,
      callStack,
      frameId,
      undefined,
      pegs
    ));

    if (n === 1) {
      // Move 1 disk directly
      const disk = pegs[fromPeg].pop()!;
      pegs[toPeg].push(disk);
      
      frame.returnValue = `disk ${disk} moved`;
      frame.isReturning = true;

      steps.push(createRecursionStep(
        stepId++,
        'move-disk',
        `Base case n=1: Move disk ${disk} directly from ${fromPeg} to ${toPeg}.`,
        3,
        callStack,
        frameId,
        undefined,
        pegs
      ));
      
      callStack.pop();
      return;
    }

    // Step 1: Move n-1 disks from source to aux
    steps.push(createRecursionStep(
      stepId++,
      'recurse-1',
      `Move top ${n - 1} disks from ${fromPeg} to auxiliary ${auxPeg}.`,
      5,
      callStack,
      frameId,
      undefined,
      pegs
    ));
    moveDisks(n - 1, fromPeg, auxPeg, toPeg);

    // Step 2: Move the single remaining largest disk from source to destination
    const disk = pegs[fromPeg].pop()!;
    pegs[toPeg].push(disk);
    steps.push(createRecursionStep(
      stepId++,
      'move-largest',
      `Move largest remaining disk ${disk} from ${fromPeg} to ${toPeg}.`,
      6,
      callStack,
      frameId,
      undefined,
      pegs
    ));

    // Step 3: Move the n-1 disks from aux to destination
    steps.push(createRecursionStep(
      stepId++,
      'recurse-2',
      `Move the ${n - 1} disks from auxiliary ${auxPeg} to final destination ${toPeg}.`,
      7,
      callStack,
      frameId,
      undefined,
      pegs
    ));
    moveDisks(n - 1, auxPeg, toPeg, fromPeg);

    const parentFrameIndex = callStack.findIndex(f => f.id === frameId);
    if (parentFrameIndex !== -1) {
      callStack[parentFrameIndex].isReturning = true;
    }
    steps.push(createRecursionStep(
      stepId++,
      'return',
      `Completed sub-problem for n=${n}. Backtrack.`,
      8,
      callStack,
      frameId,
      undefined,
      pegs
    ));
    callStack.pop();
  }

  moveDisks(numDisks, 'A', 'C', 'B');

  steps.push(createRecursionStep(
    stepId++,
    'done',
    'Tower of Hanoi puzzle solved successfully!',
    9,
    callStack,
    undefined,
    undefined,
    pegs
  ));

  return steps;
}
