import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Code2,
  Bug,
  CheckSquare,
  Trophy,
  Flame,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { CodePanel } from './CodePanel';

interface PracticeLabProps {
  onMarkComplete?: () => void;
  isCompleted?: boolean;
  xp: number;
  onAddXp: (points: number, reason: string) => void;
  badges: string[];
  onUnlockBadge: (badgeId: string) => void;
  explainLikeImNew?: boolean;
}

type TabType = 'predict' | 'bugs' | 'quiz';

export const PracticeLab: React.FC<PracticeLabProps> = ({
  onMarkComplete,
  isCompleted = false,
  xp,
  onAddXp,
  badges,
  onUnlockBadge,
  explainLikeImNew = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('predict');

  // ==========================================
  // PART A: PREDICT THE OUTPUT (8 SNIPPETS)
  // ==========================================
  const predictSnippets = useMemo(
    () => [
      {
        id: 1,
        title: '1. Integer Division in C',
        concept: 'Integer Truncation',
        code: `#include <stdio.h>

int main() {
    int a = 7;
    int b = 2;
    printf("%d\\n", a / b);
    return 0;
}`,
        expectedOutput: '3',
        acceptableAnswers: ['3', '3\n'],
        explanation:
          'In C, dividing an integer by an integer yields an integer! The decimal fraction is completely discarded (truncated toward zero), not rounded. So 7 / 2 = 3.',
        dryRunRows: [
          { step: '1', line: 'int a = 7, b = 2;', effect: 'Variables stored in RAM: a = 7, b = 2' },
          { step: '2', line: 'a / b', effect: '7 / 2 evaluates to 3 in C integer arithmetic' },
          { step: '3', line: 'printf("%d\\n", 3);', effect: 'Prints "3" to stdout terminal' },
        ],
      },
      {
        id: 2,
        title: '2. The Modulo Operator (%)',
        concept: 'Remainder Division',
        code: `#include <stdio.h>

int main() {
    int a = 14;
    int b = 4;
    printf("%d\\n", a % b);
    return 0;
}`,
        expectedOutput: '2',
        acceptableAnswers: ['2', '2\n'],
        explanation:
          'The % operator returns the remainder of integer division: 14 divided by 4 is 3 with a remainder of 2 (14 = 4 * 3 + 2).',
        dryRunRows: [
          { step: '1', line: 'int a = 14, b = 4;', effect: 'Variables initialized in memory' },
          { step: '2', line: '14 % 4', effect: 'Remainder of 14 / 4 is 2' },
          { step: '3', line: 'printf("%d\\n", 2);', effect: 'Prints "2" to stdout terminal' },
        ],
      },
      {
        id: 3,
        title: '3. Post-Increment (a++) in Expressions',
        concept: 'Pre vs Post Increment',
        code: `#include <stdio.h>

int main() {
    int a = 5;
    int b = a++;
    printf("%d %d\\n", a, b);
    return 0;
}`,
        expectedOutput: '6 5',
        acceptableAnswers: ['6 5', '6, 5', '6,5', '6 5\n'],
        explanation:
          'Post-increment (a++) uses the CURRENT value of a first in the assignment, and increments a afterwards. So b receives 5, and a becomes 6.',
        dryRunRows: [
          { step: '1', line: 'int a = 5;', effect: 'a is initialized to 5' },
          { step: '2', line: 'int b = a++;', effect: 'b takes 5 (old value of a); then a is incremented to 6' },
          { step: '3', line: 'printf("%d %d\\n", a, b);', effect: 'Prints "6 5"' },
        ],
      },
      {
        id: 4,
        title: '4. If / Else Boundary Condition',
        concept: 'Relational Comparison',
        code: `#include <stdio.h>

int main() {
    int score = 80;
    if (score > 80) {
        printf("Passed\\n");
    } else {
        printf("Retake\\n");
    }
    return 0;
}`,
        expectedOutput: 'Retake',
        acceptableAnswers: ['retake', 'Retake', 'Retake\n'],
        explanation:
          'The operator is strictly greater than (>), not greater than or equal (>=). Since 80 > 80 is FALSE (0), the else branch runs, printing "Retake"!',
        dryRunRows: [
          { step: '1', line: 'int score = 80;', effect: 'score = 80 in stack RAM' },
          { step: '2', line: 'if (80 > 80)', effect: 'Evaluates to 0 (FALSE)' },
          { step: '3', line: 'else block', effect: 'Executes printf("Retake\\n")' },
        ],
      },
      {
        id: 5,
        title: '5. For Loop Accumulator',
        concept: 'Loop Summation',
        code: `#include <stdio.h>

int main() {
    int count = 0;
    for (int i = 0; i < 4; i++) {
        count += i;
    }
    printf("%d\\n", count);
    return 0;
}`,
        expectedOutput: '6',
        acceptableAnswers: ['6', '6\n'],
        explanation:
          'i takes values 0, 1, 2, 3. The sum is 0 + 1 + 2 + 3 = 6. The loop stops when i becomes 4.',
        dryRunRows: [
          { step: 'Round 1', line: 'i = 0', effect: 'count = 0 + 0 = 0' },
          { step: 'Round 2', line: 'i = 1', effect: 'count = 0 + 1 = 1' },
          { step: 'Round 3', line: 'i = 2', effect: 'count = 1 + 2 = 3' },
          { step: 'Round 4', line: 'i = 3', effect: 'count = 3 + 3 = 6' },
          { step: 'Exit', line: 'i = 4 (4 < 4 is FALSE)', effect: 'Loop terminates, prints 6' },
        ],
      },
      {
        id: 6,
        title: '6. While Loop Decrementing',
        concept: 'Entry-Controlled Loop',
        code: `#include <stdio.h>

int main() {
    int n = 3;
    while (n > 0) {
        printf("%d", n);
        n--;
    }
    printf("\\n");
    return 0;
}`,
        expectedOutput: '321',
        acceptableAnswers: ['321', '3 2 1', '321\n'],
        explanation:
          'n starts at 3, prints 3, decrements to 2. Prints 2, decrements to 1. Prints 1, decrements to 0. At n = 0, condition 0 > 0 is FALSE. Output is 321.',
        dryRunRows: [
          { step: 'Round 1', line: 'n = 3 (3 > 0 is TRUE)', effect: 'Prints 3, n becomes 2' },
          { step: 'Round 2', line: 'n = 2 (2 > 0 is TRUE)', effect: 'Prints 2, n becomes 1' },
          { step: 'Round 3', line: 'n = 1 (1 > 0 is TRUE)', effect: 'Prints 1, n becomes 0' },
          { step: 'Exit', line: 'n = 0 (0 > 0 is FALSE)', effect: 'Loop terminates' },
        ],
      },
      {
        id: 7,
        title: '7. Do-While (False at Start)',
        concept: 'Exit-Controlled Execution',
        code: `#include <stdio.h>

int main() {
    int x = 10;
    do {
        printf("%d", x);
        x++;
    } while (x < 5);
    return 0;
}`,
        expectedOutput: '10',
        acceptableAnswers: ['10', '10\n'],
        explanation:
          'A do-while loop always executes the body AT LEAST ONCE before checking the condition. It prints 10, increments x to 11, then checks 11 < 5 (FALSE) and stops!',
        dryRunRows: [
          { step: 'Round 1 (Body)', line: 'printf("%d", 10)', effect: 'Prints "10"' },
          { step: 'Update', line: 'x++', effect: 'x increments from 10 to 11' },
          { step: 'Exit Check', line: 'while (11 < 5)', effect: '11 < 5 is FALSE (0) ➔ Terminates!' },
        ],
      },
      {
        id: 8,
        title: '8. Break and Continue Together',
        concept: 'Jump Control Flow',
        code: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) continue;
        if (i == 4) break;
        printf("%d", i);
    }
    return 0;
}`,
        expectedOutput: '13',
        acceptableAnswers: ['13', '1 3', '13\n'],
        explanation:
          'i=1: prints 1. i=2: continue skips printing. i=3: prints 3. i=4: break halts loop entirely. i=5 is never reached! Output is 13.',
        dryRunRows: [
          { step: 'i = 1', line: 'printf("%d", 1)', effect: 'Prints 1' },
          { step: 'i = 2', line: 'continue;', effect: 'Skips printf, jumps straight to i++' },
          { step: 'i = 3', line: 'printf("%d", 3)', effect: 'Prints 3' },
          { step: 'i = 4', line: 'break;', effect: 'Terminates loop immediately!' },
        ],
      },
    ],
    []
  );

  const [activeSnippetIdx, setActiveSnippetIdx] = useState<number>(0);
  const [userPredictions, setUserPredictions] = useState<Record<number, string>>({});
  const [checkedSnippets, setCheckedSnippets] = useState<Record<number, boolean>>({});
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const currentSnippet = predictSnippets[activeSnippetIdx];
  const currentPrediction = userPredictions[currentSnippet.id] || '';
  const isCurrentChecked = checkedSnippets[currentSnippet.id] || false;
  const isCurrentCorrect =
    currentSnippet.acceptableAnswers.includes(currentPrediction.trim());

  const handleCheckPrediction = () => {
    if (!isCurrentChecked) {
      setCheckedSnippets((prev) => ({ ...prev, [currentSnippet.id]: true }));
      if (isCurrentCorrect) {
        onAddXp(25, `Predicted output for "${currentSnippet.title}" correctly!`);
      }
    }
  };

  // ==========================================
  // PART B: FIX THE BUG (5 BROKEN PROGRAMS)
  // ==========================================
  const bugPrograms = useMemo(
    () => [
      {
        id: 1,
        title: 'Bug 1: The Missing Semicolon',
        code: `#include <stdio.h>

int main() {
    int age = 19
    printf("Age: %d\\n", age);
    return 0;
}`,
        bugLine: 4,
        options: [
          { id: 'A', text: 'Add a semicolon at the end of line 4: int age = 19;', isCorrect: true },
          { id: 'B', text: 'Change int to float on line 4', isCorrect: false },
          { id: 'C', text: 'Remove the value 19', isCorrect: false },
        ],
        explanation:
          'Every statement in C must end with a semicolon (;). Without it, the compiler merges line 4 into line 5, causing a syntax compile error.',
      },
      {
        id: 2,
        title: 'Bug 2: The Missing & in scanf',
        code: `#include <stdio.h>

int main() {
    int marks;
    printf("Enter marks: ");
    scanf("%d", marks);
    return 0;
}`,
        bugLine: 6,
        options: [
          { id: 'A', text: 'Change "%d" to "%f"', isCorrect: false },
          { id: 'B', text: 'Pass &marks instead of marks to scanf: scanf("%d", &marks);', isCorrect: true },
          { id: 'C', text: 'Replace scanf with printf', isCorrect: false },
        ],
        explanation:
          'scanf requires the memory address of the variable (&marks) so it can write the typed number directly into that memory slot.',
      },
      {
        id: 3,
        title: 'Bug 3: Assignment (=) vs Equality (==)',
        code: `#include <stdio.h>

int main() {
    int pass = 0;
    if (pass = 1) {
        printf("User passed!\\n");
    }
    return 0;
}`,
        bugLine: 5,
        options: [
          { id: 'A', text: 'Change pass = 1 to pass == 1 in the if condition', isCorrect: true },
          { id: 'B', text: 'Remove the if statement completely', isCorrect: false },
          { id: 'C', text: 'Change int pass = 0 to float pass = 0;', isCorrect: false },
        ],
        explanation:
          'Single = assigns 1 to pass! In C, any non-zero value evaluates to TRUE, so if (pass = 1) will ALWAYS run regardless of what pass was before. Use == to compare.',
      },
      {
        id: 4,
        title: 'Bug 4: Off-by-One Array Indexing',
        code: `#include <stdio.h>

int main() {
    int scores[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i <= 5; i++) {
        printf("%d\\n", scores[i]);
    }
    return 0;
}`,
        bugLine: 5,
        options: [
          { id: 'A', text: 'Change i <= 5 to i < 5 in the for loop condition', isCorrect: true },
          { id: 'B', text: 'Start i at 1 instead of 0', isCorrect: false },
          { id: 'C', text: 'Change scores[5] to scores[6]', isCorrect: false },
        ],
        explanation:
          'In C, arrays of size 5 have indices 0, 1, 2, 3, 4. When i is 5, scores[5] accesses unallocated memory outside the array (buffer overflow), which can crash your program.',
      },
      {
        id: 5,
        title: 'Bug 5: Infinite Loop with No Counter Update',
        code: `#include <stdio.h>

int main() {
    int i = 1;
    while (i <= 5) {
        printf("%d ", i);
    }
    return 0;
}`,
        bugLine: 5,
        options: [
          { id: 'A', text: 'Add i++; inside the while loop body', isCorrect: true },
          { id: 'B', text: 'Change i <= 5 to i <= 0', isCorrect: false },
          { id: 'C', text: 'Change int i = 1 to int i = 10', isCorrect: false },
        ],
        explanation:
          'Without i++; inside the body, i remains 1 forever! The condition 1 <= 5 will always be TRUE, freezing your program in an infinite loop.',
      },
    ],
    []
  );

  const [activeBugIdx, setActiveBugIdx] = useState<number>(0);
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);
  const [selectedFixOption, setSelectedFixOption] = useState<string | null>(null);
  const [bugAnswers, setBugAnswers] = useState<Record<number, boolean>>({});

  const currentBug = bugPrograms[activeBugIdx];
  const isBugAnswered = bugAnswers[currentBug.id] !== undefined;

  const handleFixSubmit = (optId: string) => {
    if (isBugAnswered) return;
    const opt = currentBug.options.find((o) => o.id === optId);
    const isCorrect = !!opt?.isCorrect;
    setSelectedFixOption(optId);
    setBugAnswers((prev) => ({ ...prev, [currentBug.id]: isCorrect }));

    if (isCorrect) {
      onAddXp(30, `Fixed ${currentBug.title}!`);
      // Check if Bug Hunter badge can be awarded
      const fixedCount = Object.values({ ...bugAnswers, [currentBug.id]: true }).filter(Boolean).length;
      if (fixedCount >= 3 && !badges.includes('Bug Hunter')) {
        onUnlockBadge('Bug Hunter');
      }
    }
  };

  // ==========================================
  // PART C: FINAL QUIZ (10 MCQS)
  // ==========================================
  const quizQuestions = useMemo(
    () => [
      {
        id: 1,
        question: 'Where does CPU execution begin in every valid C program?',
        options: ['At #include <stdio.h>', 'At the first function defined in the file', 'Inside the main() function', 'At return 0;'],
        correctIndex: 2,
        explanation: 'The operating system and CPU always begin execution inside main().',
      },
      {
        id: 2,
        question: 'What is the typical memory size of an int in C on modern 32/64-bit systems?',
        options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correctIndex: 2,
        explanation: 'An int is typically 4 bytes (32 bits), while char is 1 byte, float is 4 bytes, and double is 8 bytes.',
      },
      {
        id: 3,
        question: 'Which escape sequence is used in printf to print a newline?',
        options: ['\\t', '\\n', '\\r', '\\0'],
        correctIndex: 1,
        explanation: '\\n prints a newline character, pushing the terminal cursor to the next line.',
      },
      {
        id: 4,
        question: 'Which format specifier prints a floating-point number formatted to exactly two decimal places?',
        options: ['%2f', '%.2f', '%f.2', '%d'],
        correctIndex: 1,
        explanation: '%.2f specifies floating-point with a precision of 2 decimal digits.',
      },
      {
        id: 5,
        question: 'What is the result of 9 / 2 in C integer arithmetic?',
        options: ['4.5', '5', '4', 'Undefined'],
        correctIndex: 2,
        explanation: 'Dividing an int by an int in C truncates the decimal fraction, giving 4.',
      },
      {
        id: 6,
        question: 'Why is the & symbol required in scanf("%d", &num);?',
        options: ['It means "logical AND"', 'It passes the memory address of num so scanf can store data there', 'It converts num to a string', 'It is optional and can be left out'],
        correctIndex: 1,
        explanation: 'In C, functions pass by value. The address-of operator & passes num\'s RAM address so scanf can write the value into memory.',
      },
      {
        id: 7,
        question: 'What happens in a C switch statement if you forget to put break; at the end of a matching case?',
        options: ['A syntax error occurs', 'Execution falls through into the next case automatically', 'The program crashes', 'The loop repeats from case 1'],
        correctIndex: 1,
        explanation: 'Without break;, execution cascades downward into the next case regardless of condition—this is known as switch fall-through.',
      },
      {
        id: 8,
        question: 'How many times will a do-while loop execute if its condition is FALSE from the start?',
        options: ['0 times', 'Exactly 1 time', 'Infinitely', '2 times'],
        correctIndex: 1,
        explanation: 'Because do-while is an exit-controlled loop, the body always executes at least once before the condition is checked at the bottom.',
      },
      {
        id: 9,
        question: 'Which keyword skips only the remaining instructions of the current loop round and jumps to the update step?',
        options: ['break', 'continue', 'return', 'exit'],
        correctIndex: 1,
        explanation: 'continue skips the rest of the current iteration and jumps directly to the loop update (i++). break exits the entire loop.',
      },
      {
        id: 10,
        question: 'What value does C evaluate as boolean FALSE in conditional if statements?',
        options: ['-1', 'Only NULL', '0 (zero)', 'Any negative number'],
        correctIndex: 2,
        explanation: 'In C, 0 represents FALSE. Any non-zero value (such as 1, 42, or -5) is evaluated as TRUE.',
      },
    ],
    []
  );

  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const activeQuestion = quizQuestions[currentQuizIdx];
  const selectedQuizOption = quizAnswers[activeQuestion.id];
  const isQuestionAnswered = selectedQuizOption !== undefined;

  const handleSelectQuizOption = (optIndex: number) => {
    if (isQuestionAnswered) return;
    setQuizAnswers((prev) => ({ ...prev, [activeQuestion.id]: optIndex }));

    if (optIndex === activeQuestion.correctIndex) {
      onAddXp(20, `Correct answer on Quiz Question ${activeQuestion.id}!`);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      if (!badges.includes('Code Champion')) {
        onUnlockBadge('Code Champion');
      }
    }
  };

  const quizScore = useMemo(() => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [quizAnswers, quizQuestions]);

  return (
    <div className="space-y-6">
      {/* Module Title Header & XP Gamification Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Module 05</span>
            <span>·</span>
            <span>Mastery Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <span>5. Practice, Bug Hunting &amp; Final Quiz</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test your C comprehension with 8 output predictions, 5 interactive bug fixes, and the comprehensive 10-question final evaluation.
          </p>
        </div>

        {/* Live XP and Badges Strip */}
        <div className="flex items-center gap-3 bg-[#0d1627] px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-slate-400">Total XP:</span>
            <span className="font-bold text-amber-300 text-sm">{xp} XP</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{badges.length} Badges</span>
          </div>
        </div>
      </div>

      {/* Beginner Mode Callout if active */}
      {explainLikeImNew && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Beginner Guide Active:</strong> Take your time! Read C code slowly like a recipe: instructions execute one by one from top to bottom.
          </span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
        {[
          { id: 'predict', label: 'Part A: Predict Output (8)', icon: Code2 },
          { id: 'bugs', label: 'Part B: Fix the Bug (5)', icon: Bug },
          { id: 'quiz', label: 'Part C: Final Quiz (10)', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PART A: PREDICT THE OUTPUT */}
      {/* ========================================================================= */}
      {activeTab === 'predict' && (
        <div className="space-y-6">
          {/* Snippet Selector Strip */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0a101f] p-2 rounded-xl border border-slate-800">
            {predictSnippets.map((s, idx) => {
              const isChecked = checkedSnippets[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSnippetIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    activeSnippetIdx === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  {isChecked && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Workbench: Code & Input */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* C Code Panel (7 cols) */}
            <div className="lg:col-span-7 h-[380px]">
              <CodePanel
                code={currentSnippet.code}
                fileName={`predict_${currentSnippet.id}.c`}
                statusTag={currentSnippet.concept}
              />
            </div>

            {/* Prediction Input & Result (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-[#0b1222] border border-slate-800 shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100">{currentSnippet.title}</h3>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    +25 XP
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Read the C code on the left carefully. What will this program output to the terminal?
                </p>

                {/* Prediction Input Field */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-mono text-slate-400">Your Predicted Output:</label>
                  <input
                    type="text"
                    value={currentPrediction}
                    disabled={isCurrentChecked}
                    onChange={(e) =>
                      setUserPredictions((prev) => ({
                        ...prev,
                        [currentSnippet.id]: e.target.value,
                      }))
                    }
                    placeholder="Type output here (e.g. 3)"
                    className="w-full bg-slate-900 border border-slate-700 font-mono text-sm px-3 py-2 rounded-lg text-emerald-300 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                  />
                </div>

                {!isCurrentChecked ? (
                  <button
                    onClick={handleCheckPrediction}
                    disabled={!currentPrediction.trim()}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Check Output</span>
                  </button>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div
                      className={`p-3 rounded-lg border text-xs ${
                        isCurrentCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {isCurrentCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Spot on! Correct Output (+25 XP)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span>Not quite right. Correct output: "{currentSnippet.expectedOutput}"</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        {currentSnippet.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowWhyModal(true)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Show Me Why (Step-by-Step Dry Run)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Next snippet navigation */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Snippet {activeSnippetIdx + 1} of {predictSnippets.length}
                </span>

                <button
                  onClick={() =>
                    setActiveSnippetIdx((prev) =>
                      prev < predictSnippets.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <span>Next Snippet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* "Show Me Why" Modal with Dry Run Table */}
          {showWhyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <div className="bg-[#0b1222] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Dry Run Trace: {currentSnippet.title}</span>
                  </h3>
                  <button
                    onClick={() => setShowWhyModal(false)}
                    className="text-slate-400 hover:text-white text-xs font-mono"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-mono">
                    Step-by-step CPU execution log:
                  </div>
                  <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#0d1627] text-slate-400">
                        <tr>
                          <th className="py-2 px-3">Step</th>
                          <th className="py-2 px-3">Statement</th>
                          <th className="py-2 px-3">RAM / Effect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-[#050811]">
                        {currentSnippet.dryRunRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-900/40">
                            <td className="py-2 px-3 text-cyan-400 font-bold">{r.step}</td>
                            <td className="py-2 px-3 text-slate-300">{r.line}</td>
                            <td className="py-2 px-3 text-emerald-400">{r.effect}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <strong>Core Takeaway:</strong> {currentSnippet.explanation}
                </p>

                <button
                  onClick={() => setShowWhyModal(false)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs"
                >
                  Got It!
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PART B: FIX THE BUG (5 BROKEN PROGRAMS) */}
      {/* ========================================================================= */}
      {activeTab === 'bugs' && (
        <div className="space-y-6">
          {/* Bug Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0a101f] p-2 rounded-xl border border-slate-800">
            {bugPrograms.map((b, idx) => {
              const isSolved = bugAnswers[b.id] !== undefined;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBugIdx(idx);
                    setSelectedBugLine(null);
                    setSelectedFixOption(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    activeBugIdx === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Bug className="w-3 h-3" />
                  <span>Bug #{idx + 1}</span>
                  {isSolved && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* C Code Panel (7 cols) - Interactive line clicking */}
            <div className="lg:col-span-7 h-[380px]">
              <CodePanel
                code={currentBug.code}
                activeLine={selectedBugLine}
                fileName={`broken_program_${currentBug.id}.c`}
                statusTag="Click the buggy line"
                onLineClick={(line) => setSelectedBugLine(line)}
                annotation={
                  selectedBugLine
                    ? selectedBugLine === currentBug.bugLine
                      ? '🎯 Target line selected!'
                      : `Line ${selectedBugLine} selected`
                    : undefined
                }
              />
            </div>

            {/* Fix Selection & Feedback (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-[#0b1222] border border-slate-800 shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-rose-400" />
                    <span>{currentBug.title}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    +30 XP
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Step 1: Click the line in the code you think is wrong (or select below).
                  <br />
                  Step 2: Choose the correct C fix from the 3 options.
                </p>

                {/* 3 Fix Options */}
                <div className="space-y-2 pt-1">
                  {currentBug.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleFixSubmit(opt.id)}
                      disabled={isBugAnswered}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-2.5 ${
                        selectedFixOption === opt.id
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : isBugAnswered && opt.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {/* Explanation card after answering */}
                {isBugAnswered && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Bug Diagnostic &amp; Explanation:</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {currentBug.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Bug {activeBugIdx + 1} of {bugPrograms.length}
                </span>

                <button
                  onClick={() => {
                    setActiveBugIdx((prev) =>
                      prev < bugPrograms.length - 1 ? prev + 1 : 0
                    );
                    setSelectedBugLine(null);
                    setSelectedFixOption(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <span>Next Bug</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PART C: FINAL QUIZ (10 MCQS) */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!isQuizCompleted ? (
            <div className="max-w-2xl mx-auto bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Question Progress Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">
                    Question {currentQuizIdx + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-slate-400 font-semibold">
                    Score: {quizScore} / {quizQuestions.length}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{
                      width: `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                  {activeQuestion.question}
                </h3>

                {/* 4 Multiple Choice Options */}
                <div className="space-y-2.5">
                  {activeQuestion.options.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === activeQuestion.correctIndex;

                    let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800';

                    if (isQuestionAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/30 border-slate-850 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={isQuestionAnswered}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isQuestionAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {isQuestionAnswered && isSelected && !isCorrect && (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Explanation */}
                {isQuestionAnswered && (
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-cyan-300 font-bold font-mono">Explanation:</span>
                    <p className="leading-relaxed">{activeQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isQuestionAnswered && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentQuizIdx < quizQuestions.length - 1
                      ? 'Next Question'
                      : 'View Final Quiz Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* Quiz Completed Results Screen */
            <div className="max-w-xl mx-auto bg-[#0b1222] border border-cyan-500/40 rounded-2xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-100">Final Quiz Completed!</h3>
                <p className="text-xs text-slate-400">
                  You have successfully completed the 10-question evaluation for first-year C programming.
                </p>
              </div>

              {/* Score Metric */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-around font-mono">
                <div>
                  <span className="text-slate-500 text-xs">Your Score:</span>
                  <div className="text-2xl font-bold text-emerald-400">
                    {quizScore} / {quizQuestions.length}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="text-slate-500 text-xs">Accuracy:</span>
                  <div className="text-2xl font-bold text-cyan-300">
                    {Math.round((quizScore / quizQuestions.length) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentQuizIdx(0);
                    setQuizAnswers({});
                    setIsQuizCompleted(false);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>

                {onMarkComplete && (
                  <button
                    onClick={onMarkComplete}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Mark Module 5 as Completed
                  </button>
                )}
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
              {isCompleted ? 'Module 5: Practice & Quiz Completed!' : 'Finished Testing Your Knowledge?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Outstanding work! You have finished all interactive practice exercises and quizzes.'
                : 'Mark this module as complete to achieve 100% curriculum completion and unlock your celebration screen!'}
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
            {isCompleted ? '✓ Completed (Click to Toggle)' : 'Mark Module 5 as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
