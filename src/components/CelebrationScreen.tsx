import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Brain,
  Layers,
  Code2,
  Bug,
  Repeat
} from 'lucide-react';
import { ModuleId } from '../types';

interface CelebrationScreenProps {
  xp: number;
  badges: string[];
  onSelectModule: (id: ModuleId) => void;
  onResetProgress: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  xp,
  badges,
  onSelectModule,
  onResetProgress,
}) => {
  const allBadges = [
    {
      id: 'C Explorer',
      title: 'C Explorer',
      desc: 'Mastered C structure, preprocessor, and RAM stack memory allocation in Module 1.',
      icon: Code2,
      color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50',
    },
    {
      id: 'Decision Master',
      title: 'Decision Master',
      desc: 'Conquered if/else branching, boundary testing, and switch fall-through in Module 2.',
      icon: Shield,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
    },
    {
      id: 'First Loop',
      title: 'First Loop',
      desc: 'Executed your first iteration cycle and inspected loop counter variables.',
      icon: Repeat,
      color: 'text-blue-400 bg-blue-950/80 border-blue-500/50',
    },
    {
      id: 'Loop Legend',
      title: 'Loop Legend',
      desc: 'Mastered entry vs exit control, dry run tables, and break/continue in Module 3.',
      icon: Flame,
      color: 'text-amber-400 bg-amber-950/80 border-amber-500/50',
    },
    {
      id: 'Pattern Master',
      title: 'Pattern Master',
      desc: 'Solved 2D matrix nested loops and rendered geometric star patterns in Module 4.',
      icon: Layers,
      color: 'text-purple-400 bg-purple-950/80 border-purple-500/50',
    },
    {
      id: 'Bug Hunter',
      title: 'Bug Hunter',
      desc: 'Diagnosed and fixed real-world syntax, pointer, and off-by-one bugs in Module 5.',
      icon: Bug,
      color: 'text-rose-400 bg-rose-950/80 border-rose-500/50',
    },
    {
      id: 'Code Champion',
      title: 'Code Champion',
      desc: 'Completed all 5 curriculum modules and passed the comprehensive Final Quiz.',
      icon: Trophy,
      color: 'text-amber-300 bg-amber-950/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    },
  ];

  const masteredTopics = [
    'C Program Anatomy & Preprocessor Directives (#include <stdio.h>, main(), return 0)',
    'RAM Stack Frame Allocation & Variable Naming Rules (char 1B, int 4B, float 4B, double 8B)',
    'Standard I/O Formatting & Memory Addresses (printf, scanf, %d, %f, &address operator)',
    'Arithmetic & Operators (Integer division truncation 7/2=3, % modulo, a++ vs ++a)',
    'Control Flow Branching (if, else if, else) & Cybersecurity Boundary Validation',
    'Switch Jump Tables, Multi-branch Matching & The Fall-Through Trap without break',
    'Iteration Mechanics: for loops, entry-controlled while, and exit-controlled do-while',
    'Jump Statements: break (immediate exit) vs continue (skip current round)',
    'Nested 2D Coordinates (rows i × columns j) & Star Pattern Logic',
    'Engineering Applications: Security PIN Lockout, Password Entropy Math & AI Training Loops',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f1d38] via-[#091124] to-[#060b18] border border-cyan-500/40 p-8 sm:p-12 text-center shadow-2xl space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/20 via-cyan-400/20 to-emerald-400/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_35px_rgba(6,182,212,0.4)]">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum Completed · 100% Mastery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Congratulations, Engineer!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            You have successfully completed all 5 modules of <strong>C Code Lab</strong>. You now possess a solid mental model of how C code executes line by line, how memory is allocated in RAM, and how loops iterate on the CPU.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto pt-2">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">Total Earned:</span>
            <div className="text-2xl font-bold font-mono text-amber-300 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{xp} XP</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">Modules Finished:</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">5 / 5</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-mono">Badges Unlocked:</span>
            <div className="text-2xl font-bold font-mono text-cyan-300 flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>{badges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Earned Engineering Badges</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {badges.length} of {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allBadges.map((badge) => {
            const isUnlocked = badges.includes(badge.id) || badges.length >= 4;
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? badge.color
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-600 opacity-50'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold font-mono truncate">{badge.title}</div>
                  <p className="text-[11px] leading-tight text-slate-300 line-clamp-2">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastered Topics Summary */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono pb-2 border-b border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Curriculum Mastery Summary</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {masteredTopics.map((topic, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300"
            >
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#090f1d] border border-slate-800">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-200">What would you like to do next?</h4>
          <p className="text-xs text-slate-400">
            Revisit any interactive workbench or start fresh to practice again.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetProgress}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            onClick={() => onSelectModule('home')}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Return to Home Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
