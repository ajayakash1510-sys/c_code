import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  GitFork,
  Repeat,
  Cpu,
  CheckSquare,
  Shield,
  Brain,
  Code2,
  Clock,
  Compass,
  Trophy,
  Flame,
  Award
} from 'lucide-react';
import { ModuleId } from '../types';
import { MODULES_DATA } from '../data/modulesData';

interface HomePageProps {
  onStartLearning: () => void;
  onSelectModule: (id: ModuleId) => void;
  completedModules: string[];
  xp?: number;
  badges?: string[];
  onViewCelebration?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartLearning,
  onSelectModule,
  completedModules,
  xp = 0,
  badges = [],
  onViewCelebration,
}) => {
  const totalModules = MODULES_DATA.length; // 5 modules
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  const isAllComplete = completedCount >= 5;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'GitFork':
        return <GitFork className="w-5 h-5 text-cyan-400" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-cyan-400" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-10 py-2">
      {/* Celebration Banner if all completed */}
      {isAllComplete && onViewCelebration && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#0d172e] to-cyan-950/60 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0 mx-auto sm:mx-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-200">
                100% Curriculum Completed · Certified C Explorer!
              </h3>
              <p className="text-xs text-slate-300">
                You have mastered all 5 modules with {xp} XP and {badges.length} badges earned.
              </p>
            </div>
          </div>

          <button
            onClick={onViewCelebration}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View Celebration Screen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e172a] via-[#091020] to-[#060a14] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {/* Subtle decorative grid effect in background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Engineering Track Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Computer Engineering Year 1</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Cybersecurity</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-purple-400 font-medium bg-purple-950/60 border border-purple-800/50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>AI &amp; Machine Learning</span>
            </span>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            C Code Lab
          </h1>
          <p className="text-lg sm:text-xl text-cyan-400 font-medium tracking-wide">
            See C code run, one step at a time.
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Never coded before? No problem. C Code Lab visually executes real C code right in front of your eyes using an interactive JavaScript simulation engine. Trace variables in RAM, evaluate branches, and demystify switch fall-through without dealing with compiler errors or setup headaches.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartLearning}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center gap-2 group cursor-pointer"
            >
              <span>Start Learning (Module 1)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onSelectModule('practice')}
              className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>Module 5: Practice &amp; Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Progress Bar Section with XP & Badges */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Completion Progress</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your exploration through the fundamental C programming milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* XP Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-bold">{xp} XP</span>
            </div>

            {/* Badges Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">{badges.length} Badges</span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {completedCount} of {totalModules} modules finished
            </span>

            <span className="font-mono text-cyan-400 text-sm font-bold bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-md">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* The Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            style={{ width: `${Math.max(progressPercent, 0)}%` }}
          />
        </div>
      </div>

      {/* Module Overview Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Curriculum Modules</h2>
            <p className="text-xs text-slate-400">
              Designed for first-year engineers with dedicated Cyber and AI/ML connections.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">5 Live Interactive Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES_DATA.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            const isActive = module.status === 'active';

            return (
              <div
                key={module.id}
                onClick={() => onSelectModule(module.id)}
                className={`group cursor-pointer rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#0d1629] to-[#080e1b] border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                    : 'bg-[#090f1d] border-slate-800 hover:border-slate-700/80 hover:bg-[#0c1424]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                      {getModuleIcon(module.icon)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                          ✓ Completed
                        </span>
                      ) : isActive ? (
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded">
                          Interactive Lab
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/90 mt-0.5 line-clamp-1">
                      {module.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {module.description}
                  </p>

                  {/* Topics bullet list */}
                  <div className="pt-2 border-t border-slate-800/60 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Core Concepts:</div>
                    <ul className="text-[11px] text-slate-400 space-y-0.5">
                      {module.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-cyan-400 text-[10px]">▸</span>
                          <span className="truncate">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{module.estimatedMinutes} mins</span>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold transition-colors">
                    <span>Launch Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beginner Welcome Guide & How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#090f1d] border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>How This Lab Works (Zero Setup Required)</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard C requires installing a compiler like GCC or Clang, configuring paths, and deciphering cryptic terminal errors. In C Code Lab, we display authentic C99 source code and use an interactive JavaScript execution engine to simulate the memory stack, condition evaluations, and console stdout step-by-step.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090f1d] border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Cybersecurity &amp; AI/ML Mindset</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            As a future engineer, understanding C is your superpower. In Cybersecurity, memory layouts and branch validation teach you how attacks happen. In AI/ML, low-level data structures and loops explain how GPU kernels and neural tensors execute with raw speed.
          </p>
        </div>
      </div>
    </div>
  );
};
