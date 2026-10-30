import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Repeat,
  Sliders,
  Layers,
  StopCircle,
  SkipForward,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CodePanel } from './CodePanel';
import { ConsolePanel } from './ConsolePanel';

interface LoopsLabProps {
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

type LoopType = 'for' | 'while' | 'do-while';
type MainViewSection = 'visualizer' | 'comparison' | 'break-continue';

interface DryRunRow {
  round: number;
  iValue: number;
  conditionStr: string;
  conditionResult: boolean;
  outputStr: string;
  phase: string;
}

export const LoopsLab: React.FC<LoopsLabProps> = ({
  onMarkComplete,
  isCompleted = false,
}) => {
  const [activeSection, setActiveSection] = useState<MainViewSection>('visualizer');

  // ==========================================
  // SECTION 1: LOOP VISUALIZER (for, while, do-while)
  // ==========================================
  const [loopType, setLoopType] = useState<LoopType>('for');
  const [startVal, setStartVal] = useState<number>(1);
  const [condOp, setCondOp] = useState<'<' | '<=' | '>' | '>='>('<=');
  const [condTarget, setCondTarget] = useState<number>(5);
  const [updateOp, setUpdateOp] = useState<'i++' | 'i--' | 'i += 2' | 'i -= 2'>('i++');
  const [speedMs, setSpeedMs] = useState<number>(800); // 300 to 1500

  // Stepping simulation state
  type StepPhase = 'init' | 'check' | 'body' | 'update' | 'done' | 'infinite_halt';

  interface MicroStep {
    phase: StepPhase;
    iValue: number;
    roundNumber: number;
    line: number;
    annotation: string;
    conditionResult?: boolean;
    conditionStr?: string;
    outputLine?: string;
    isLoopTerminated?: boolean;
  }

  // Pre-generate execution trace up to 50 iterations with infinite-loop detection
  const executionPlan = useMemo(() => {
    const steps: MicroStep[] = [];
    let currentI = startVal;
    let round = 1;
    const maxRounds = 50;
    let isTerminated = false;

    const evalCond = (val: number): boolean => {
      switch (condOp) {
        case '<':
          return val < condTarget;
        case '<=':
          return val <= condTarget;
        case '>':
          return val > condTarget;
        case '>=':
          return val >= condTarget;
      }
    };

    const applyUpdate = (val: number): number => {
      switch (updateOp) {
        case 'i++':
          return val + 1;
        case 'i--':
          return val - 1;
        case 'i += 2':
          return val + 2;
        case 'i -= 2':
          return val - 2;
      }
    };

    if (loopType === 'for') {
      // Line mapping:
      // Line 4: for (int i = start; i cond target; update)
      // Line 5:     printf("%d ", i);
      // Line 7: printf("\n"); return 0;
      steps.push({
        phase: 'init',
        iValue: currentI,
        roundNumber: 0,
        line: 4,
        annotation: `Initialisation: int i = ${currentI} (runs ONCE at start)`,
      });

      while (round <= maxRounds) {
        const condPassed = evalCond(currentI);
        const conditionStr = `${currentI} ${condOp} ${condTarget}`;

        steps.push({
          phase: 'check',
          iValue: currentI,
          roundNumber: round,
          line: 4,
          conditionResult: condPassed,
          conditionStr,
          annotation: condPassed
            ? `Condition check: ${conditionStr} is TRUE (1) ➔ Enter loop`
            : `Condition check: ${conditionStr} is FALSE (0) ➔ Exit loop`,
        });

        if (!condPassed) {
          isTerminated = true;
          break;
        }

        // Body execution
        steps.push({
          phase: 'body',
          iValue: currentI,
          roundNumber: round,
          line: 5,
          outputLine: `${currentI} `,
          annotation: `Body: executes printf("%d ", ${currentI})`,
        });

        // Update
        const nextI = applyUpdate(currentI);
        steps.push({
          phase: 'update',
          iValue: nextI,
          roundNumber: round,
          line: 4,
          annotation: `Update: ${updateOp} ➔ i changes from ${currentI} to ${nextI}`,
        });

        currentI = nextI;
        round++;
      }

      if (isTerminated) {
        steps.push({
          phase: 'done',
          iValue: currentI,
          roundNumber: round,
          line: 7,
          annotation: 'Loop completed! Reached statements after the loop.',
          isLoopTerminated: true,
        });
      } else {
        steps.push({
          phase: 'infinite_halt',
          iValue: currentI,
          roundNumber: maxRounds,
          line: 4,
          annotation: '⚠️ Infinite loop protection triggered! Reached 50 rounds without stopping.',
          isLoopTerminated: false,
        });
      }
    } else if (loopType === 'while') {
      // Line mapping:
      // Line 4: int i = start;
      // Line 6: while (i cond target) {
      // Line 7:     printf("%d ", i);
      // Line 8:     update;
      // Line 9: }
      // Line 11: printf("\n");
      steps.push({
        phase: 'init',
        iValue: currentI,
        roundNumber: 0,
        line: 4,
        annotation: `Initialisation: int i = ${currentI};`,
      });

      while (round <= maxRounds) {
        const condPassed = evalCond(currentI);
        const conditionStr = `${currentI} ${condOp} ${condTarget}`;

        steps.push({
          phase: 'check',
          iValue: currentI,
          roundNumber: round,
          line: 6,
          conditionResult: condPassed,
          conditionStr,
          annotation: condPassed
            ? `Entry check: while (${conditionStr}) is TRUE ➔ Enter body`
            : `Entry check: while (${conditionStr}) is FALSE ➔ Exit loop`,
        });

        if (!condPassed) {
          isTerminated = true;
          break;
        }

        steps.push({
          phase: 'body',
          iValue: currentI,
          roundNumber: round,
          line: 7,
          outputLine: `${currentI} `,
          annotation: `Body: printf("%d ", ${currentI});`,
        });

        const nextI = applyUpdate(currentI);
        steps.push({
          phase: 'update',
          iValue: nextI,
          roundNumber: round,
          line: 8,
          annotation: `Update: ${updateOp}; ➔ i is now ${nextI}`,
        });

        currentI = nextI;
        round++;
      }

      if (isTerminated) {
        steps.push({
          phase: 'done',
          iValue: currentI,
          roundNumber: round,
          line: 11,
          annotation: 'Loop completed! Continued after while closing brace.',
          isLoopTerminated: true,
        });
      } else {
        steps.push({
          phase: 'infinite_halt',
          iValue: currentI,
          roundNumber: maxRounds,
          line: 6,
          annotation: '⚠️ Infinite loop protection triggered after 50 rounds.',
          isLoopTerminated: false,
        });
      }
    } else {
      // do-while:
      // Line 4: int i = start;
      // Line 6: do {
      // Line 7:     printf("%d ", i);
      // Line 8:     update;
      // Line 9: } while (i cond target);
      // Line 11: printf("\n");
      steps.push({
        phase: 'init',
        iValue: currentI,
        roundNumber: 0,
        line: 4,
        annotation: `Initialisation: int i = ${currentI};`,
      });

      while (round <= maxRounds) {
        steps.push({
          phase: 'body',
          iValue: currentI,
          roundNumber: round,
          line: 7,
          outputLine: `${currentI} `,
          annotation: `Body (runs BEFORE check!): printf("%d ", ${currentI});`,
        });

        const nextI = applyUpdate(currentI);
        steps.push({
          phase: 'update',
          iValue: nextI,
          roundNumber: round,
          line: 8,
          annotation: `Update: ${updateOp}; ➔ i is now ${nextI}`,
        });

        // In do-while, condition checks the updated variable
        const condPassed = evalCond(nextI);
        const conditionStr = `${nextI} ${condOp} ${condTarget}`;

        steps.push({
          phase: 'check',
          iValue: nextI,
          roundNumber: round,
          line: 9,
          conditionResult: condPassed,
          conditionStr,
          annotation: condPassed
            ? `Exit check: while (${conditionStr}) is TRUE ➔ Repeat loop`
            : `Exit check: while (${conditionStr}) is FALSE ➔ Exit do-while`,
        });

        currentI = nextI;

        if (!condPassed) {
          isTerminated = true;
          break;
        }

        round++;
      }

      if (isTerminated) {
        steps.push({
          phase: 'done',
          iValue: currentI,
          roundNumber: round,
          line: 11,
          annotation: 'do-while completed! Reached next statement.',
          isLoopTerminated: true,
        });
      } else {
        steps.push({
          phase: 'infinite_halt',
          iValue: currentI,
          roundNumber: maxRounds,
          line: 9,
          annotation: '⚠️ Infinite loop protection triggered after 50 rounds.',
          isLoopTerminated: false,
        });
      }
    }

    return steps;
  }, [loopType, startVal, condOp, condTarget, updateOp]);

  // Current playback index
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Reset steps when parameters or loop type change
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [loopType, startVal, condOp, condTarget, updateOp]);

  // Auto-play interval
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= executionPlan.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, executionPlan.length, speedMs]);

  const currentStep = executionPlan[Math.min(stepIndex, executionPlan.length - 1)];

  // Live C Code representation for visualizer
  const visualizerCode = useMemo(() => {
    if (loopType === 'for') {
      return `#include <stdio.h>

int main() {
    for (int i = ${startVal}; i ${condOp} ${condTarget}; ${updateOp}) {
        printf("%d ", i);
    }

    printf("\\nLoop finished!\\n");
    return 0;
}`;
    } else if (loopType === 'while') {
      return `#include <stdio.h>

int main() {
    int i = ${startVal};

    while (i ${condOp} ${condTarget}) {
        printf("%d ", i);
        ${updateOp};
    }

    printf("\\nLoop finished!\\n");
    return 0;
}`;
    } else {
      return `#include <stdio.h>

int main() {
    int i = ${startVal};

    do {
        printf("%d ", i);
        ${updateOp};
    } while (i ${condOp} ${condTarget});

    printf("\\nLoop finished!\\n");
    return 0;
}`;
    }
  }, [loopType, startVal, condOp, condTarget, updateOp]);

  // Accumulated console output up to current step
  const accumulatedConsole = useMemo(() => {
    let out = '';
    for (let s = 0; s <= stepIndex && s < executionPlan.length; s++) {
      if (executionPlan[s].outputLine) {
        out += executionPlan[s].outputLine;
      }
    }
    const lines = out ? [out.trim()] : [];
    if (currentStep?.phase === 'done') {
      lines.push('Loop finished!');
    }
    return lines;
  }, [stepIndex, executionPlan, currentStep]);

  // Dry Run Table rows accumulated up to current step
  const dryRunTableRows: DryRunRow[] = useMemo(() => {
    const rows: DryRunRow[] = [];
    const seenRounds = new Map<number, DryRunRow>();

    for (let s = 0; s <= stepIndex && s < executionPlan.length; s++) {
      const step = executionPlan[s];
      if (step.roundNumber > 0) {
        if (!seenRounds.has(step.roundNumber)) {
          seenRounds.set(step.roundNumber, {
            round: step.roundNumber,
            iValue: step.iValue,
            conditionStr: step.conditionStr || `${step.iValue} ${condOp} ${condTarget}`,
            conditionResult: step.conditionResult ?? true,
            outputStr: step.outputLine ? step.outputLine.trim() : '-',
            phase: step.phase,
          });
        } else {
          const existing = seenRounds.get(step.roundNumber)!;
          if (step.conditionStr) {
            existing.conditionStr = step.conditionStr;
            existing.conditionResult = step.conditionResult ?? existing.conditionResult;
          }
          if (step.outputLine) {
            existing.outputStr = step.outputLine.trim();
          }
          existing.phase = step.phase;
        }
      }
    }

    seenRounds.forEach((row) => rows.push(row));
    return rows;
  }, [stepIndex, executionPlan, condOp, condTarget]);

  const isInfiniteHalt = currentStep?.phase === 'infinite_halt';

  // ==========================================
  // SECTION 2: WHILE VS DO-WHILE COMPARISON
  // ==========================================
  const [compStartVal, setCompStartVal] = useState<number>(10);
  const [compTarget, setCompTarget] = useState<number>(5);
  const [compRan, setCompRan] = useState<boolean>(false);

  const whileRuns = compStartVal < compTarget ? compTarget - compStartVal : 0;
  const doWhileRuns = compStartVal < compTarget ? compTarget - compStartVal : 1;

  // ==========================================
  // SECTION 3: BREAK AND CONTINUE LAB
  // ==========================================
  const [isBreakActive, setIsBreakActive] = useState<boolean>(true);
  const [breakAt, setBreakAt] = useState<number>(6);
  const [isContinueActive, setIsContinueActive] = useState<boolean>(true);
  const [continueAt, setContinueAt] = useState<number>(4);

  const breakContinueCode = useMemo(() => {
    let inner = '';
    if (isContinueActive) {
      inner += `        if (i == ${continueAt}) {\n            continue; // Skip rest of body, jump to i++\n        }\n`;
    }
    if (isBreakActive) {
      inner += `        if (i == ${breakAt}) {\n            break; // Stop loop immediately, jump outside\n        }\n`;
    }
    inner += '        printf("%d ", i);';

    return `#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
${inner}
    }

    printf("\\nDone!\\n");
    return 0;
}`;
  }, [isBreakActive, breakAt, isContinueActive, continueAt]);

  const breakContinueOutput = useMemo(() => {
    const nums: number[] = [];
    for (let i = 1; i <= 10; i++) {
      if (isContinueActive && i === continueAt) {
        continue;
      }
      if (isBreakActive && i === breakAt) {
        break;
      }
      nums.push(i);
    }
    return nums.join(' ');
  }, [isBreakActive, breakAt, isContinueActive, continueAt]);

  return (
    <div className="space-y-8">
      {/* Module Title Header & Section Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Module 03</span>
            <span>·</span>
            <span>Iteration &amp; Control Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-cyan-400" />
            <span>3. Loops: Visualizer &amp; Mechanics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Watch loop iterations execute step-by-step. Trace counter updates, condition checks, dry run tables, and see how break &amp; continue manipulate execution.
          </p>
        </div>

        {/* Section Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto shrink-0">
          {[
            { id: 'visualizer', label: '1. Loop Visualizer' },
            { id: 'comparison', label: '2. while vs do-while' },
            { id: 'break-continue', label: '3. break & continue' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as MainViewSection)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSection === sec.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: THE LOOP VISUALIZER (for, while, do-while) */}
      {/* ========================================================================= */}
      {activeSection === 'visualizer' && (
        <div className="space-y-6">
          {/* Loop Type Tabs (for, while, do-while) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a101f] p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              {(['for', 'while', 'do-while'] as LoopType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setLoopType(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    loopType === type
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {type} loop
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:flex items-center gap-2">
              <span>Selected:</span>
              <span className="text-cyan-400 font-bold">{loopType} (C99)</span>
            </div>
          </div>

          {/* Interactive Parameters Configuration Bar */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configure Loop Parameters</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Change the start value, condition, and update rule. Watch the C source code and execution steps adapt instantly!
                </p>
              </div>

              {/* Condition check badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Condition Status:</span>
                {currentStep?.conditionResult !== undefined ? (
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 ${
                      currentStep.conditionResult
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                    }`}
                  >
                    <span>●</span>
                    <span>{currentStep.conditionResult ? 'TRUE (Loop Enters)' : 'FALSE (Loop Exits)'}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800">
                    Not tested yet
                  </span>
                )}
              </div>
            </div>

            {/* Inputs: Start, Condition, Update */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              {/* Start Value */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Start Value (int i):</label>
                <input
                  type="number"
                  value={startVal}
                  onChange={(e) => setStartVal(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Condition Operator */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Condition Operator:</label>
                <select
                  value={condOp}
                  onChange={(e) => setCondOp(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="<">&lt; (Less than)</option>
                  <option value="<=">&lt;= (Less than or equal)</option>
                  <option value=">">&gt; (Greater than)</option>
                  <option value=">=">&gt;= (Greater than or equal)</option>
                </select>
              </div>

              {/* Condition Target Number */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Target Number:</label>
                <input
                  type="number"
                  value={condTarget}
                  onChange={(e) => setCondTarget(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Update Rule */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Update Expression:</label>
                <select
                  value={updateOp}
                  onChange={(e) => setUpdateOp(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-amber-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="i++">i++ (Increment by 1)</option>
                  <option value="i--">i-- (Decrement by 1)</option>
                  <option value="i += 2">i += 2 (Increment by 2)</option>
                  <option value="i -= 2">i -= 2 (Decrement by 2)</option>
                </select>
              </div>
            </div>

            {/* Playback & Stepper Control Strip */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  title="Reset to initial state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((prev) => Math.min(prev + 1, executionPlan.length - 1));
                  }}
                  disabled={stepIndex >= executionPlan.length - 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Step Forward</span>
                </button>

                <span className="text-[11px] font-mono text-slate-500 ml-2">
                  Step {stepIndex + 1} / {executionPlan.length}
                </span>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Speed:</span>
                <span className="text-slate-500 text-[10px]">Fast</span>
                <input
                  type="range"
                  min="200"
                  max="1400"
                  step="100"
                  value={1600 - speedMs}
                  onChange={(e) => setSpeedMs(1600 - Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-slate-500 text-[10px]">Slow</span>
              </div>
            </div>

            {/* Infinite Loop Protection Alert */}
            {isInfiniteHalt && (
              <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-200 text-xs space-y-2 animate-pulse">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Infinite Loop Protection Triggered! (Halted at 50 rounds)</span>
                </div>
                <p className="leading-relaxed">
                  The loop never terminates because the condition <code className="bg-rose-900/60 px-1.5 py-0.5 rounded font-mono text-rose-200">i {condOp} {condTarget}</code> never evaluates to false with update <code className="bg-rose-900/60 px-1.5 py-0.5 rounded font-mono text-rose-200">{updateOp}</code>. The counter variable <code className="font-mono">i</code> keeps moving away from the exit boundary instead of towards it!
                </p>
              </div>
            )}
          </div>

          {/* Workbench: Code Panel, Active Step & Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Code Panel (7 cols) */}
            <div className="lg:col-span-7 h-[380px] sm:h-[420px]">
              <CodePanel
                code={visualizerCode}
                activeLine={currentStep?.line}
                fileName={`${loopType}_loop.c`}
                statusTag={`Round ${currentStep?.roundNumber || 0} · ${currentStep?.phase || 'ready'}`}
                annotation={currentStep?.annotation}
              />
            </div>

            {/* Right: State & Console (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* RAM Variable Inspector for i */}
              <div className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Loop Counter: int i</span>
                  <span className="text-cyan-400 font-bold">Round {currentStep?.roundNumber || 0}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Value of i in RAM:</span>
                  <span className="text-2xl font-bold font-mono text-cyan-300">
                    {currentStep?.iValue !== undefined ? currentStep.iValue : startVal}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  <span className="text-cyan-400 font-mono mr-1">Current Action:</span>
                  <span>{currentStep?.annotation || 'Press Play or Step to begin.'}</span>
                </div>
              </div>

              {/* Console Output */}
              <div className="flex-1 min-h-[190px]">
                <ConsolePanel
                  lines={accumulatedConsole}
                  isComplete={currentStep?.phase === 'done'}
                  command={`./${loopType}_demo`}
                  onClear={() => setStepIndex(0)}
                />
              </div>
            </div>
          </div>

          {/* Dry Run Table */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Dry Run Table (Iteration Trace)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  First-year CE practical requirement: tracing variables across rounds.
                </p>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded">
                {dryRunTableRows.length} {dryRunTableRows.length === 1 ? 'Round' : 'Rounds'} Logged
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0d1627] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Round #</th>
                    <th className="py-2 px-3">Value of i</th>
                    <th className="py-2 px-3">Condition Evaluation</th>
                    <th className="py-2 px-3">Condition Result</th>
                    <th className="py-2 px-3">Output Printed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-[#060b16]">
                  {dryRunTableRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-600 font-sans text-xs">
                        No rounds executed yet. Click "Step Forward" or "Play" above to start logging.
                      </td>
                    </tr>
                  ) : (
                    dryRunTableRows.map((row) => (
                      <tr
                        key={row.round}
                        className={`transition-colors ${
                          currentStep?.roundNumber === row.round
                            ? 'bg-cyan-950/30'
                            : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="py-2 px-3 text-cyan-400 font-bold">Round {row.round}</td>
                        <td className="py-2 px-3 text-slate-200">{row.iValue}</td>
                        <td className="py-2 px-3 text-slate-300">{row.conditionStr}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.conditionResult
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {row.conditionResult ? 'TRUE (1)' : 'FALSE (0)'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{row.outputStr}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: WHILE VS DO-WHILE COMPARISON */}
      {/* ========================================================================= */}
      {activeSection === 'comparison' && (
        <div className="space-y-6">
          {/* Comparison Controller */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Entry-Controlled vs Exit-Controlled Testbed</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Set the start value to 10 and the condition to &lt; 5 (already FALSE at the start) to see the monumental difference between while and do-while!
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCompStartVal(10);
                    setCompTarget(5);
                    setCompRan(true);
                  }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium font-mono transition-colors"
                >
                  Load Edge Case: i=10, condition i &lt; 5
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Start Value (i):</span>
                <input
                  type="number"
                  value={compStartVal}
                  onChange={(e) => {
                    setCompStartVal(parseInt(e.target.value, 10) || 0);
                    setCompRan(true);
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-2.5 py-1.5 text-cyan-300"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Condition:</span>
                <span className="text-amber-300 font-bold">i &lt;</span>
                <input
                  type="number"
                  value={compTarget}
                  onChange={(e) => {
                    setCompTarget(parseInt(e.target.value, 10) || 0);
                    setCompRan(true);
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-2.5 py-1.5 text-cyan-300"
                />
              </div>
            </div>
          </div>

          {/* Two Side-by-Side Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Panel: while Loop */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <h4 className="text-sm font-bold text-slate-100 font-mono">while Loop</h4>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Runs {whileRuns} {whileRuns === 1 ? 'time' : 'times'}
                </span>
              </div>

              {/* C Code Box */}
              <div className="p-3 bg-[#050811] rounded-lg border border-slate-800/80 font-mono text-xs leading-relaxed text-slate-300">
                <div className="text-slate-500">// Entry-controlled: test occurs BEFORE body</div>
                <div><span className="text-emerald-400">int</span> i = {compStartVal};</div>
                <div className="text-cyan-400 font-bold">while (i &lt; {compTarget}) &#123;</div>
                <div className="pl-4 text-slate-300">printf(<span className="text-lime-300">"%d "</span>, i);</div>
                <div className="pl-4 text-amber-300">i++;</div>
                <div>&#125;</div>
              </div>

              {/* Execution Outcome */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-mono">
                  Initial Check: {compStartVal} &lt; {compTarget} ➔{' '}
                  <span className={compStartVal < compTarget ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {compStartVal < compTarget ? 'TRUE' : 'FALSE (0)'}
                  </span>
                </div>
                <div className="text-slate-300">
                  Output printed: <span className="font-mono text-emerald-400 font-bold">{whileRuns === 0 ? '(Nothing - body was never entered!)' : `${compStartVal}...`}</span>
                </div>
              </div>

              {/* The One Sentence Rule */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                <strong>Entry-controlled loop:</strong> The condition is tested before entering the loop, so if it is false at the start, the body never runs.
              </div>
            </div>

            {/* Right Panel: do-while Loop */}
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <h4 className="text-sm font-bold text-slate-100 font-mono">do-while Loop</h4>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Runs {doWhileRuns} {doWhileRuns === 1 ? 'time' : 'times'}
                </span>
              </div>

              {/* C Code Box */}
              <div className="p-3 bg-[#050811] rounded-lg border border-slate-800/80 font-mono text-xs leading-relaxed text-slate-300">
                <div className="text-slate-500">// Exit-controlled: body runs FIRST, test occurs at end</div>
                <div><span className="text-emerald-400">int</span> i = {compStartVal};</div>
                <div className="text-cyan-400 font-bold">do &#123;</div>
                <div className="pl-4 text-slate-300">printf(<span className="text-lime-300">"%d "</span>, i);</div>
                <div className="pl-4 text-amber-300">i++;</div>
                <div className="text-cyan-400 font-bold">&#125; while (i &lt; {compTarget});</div>
              </div>

              {/* Execution Outcome */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-mono">
                  First Round: Body runs blindly first, prints {compStartVal}, then tests {compStartVal + 1} &lt; {compTarget}
                </div>
                <div className="text-slate-300">
                  Output printed: <span className="font-mono text-emerald-400 font-bold">{compStartVal} </span>
                </div>
              </div>

              {/* The One Sentence Rule */}
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
                <strong>Exit-controlled loop:</strong> The body always executes at least once before the condition is checked at the end.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: BREAK AND CONTINUE LAB */}
      {/* ========================================================================= */}
      {activeSection === 'break-continue' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <StopCircle className="w-4 h-4 text-rose-400" />
                <span>Jump Statements: break &amp; continue</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A loop runs from 1 to 10. Toggle break and continue at specific values of i to see rounds skipped or stopped early.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Continue Toggle & Number */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="toggle-continue"
                    checked={isContinueActive}
                    onChange={(e) => setIsContinueActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <label htmlFor="toggle-continue" className="text-xs text-slate-200 font-medium cursor-pointer">
                    Add <code className="text-amber-300 font-mono">continue</code> when i ==
                  </label>
                </div>

                <select
                  disabled={!isContinueActive}
                  value={continueAt}
                  onChange={(e) => setContinueAt(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs rounded px-2.5 py-1 disabled:opacity-30"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Break Toggle & Number */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="toggle-break"
                    checked={isBreakActive}
                    onChange={(e) => setIsBreakActive(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <label htmlFor="toggle-break" className="text-xs text-slate-200 font-medium cursor-pointer">
                    Add <code className="text-rose-400 font-mono">break</code> when i ==
                  </label>
                </div>

                <select
                  disabled={!isBreakActive}
                  value={breakAt}
                  onChange={(e) => setBreakAt(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-rose-300 font-mono text-xs rounded px-2.5 py-1 disabled:opacity-30"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 10 Visual Round Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-semibold">Loop Round Traversal (i = 1 to 10):</span>
              <span className="text-slate-500 font-mono">Watch skipped &amp; stopped states</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isBreakRound = isBreakActive && num === breakAt;
                const isAfterBreak = isBreakActive && num > breakAt;
                const isContinueRound = isContinueActive && num === continueAt && (!isBreakActive || num <= breakAt);

                let cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-300';
                let statusLabel = 'Printed';

                if (isBreakRound) {
                  cardStyle = 'bg-rose-950/80 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-rose-200';
                  statusLabel = '🛑 break;';
                } else if (isAfterBreak) {
                  cardStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                  statusLabel = '⛔ Not reached';
                } else if (isContinueRound) {
                  cardStyle = 'bg-slate-800/80 border-amber-500/50 text-slate-400 line-through';
                  statusLabel = '⏭ continue;';
                } else {
                  cardStyle = 'bg-[#091122] border-emerald-500/40 text-emerald-300';
                  statusLabel = '✓ Output';
                }

                return (
                  <div
                    key={num}
                    className={`p-3 rounded-lg border text-center transition-all ${cardStyle}`}
                  >
                    <div className="text-xs font-mono text-slate-400">i = {num}</div>
                    <div className="text-lg font-mono font-bold my-1">{num}</div>
                    <div className="text-[10px] font-mono leading-tight">{statusLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workbench: Code Panel & Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* C Code Panel */}
            <div className="lg:col-span-7 h-[360px]">
              <CodePanel
                code={breakContinueCode}
                fileName="break_continue.c"
                statusTag="Live C Code"
              />
            </div>

            {/* Console Output & Rules */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="h-[200px]">
                <ConsolePanel
                  lines={breakContinueOutput ? [breakContinueOutput, 'Done!'] : ['(No output produced)', 'Done!']}
                  command="./break_continue"
                  title="Terminal Output (stdout)"
                />
              </div>

              {/* Explainer card */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <div className="text-cyan-300 font-semibold font-mono flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>The Fundamental Difference:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">continue:</strong> Skips only the current round and jumps straight to the counter update (<code className="font-mono">i++</code>). The loop keeps running!
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-rose-400">break:</strong> Completely terminates the entire loop immediately, jumping directly to the first instruction past the loop closing brace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Module Complete Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {isCompleted ? 'Module 3: Loops Completed!' : 'Finished Exploring Loops?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Mastered! You understand for, while, do-while, dry run tables, and break/continue.'
                : 'Mark this module as complete to update your overall engineering lab progress.'}
            </p>
          </div>
        </div>

        {onMarkComplete && (
          <button
            onClick={onMarkComplete}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isCompleted ? '✓ Completed (Click to Toggle)' : 'Mark Module 3 as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
