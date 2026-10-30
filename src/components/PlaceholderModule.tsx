import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  Code2,
  CheckCircle2,
  Bell,
  Sparkles,
  Shield,
  Bot
} from 'lucide-react';
import { ModuleInfo, ModuleId } from '../types';
import { CodePanel } from './CodePanel';

interface PlaceholderModuleProps {
  module: ModuleInfo;
  onGoToActiveLab: () => void;
  onSelectModule: (id: ModuleId) => void;
}

export const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({
  module,
  onGoToActiveLab,
}) => {
  const [notified, setNotified] = useState(false);

  // Sample upcoming code snippet tailored to the module
  const getPreviewCode = (id: string) => {
    switch (id) {
      case 'basics':
        return `#include <stdio.h>

int main() {
    // Basic variables and memory allocation
    int studentId = 202601;
    float gpa = 3.85;
    char gradeLetter = 'A';

    printf("Welcome to Computer Engineering!\\n");
    printf("ID: %d | GPA: %.2f | Grade: %c\\n", studentId, gpa, gradeLetter);

    return 0;
}`;
      case 'loops':
        return `#include <stdio.h>

int main() {
    // Counter loop: tracing 5 iterations step-by-step
    printf("Starting loop simulation...\\n");

    for (int i = 1; i <= 5; i++) {
        printf("Iteration %d: i = %d (RAM: 0x7ffd)\\n", i, i);
    }

    printf("Loop complete! Condition (i <= 5) evaluated to FALSE.\\n");
    return 0;
}`;
      case 'patterns':
        return `#include <stdio.h>

int main() {
    int rows = 4;

    // Nested loops: Outer loop for rows, inner loop for columns
    for (int r = 1; r <= rows; r++) {
        for (int c = 1; c <= r; c++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`;
      case 'practice':
        return `#include <stdio.h>

int main() {
    int x = 5, y = 10;

    // Mystery Quiz: What will this print?
    if (x > 3 && y++ < 15) {
        printf("Branch A: y is %d\\n", y);
    } else {
        printf("Branch B: y is %d\\n", y);
    }

    return 0;
}`;
      default:
        return `// Coming soon to C Code Lab`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Module {module.number}</span>
          <span>·</span>
          <span>{module.shortTitle}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
          <span>{module.title}</span>
          <span className="text-xs font-mono font-medium text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2.5 py-0.5 rounded-md">
            Coming soon
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {module.tagline}
        </p>
      </div>

      {/* Main Coming Soon Banner Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0e172a] via-[#091020] to-[#060a14] border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span>Lab Module in Development</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Coming soon: Interactive Visual Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 shrink-0">
            <button
              onClick={onGoToActiveLab}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Module 2: Decisions Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setNotified(true)}
              disabled={notified}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                notified
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700/60'
              }`}
            >
              {notified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notification Saved!</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me When Released</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Curriculum Syllabus Breakdown */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>What You Will Learn in This Module</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {module.topics.map((topic, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cyber & AI/ML relevance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {module.cyberConnection && (
            <div className="p-3.5 rounded-lg bg-[#0a1220] border border-cyan-900/40 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Cybersecurity Track Connection</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {module.cyberConnection}
              </p>
            </div>
          )}

          {module.aiMlConnection && (
            <div className="p-3.5 rounded-lg bg-[#0e1022] border border-purple-900/40 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold font-mono text-[11px]">
                <Bot className="w-3.5 h-3.5" />
                <span>AI &amp; Machine Learning Track Connection</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {module.aiMlConnection}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview of the upcoming code workbench */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Upcoming Lab Preview: C Source Snippet</span>
          </span>
          <span>Read-only Preview</span>
        </div>

        <div className="h-[280px]">
          <CodePanel
            code={getPreviewCode(module.id)}
            fileName={`preview_${module.id}.c`}
            statusTag="Coming soon preview"
          />
        </div>
      </div>
    </div>
  );
};
