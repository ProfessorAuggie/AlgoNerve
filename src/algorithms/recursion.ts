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

// ─── Fibonacci (Recursive) ──────────────────────────────────────────────────
export function generateFibonacciRecursiveSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const callStack: StackFrame[] = [];

  steps.push(createRecursionStep(
    stepId++,
    'init',
    `Start computing Fibonacci(${n}) recursively.`,
    1,
    callStack
  ));

  function fib(val: number): number {
    const frameId = `fib-${stepId}-${val}`;
    const frame: StackFrame = {
      id: frameId,
      funcName: 'fibonacci',
      args: { n: val },
    };

    callStack.push(frame);
    steps.push(createRecursionStep(
      stepId++,
      'call',
      `Call fibonacci(${val}). Push new stack frame.`,
      2,
      callStack,
      frameId
    ));

    if (val <= 1) {
      frame.returnValue = val;
      frame.isReturning = true;
      steps.push(createRecursionStep(
        stepId++,
        'base-case',
        `Base case hit: n = ${val} <= 1. Return ${val}.`,
        3,
        callStack,
        frameId
      ));
      callStack.pop();
      return val;
    }

    steps.push(createRecursionStep(
      stepId++,
      'recurse-left',
      `n = ${val} > 1. Compute left sub-tree: fibonacci(${val - 1}).`,
      5,
      callStack,
      frameId
    ));

    const left = fib(val - 1);

    // Re-sync parent frame in stack view after left branch returned
    const pIdx = callStack.findIndex(f => f.id === frameId);
    if (pIdx !== -1) {
      callStack[pIdx].args = { n: val, leftResult: left };
    }

    steps.push(createRecursionStep(
      stepId++,
      'recurse-right',
      `Left branch fibonacci(${val - 1}) resolved to ${left}. Compute right sub-tree: fibonacci(${val - 2}).`,
      5,
      callStack,
      frameId
    ));

    const right = fib(val - 2);

    const ans = left + right;
    
    // Re-sync parent frame returning state
    const pIdx2 = callStack.findIndex(f => f.id === frameId);
    if (pIdx2 !== -1) {
      callStack[pIdx2].returnValue = ans;
      callStack[pIdx2].isReturning = true;
    }

    steps.push(createRecursionStep(
      stepId++,
      'add',
      `Sum results: fibonacci(${val - 1}) + fibonacci(${val - 2}) = ${left} + ${right} = ${ans}. Return ${ans}.`,
      6,
      callStack,
      frameId
    ));

    callStack.pop();
    return ans;
  }

  const finalResult = fib(n);
  steps.push(createRecursionStep(
    stepId++,
    'done',
    `Fibonacci(${n}) calculation complete! Result is ${finalResult}.`,
    8,
    callStack,
    undefined,
    finalResult
  ));

  return steps;
}

// ─── Sum of N Numbers ───────────────────────────────────────────────────────
export function generateSumOfNRecursiveSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const callStack: StackFrame[] = [];

  steps.push(createRecursionStep(
    stepId++,
    'init',
    `Start computing Sum of first ${n} natural numbers recursively.`,
    1,
    callStack
  ));

  function sumOfN(val: number): number {
    const frameId = `sum-${stepId}-${val}`;
    const frame: StackFrame = {
      id: frameId,
      funcName: 'sumOfN',
      args: { n: val },
    };

    callStack.push(frame);
    steps.push(createRecursionStep(
      stepId++,
      'call',
      `Call sumOfN(${val}). Push new stack frame.`,
      2,
      callStack,
      frameId
    ));

    if (val <= 0) {
      frame.returnValue = 0;
      frame.isReturning = true;
      steps.push(createRecursionStep(
        stepId++,
        'base-case',
        `Base case hit: n = 0. Return 0.`,
        3,
        callStack,
        frameId
      ));
      callStack.pop();
      return 0;
    }

    steps.push(createRecursionStep(
      stepId++,
      'recurse',
      `n = ${val} > 0. Compute sumOfN(${val - 1}) first.`,
      5,
      callStack,
      frameId
    ));

    const subSum = sumOfN(val - 1);

    const ans = val + subSum;
    const pIdx = callStack.findIndex(f => f.id === frameId);
    if (pIdx !== -1) {
      callStack[pIdx].returnValue = ans;
      callStack[pIdx].isReturning = true;
    }

    steps.push(createRecursionStep(
      stepId++,
      'add',
      `Resolve call: sumOfN(${val}) = ${val} + sumOfN(${val - 1}) = ${val} + ${subSum} = ${ans}. Return ${ans}.`,
      6,
      callStack,
      frameId
    ));

    callStack.pop();
    return ans;
  }

  const finalResult = sumOfN(n);
  steps.push(createRecursionStep(
    stepId++,
    'done',
    `Sum of N complete! Sum of first ${n} numbers is ${finalResult}.`,
    8,
    callStack,
    undefined,
    finalResult
  ));

  return steps;
}

// ─── Power Function (x^n) ───────────────────────────────────────────────────
export function generatePowerFunctionRecursiveSteps(n: number): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const callStack: StackFrame[] = [];
  const x = 2; // base is 2

  steps.push(createRecursionStep(
    stepId++,
    'init',
    `Start computing power(${x}, ${n}) recursively using divide-and-conquer.`,
    1,
    callStack
  ));

  function power(base: number, exp: number): number {
    const frameId = `power-${stepId}-${base}-${exp}`;
    const frame: StackFrame = {
      id: frameId,
      funcName: 'power',
      args: { x: base, n: exp },
    };

    callStack.push(frame);
    steps.push(createRecursionStep(
      stepId++,
      'call',
      `Call power(${base}, ${exp}). Push new stack frame.`,
      2,
      callStack,
      frameId
    ));

    if (exp === 0) {
      frame.returnValue = 1;
      frame.isReturning = true;
      steps.push(createRecursionStep(
        stepId++,
        'base-case',
        `Base case hit: exponent n = 0. Return 1.`,
        3,
        callStack,
        frameId
      ));
      callStack.pop();
      return 1;
    }

    const halfExp = Math.floor(exp / 2);
    steps.push(createRecursionStep(
      stepId++,
      'recurse',
      `Divide: Compute power(${base}, ${halfExp}) (half of exponent ${exp}).`,
      5,
      callStack,
      frameId
    ));

    const halfPower = power(base, halfExp);

    const isEven = exp % 2 === 0;
    const ans = isEven ? halfPower * halfPower : base * halfPower * halfPower;

    const pIdx = callStack.findIndex(f => f.id === frameId);
    if (pIdx !== -1) {
      callStack[pIdx].returnValue = ans;
      callStack[pIdx].isReturning = true;
    }

    steps.push(createRecursionStep(
      stepId++,
      'multiply',
      isEven
        ? `Exponent ${exp} is even: power(${base}, ${halfExp})² = ${halfPower} * ${halfPower} = ${ans}. Return ${ans}.`
        : `Exponent ${exp} is odd: ${base} * power(${base}, ${halfExp})² = ${base} * ${halfPower} * ${halfPower} = ${ans}. Return ${ans}.`,
      6,
      callStack,
      frameId
    ));

    callStack.pop();
    return ans;
  }

  const finalResult = power(x, n);
  steps.push(createRecursionStep(
    stepId++,
    'done',
    `Power function complete! ${x}^${n} is ${finalResult}.`,
    8,
    callStack,
    undefined,
    finalResult
  ));

  return steps;
}
