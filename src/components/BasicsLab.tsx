import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Binary,
  Cpu,
  ArrowRight,
  Database,
  HelpCircle,
  Code2,
  Plus,
  Trash2,
  Check,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { CodePanel } from './CodePanel';
import { ConsolePanel } from './ConsolePanel';

interface BasicsLabProps {
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

type TabType = 'structure' | 'variables' | 'io' | 'operators';

interface CustomVariable {
  id: string;
  name: string;
  type: 'int' | 'float' | 'double' | 'char';
  value: string;
  bytes: number;
  address: string;
}

export const BasicsLab: React.FC<BasicsLabProps> = ({
  onMarkComplete,
  isCompleted = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('structure');

  // ==========================================
  // TAB 1: STRUCTURE OF A C PROGRAM
  // ==========================================
  const structureCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

  const [selectedStructureLine, setSelectedStructureLine] = useState<number>(4);
  const [structureConsoleLines, setStructureConsoleLines] = useState<string[]>([]);
  const [isCompilingPipeline, setIsCompilingPipeline] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(-1);

  const structureLineExplanations: Record<number, { title: string; explanation: string; tip: string }> = {
    1: {
      title: '#include <stdio.h> (Preprocessor Directive)',
      explanation:
        'Tells the C Preprocessor to include the contents of standard header file "stdio.h" (Standard Input Output) before compilation begins. This header provides declarations for functions like printf() and scanf().',
      tip: 'Lines starting with # are handled before compilation. Without stdio.h, the compiler does not know what printf means!',
    },
    2: {
      title: 'Blank Line (Whitespace)',
      explanation:
        'C completely ignores whitespace, blank lines, and indentations during compilation. They exist purely for human programmers to organize code clearly.',
      tip: 'Use blank lines to visually separate logical blocks of your code.',
    },
    3: {
      title: 'int main() { (The Program Entry Point)',
      explanation:
        'Every valid C program MUST have exactly one main() function. When your program starts, this is the first function the CPU executes. The "int" keyword means this function will return an integer exit code to the operating system when it finishes.',
      tip: 'No main() function = Linker error! The operating system wouldn\'t know where to start running.',
    },
    4: {
      title: 'printf("Hello, World!\\n"); (Standard Output)',
      explanation:
        'Calls the standard library function printf (print formatted) to output text to stdout (your terminal screen). The "\\n" is an escape sequence that prints a newline, moving the cursor to the next line.',
      tip: 'Every simple statement in C must end with a semicolon (;). Forgetting a semicolon is the #1 beginner syntax error!',
    },
    5: {
      title: 'return 0; (Exit Status Code)',
      explanation:
        'Terminates the main() function and hands execution back to the operating system. By convention in UNIX/Linux and Windows, returning 0 signals "Success - No errors occurred". Returning any non-zero number (like 1 or -1) signals an error.',
      tip: 'You can test a program\'s return code in bash using: echo $?',
    },
    6: {
      title: '} (Closing Function Scope)',
      explanation:
        'The closing curly brace marks the end of the main() function block. Any local variables created inside main are deallocated here.',
      tip: 'Every opening brace { must have a matching closing brace }.',
    },
  };

  const handleRunStructure = () => {
    setStructureConsoleLines([
      'Hello, World!',
    ]);
  };

  // Compilation pipeline steps
  const pipelineSteps = [
    { name: '1. Source Code', file: 'main.c', desc: 'Raw C source code written by you.' },
    { name: '2. Preprocessor', file: 'main.i', desc: 'Expands #include & #define directives.' },
    { name: '3. Compiler', file: 'main.s', desc: 'Translates C into CPU Assembly instructions.' },
    { name: '4. Assembler', file: 'main.o', desc: 'Converts assembly to machine binary object code.' },
    { name: '5. Linker', file: 'a.out', desc: 'Links standard C library (libc) into final binary.' },
    { name: '6. Executable', file: './hello', desc: 'OS loads binary into RAM & executes on CPU!' },
  ];

  const handleSimulatePipeline = () => {
    if (isCompilingPipeline) return;
    setIsCompilingPipeline(true);
    setActivePipelineStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < pipelineSteps.length) {
        setActivePipelineStep(current);
      } else {
        clearInterval(interval);
        setIsCompilingPipeline(false);
        setStructureConsoleLines((prev) => [
          ...prev,
          '[Pipeline Complete: hello binary generated & executed]',
          'Hello, World!',
        ]);
      }
    }, 700);
  };

  // ==========================================
  // TAB 2: VARIABLES AND DATA TYPES
  // ==========================================
  const [selectedType, setSelectedType] = useState<'int' | 'float' | 'double' | 'char'>('int');
  const [varNameInput, setVarNameInput] = useState<string>('age');
  const [varValueInput, setVarValueInput] = useState<string>('18');
  const [validationError, setValidationError] = useState<string | null>(null);

  const typeDetails = {
    int: { bytes: 4, placeholder: '18', desc: 'Whole integers (e.g. 42, -5, 1000)' },
    float: { bytes: 4, placeholder: '3.14', desc: 'Single-precision floating decimals (e.g. 3.14f)' },
    double: { bytes: 8, placeholder: '3.14159265', desc: 'Double-precision floating decimals (higher precision)' },
    char: { bytes: 1, placeholder: 'A', desc: 'Single ASCII character in single quotes (e.g. \'A\')' },
  };

  const reservedKeywords = new Set([
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int',
    'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct',
    'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'
  ]);

  const validateVarName = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return 'Variable name cannot be blank.';
    if (/^[0-9]/.test(trimmed)) {
      return 'C variables cannot start with a digit (0-9). Start with a letter or an underscore (_).';
    }
    if (/\s/.test(trimmed)) {
      return 'C variables cannot contain spaces. Use camelCase (myAge) or snake_case (my_age).';
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
      return 'C variables can only contain letters (a-z, A-Z), digits (0-9), and underscores (_). Special symbols are not allowed.';
    }
    if (reservedKeywords.has(trimmed.toLowerCase())) {
      return `"${trimmed}" is a reserved C keyword! It cannot be used as an identifier name.`;
    }
    return null;
  };

  // Update validation whenever name changes
  useEffect(() => {
    setValidationError(validateVarName(varNameInput));
  }, [varNameInput]);

  const [allocatedVars, setAllocatedVars] = useState<CustomVariable[]>([
    { id: '1', name: 'age', type: 'int', value: '18', bytes: 4, address: '0x1000' },
    { id: '2', name: 'gpa', type: 'float', value: '3.85', bytes: 4, address: '0x1004' },
    { id: '3', name: 'grade', type: 'char', value: 'A', bytes: 1, address: '0x1008' },
  ]);

  const handleCreateVariable = () => {
    const error = validateVarName(varNameInput);
    if (error) {
      setValidationError(error);
      return;
    }

    // Format value according to type
    let cleanVal = varValueInput.trim();
    if (selectedType === 'char') {
      cleanVal = cleanVal ? cleanVal[0] : 'A';
    } else if (selectedType === 'int') {
      cleanVal = String(parseInt(cleanVal, 10) || 0);
    } else {
      cleanVal = String(parseFloat(cleanVal) || 0.0);
    }

    const nextAddrNum = 4096 + allocatedVars.length * 4;
    const hexAddr = '0x' + nextAddrNum.toString(16);

    const newVar: CustomVariable = {
      id: Date.now().toString(),
      name: varNameInput.trim(),
      type: selectedType,
      value: cleanVal,
      bytes: typeDetails[selectedType].bytes,
      address: hexAddr,
    };

    setAllocatedVars((prev) => [...prev, newVar]);
  };

  const generatedCDeclaration = `${selectedType} ${varNameInput || 'myVar'} = ${
    selectedType === 'char'
      ? `'${varValueInput ? varValueInput[0] : 'A'}'`
      : selectedType === 'float'
      ? `${varValueInput || '0.0'}f`
      : varValueInput || '0'
  };`;

  // ==========================================
  // TAB 3: INPUT & OUTPUT (PRINTF & SCANF)
  // ==========================================
  const [specifierValue, setSpecifierValue] = useState<string>('42');
  const [selectedSpecifier, setSelectedSpecifier] = useState<string>('%d');

  // Compute simulated printf output & mismatch warning
  const formatSpecifierSimulation = () => {
    const val = specifierValue.trim();
    let output = '';
    let warning: string | null = null;

    if (selectedSpecifier === '%d') {
      const num = parseFloat(val);
      if (isNaN(num)) {
        output = '0';
        warning = `⚠️ Passing a non-numeric string to %d causes undefined behavior. C will read raw memory bits as an integer.`;
      } else if (val.includes('.')) {
        output = String(Math.trunc(num));
        warning = `⚠️ Format Mismatch: %d expects an integer, but you provided "${val}" (floating-point). In C, passing a float to %d produces compiler warnings and truncates or misinterprets the memory representation.`;
      } else {
        output = String(Math.round(num));
      }
    } else if (selectedSpecifier === '%f') {
      const num = parseFloat(val);
      if (isNaN(num)) {
        output = '0.000000';
        warning = `⚠️ Value cannot be parsed as a float.`;
      } else {
        output = num.toFixed(6);
      }
    } else if (selectedSpecifier === '%.2f') {
      const num = parseFloat(val);
      if (isNaN(num)) {
        output = '0.00';
      } else {
        output = num.toFixed(2);
      }
    } else if (selectedSpecifier === '%c') {
      if (/^\d+$/.test(val)) {
        const ascii = parseInt(val, 10);
        if (ascii >= 32 && ascii <= 126) {
          output = String.fromCharCode(ascii);
          warning = `Notice: Integer ${ascii} was converted to its ASCII character '${output}'!`;
        } else {
          output = '?';
          warning = `Notice: ${ascii} is outside printable ASCII range (32-126).`;
        }
      } else {
        output = val.length > 0 ? val[0] : ' ';
      }
    } else if (selectedSpecifier === '%s') {
      output = val;
    }

    return { output, warning };
  };

  const { output: simulatedPrintfOutput, warning: printfWarning } = formatSpecifierSimulation();

  // Simulated scanf state
  const [scanfTerminalLines, setScanfTerminalLines] = useState<string[]>([
    'Program started...',
  ]);
  const [scanfAgeValue, setScanfAgeValue] = useState<string>('');
  const [isScanfWaiting, setIsScanfWaiting] = useState<boolean>(true);
  const [allocatedScanfAge, setAllocatedScanfAge] = useState<number | null>(null);

  const scanfCode = `#include <stdio.h>

int main() {
    int age;

    printf("Enter your age: ");
    scanf("%d", &age);

    printf("You entered age: %d\\n", age);
    printf("Next year you will be: %d\\n", age + 1);

    return 0;
}`;

  const handleScanfSubmit = () => {
    const ageNum = parseInt(scanfAgeValue, 10);
    const validAge = isNaN(ageNum) ? 19 : ageNum;

    setAllocatedScanfAge(validAge);
    setIsScanfWaiting(false);
    setScanfTerminalLines([
      'Enter your age: ' + validAge,
      `You entered age: ${validAge}`,
      `Next year you will be: ${validAge + 1}`,
    ]);
  };

  const handleResetScanf = () => {
    setIsScanfWaiting(true);
    setAllocatedScanfAge(null);
    setScanfAgeValue('');
    setScanfTerminalLines(['Program started...']);
  };

  // ==========================================
  // TAB 4: OPERATORS
  // ==========================================
  const [operandA, setOperandA] = useState<number>(7);
  const [operandB, setOperandB] = useState<number>(2);
  const [selectedOperator, setSelectedOperator] = useState<'+' | '-' | '*' | '/' | '%'>('/');

  // Operator result calculation simulating C semantics
  const computeOperatorResult = () => {
    let result = '';
    let explanation = '';
    let hasIntegerDivisionNote = false;

    if (selectedOperator === '+') {
      result = String(operandA + operandB);
      explanation = `Standard addition: ${operandA} + ${operandB} = ${operandA + operandB}`;
    } else if (selectedOperator === '-') {
      result = String(operandA - operandB);
      explanation = `Standard subtraction: ${operandA} - ${operandB} = ${operandA - operandB}`;
    } else if (selectedOperator === '*') {
      result = String(operandA * operandB);
      explanation = `Standard multiplication: ${operandA} * ${operandB} = ${operandA * operandB}`;
    } else if (selectedOperator === '/') {
      if (operandB === 0) {
        result = 'Runtime Error';
        explanation = '💥 Division by zero (SIGFPE Floating point exception). In C, dividing an integer by 0 crashes your program immediately!';
      } else {
        const intDiv = Math.trunc(operandA / operandB);
        result = String(intDiv);
        hasIntegerDivisionNote = true;
        explanation = `In C, integer / integer discards the decimal remainder (truncation towards 0). ${operandA} / ${operandB} = ${intDiv}`;
      }
    } else if (selectedOperator === '%') {
      if (operandB === 0) {
        result = 'Runtime Error';
        explanation = '💥 Modulo by zero error! In C, % by 0 crashes the program.';
      } else {
        const mod = operandA % operandB;
        result = String(mod);
        explanation = `Modulo operator (%) calculates the remainder after integer division: ${operandA} % ${operandB} = ${mod}`;
      }
    }

    return { result, explanation, hasIntegerDivisionNote };
  };

  const operatorInfo = computeOperatorResult();

  // Increment demo state
  const [incA, setIncA] = useState<number>(5);
  const [incB, setIncB] = useState<number>(0);
  const [lastIncAction, setLastIncAction] = useState<string | null>(null);

  const handlePostIncrement = () => {
    const currentA = incA;
    setIncB(currentA);
    setIncA(currentA + 1);
    setLastIncAction(`b = a++; (b received old value ${currentA}, then a incremented to ${currentA + 1})`);
  };

  const handlePreIncrement = () => {
    const newA = incA + 1;
    setIncA(newA);
    setIncB(newA);
    setLastIncAction(`b = ++a; (a incremented to ${newA} first, then b received new value ${newA})`);
  };

  const handleResetIncrement = () => {
    setIncA(5);
    setIncB(0);
    setLastIncAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Module 01</span>
            <span>·</span>
            <span>C Programming Basics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            1. C Basics: Foundations, Memory &amp; Operators
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore program structure, compilation phases, stack memory allocation, printf/scanf I/O, and operator rules.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start md:self-auto shrink-0">
          {[
            { id: 'structure', label: '1. Program Structure' },
            { id: 'variables', label: '2. Variables & Types' },
            { id: 'io', label: '3. Input & Output' },
            { id: 'operators', label: '4. Operators' },
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
      {/* TAB 1: STRUCTURE OF A C PROGRAM */}
      {/* ========================================================================= */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          {/* Controls: Run & Pipeline */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <span>Interactive Anatomy: Click any line to inspect</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Click lines 1 through 6 in the Code Panel to reveal what each statement does in plain words.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleRunStructure}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Program</span>
              </button>

              <button
                onClick={handleSimulatePipeline}
                disabled={isCompilingPipeline}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Build Pipeline</span>
              </button>
            </div>
          </div>

          {/* Compilation Pipeline Animation Row */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>C Compilation Pipeline (gcc main.c -o hello)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isCompilingPipeline
                  ? `Stage ${activePipelineStep + 1} of 6 processing...`
                  : 'Click "Simulate Build Pipeline" to watch'}
              </span>
            </div>

            {/* Pipeline Step Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {pipelineSteps.map((step, idx) => {
                const isActive = activePipelineStep === idx;
                const isPassed = activePipelineStep > idx;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-102'
                        : isPassed
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-mono text-cyan-300 truncate">
                      {step.name}
                    </div>
                    <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                      {step.file}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dual Workbench: Code Panel & Explanation + Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: Code Panel (7 cols) */}
            <div className="lg:col-span-7 h-[380px] sm:h-[420px]">
              <CodePanel
                code={structureCode}
                activeLine={selectedStructureLine}
                fileName="hello_world.c"
                statusTag={`Line ${selectedStructureLine} selected`}
                onLineClick={(line) => setSelectedStructureLine(line)}
              />
            </div>

            {/* Right Column: Line Explanation Card & Console (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Line Explanation Card */}
              <div className="p-4 rounded-xl bg-[#090f1d] border border-cyan-500/30 space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">
                    {structureLineExplanations[selectedStructureLine]?.title || `Line ${selectedStructureLine}`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {structureLineExplanations[selectedStructureLine]?.explanation ||
                    'Click any line in the code editor on the left to see what it does.'}
                </p>
                {structureLineExplanations[selectedStructureLine]?.tip && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400/90 flex items-start gap-1.5">
                    <span className="font-bold">Tip:</span>
                    <span>{structureLineExplanations[selectedStructureLine].tip}</span>
                  </div>
                )}
              </div>

              {/* Console Output */}
              <div className="flex-1 min-h-[190px]">
                <ConsolePanel
                  lines={structureConsoleLines}
                  isComplete={structureConsoleLines.length > 0}
                  command="./hello"
                  onClear={() => setStructureConsoleLines([])}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VARIABLES AND DATA TYPES */}
      {/* ========================================================================= */}
      {activeTab === 'variables' && (
        <div className="space-y-6">
          {/* Variable Builder Controls */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Interactive C Variable Allocator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pick a data type, enter an identifier name and value. See how C validates naming rules and reserves memory slots in RAM.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Type Picker */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Data Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                >
                  <option value="int">int (4 bytes - Whole numbers)</option>
                  <option value="float">float (4 bytes - Decimals)</option>
                  <option value="double">double (8 bytes - High precision)</option>
                  <option value="char">char (1 byte - Single character)</option>
                </select>
              </div>

              {/* Variable Name Input */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Variable Name:</label>
                <input
                  type="text"
                  value={varNameInput}
                  onChange={(e) => setVarNameInput(e.target.value)}
                  placeholder="e.g. age, gpa, grade"
                  className={`w-full bg-slate-900 border font-mono text-xs rounded-lg px-3 py-2 text-slate-100 focus:outline-none ${
                    validationError
                      ? 'border-rose-500/80 focus:border-rose-400 text-rose-200'
                      : 'border-slate-700 focus:border-cyan-400'
                  }`}
                />
              </div>

              {/* Initial Value Input */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-mono text-slate-400">Value:</label>
                <input
                  type="text"
                  value={varValueInput}
                  onChange={(e) => setVarValueInput(e.target.value)}
                  placeholder={typeDetails[selectedType].placeholder}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Create Button */}
              <div className="sm:col-span-3">
                <button
                  onClick={handleCreateVariable}
                  disabled={!!validationError}
                  className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Variable</span>
                </button>
              </div>
            </div>

            {/* Validation Feedback & Matching Declaration Line */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {validationError ? (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/40 px-3 py-1.5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Valid C Identifier Name!</span>
                </div>
              )}

              {/* C Declaration Code Preview */}
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-slate-500">C Source:</span>
                <span className="text-emerald-400 font-semibold">{generatedCDeclaration}</span>
              </div>
            </div>
          </div>

          {/* Allocated RAM Memory Boxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Simulated RAM Memory Layout (Stack Frame)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Notice how each data type occupies an exact number of bytes and increments memory addresses.
                </p>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                {allocatedVars.length} Variables in RAM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {allocatedVars.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl bg-[#090f1d] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-cyan-300 font-bold text-sm">{v.name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                        {v.type} ({v.bytes} {v.bytes === 1 ? 'byte' : 'bytes'})
                      </span>
                    </div>

                    {/* Stored Value */}
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center font-mono">
                      <div className="text-xl font-bold text-slate-100">
                        {v.type === 'char' ? `'${v.value}'` : v.value}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {v.type === 'char'
                          ? `ASCII Code: ${v.value.charCodeAt(0) || 65}`
                          : `Stored in ${v.bytes * 8} bits`}
                      </div>
                    </div>
                  </div>

                  {/* Memory Address & Delete */}
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-emerald-400">{v.address}</span>
                    <button
                      onClick={() => setAllocatedVars((prev) => prev.filter((item) => item.id !== v.id))}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                      title="Deallocate variable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Note on typical sizes */}
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note on Data Sizes:</strong> While C allows compilers on different chip architectures to choose exact byte widths, the typical sizes on modern 32-bit/64-bit systems are: <code className="text-cyan-300">char = 1 byte</code>, <code className="text-cyan-300">int = 4 bytes</code>, <code className="text-cyan-300">float = 4 bytes</code>, <code className="text-cyan-300">double = 8 bytes</code>.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INPUT AND OUTPUT (PRINTF AND SCANF) */}
      {/* ========================================================================= */}
      {activeTab === 'io' && (
        <div className="space-y-6">
          {/* Part A: Format Specifier Playground */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Part 1: Format Specifier Playground (printf)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Test how printf formats values in memory using specifiers like %d, %f, %.2f, %c, and %s. Try entering a decimal with %d to see what happens on mismatch!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* Value Input */}
              <div className="md:col-span-5 space-y-1">
                <label className="text-xs font-mono text-slate-400">Value to Print:</label>
                <input
                  type="text"
                  value={specifierValue}
                  onChange={(e) => setSpecifierValue(e.target.value)}
                  placeholder="e.g. 42, 3.14, A, 3.5"
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Specifier Buttons */}
              <div className="md:col-span-7 space-y-1">
                <label className="text-xs font-mono text-slate-400">Format Specifier:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { spec: '%d', label: '%d (int)' },
                    { spec: '%f', label: '%f (float)' },
                    { spec: '%.2f', label: '%.2f (2 decimals)' },
                    { spec: '%c', label: '%c (char)' },
                    { spec: '%s', label: '%s (string)' },
                  ].map((item) => (
                    <button
                      key={item.spec}
                      onClick={() => setSelectedSpecifier(item.spec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedSpecifier === item.spec
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Quick Tests:</span>
              {[
                { label: 'Integer 42 (%d)', val: '42', spec: '%d' },
                { label: 'Pi 3.14159 (%f)', val: '3.14159', spec: '%f' },
                { label: 'Currency 19.99 (%.2f)', val: '19.99', spec: '%.2f' },
                { label: 'Char 65 (%c)', val: '65', spec: '%c' },
                { label: 'Mismatch: 3.5 with %d', val: '3.5', spec: '%d' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpecifierValue(p.val);
                    setSelectedSpecifier(p.spec);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Simulated C printf call & Console output */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-slate-400">
                <span className="text-cyan-400">printf</span>(
                <span className="text-lime-300">"Value: {selectedSpecifier}\\n"</span>, {specifierValue}
                );
              </div>

              <div className="p-2.5 rounded bg-[#03060c] border border-slate-800/80 flex items-center justify-between text-emerald-400">
                <span className="font-bold">➔ Terminal Output: Value: {simulatedPrintfOutput}</span>
                <span className="text-[10px] text-slate-500">stdout</span>
              </div>

              {printfWarning && (
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs font-sans">
                  {printfWarning}
                </div>
              )}
            </div>
          </div>

          {/* Part B: Simulated scanf */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Part 2: Simulated scanf (Interactive Terminal Input)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Type your age directly in the terminal console below to see how scanf reads user input into memory.
                </p>
              </div>

              <button
                onClick={handleResetScanf}
                className="flex items-center gap-1 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Dual Workbench: C Code Panel & Terminal Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* C Code Panel */}
              <div className="lg:col-span-7 h-[360px]">
                <CodePanel
                  code={scanfCode}
                  activeLine={isScanfWaiting ? 7 : 9}
                  fileName="user_input.c"
                  statusTag={isScanfWaiting ? 'Waiting for scanf()' : 'Executed'}
                  annotation={
                    isScanfWaiting
                      ? 'scanf("%d", &age) waiting for stdin'
                      : 'Output generated successfully'
                  }
                />
              </div>

              {/* Console with Interactive input prompt */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="h-[240px]">
                  <ConsolePanel
                    lines={scanfTerminalLines}
                    command="./user_input"
                    inputPrompt={isScanfWaiting ? 'Enter your age: ' : undefined}
                    inputValue={scanfAgeValue}
                    onInputChange={(v) => setScanfAgeValue(v)}
                    onInputSubmit={handleScanfSubmit}
                    inputPlaceholder="e.g. 19"
                    isComplete={!isScanfWaiting}
                  />
                </div>

                {/* Stack RAM Slot for age */}
                <div className="p-3 bg-[#090f1d] border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Variable: int age</span>
                    <span className="text-cyan-400">addr: 0x7ffd98</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Value in RAM:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {allocatedScanfAge !== null ? allocatedScanfAge : '? (Uninitialized garbage)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* The & (Address-Of) Explainer Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>Why is the '&' (Address-Of) operator required in scanf?</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In C, functions receive arguments <strong>by value (a copy)</strong>. If you wrote <code className="text-rose-300 font-mono">scanf("%d", age)</code>, scanf would receive a copy of whatever random garbage was in age, and couldn't update the original variable! By adding the <strong className="text-emerald-400 font-mono">&amp;</strong> symbol (<code className="text-emerald-300 font-mono">&amp;age</code>), you pass the <strong>memory address</strong> of age. scanf then walks directly to that slot in RAM and stores the typed number there.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OPERATORS */}
      {/* ========================================================================= */}
      {activeTab === 'operators' && (
        <div className="space-y-6">
          {/* Part A: Operator Calculator */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Part 1: C Arithmetic Calculator (Integer Division Simulator)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter two operands and select an operator. Notice how C integer division discards fractions!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Operand A */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Operand A (int):</label>
                <input
                  type="number"
                  value={operandA}
                  onChange={(e) => setOperandA(parseInt(e.target.value, 10) || 0)}
                  className="w-28 bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Operator Buttons */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Operator:</label>
                <div className="flex items-center gap-1.5">
                  {(['+', '-', '*', '/', '%'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setSelectedOperator(op)}
                      className={`w-9 h-9 rounded-lg font-mono text-sm font-bold transition-all ${
                        selectedOperator === op
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operand B */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Operand B (int):</label>
                <input
                  type="number"
                  value={operandB}
                  onChange={(e) => setOperandB(parseInt(e.target.value, 10) || 0)}
                  className="w-28 bg-slate-900 border border-slate-700 font-mono text-xs rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Result Badge */}
              <div className="space-y-1 ml-auto">
                <label className="text-xs font-mono text-slate-400">C Result:</label>
                <div className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-base font-bold">
                  {operandA} {selectedOperator} {operandB} = {operatorInfo.result}
                </div>
              </div>
            </div>

            {/* Explanation card */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
              {operatorInfo.explanation}
            </div>

            {/* Integer Division Comparison Note */}
            {operatorInfo.hasIntegerDivisionNote && operandB !== 0 && (
              <div className="p-3.5 bg-[#091122] border border-cyan-800/60 rounded-lg text-xs space-y-2">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Integer Division vs Float Division Comparison:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-amber-300">{operandA} / {operandB} = {Math.trunc(operandA / operandB)}</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      int / int ➔ int. Fractions are completely discarded (truncated toward zero).
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400">{operandA}.0 / {operandB} = {(operandA / operandB).toFixed(2)}</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      double / int ➔ double. Adding .0 forces floating-point division!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Part B: Pre-Increment vs Post-Increment Demo */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Part 2: Pre-Increment (++a) vs Post-Increment (a++)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Watch how the order of operation changes whether b receives the old value or the new incremented value.
                </p>
              </div>

              <button
                onClick={handleResetIncrement}
                className="flex items-center gap-1 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to a=5, b=0</span>
              </button>
            </div>

            {/* Interactive Test Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePostIncrement}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono font-medium rounded-lg text-xs transition-colors"
              >
                Test Post-Increment: b = a++;
              </button>

              <button
                onClick={handlePreIncrement}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-mono font-medium rounded-lg text-xs transition-colors"
              >
                Test Pre-Increment: b = ++a;
              </button>
            </div>

            {/* Visual RAM memory slots for a and b */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs font-mono text-cyan-400 font-bold">int a</span>
                <div className="text-3xl font-mono font-bold text-slate-100">{incA}</div>
                <span className="text-[10px] text-slate-500 font-mono">Address: 0x7ffd01</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold">int b</span>
                <div className="text-3xl font-mono font-bold text-slate-100">{incB}</div>
                <span className="text-[10px] text-slate-500 font-mono">Address: 0x7ffd05</span>
              </div>
            </div>

            {lastIncAction && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-xs text-cyan-300 font-mono">
                {lastIncAction}
              </div>
            )}

            {/* Rules table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
                <strong className="text-cyan-300 font-mono">Post-Increment (a++):</strong>
                <p className="text-slate-300">
                  <em>"Use old value first, then increment."</em> The expression evaluates using a's current value, and only then is a incremented by 1.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
                <strong className="text-emerald-400 font-mono">Pre-Increment (++a):</strong>
                <p className="text-slate-300">
                  <em>"Increment first, then use new value."</em> a is immediately incremented by 1, and the expression evaluates to the updated value.
                </p>
              </div>
            </div>
          </div>

          {/* Part C: = vs == Explainer Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#091022] to-[#0e162b] border border-cyan-900/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>C Trap Alert: Assignment (=) vs Equality Comparison (==)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold font-mono text-sm">= (Single Equals: Assignment)</span>
                <p className="text-slate-300">
                  Used to <strong>assign a value</strong> into a variable: <code className="text-cyan-300 font-mono">x = 10;</code>
                </p>
                <div className="p-2 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300 text-[11px]">
                  ⚠️ Danger: Writing <code className="font-mono">if (x = 5)</code> in C assigns 5 to x, which is non-zero, making the if branch ALWAYS TRUE!
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-emerald-400 font-bold font-mono text-sm">== (Double Equals: Comparison)</span>
                <p className="text-slate-300">
                  Used to <strong>compare two values</strong>: <code className="text-cyan-300 font-mono">if (x == 10)</code>
                </p>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 text-[11px]">
                  ✓ Correct: Returns 1 (True) if both sides match, or 0 (False) if they differ. Never mutates variables.
                </div>
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
              {isCompleted ? 'Module 1: C Basics Completed!' : 'Finished Exploring C Basics?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Excellent work! You understand structure, RAM types, printf/scanf, and operators.'
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
            {isCompleted ? '✓ Completed (Click to Toggle)' : 'Mark Module 1 as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
