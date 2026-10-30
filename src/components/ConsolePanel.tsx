import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface ConsolePanelProps {
  lines: string[];
  isRunning?: boolean;
  isComplete?: boolean;
  onClear?: () => void;
  title?: string;
  command?: string;
  inputPrompt?: string;
  inputValue?: string;
  onInputChange?: (val: string) => void;
  onInputSubmit?: () => void;
  inputPlaceholder?: string;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  lines,
  isRunning = false,
  isComplete = false,
  onClear,
  title = 'Terminal Output (stdout)',
  command = './program',
  inputPrompt,
  inputValue = '',
  onInputChange,
  onInputSubmit,
  inputPlaceholder,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, inputPrompt]);

  useEffect(() => {
    if (inputPrompt) {
      inputRef.current?.focus();
    }
  }, [inputPrompt]);

  return (
    <div className="flex flex-col h-full bg-[#050811] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b101c] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-slate-200 font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              <span>executing</span>
            </span>
          ) : isComplete ? (
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>return 0 (success)</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">idle</span>
          )}

          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2 py-0.5 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded transition-colors"
              title="Clear terminal output"
            >
              <Trash2 className="w-3 h-3" />
              <span className="text-[11px]">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-3.5 sm:p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-y-auto space-y-1.5 bg-[#03060c]">
        {/* Terminal greeting / command simulation */}
        <div className="text-slate-500 pb-1 border-b border-slate-900 flex items-center gap-1 text-[11px]">
          <span className="text-emerald-500 font-bold">$</span>
          <span className="text-slate-400">gcc -Wall main.c -o program && {command}</span>
        </div>

        {lines.length === 0 && !inputPrompt ? (
          <div className="py-6 text-center text-slate-600 italic select-none">
            <p className="text-xs">Program has not produced stdout yet.</p>
            <p className="text-[11px] text-slate-700 mt-1">
              Adjust parameters or press Step / Run to execute the simulation.
            </p>
          </div>
        ) : (
          lines.map((line, index) => (
            <div key={index} className="flex items-start gap-2 text-emerald-400 leading-snug">
              <ArrowRight className="w-3 h-3 mt-1 text-slate-600 shrink-0" />
              <span className="break-all font-mono font-medium">{line}</span>
            </div>
          ))
        )}

        {/* Interactive scanf input prompt */}
        {inputPrompt && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onInputSubmit?.();
            }}
            className="flex flex-wrap items-center gap-2 pt-1.5 pb-1 text-slate-100 font-mono"
          >
            <span className="text-cyan-300 font-semibold">{inputPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder || 'type value & hit Enter'}
              className="bg-slate-900/90 border border-cyan-500/60 focus:border-cyan-400 focus:outline-none text-emerald-300 font-mono text-xs sm:text-sm px-2.5 py-1 rounded shadow-inner min-w-[140px]"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-medium transition-colors"
            >
              Enter ↵
            </button>
          </form>
        )}

        {isComplete && lines.length > 0 && !inputPrompt && (
          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-900/80">
            ----------------------------------------
            <br />
            Process returned 0 (0x0) | execution time : ~0.001 s
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal prompt bottom line */}
      <div className="px-4 py-2 bg-[#080d1a] border-t border-slate-800/60 text-slate-400 text-xs font-mono flex items-center gap-2">
        <span className="text-cyan-400 font-bold">$</span>
        <span className="text-slate-500">c-lab-env:~</span>
        <span className="w-2 h-4 bg-cyan-400/80 inline-block animate-pulse" />
      </div>
    </div>
  );
};
