import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  RotateCcw,
  StepForward,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Bot,
  Sliders,
  Calendar,
  Layers,
  Pause
} from 'lucide-react';
import { CodePanel } from './CodePanel';
import { ConsolePanel } from './ConsolePanel';
import { VariableInspector } from './VariableInspector';
import { SimulationVariable } from '../types';

interface DecisionsLabProps {
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

type TabType = 'grade-checker' | 'switch-demo';

export const DecisionsLab: React.FC<DecisionsLabProps> = ({
  onMarkComplete,
  isCompleted = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('grade-checker');

  // ==========================================
  // SUB-LAB 1: GRADE CHECKER STATE
  // ==========================================
  const [marks, setMarks] = useState<number>(85);
  const [includeBoundaryValidation, setIncludeBoundaryValidation] = useState<boolean>(false);
  const [gradeStep, setGradeStep] = useState<number>(0);
  const [isGradeAutoPlaying, setIsGradeAutoPlaying] = useState<boolean>(false);

  // Generate C code for Grade Checker based on boundary check toggle
  const gradeCode = useMemo(() => {
    if (includeBoundaryValidation) {
      return `#include <stdio.h>

int main() {
    int marks = ${marks};

    // Cybersecurity check: Defensive boundary guard
    if (marks < 0 || marks > 100) {
        printf("Error: Invalid marks %d! Must be 0-100.\\n", marks);
    } else if (marks >= 90) {
        printf("Result: Grade A (Outstanding)\\n");
    } else if (marks >= 80) {
        printf("Result: Grade B (Very Good)\\n");
    } else if (marks >= 70) {
        printf("Result: Grade C (Good)\\n");
    } else if (marks >= 60) {
        printf("Result: Grade D (Pass)\\n");
    } else {
        printf("Result: Grade F (Needs Improvement)\\n");
    }

    return 0;
}`;
    }

    return `#include <stdio.h>

int main() {
    int marks = ${marks};

    if (marks >= 90) {
        printf("Result: Grade A (Outstanding)\\n");
    } else if (marks >= 80) {
        printf("Result: Grade B (Very Good)\\n");
    } else if (marks >= 70) {
        printf("Result: Grade C (Good)\\n");
    } else if (marks >= 60) {
        printf("Result: Grade D (Pass)\\n");
    } else {
        printf("Result: Grade F (Needs Improvement)\\n");
    }

    return 0;
}`;
  }, [marks, includeBoundaryValidation]);

  // Compute execution steps for Grade Checker
  interface GradeExecutionStep {
    line: number;
    explanation: string;
    subExplanation?: string;
    conditionEval?: {
      expression: string;
      evaluated: string;
      result: boolean;
    };
    outputLine?: string;
    isReturn?: boolean;
  }

  const gradeSteps: GradeExecutionStep[] = useMemo(() => {
    const steps: GradeExecutionStep[] = [
      {
        line: 4,
        explanation: `Allocates 4 bytes in RAM and assigns integer variable marks = ${marks};`,
        subExplanation: 'CPU places marks in the current stack frame.',
      },
    ];

    if (includeBoundaryValidation) {
      const isInvalid = marks < 0 || marks > 100;
      steps.push({
        line: 7,
        explanation: `Evaluates boundary condition: (${marks} < 0 || ${marks} > 100)`,
        conditionEval: {
          expression: 'marks < 0 || marks > 100',
          evaluated: `${marks} < 0 || ${marks} > 100`,
          result: isInvalid,
        },
      });

      if (isInvalid) {
        steps.push({
          line: 8,
          explanation: `Condition passed! Executes error print statement.`,
          outputLine: `Error: Invalid marks ${marks}! Must be 0-100.`,
        });
        steps.push({
          line: 20,
          explanation: `Function reaches return 0 and terminates without evaluating any grade branches.`,
          isReturn: true,
        });
        return steps;
      }
    }

    // Branch 1: >= 90
    const offset = includeBoundaryValidation ? 2 : 0;
    const line90 = 6 + offset;
    const is90 = marks >= 90;
    steps.push({
      line: line90,
      explanation: `Checks condition: if (marks >= 90)`,
      conditionEval: {
        expression: 'marks >= 90',
        evaluated: `${marks} >= 90`,
        result: is90,
      },
    });

    if (is90) {
      steps.push({
        line: line90 + 1,
        explanation: `Condition is TRUE! Enters the Grade A block.`,
        outputLine: 'Result: Grade A (Outstanding)',
      });
    } else {
      // Branch 2: >= 80
      const line80 = 8 + offset;
      const is80 = marks >= 80;
      steps.push({
        line: line80,
        explanation: `Previous if was FALSE. Jumps to: else if (marks >= 80)`,
        conditionEval: {
          expression: 'marks >= 80',
          evaluated: `${marks} >= 80`,
          result: is80,
        },
      });

      if (is80) {
        steps.push({
          line: line80 + 1,
          explanation: `Condition is TRUE! Enters the Grade B block.`,
          outputLine: 'Result: Grade B (Very Good)',
        });
      } else {
        // Branch 3: >= 70
        const line70 = 10 + offset;
        const is70 = marks >= 70;
        steps.push({
          line: line70,
          explanation: `Previous else-if was FALSE. Jumps to: else if (marks >= 70)`,
          conditionEval: {
            expression: 'marks >= 70',
            evaluated: `${marks} >= 70`,
            result: is70,
          },
        });

        if (is70) {
          steps.push({
            line: line70 + 1,
            explanation: `Condition is TRUE! Enters the Grade C block.`,
            outputLine: 'Result: Grade C (Good)',
          });
        } else {
          // Branch 4: >= 60
          const line60 = 12 + offset;
          const is60 = marks >= 60;
          steps.push({
            line: line60,
            explanation: `Previous else-if was FALSE. Jumps to: else if (marks >= 60)`,
            conditionEval: {
              expression: 'marks >= 60',
              evaluated: `${marks} >= 60`,
              result: is60,
            },
          });

          if (is60) {
            steps.push({
              line: line60 + 1,
              explanation: `Condition is TRUE! Enters the Grade D block.`,
              outputLine: 'Result: Grade D (Pass)',
            });
          } else {
            // Branch 5: else
            const lineElse = 14 + offset;
            steps.push({
              line: lineElse,
              explanation: `All conditions were FALSE (0). Falls into the default else branch.`,
            });
            steps.push({
              line: lineElse + 1,
              explanation: `Executes Grade F print statement.`,
              outputLine: 'Result: Grade F (Needs Improvement)',
            });
          }
        }
      }
    }

    // Final step: return 0
    const returnLine = includeBoundaryValidation ? 22 : 18;
    steps.push({
      line: returnLine,
      explanation: `Exits main function with code 0 (success). Notice that any subsequent branches were completely skipped!`,
      isReturn: true,
    });

    return steps;
  }, [marks, includeBoundaryValidation]);

  // Reset step when inputs change
  useEffect(() => {
    setGradeStep(gradeSteps.length - 1); // Default to completed view for instantaneous feedback
  }, [marks, includeBoundaryValidation, gradeSteps.length]);

  // Auto-play timer for Grade step
  useEffect(() => {
    let timer: any;
    if (isGradeAutoPlaying) {
      timer = setInterval(() => {
        setGradeStep((prev) => {
          if (prev >= gradeSteps.length - 1) {
            setIsGradeAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100);
    }
    return () => clearInterval(timer);
  }, [isGradeAutoPlaying, gradeSteps.length]);

  const currentGradeStep = gradeSteps[Math.min(gradeStep, gradeSteps.length - 1)];

  // Compute accumulated console output up to current step
  const gradeConsoleLines = useMemo(() => {
    const lines: string[] = [];
    for (let i = 0; i <= gradeStep && i < gradeSteps.length; i++) {
      if (gradeSteps[i].outputLine) {
        lines.push(gradeSteps[i].outputLine!);
      }
    }
    return lines;
  }, [gradeStep, gradeSteps]);

  // Variables in memory for grade checker
  const gradeVariables: Record<string, SimulationVariable> = {
    marks: {
      name: 'marks',
      type: 'int',
      value: marks,
      bytes: 4,
      note: 'Integer variable stored in stack memory',
      status: currentGradeStep?.line === 4 ? 'updated' : 'neutral',
    },
  };

  // ==========================================
  // SUB-LAB 2: SWITCH-CASE & FALL-THROUGH STATE
  // ==========================================
  const [day, setDay] = useState<number>(5);
  const [includeBreak, setIncludeBreak] = useState<boolean>(true);
  const [switchStep, setSwitchStep] = useState<number>(0);
  const [isSwitchAutoPlaying, setIsSwitchAutoPlaying] = useState<boolean>(false);

  const dayNames: Record<number, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday (Weekend!)',
    7: 'Sunday (Weekend!)',
  };

  const switchCode = useMemo(() => {
    if (includeBreak) {
      return `#include <stdio.h>

int main() {
    int day = ${day};

    switch (day) {
        case 1:
            printf("Day 1: Monday\\n");
            break;
        case 2:
            printf("Day 2: Tuesday\\n");
            break;
        case 3:
            printf("Day 3: Wednesday\\n");
            break;
        case 4:
            printf("Day 4: Thursday\\n");
            break;
        case 5:
            printf("Day 5: Friday\\n");
            break;
        case 6:
            printf("Day 6: Saturday (Weekend!)\\n");
            break;
        case 7:
            printf("Day 7: Sunday (Weekend!)\\n");
            break;
        default:
            printf("Error: Invalid day %d (Expected 1-7)\\n", day);
            break;
    }

    return 0;
}`;
    }

    // Without break - shows fall-through
    return `#include <stdio.h>

int main() {
    int day = ${day};

    // Notice: All 'break;' statements removed to demonstrate Fall-Through!
    switch (day) {
        case 1:
            printf("Day 1: Monday\\n");
        case 2:
            printf("Day 2: Tuesday\\n");
        case 3:
            printf("Day 3: Wednesday\\n");
        case 4:
            printf("Day 4: Thursday\\n");
        case 5:
            printf("Day 5: Friday\\n");
        case 6:
            printf("Day 6: Saturday (Weekend!)\\n");
        case 7:
            printf("Day 7: Sunday (Weekend!)\\n");
        default:
            printf("Default: End of cascade reached!\\n");
    }

    return 0;
}`;
  }, [day, includeBreak]);

  // Compute switch execution steps
  interface SwitchStep {
    line: number;
    explanation: string;
    outputLine?: string;
    isBreak?: boolean;
    isFallthrough?: boolean;
    isReturn?: boolean;
  }

  const switchSteps: SwitchStep[] = useMemo(() => {
    const steps: SwitchStep[] = [
      {
        line: 4,
        explanation: `Initializes int day = ${day};`,
      },
    ];

    if (includeBreak) {
      // With break
      steps.push({
        line: 6,
        explanation: `switch (day): C evaluates day (${day}) and looks up matching case in jump table.`,
      });

      if (day >= 1 && day <= 7) {
        const caseLine = 7 + (day - 1) * 3;
        const printLine = caseLine + 1;
        const breakLine = caseLine + 2;

        steps.push({
          line: caseLine,
          explanation: `Matches 'case ${day}:'! Execution jumps directly here.`,
        });
        steps.push({
          line: printLine,
          explanation: `Executes printf for ${dayNames[day]}.`,
          outputLine: `Day ${day}: ${dayNames[day]}`,
        });
        steps.push({
          line: breakLine,
          explanation: `'break;' encountered! Immediately jumps out of the switch block to the end.`,
          isBreak: true,
        });
      } else {
        // default case
        steps.push({
          line: 28,
          explanation: `No case matched ${day}. Execution jumps to 'default:'!`,
        });
        steps.push({
          line: 29,
          explanation: `Executes invalid day printf error message.`,
          outputLine: `Error: Invalid day ${day} (Expected 1-7)`,
        });
        steps.push({
          line: 30,
          explanation: `'break;' exits switch statement.`,
          isBreak: true,
        });
      }

      steps.push({
        line: 33,
        explanation: `Reaches 'return 0;'. Program terminates cleanly.`,
        isReturn: true,
      });
    } else {
      // WITHOUT BREAK: FALL-THROUGH DEMO
      steps.push({
        line: 7,
        explanation: `switch (day): C evaluates day (${day}) and jumps to the matching case label.`,
      });

      if (day >= 1 && day <= 7) {
        // Starts at matching day and falls through to all subsequent cases + default
        for (let d = day; d <= 7; d++) {
          const caseLine = 8 + (d - 1) * 2;
          const printLine = caseLine + 1;

          if (d === day) {
            steps.push({
              line: caseLine,
              explanation: `Matches 'case ${d}:'! Execution enters here.`,
            });
          } else {
            steps.push({
              line: caseLine,
              explanation: `⚠️ FALL-THROUGH! Because previous case lacked 'break;', execution continues right into case ${d}!`,
              isFallthrough: true,
            });
          }

          steps.push({
            line: printLine,
            explanation: `Prints: Day ${d}: ${dayNames[d]}`,
            outputLine: `Day ${d}: ${dayNames[d]}`,
            isFallthrough: d !== day,
          });
        }

        // Falls through into default
        steps.push({
          line: 22,
          explanation: `⚠️ FALL-THROUGH! Cascades straight into the default label as well!`,
          isFallthrough: true,
        });
        steps.push({
          line: 23,
          explanation: `Executes default printf because no break stopped it!`,
          outputLine: `Default: End of cascade reached!`,
          isFallthrough: true,
        });
      } else {
        // Invalid day jumps to default
        steps.push({
          line: 22,
          explanation: `No case matched ${day}. Jumps straight to default.`,
        });
        steps.push({
          line: 23,
          explanation: `Executes default block.`,
          outputLine: `Default: End of cascade reached!`,
        });
      }

      steps.push({
        line: 26,
        explanation: `Exits switch block and hits 'return 0;'.`,
        isReturn: true,
      });
    }

    return steps;
  }, [day, includeBreak, dayNames]);

  // Reset switch step when inputs change
  useEffect(() => {
    setSwitchStep(switchSteps.length - 1);
  }, [day, includeBreak, switchSteps.length]);

  // Auto-play timer for Switch step
  useEffect(() => {
    let timer: any;
    if (isSwitchAutoPlaying) {
      timer = setInterval(() => {
        setSwitchStep((prev) => {
          if (prev >= switchSteps.length - 1) {
            setIsSwitchAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100);
    }
    return () => clearInterval(timer);
  }, [isSwitchAutoPlaying, switchSteps.length]);

  const currentSwitchStep = switchSteps[Math.min(switchStep, switchSteps.length - 1)];

  const switchConsoleLines = useMemo(() => {
    const lines: string[] = [];
    for (let i = 0; i <= switchStep && i < switchSteps.length; i++) {
      if (switchSteps[i].outputLine) {
        lines.push(switchSteps[i].outputLine!);
      }
    }
    return lines;
  }, [switchStep, switchSteps]);

  const switchVariables: Record<string, SimulationVariable> = {
    day: {
      name: 'day',
      type: 'int',
      value: day,
      bytes: 4,
      note: 'Day selector integer passed to switch()',
      status: currentSwitchStep?.line === 4 ? 'updated' : 'neutral',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-lab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Module 02</span>
            <span>·</span>
            <span>Control Flow &amp; Decisions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Decisions Lab: Conditionals &amp; Switch
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            See how the C runtime evaluates boolean branches and why the <code className="text-amber-300">break</code> keyword is essential in switch jump tables.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('grade-checker')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'grade-checker'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Grade Checker (if/else)</span>
          </button>
          <button
            onClick={() => setActiveTab('switch-demo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'switch-demo'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Switch &amp; Fall-Through</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IF / ELSE-IF / ELSE GRADE CHECKER */}
      {/* ========================================================================= */}
      {activeTab === 'grade-checker' && (
        <div className="space-y-6">
          {/* Interactive Control Deck */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <span>Interactive Parameter: int marks</span>
                  <span className="text-cyan-400 text-sm font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {marks}
                  </span>
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Drag the slider to adjust the marks variable. Watch the code pointer dynamically highlight the executing branch!
                </p>
              </div>

              {/* Step debugger playback controls */}
              <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 shrink-0">
                <button
                  onClick={() => {
                    setIsGradeAutoPlaying(false);
                    setGradeStep(0);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={() => setIsGradeAutoPlaying(!isGradeAutoPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                    isGradeAutoPlaying
                      ? 'bg-amber-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                  title={isGradeAutoPlaying ? 'Pause Auto-Run' : 'Auto-Step through code'}
                >
                  {isGradeAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Auto Step</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsGradeAutoPlaying(false);
                    setGradeStep((prev) => Math.min(prev + 1, gradeSteps.length - 1));
                  }}
                  disabled={gradeStep >= gradeSteps.length - 1}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded transition-colors"
                  title="Advance 1 step"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Step</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-0.5">
                    ({gradeStep + 1}/{gradeSteps.length})
                  </span>
                </button>
              </div>
            </div>

            {/* Range Slider & Quick Presets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-500">0</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="font-mono text-xs text-slate-500">100</span>
              </div>

              {/* Preset Buttons for Quick Testing */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-mono text-[11px] mr-1">Presets:</span>
                {[
                  { label: '95 (Grade A)', val: 95 },
                  { label: '82 (Grade B)', val: 82 },
                  { label: '73 (Grade C)', val: 73 },
                  { label: '64 (Grade D)', val: 64 },
                  { label: '45 (Grade F)', val: 45 },
                  { label: '90 (Boundary)', val: 90 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => setMarks(preset.val)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      marks === preset.val
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}

                {/* Boundary guard toggle for cybersecurity demonstration */}
                <button
                  onClick={() => setIncludeBoundaryValidation(!includeBoundaryValidation)}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors border ${
                    includeBoundaryValidation
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Defensive Guard Check</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {includeBoundaryValidation ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Dual Workbench: Code Editor & Console Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: C Code Panel (7 cols) */}
            <div className="lg:col-span-7 h-[420px] sm:h-[480px]">
              <CodePanel
                code={gradeCode}
                activeLine={currentGradeStep?.line}
                fileName="grade_checker.c"
                statusTag={`Step ${gradeStep + 1} of ${gradeSteps.length}`}
                annotation={
                  currentGradeStep?.conditionEval
                    ? currentGradeStep.conditionEval.result
                      ? 'Evaluated: TRUE (1)'
                      : 'Evaluated: FALSE (0)'
                    : currentGradeStep?.outputLine
                    ? 'Outputs to stdout'
                    : undefined
                }
              />
            </div>

            {/* Right Column: Console & State Inspector (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-[210px] sm:h-[230px]">
                <ConsolePanel
                  lines={gradeConsoleLines}
                  isComplete={gradeStep >= gradeSteps.length - 1}
                  command="./grade_checker"
                  onClear={() => setGradeStep(0)}
                />
              </div>

              <div className="flex-1">
                <VariableInspector
                  variables={gradeVariables}
                  conditionEval={currentGradeStep?.conditionEval}
                  explanation={currentGradeStep?.explanation}
                />
              </div>
            </div>
          </div>

          {/* First-Year Engineering Pedagogical Insights Deck */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono">
                <Lightbulb className="w-4 h-4" />
                <span>How C Conditions Work</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In C, there is no native boolean type in ancient C89. A condition is considered <strong className="text-cyan-300">FALSE if 0</strong>, and <strong className="text-emerald-400">TRUE if non-zero</strong>. When an <code className="text-cyan-300">if</code> evaluates to true, C enters that block and immediately ignores all subsequent <code className="text-cyan-300">else if</code> and <code className="text-cyan-300">else</code> clauses!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Cybersecurity Guardrails</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Notice the optional <strong className="text-emerald-400">Defensive Guard</strong> toggle. In security engineering, assuming user marks will only be 0-100 without checks invites logic bombs. Guard clauses validate bounds early before running business logic.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs font-mono">
                <Bot className="w-4 h-4" />
                <span>AI &amp; Machine Learning</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Decision Trees in Machine Learning (CART / Random Forests) work exactly like this cascading if-else chain. Each branch represents an optimized threshold split learned from training data!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SWITCH-CASE & BREAK FALL-THROUGH */}
      {/* ========================================================================= */}
      {activeTab === 'switch-demo' && (
        <div className="space-y-6">
          {/* Interactive Control Deck for Switch */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <span>Interactive Day Selector: int day</span>
                  <span className="text-cyan-400 text-sm font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {day} ({dayNames[day] || 'Unknown'})
                  </span>
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Select a day number (1–7) and watch how the switch statement jumps to the matching case.
                </p>
              </div>

              {/* Step debugger playback controls */}
              <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 shrink-0">
                <button
                  onClick={() => {
                    setIsSwitchAutoPlaying(false);
                    setSwitchStep(0);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={() => setIsSwitchAutoPlaying(!isSwitchAutoPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                    isSwitchAutoPlaying
                      ? 'bg-amber-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                  title={isSwitchAutoPlaying ? 'Pause Auto-Run' : 'Auto-Step through code'}
                >
                  {isSwitchAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Auto Step</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsSwitchAutoPlaying(false);
                    setSwitchStep((prev) => Math.min(prev + 1, switchSteps.length - 1));
                  }}
                  disabled={switchStep >= switchSteps.length - 1}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded transition-colors"
                  title="Advance 1 step"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Step</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-0.5">
                    ({switchStep + 1}/{switchSteps.length})
                  </span>
                </button>
              </div>
            </div>

            {/* Day Selector Buttons & The Fall-Through Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      day === d
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    Day {d}
                  </button>
                ))}

                {/* Test default case */}
                <button
                  onClick={() => setDay(9)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    day === 9
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-slate-900 text-rose-300 hover:bg-slate-800 border border-rose-900/40'
                  }`}
                  title="Test default: with invalid input 9"
                >
                  Day 9 (Test Default)
                </button>
              </div>

              {/* THE CRITICAL FALL-THROUGH TOGGLE */}
              <div className="flex items-center gap-2 bg-[#0d1627] p-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">break keyword:</span>
                <button
                  onClick={() => setIncludeBreak(true)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    includeBreak
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  With 'break;'
                </button>
                <button
                  onClick={() => setIncludeBreak(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    !includeBreak
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Remove 'break;' (Fall-Through!)</span>
                </button>
              </div>
            </div>

            {/* Alert banner when break is removed */}
            {!includeBreak && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-amber-300">Fall-Through Mode Active:</strong> In C, without a <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-200 font-mono">break;</code> statement, execution does NOT stop after matching the case! It cascades right into all subsequent cases below it. Watch how multiple lines print to the console below!
                </div>
              </div>
            )}
          </div>

          {/* Dual Workbench: Code Editor & Console Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: C Code Panel (7 cols) */}
            <div className="lg:col-span-7 h-[460px] sm:h-[500px]">
              <CodePanel
                code={switchCode}
                activeLine={currentSwitchStep?.line}
                fileName="day_switch.c"
                statusTag={
                  !includeBreak
                    ? 'Fall-Through Active ⚠️'
                    : `Step ${switchStep + 1} of ${switchSteps.length}`
                }
                annotation={
                  currentSwitchStep?.isBreak
                    ? 'break exits switch immediately'
                    : currentSwitchStep?.isFallthrough
                    ? 'FALL-THROUGH: cascades into next case!'
                    : currentSwitchStep?.outputLine
                    ? 'Prints to console'
                    : undefined
                }
              />
            </div>

            {/* Right Column: Console & State Inspector (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-[230px] sm:h-[250px]">
                <ConsolePanel
                  lines={switchConsoleLines}
                  isComplete={switchStep >= switchSteps.length - 1}
                  command="./day_switch"
                  onClear={() => setSwitchStep(0)}
                />
              </div>

              <div className="flex-1">
                <VariableInspector
                  variables={switchVariables}
                  explanation={currentSwitchStep?.explanation}
                />
              </div>
            </div>
          </div>

          {/* Switch Fall-Through Mental Model Explainer */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Why Does C Fall-Through? (Jump Tables Under The Hood)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a C compiler translates a <code className="text-cyan-300 font-mono">switch</code> statement, it generates an internal <em>jump table</em>. The <code className="text-amber-300 font-mono">case 5:</code> is merely a jump label (like an address tag in memory). Once execution jumps to that label, the CPU simply executes instructions sequentially downward. Unless it encounters a <code className="text-emerald-400 font-mono">break;</code> (which translates to a machine-level unconditional jump past the switch closing brace), it will blindly execute case 6, case 7, and default!
            </p>
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
              {isCompleted ? 'Module 2 Completed!' : 'Finished Exploring Decisions?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Great job! You understand if/else branching, condition evaluation, and switch fall-through.'
                : 'Mark this module as complete to update your overall engineering lab progress.'}
            </p>
          </div>
        </div>

        {onMarkComplete && (
          <button
            onClick={onMarkComplete}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isCompleted ? '✓ Completed (Click to Toggle)' : 'Mark Module 2 as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
