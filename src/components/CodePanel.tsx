import React, { useState } from 'react';
import { Copy, Check, FileCode, Sparkles } from 'lucide-react';
import { tokenizeCCode } from '../utils/cTokenizer';
import { SyntaxTokenType } from '../types';

interface CodePanelProps {
  code: string;
  activeLine?: number | null;
  highlightedLines?: number[];
  fileName?: string;
  statusTag?: string;
  annotation?: string;
  readOnly?: boolean;
  onLineClick?: (lineNumber: number) => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  activeLine = null,
  highlightedLines = [],
  fileName = 'main.c',
  statusTag,
  annotation,
  onLineClick,
}) => {
  const [copied, setCopied] = useState(false);
  const codeLines = tokenizeCCode(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const getTokenColor = (type: SyntaxTokenType): string => {
    switch (type) {
      case 'keyword':
        return 'text-cyan-400 font-semibold';
      case 'type':
        return 'text-emerald-400 font-medium';
      case 'string':
        return 'text-lime-300';
      case 'number':
        return 'text-amber-300 font-mono';
      case 'comment':
        return 'text-slate-400 italic';
      case 'preprocessor':
        return 'text-fuchsia-400 font-medium';
      case 'function':
        return 'text-sky-300 font-medium';
      case 'operator':
        return 'text-cyan-300 font-bold';
      case 'punctuation':
        return 'text-slate-300';
      case 'label':
        return 'text-amber-400 font-semibold';
      case 'variable':
        return 'text-slate-100';
      default:
        return 'text-slate-200';
    }
  };

  const keywordTooltips: Record<string, string> = {
    int: 'Type: 4-byte whole number integer (e.g. 42, -5)',
    float: 'Type: 4-byte single-precision decimal number',
    double: 'Type: 8-byte high-precision decimal number',
    char: 'Type: 1-byte single ASCII character (e.g. \'A\')',
    printf: 'Function: prints formatted text to the terminal stdout',
    scanf: 'Function: reads formatted input from keyboard stdin using &address',
    for: 'Loop: repeats with (init; condition; update)',
    while: 'Loop: entry-controlled, checks condition before running body',
    do: 'Loop: exit-controlled, runs body first then checks condition at end',
    break: 'Jump: immediately terminates the current loop or switch',
    continue: 'Jump: skips rest of current round and jumps to counter update',
    return: 'Return: exits function and returns status code (0 = success) to OS',
    if: 'Condition: executes block if expression evaluates to non-zero (True)',
    else: 'Condition: fallback block executed when if condition is zero (False)',
    switch: 'Branch: jump table matching variable to case constant labels',
    case: 'Branch: jump target inside switch statement',
    default: 'Branch: default fallback inside switch if no case matches',
  };

  return (
    <div className="flex flex-col h-full bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Code Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1627] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          {/* Editor window dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#090f1d] border border-slate-700/80 rounded-md text-slate-200 font-mono font-medium">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{fileName}</span>
            <span className="text-[10px] text-cyan-400 font-normal ml-1">C99</span>
          </div>
        </div>

        {/* Right tools: Status indicator & Copy */}
        <div className="flex items-center gap-3">
          {statusTag && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-md font-mono">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{statusTag}</span>
            </span>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
            title="Copy C source code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Canvas with Line Numbers */}
      <div className="flex-1 overflow-auto p-2 sm:p-3 font-mono text-xs sm:text-sm leading-relaxed bg-[#070b14]">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line) => {
              const isActive = activeLine === line.lineNumber;
              const isHighlighted = highlightedLines.includes(line.lineNumber);

              return (
                <tr
                  key={line.lineNumber}
                  onClick={() => onLineClick?.(line.lineNumber)}
                  className={`transition-colors duration-150 ${
                    onLineClick ? 'cursor-pointer' : ''
                  } ${
                    isActive
                      ? 'bg-cyan-500/15 border-l-2 border-cyan-400 shadow-inner'
                      : isHighlighted
                      ? 'bg-emerald-500/10'
                      : onLineClick
                      ? 'hover:bg-slate-800/60'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Line indicator icon & Line Number */}
                  <td className="w-10 sm:w-12 py-0.5 select-none text-right pr-3 font-mono text-[11px] sm:text-xs">
                    <div className="flex items-center justify-end gap-1">
                      {isActive && (
                        <span className="text-cyan-400 text-[10px] font-bold animate-pulse">▶</span>
                      )}
                      <span
                        className={
                          isActive
                            ? 'text-cyan-300 font-bold'
                            : isHighlighted
                            ? 'text-emerald-400'
                            : 'text-slate-600'
                        }
                      >
                        {line.lineNumber}
                      </span>
                    </div>
                  </td>

                  {/* Code Tokens */}
                  <td className="py-0.5 pl-2 pr-4 whitespace-pre font-mono">
                    <span className="inline-block">
                      {line.tokens.map((token, idx) => {
                        const tip = keywordTooltips[token.text.trim()];
                        return (
                          <span
                            key={idx}
                            className={`${getTokenColor(token.type)} ${
                              tip ? 'underline decoration-dotted decoration-cyan-500/40 cursor-help' : ''
                            }`}
                            title={tip}
                          >
                            {token.text}
                          </span>
                        );
                      })}
                    </span>

                    {/* Active Line Explainer Annotation */}
                    {isActive && annotation && (
                      <span className="ml-4 inline-flex items-center text-[10px] sm:text-xs font-sans text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded shadow-sm">
                        {annotation}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer bar showing line summary */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090f1d] border-t border-slate-800 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>{codeLines.length} lines</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          {activeLine ? (
            <span className="text-cyan-400 font-medium">Line {activeLine} active</span>
          ) : (
            <span className="text-slate-500">Ready</span>
          )}
        </div>
      </div>
    </div>
  );
};
