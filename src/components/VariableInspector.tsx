import React from 'react';
import { Database, Binary, HelpCircle } from 'lucide-react';
import { SimulationVariable } from '../types';

interface VariableInspectorProps {
  variables: Record<string, SimulationVariable>;
  conditionEval?: {
    expression: string;
    evaluated: string;
    result: boolean;
  };
  explanation?: string;
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({
  variables,
  conditionEval,
  explanation,
}) => {
  const varList = Object.values(variables);

  return (
    <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Stack Memory & State
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">RAM Simulation</span>
      </div>

      {/* Variables in Memory */}
      <div className="space-y-2">
        <div className="text-[11px] text-slate-400 font-medium">Allocated Variables:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {varList.map((v) => (
            <div
              key={v.name}
              className={`p-2.5 rounded-lg border transition-all ${
                v.status === 'updated'
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-300 font-bold">{v.name}</span>
                <span className="text-[10px] text-slate-500">
                  {v.type} ({v.bytes}B)
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between font-mono">
                <span className="text-lg font-bold text-slate-100">{v.value}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  addr: 0x7ffd..
                </span>
              </div>
              {v.note && (
                <p className="mt-1 text-[11px] text-slate-400 leading-tight font-sans">
                  {v.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Condition Evaluator Box (if present) */}
      {conditionEval && (
        <div className="mt-1 p-2.5 rounded-lg bg-[#070d19] border border-cyan-900/40 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              <span>C Condition Evaluation:</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                conditionEval.result
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950 border border-rose-500/40 text-rose-300'
              }`}
            >
              {conditionEval.result ? 'TRUE (1)' : 'FALSE (0)'}
            </span>
          </div>

          <div className="font-mono text-xs text-slate-300 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-500">{conditionEval.expression}</span>
              <span className="text-cyan-400 mx-2">➔</span>
              <span className="text-amber-300 font-bold">{conditionEval.evaluated}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {conditionEval.result ? 'Branch takes this path' : 'Branch is skipped'}
            </span>
          </div>
        </div>
      )}

      {/* Beginner friendly explanation card */}
      {explanation && (
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="text-cyan-300 font-medium mr-1">What's happening:</span>
            <span>{explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
