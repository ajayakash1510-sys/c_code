import React from 'react';
import {
  Home,
  Terminal,
  GitFork,
  Repeat,
  Cpu,
  CheckSquare,
  Sparkles,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  Bot,
  Trophy
} from 'lucide-react';
import { ModuleId } from '../types';
import { MODULES_DATA } from '../data/modulesData';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  completedModules: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenOnMobile,
  onCloseMobile,
  completedModules,
}) => {
  const getIcon = (iconName: string, active: boolean) => {
    const className = `w-4 h-4 shrink-0 transition-colors ${
      active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
    }`;
    switch (iconName) {
      case 'Terminal':
        return <Terminal className={className} />;
      case 'GitFork':
        return <GitFork className={className} />;
      case 'Repeat':
        return <Repeat className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'CheckSquare':
        return <CheckSquare className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  const navItems = [
    {
      id: 'home' as ModuleId,
      number: '0',
      title: 'Home',
      shortTitle: 'Home',
      icon: <Home className={`w-4 h-4 shrink-0 ${currentModule === 'home' ? 'text-cyan-400' : 'text-slate-400'}`} />,
      status: 'active',
      badge: 'Welcome'
    },
    ...MODULES_DATA.map((m) => ({
      id: m.id,
      number: m.number,
      title: m.title,
      shortTitle: m.shortTitle,
      icon: getIcon(m.icon, currentModule === m.id),
      status: m.status,
      badge: m.status === 'active' ? 'Interactive Lab' : 'Coming soon',
    }))
  ];

  const totalCurriculum = MODULES_DATA.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalCurriculum) * 100);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080d1a] border-r border-slate-800/80 text-slate-300 w-72 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            &lt;C/&gt;
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>C Code Lab</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Computer Eng. First Year</p>
          </div>
        </div>
      </div>

      {/* Engineering Focus Sub-pill */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>Cybersecurity &amp;</span>
        <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-0.5" />
        <span>AI/ML Track</span>
      </div>

      {/* Module Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-mono text-slate-500 px-3 py-1 font-semibold">
          Curriculum Modules
        </div>

        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          const isDone = completedModules.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full text-left group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900/90 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.icon}
                <span className="truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isDone && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono">
                    ✓ Done
                  </span>
                )}

                {item.status === 'active' && !isDone && (
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                    Live
                  </span>
                )}

                {item.status === 'coming_soon' && (
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}

                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </div>
            </button>
          );
        })}

        {completedCount >= 5 && (
          <button
            onClick={() => {
              onSelectModule('celebration');
              onCloseMobile();
            }}
            className={`w-full text-left group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === 'celebration'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-amber-400 hover:text-amber-200 hover:bg-slate-900/60 border border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate font-bold">Celebration Screen</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">
              100%
            </span>
          </button>
        )}
      </div>

      {/* Lab Progress Widget in Sidebar */}
      <div className="p-3.5 m-3 rounded-xl bg-[#0d1627] border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lab Progress</span>
          </span>
          <span className="font-mono text-cyan-400 text-xs font-bold">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] text-slate-400 leading-tight">
          {completedCount === 0
            ? 'Complete Module 1 (Basics) or Module 2 (Decisions) to level up!'
            : `${completedCount} of ${totalCurriculum} modules completed.`}
        </p>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>No real compiler needed</span>
        <span className="font-mono text-cyan-400/80">JS Visual Engine</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenOnMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative z-10 w-72 h-full max-w-[85vw] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
