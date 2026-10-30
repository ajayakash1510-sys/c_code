import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  Shield,
  Brain,
  BarChart3,
  Lock,
  Unlock,
  Key,
  Clock,
  Sparkles,
  Sliders
} from 'lucide-react';
import { CodePanel } from './CodePanel';
import { ConsolePanel } from './ConsolePanel';

interface PatternsLabProps {
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

type TabType = 'grid' | 'studio' | 'real-world';
type RealWorldLabType = 'login-lock' | 'passwords' | 'training-loop' | 'data-stats';
type PatternType = 'square' | 'right_triangle' | 'inverted_triangle' | 'number_triangle' | 'pyramid';

export const PatternsLab: React.FC<PatternsLabProps> = ({
  onMarkComplete,
  isCompleted = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('grid');

  // ==========================================
  // TAB 1: NESTED LOOP GRID
  // ==========================================
  const [gridRows, setGridRows] = useState<number>(3);
  const [gridCols, setGridCols] = useState<number>(4);
  const [gridSpeedMs, setGridSpeedMs] = useState<number>(500);
  const [gridStepIndex, setGridStepIndex] = useState<number>(0);
  const [isGridPlaying, setIsGridPlaying] = useState<boolean>(false);

  // Generate sequence of steps for nested loop: (i, j)
  interface GridStep {
    i: number;
    j: number;
    stepNumber: number;
    phase: 'row-start' | 'cell' | 'row-end' | 'done';
    line: number;
    annotation: string;
    output?: string;
  }

  const gridSteps = useMemo(() => {
    const steps: GridStep[] = [];
    let count = 0;

    for (let i = 1; i <= gridRows; i++) {
      steps.push({
        i,
        j: 0,
        stepNumber: ++count,
        phase: 'row-start',
        line: 6,
        annotation: `Outer loop: i = ${i} (Row ${i} begins)`,
      });

      for (let j = 1; j <= gridCols; j++) {
        steps.push({
          i,
          j,
          stepNumber: ++count,
          phase: 'cell',
          line: 7,
          annotation: `Inner loop: j = ${j} ➔ processing cell (${i}, ${j})`,
          output: `(${i},${j}) `,
        });
      }

      steps.push({
        i,
        j: gridCols,
        stepNumber: ++count,
        phase: 'row-end',
        line: 9,
        annotation: `Inner loop finished for row ${i}. Prints '\\n'`,
        output: '\n',
      });
    }

    steps.push({
      i: gridRows + 1,
      j: 0,
      stepNumber: ++count,
      phase: 'done',
      line: 12,
      annotation: `Nested loops finished! Total inner runs: ${gridRows * gridCols}`,
    });

    return steps;
  }, [gridRows, gridCols]);

  // Reset grid playback on parameter changes
  useEffect(() => {
    setGridStepIndex(0);
    setIsGridPlaying(false);
  }, [gridRows, gridCols]);

  // Grid auto-play timer
  useEffect(() => {
    let timer: any;
    if (isGridPlaying) {
      timer = setInterval(() => {
        setGridStepIndex((prev) => {
          if (prev >= gridSteps.length - 1) {
            setIsGridPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, gridSpeedMs);
    }
    return () => clearInterval(timer);
  }, [isGridPlaying, gridSteps.length, gridSpeedMs]);

  const currentGridStep = gridSteps[Math.min(gridStepIndex, gridSteps.length - 1)];

  // Live C code for nested grid
  const gridCode = useMemo(() => {
    return `#include <stdio.h>

int main() {
    int rows = ${gridRows};
    int cols = ${gridCols};

    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            printf("(%d,%d) ", i, j);
        }
        printf("\\n");
    }

    return 0;
}`;
  }, [gridRows, gridCols]);

  // Accumulated console output for grid
  const gridConsoleLines = useMemo(() => {
    const lines: string[] = [];
    let currentRowText = '';

    for (let s = 0; s <= gridStepIndex && s < gridSteps.length; s++) {
      const step = gridSteps[s];
      if (step.phase === 'cell' && step.output) {
        currentRowText += step.output;
      } else if (step.phase === 'row-end') {
        if (currentRowText) {
          lines.push(currentRowText.trim());
          currentRowText = '';
        }
      }
    }
    if (currentRowText) {
      lines.push(currentRowText.trim());
    }
    return lines;
  }, [gridStepIndex, gridSteps]);

  // Determine which cells have been visited
  const visitedCells = useMemo(() => {
    const set = new Set<string>();
    for (let s = 0; s <= gridStepIndex && s < gridSteps.length; s++) {
      const step = gridSteps[s];
      if (step.phase === 'cell') {
        set.add(`${step.i}-${step.j}`);
      }
    }
    return set;
  }, [gridStepIndex, gridSteps]);

  // ==========================================
  // TAB 2: PATTERN STUDIO
  // ==========================================
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('right_triangle');
  const [patternRows, setPatternRows] = useState<number>(5);
  const [patternAnimationIndex, setPatternAnimationIndex] = useState<number>(0);
  const [isPatternAnimating, setIsPatternAnimating] = useState<boolean>(false);

  // Pattern code and logic generator
  const patternDetails = useMemo(() => {
    switch (selectedPattern) {
      case 'square':
        return {
          title: 'Square Pattern',
          hint: 'Both outer and inner loops run n times, forming an n × n matrix of stars.',
          code: `#include <stdio.h>

int main() {
    int n = ${patternRows};

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`,
          generateLines: (n: number) => {
            const lines: string[] = [];
            for (let i = 1; i <= n; i++) {
              let line = '';
              for (let j = 1; j <= n; j++) line += '* ';
              lines.push(line.trim());
            }
            return lines;
          },
        };

      case 'right_triangle':
        return {
          title: 'Right Triangle Pattern',
          hint: 'In row i, the inner loop runs i times: print i stars.',
          code: `#include <stdio.h>

int main() {
    int n = ${patternRows};

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`,
          generateLines: (n: number) => {
            const lines: string[] = [];
            for (let i = 1; i <= n; i++) {
              let line = '';
              for (let j = 1; j <= i; j++) line += '* ';
              lines.push(line.trim());
            }
            return lines;
          },
        };

      case 'inverted_triangle':
        return {
          title: 'Inverted Triangle Pattern',
          hint: 'Outer loop counts down from n to 1. In row i, print i stars.',
          code: `#include <stdio.h>

int main() {
    int n = ${patternRows};

    for (int i = n; i >= 1; i--) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`,
          generateLines: (n: number) => {
            const lines: string[] = [];
            for (let i = n; i >= 1; i--) {
              let line = '';
              for (let j = 1; j <= i; j++) line += '* ';
              lines.push(line.trim());
            }
            return lines;
          },
        };

      case 'number_triangle':
        return {
          title: 'Number Triangle Pattern',
          hint: 'In row i, print numbers from 1 up to i using the inner loop variable j.',
          code: `#include <stdio.h>

int main() {
    int n = ${patternRows};

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d ", j);
        }
        printf("\\n");
    }

    return 0;
}`,
          generateLines: (n: number) => {
            const lines: string[] = [];
            for (let i = 1; i <= n; i++) {
              let line = '';
              for (let j = 1; j <= i; j++) line += `${j} `;
              lines.push(line.trim());
            }
            return lines;
          },
        };

      case 'pyramid':
        return {
          title: 'Centered Pyramid Pattern',
          hint: 'Row i requires (n - i) spaces followed by (2*i - 1) stars.',
          code: `#include <stdio.h>

int main() {
    int n = ${patternRows};

    for (int i = 1; i <= n; i++) {
        // Leading spaces: (n - i)
        for (int s = 1; s <= n - i; s++) {
            printf("  ");
        }
        // Stars: (2 * i - 1)
        for (int j = 1; j <= 2 * i - 1; j++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`,
          generateLines: (n: number) => {
            const lines: string[] = [];
            for (let i = 1; i <= n; i++) {
              let line = '';
              for (let s = 1; s <= n - i; s++) line += '  ';
              for (let j = 1; j <= 2 * i - 1; j++) line += '* ';
              lines.push(line);
            }
            return lines;
          },
        };
    }
  }, [selectedPattern, patternRows]);

  const allPatternLines = useMemo(() => {
    return patternDetails.generateLines(patternRows);
  }, [patternDetails, patternRows]);

  // Trigger row-by-row animated drawing
  const handleDrawPattern = () => {
    setPatternAnimationIndex(0);
    setIsPatternAnimating(true);
  };

  useEffect(() => {
    let timer: any;
    if (isPatternAnimating) {
      if (patternAnimationIndex < allPatternLines.length) {
        timer = setTimeout(() => {
          setPatternAnimationIndex((prev) => prev + 1);
        }, 220);
      } else {
        setIsPatternAnimating(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPatternAnimating, patternAnimationIndex, allPatternLines.length]);

  // Display all lines if not animating, or slice up to animation index
  const visiblePatternLines = isPatternAnimating
    ? allPatternLines.slice(0, patternAnimationIndex)
    : allPatternLines;

  // ==========================================
  // TAB 3: REAL-WORLD LABS
  // ==========================================
  const [activeRealWorldLab, setActiveRealWorldLab] = useState<RealWorldLabType>('login-lock');

  // Lab 1: Login Lock
  const correctPIN = '2026';
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinAttempts, setPinAttempts] = useState<number>(0);
  const [pinLog, setPinLog] = useState<string[]>([]);
  const [isAccountLocked, setIsAccountLocked] = useState<boolean>(false);
  const [isAccessGranted, setIsAccessGranted] = useState<boolean>(false);

  const handlePinSubmit = () => {
    if (isAccountLocked || isAccessGranted) return;
    const currentAttempt = pinAttempts + 1;
    setPinAttempts(currentAttempt);

    if (enteredPin === correctPIN) {
      setIsAccessGranted(true);
      setPinLog((prev) => [
        ...prev,
        `Attempt ${currentAttempt}: PIN [****] entered.`,
        '✓ Access Granted! Welcome to Secure Terminal.',
      ]);
    } else {
      if (currentAttempt >= 3) {
        setIsAccountLocked(true);
        setPinLog((prev) => [
          ...prev,
          `Attempt ${currentAttempt}: Incorrect PIN. Attempts remaining: 0.`,
          '🛑 ALERT: Account LOCKED! Too many failed attempts (3/3). Security lockout enforced.',
        ]);
      } else {
        setPinLog((prev) => [
          ...prev,
          `Attempt ${currentAttempt}: Incorrect PIN. Attempts remaining: ${3 - currentAttempt}.`,
        ]);
      }
    }
    setEnteredPin('');
  };

  const handleResetPinLab = () => {
    setPinAttempts(0);
    setEnteredPin('');
    setIsAccountLocked(false);
    setIsAccessGranted(false);
    setPinLog([]);
  };

  const loginLockCode = `#include <stdio.h>

int main() {
    int correctPIN = 2026;
    int enteredPIN;
    int attempts = 0;
    int maxAttempts = 3;

    do {
        printf("Enter your 4-digit PIN: ");
        scanf("%d", &enteredPIN);
        attempts++;

        if (enteredPIN == correctPIN) {
            printf("Access Granted! Welcome.\\n");
            break;
        } else {
            printf("Incorrect. Remaining: %d\\n", maxAttempts - attempts);
        }
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts && enteredPIN != correctPIN) {
        printf("ALERT: Account LOCKED!\\n");
    }

    return 0;
}`;

  // Lab 2: Why Long Passwords Matter
  const [pwLength, setPwLength] = useState<number>(6);
  const [pwCharset, setPwCharset] = useState<'digits' | 'lower' | 'alphanumeric'>('alphanumeric');

  const charsetSizes = {
    digits: { size: 10, name: 'Digits only (0-9)', sample: '10 possibilities' },
    lower: { size: 26, name: 'Lowercase letters (a-z)', sample: '26 possibilities' },
    alphanumeric: { size: 62, name: 'Letters + Digits (a-z, A-Z, 0-9)', sample: '62 possibilities' },
  };

  const pwMath = useMemo(() => {
    const base = charsetSizes[pwCharset].size;
    let totalCombinations = 1;
    // Loop based calculation
    for (let i = 1; i <= pwLength; i++) {
      totalCombinations *= base;
    }

    // At 1,000,000 guesses per second:
    const seconds = totalCombinations / 1000000;
    let timeFormatted = '';

    if (seconds < 1) {
      timeFormatted = `${(seconds * 1000).toFixed(1)} milliseconds (Instant crack!)`;
    } else if (seconds < 60) {
      timeFormatted = `${seconds.toFixed(2)} seconds`;
    } else if (seconds < 3600) {
      timeFormatted = `${(seconds / 60).toFixed(1)} minutes`;
    } else if (seconds < 86400) {
      timeFormatted = `${(seconds / 3600).toFixed(1)} hours`;
    } else if (seconds < 31536000) {
      timeFormatted = `${(seconds / 86400).toFixed(1)} days`;
    } else if (seconds < 3153600000) {
      timeFormatted = `${(seconds / 31536000).toFixed(1)} years`;
    } else {
      timeFormatted = `${(seconds / 31536000).toExponential(2)} centuries (Practically uncrackable)`;
    }

    return { totalCombinations, timeFormatted, base };
  }, [pwLength, pwCharset]);

  // Lab 3: AI/ML Training Loop
  const [mlEpochs, setMlEpochs] = useState<number>(10);
  const [mlCurrentEpoch, setMlCurrentEpoch] = useState<number>(0);
  const [isMlTraining, setIsMlTraining] = useState<boolean>(false);
  const [mlHistory, setMlHistory] = useState<number[]>([12]);

  const handleStartTraining = () => {
    setMlCurrentEpoch(0);
    setMlHistory([12]);
    setIsMlTraining(true);
  };

  useEffect(() => {
    let timer: any;
    if (isMlTraining) {
      if (mlCurrentEpoch < mlEpochs) {
        timer = setTimeout(() => {
          setMlCurrentEpoch((prev) => {
            const next = prev + 1;
            // Simulated learning curve: climbs towards 95%
            const prevAcc = mlHistory[mlHistory.length - 1];
            const gain = (95 - prevAcc) * 0.28;
            const newAcc = Math.min(95, prevAcc + gain + (Math.random() * 1.5 - 0.75));
            setMlHistory((h) => [...h, Math.round(newAcc * 10) / 10]);
            return next;
          });
        }, 280);
      } else {
        setIsMlTraining(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isMlTraining, mlCurrentEpoch, mlEpochs, mlHistory]);

  const mlLoopCode = `#include <stdio.h>

int main() {
    float accuracy = 0.12f; // Initial random guess
    int totalEpochs = ${mlEpochs};

    for (int epoch = 1; epoch <= totalEpochs; epoch++) {
        // Forward pass, loss calculation & weight update
        accuracy += (0.95f - accuracy) * 0.28f;
        printf("Epoch %d: Training Accuracy = %.1f%%\\n", epoch, accuracy * 100);
    }

    printf("Model converged successfully!\\n");
    return 0;
}`;

  // Lab 4: Data Lab - Marks Statistics
  const [marksList, setMarksList] = useState<number[]>([85, 92, 78, 64, 88]);

  const dataStats = useMemo(() => {
    let total = 0;
    let highest = marksList[0];
    let lowest = marksList[0];
    const traceRows: any[] = [];

    for (let i = 0; i < marksList.length; i++) {
      const mark = marksList[i];
      total += mark;
      if (mark > highest) highest = mark;
      if (mark < lowest) lowest = mark;

      traceRows.push({
        i,
        mark,
        runningTotal: total,
        highestSoFar: highest,
        lowestSoFar: lowest,
      });
    }

    const avg = total / marksList.length;
    return { total, highest, lowest, avg, traceRows };
  }, [marksList]);

  const dataStatsCode = `#include <stdio.h>

int main() {
    int marks[5] = {${marksList.join(', ')}};
    int total = 0;
    int highest = marks[0];
    int lowest = marks[0];

    for (int i = 0; i < 5; i++) {
        total += marks[i];
        if (marks[i] > highest) highest = marks[i];
        if (marks[i] < lowest) lowest = marks[i];
    }

    float average = (float)total / 5.0;
    printf("Total: %d | Avg: %.2f | Max: %d | Min: %d\\n", total, average, highest, lowest);
    return 0;
}`;

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Module 04</span>
            <span>·</span>
            <span>Nested Loops &amp; Real-World Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>4. Patterns &amp; Real-World Labs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Master 2D coordinate nested loops, star pattern generation, and explore hands-on labs in Cybersecurity, AI/ML training loops, and data aggregation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto shrink-0">
          {[
            { id: 'grid', label: '1. Nested Loop Grid' },
            { id: 'studio', label: '2. Pattern Studio' },
            { id: 'real-world', label: '3. Real-World Labs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NESTED LOOP GRID */}
      {/* ========================================================================= */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configure Nested Loop Dimensions (Rows × Cols)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The outer loop controls rows (i), while the inner loop controls columns (j). Watch each cell light up!
                </p>
              </div>

              {/* Total Inner Runs Formula Badge */}
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 font-mono text-xs text-cyan-300 flex items-center gap-2">
                <span className="text-slate-400">Total Inner Runs:</span>
                <span className="font-bold text-sm text-cyan-200">
                  {gridRows} × {gridCols} = {gridRows * gridCols} runs
                </span>
              </div>
            </div>

            {/* Dimension Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Rows Slider */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Outer Loop Rows (i = 1 to {gridRows}):</span>
                  <span className="text-cyan-400 font-bold">{gridRows} rows</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={gridRows}
                  onChange={(e) => setGridRows(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Columns Slider */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Inner Loop Columns (j = 1 to {gridCols}):</span>
                  <span className="text-amber-300 font-bold">{gridCols} columns</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={gridCols}
                  onChange={(e) => setGridCols(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Stepper & Playback Controls */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsGridPlaying(false);
                    setGridStepIndex(0);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setIsGridPlaying(!isGridPlaying)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isGridPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  }`}
                >
                  {isGridPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Simulation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsGridPlaying(false);
                    setGridStepIndex((prev) => Math.min(prev + 1, gridSteps.length - 1));
                  }}
                  disabled={gridStepIndex >= gridSteps.length - 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Step</span>
                </button>

                <span className="text-[11px] font-mono text-slate-500 ml-2">
                  Step {gridStepIndex + 1} / {gridSteps.length}
                </span>
              </div>

              {/* Live Loop Variable Counters */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                  i (row): {currentGridStep?.i > gridRows ? gridRows : currentGridStep?.i || 1}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                  j (col): {currentGridStep?.j || 0}
                </span>
              </div>
            </div>
          </div>

          {/* 2D Interactive Grid Visual Canvas */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>2D Matrix Cell Execution (Outer row i, Inner column j)</span>
              </span>
              <span className="text-slate-500 font-mono">
                {visitedCells.size} of {gridRows * gridCols} cells processed
              </span>
            </div>

            {/* The Visual Cell Grid */}
            <div className="flex justify-center p-4 bg-[#050811] rounded-xl border border-slate-800/80 overflow-x-auto">
              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${gridCols}, minmax(60px, 1fr))`,
                }}
              >
                {Array.from({ length: gridRows }, (_, rIndex) => {
                  const rowNum = rIndex + 1;
                  return Array.from({ length: gridCols }, (_, cIndex) => {
                    const colNum = cIndex + 1;
                    const cellKey = `${rowNum}-${colNum}`;
                    const isCurrent =
                      currentGridStep?.phase === 'cell' &&
                      currentGridStep.i === rowNum &&
                      currentGridStep.j === colNum;
                    const isVisited = visitedCells.has(cellKey);

                    let cellStyle = 'bg-slate-900/60 border-slate-800 text-slate-500';

                    if (isCurrent) {
                      cellStyle =
                        'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105';
                    } else if (isVisited) {
                      cellStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-medium';
                    }

                    return (
                      <div
                        key={cellKey}
                        className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center font-mono text-xs transition-all duration-200 ${cellStyle}`}
                      >
                        <span className="text-[10px] opacity-75">
                          r{rowNum}, c{colNum}
                        </span>
                        <span className="font-bold text-sm">
                          ({rowNum},{colNum})
                        </span>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>

          {/* Workbench: Code & Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* C Code Panel */}
            <div className="lg:col-span-7 h-[360px]">
              <CodePanel
                code={gridCode}
                activeLine={currentGridStep?.line}
                fileName="nested_grid.c"
                statusTag={`Row ${currentGridStep?.i || 1} · Col ${currentGridStep?.j || 0}`}
                annotation={currentGridStep?.annotation}
              />
            </div>

            {/* Terminal Console */}
            <div className="lg:col-span-5 h-[360px]">
              <ConsolePanel
                lines={gridConsoleLines}
                isComplete={currentGridStep?.phase === 'done'}
                command="./nested_grid"
                title="Terminal stdout (Matrix Output)"
                onClear={() => setGridStepIndex(0)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PATTERN STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          {/* Pattern Picker & Controls */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>C Pattern Studio</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a classic first-year pattern and adjust row count. The simulator renders row by row!
                </p>
              </div>

              <button
                onClick={handleDrawPattern}
                disabled={isPatternAnimating}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Draw Pattern Row-by-Row</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Pattern Dropdown */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs font-mono text-slate-400">Select Pattern Type:</label>
                <select
                  value={selectedPattern}
                  onChange={(e) => {
                    setSelectedPattern(e.target.value as PatternType);
                    setPatternAnimationIndex(0);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="square">1. Square Pattern (n × n)</option>
                  <option value="right_triangle">2. Right Triangle Pattern</option>
                  <option value="inverted_triangle">3. Inverted Triangle Pattern</option>
                  <option value="number_triangle">4. Number Triangle Pattern</option>
                  <option value="pyramid">5. Centered Pyramid Pattern</option>
                </select>
              </div>

              {/* Rows Slider */}
              <div className="sm:col-span-6 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Rows (n):</span>
                  <span className="text-amber-300 font-bold">{patternRows} rows</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={patternRows}
                  onChange={(e) => {
                    setPatternRows(Number(e.target.value));
                    setPatternAnimationIndex(0);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* One-Line Hint Box */}
            <div className="p-3 bg-slate-950 rounded-lg border border-cyan-800/50 flex items-center gap-2.5 text-xs">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-slate-300">
                <strong className="text-cyan-300 font-mono mr-1">Pattern Logic:</strong>
                <span>{patternDetails.hint}</span>
              </div>
            </div>
          </div>

          {/* Workbench: Code & Animated Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* C Code Panel */}
            <div className="lg:col-span-7 h-[400px]">
              <CodePanel
                code={patternDetails.code}
                fileName={`${selectedPattern}.c`}
                statusTag={patternDetails.title}
              />
            </div>

            {/* Pattern Terminal Output */}
            <div className="lg:col-span-5 h-[400px]">
              <ConsolePanel
                lines={visiblePatternLines}
                command={`./${selectedPattern}`}
                title="Terminal stdout (Rendered Pattern)"
                isComplete={!isPatternAnimating}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REAL-WORLD LABS */}
      {/* ========================================================================= */}
      {activeTab === 'real-world' && (
        <div className="space-y-6">
          {/* Sub-lab selector pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#090f1d] p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'login-lock', label: '1. Cyber: Login Lock (do-while)', icon: Shield },
              { id: 'passwords', label: '2. Cyber: Why Long Passwords Matter', icon: Key },
              { id: 'training-loop', label: '3. AI/ML: Training Loop', icon: Brain },
              { id: 'data-stats', label: '4. Data: Array Aggregation', icon: BarChart3 },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveRealWorldLab(sub.id as RealWorldLabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeRealWorldLab === sub.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* ============================================ */}
          {/* SUB-LAB 1: CYBER LOGIN LOCK (do-while) */}
          {/* ============================================ */}
          {activeRealWorldLab === 'login-lock' && (
            <div className="space-y-5">
              <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Cybersecurity Lab 1: Authentication Lockout Loop</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Simulates a <code className="text-cyan-300 font-mono">do-while</code> loop enforcing rate limiting. After 3 wrong tries, the account locks!
                    </p>
                  </div>

                  {/* Attempts badge */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">Failed Attempts:</span>
                    <span
                      className={`px-3 py-1 rounded-md font-bold ${
                        isAccountLocked
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse'
                          : isAccessGranted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                          : 'bg-slate-900 text-amber-300 border border-slate-700'
                      }`}
                    >
                      {pinAttempts} / 3 Attempts
                    </span>
                  </div>
                </div>

                {/* PIN Input interactive form */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      value={enteredPin}
                      disabled={isAccountLocked || isAccessGranted}
                      onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="4-digit PIN"
                      className="bg-slate-900 border border-slate-700 font-mono text-sm tracking-widest text-center w-36 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 disabled:opacity-40"
                    />
                  </div>

                  <button
                    onClick={handlePinSubmit}
                    disabled={isAccountLocked || isAccessGranted || enteredPin.length !== 4}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Submit PIN</span>
                  </button>

                  <button
                    onClick={handleResetPinLab}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg text-xs transition-colors"
                  >
                    Reset PIN Demo
                  </button>

                  <span className="text-[11px] font-mono text-slate-500 ml-auto">
                    Hint for demo: Correct PIN is <code className="text-cyan-400">2026</code>
                  </span>
                </div>

                {/* Lockout status alert */}
                {isAccountLocked && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg text-rose-200 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Account Locked:</strong> Brute-force threshold exceeded (3 failed attempts). In cybersecurity, this rate-limiting loop prevents attackers from running infinite dictionary scripts.
                    </span>
                  </div>
                )}

                {isAccessGranted && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Authentication Successful:</strong> Target PIN matched. Loop terminated immediately via <code className="font-mono">break;</code>!
                    </span>
                  </div>
                )}
              </div>

              {/* Workbench */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 h-[360px]">
                  <CodePanel
                    code={loginLockCode}
                    fileName="login_lock.c"
                    statusTag="do-while authentication loop"
                  />
                </div>
                <div className="lg:col-span-5 h-[360px]">
                  <ConsolePanel
                    lines={pinLog.length > 0 ? pinLog : ['Awaiting PIN entry...']}
                    command="./login_lock"
                    title="Terminal stdout (Security Prompt)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUB-LAB 2: WHY LONG PASSWORDS MATTER */}
          {/* ============================================ */}
          {activeRealWorldLab === 'passwords' && (
            <div className="space-y-5">
              <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span>Cybersecurity Lab 2: Exponential Loop Permutations</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explore how a loop multiplying possibilities by charset size creates astronomical numbers of combinations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Charset Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Character Type:</label>
                    <div className="space-y-1.5">
                      {(['digits', 'lower', 'alphanumeric'] as const).map((key) => (
                        <button
                          key={key}
                          onClick={() => setPwCharset(key)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between border ${
                            pwCharset === key
                              ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{charsetSizes[key].name}</span>
                          <span className="text-[11px] text-slate-500">
                            {charsetSizes[key].size} chars
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length Slider */}
                  <div className="space-y-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Password Length:</span>
                      <span className="text-xl font-bold text-cyan-400">{pwLength} characters</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={pwLength}
                      onChange={(e) => setPwLength(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="text-[11px] text-slate-400">
                      Calculated via loop: <code className="text-cyan-300 font-mono">{pwMath.base}^{pwLength}</code>
                    </div>
                  </div>
                </div>

                {/* Mathematical Outcome Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-400">Total Possible Combinations:</span>
                    <div className="text-2xl font-mono font-bold text-amber-300 truncate">
                      {pwMath.totalCombinations.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Calculated across {pwLength} loop multiplications
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-400">
                      Brute-Force Time @ 1,000,000 guesses/sec:
                    </span>
                    <div className="text-lg font-mono font-bold text-emerald-400 truncate">
                      {pwMath.timeFormatted}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Assuming a high-speed GPU cluster
                    </span>
                  </div>
                </div>

                {/* Educational Takeaway & Safe Notice */}
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs text-slate-300 space-y-1">
                  <p>
                    <strong className="text-cyan-300">Why Length Trumps Complexity:</strong> Every added character multiplies the loop iterations by the entire alphabet size ({pwMath.base}×). That exponential growth is why an 8-character password takes vastly longer to crack than a 4-character one!
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    Note: For learning only. This app does not generate or test real passwords.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUB-LAB 3: AI/ML TRAINING LOOP */}
          {/* ============================================ */}
          {activeRealWorldLab === 'training-loop' && (
            <div className="space-y-5">
              <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span>AI/ML Lab: Model Optimization Training Loop</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Neural networks learn by iterating through training loops (epochs) to incrementally improve accuracy.
                    </p>
                  </div>

                  <button
                    onClick={handleStartTraining}
                    disabled={isMlTraining}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Training Loop</span>
                  </button>
                </div>

                {/* Epochs Slider */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Number of Epochs (Loop Iterations):</span>
                    <span className="text-purple-400 font-bold">{mlEpochs} epochs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={mlEpochs}
                    disabled={isMlTraining}
                    onChange={(e) => setMlEpochs(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>

                {/* Mini SVG Live Accuracy Line Chart */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Training Accuracy Curve (%):</span>
                    <span className="text-emerald-400 font-bold">
                      Current Accuracy: {mlHistory[mlHistory.length - 1]}%
                    </span>
                  </div>

                  <div className="h-32 w-full relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="400" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeDasharray="3 3" />

                      {/* Accuracy Curve */}
                      {mlHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="3"
                          points={mlHistory
                            .map((acc, index) => {
                              const x = (index / mlEpochs) * 390 + 5;
                              const y = 95 - (acc / 100) * 85;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                        />
                      )}

                      {/* Points */}
                      {mlHistory.map((acc, index) => {
                        const x = (index / mlEpochs) * 390 + 5;
                        const y = 95 - (acc / 100) * 85;
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="3.5"
                            className="fill-cyan-400 stroke-slate-950 stroke-1"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* C-style training loop code & takeaway */}
                <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg text-xs text-purple-200">
                  <strong>AI/ML Takeaway:</strong> AI models don't learn all at once—they execute repetitive optimization loops over epochs, updating weights slightly on each round until performance converges toward 95%+.
                </div>
              </div>

              {/* C Code Panel */}
              <div className="h-[300px]">
                <CodePanel
                  code={mlLoopCode}
                  fileName="ml_training_loop.c"
                  statusTag={`Epoch ${mlCurrentEpoch} / ${mlEpochs}`}
                />
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUB-LAB 4: DATA STATS AGGREGATION */}
          {/* ============================================ */}
          {activeRealWorldLab === 'data-stats' && (
            <div className="space-y-5">
              <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Data Lab: Array Aggregation Loop</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      A loop walks through an array of 5 marks, maintaining a running total and tracking min/max.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-slate-400">Presets:</span>
                    <button
                      onClick={() => setMarksList([85, 92, 78, 64, 88])}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-cyan-300"
                    >
                      Sample A
                    </button>
                    <button
                      onClick={() => setMarksList([45, 52, 98, 61, 73])}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-cyan-300"
                    >
                      Sample B
                    </button>
                  </div>
                </div>

                {/* 5 Marks Inputs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Enter 5 Student Marks:</label>
                  <div className="grid grid-cols-5 gap-2">
                    {marksList.map((m, idx) => (
                      <input
                        key={idx}
                        type="number"
                        min="0"
                        max="100"
                        value={m}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setMarksList((prev) => {
                            const next = [...prev];
                            next[idx] = isNaN(val) ? 0 : val;
                            return next;
                          });
                        }}
                        className="bg-slate-900 border border-slate-700 font-mono text-center text-sm py-1.5 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Calculated Results Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 font-mono">Total Sum:</span>
                    <div className="text-xl font-bold font-mono text-cyan-300">{dataStats.total}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 font-mono">Average:</span>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {dataStats.avg.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 font-mono">Highest Mark:</span>
                    <div className="text-xl font-bold font-mono text-amber-300">{dataStats.highest}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 font-mono">Lowest Mark:</span>
                    <div className="text-xl font-bold font-mono text-rose-300">{dataStats.lowest}</div>
                  </div>
                </div>
              </div>

              {/* Dry Run Table for Array Aggregation */}
              <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Dry Run Table: Array Loop Stepping</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">5 Array Iterations</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#0d1627] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Iteration i</th>
                        <th className="py-2 px-3">marks[i]</th>
                        <th className="py-2 px-3">Running Total</th>
                        <th className="py-2 px-3">Highest so far</th>
                        <th className="py-2 px-3">Lowest so far</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#060b16]">
                      {dataStats.traceRows.map((row) => (
                        <tr key={row.i} className="hover:bg-slate-900/40">
                          <td className="py-2 px-3 text-cyan-400 font-bold">i = {row.i}</td>
                          <td className="py-2 px-3 text-slate-100 font-bold">{row.mark}</td>
                          <td className="py-2 px-3 text-emerald-400 font-medium">
                            {row.runningTotal}
                          </td>
                          <td className="py-2 px-3 text-amber-300">{row.highestSoFar}</td>
                          <td className="py-2 px-3 text-rose-300">{row.lowestSoFar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Panel */}
              <div className="h-[280px]">
                <CodePanel
                  code={dataStatsCode}
                  fileName="array_aggregation.c"
                  statusTag="Array iteration loop"
                />
              </div>
            </div>
          )}
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
              {isCompleted ? 'Module 4: Patterns & Real-World Labs Completed!' : 'Finished Exploring Patterns & Labs?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Outstanding! You mastered 2D nested loops, star patterns, cyber security locks, AI training loops, and data aggregation.'
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
            {isCompleted ? '✓ Completed (Click to Toggle)' : 'Mark Module 4 as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
