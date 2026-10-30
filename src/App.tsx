import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  GitFork,
  Terminal,
  Repeat,
  Cpu,
  CheckSquare,
  Trophy,
  Flame,
  Award,
  Lightbulb,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ModuleId } from './types';
import { MODULES_DATA } from './data/modulesData';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { BasicsLab } from './components/BasicsLab';
import { DecisionsLab } from './components/DecisionsLab';
import { LoopsLab } from './components/LoopsLab';
import { PatternsLab } from './components/PatternsLab';
import { PracticeLab } from './components/PracticeLab';
import { CelebrationScreen } from './components/CelebrationScreen';

export default function App() {
  const [currentModule, setCurrentModule] = useState<ModuleId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // 1. Progress State (wrapped in try/catch for robust localStorage resilience)
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('c_code_lab_progress');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. XP Gamification State
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('c_code_lab_xp');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  // 3. Badges State
  const [badges, setBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('c_code_lab_badges');
      return saved ? JSON.parse(saved) : ['C Explorer'];
    } catch {
      return ['C Explorer'];
    }
  });

  // 4. "Explain like I'm new" Beginner Toggle
  const [explainLikeImNew, setExplainLikeImNew] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('c_code_lab_explain_new');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Toast / XP notification message
  const [xpNotification, setXpNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('c_code_lab_progress', JSON.stringify(completedModules));
    } catch {
      // storage unavailable
    }
  }, [completedModules]);

  useEffect(() => {
    try {
      localStorage.setItem('c_code_lab_xp', JSON.stringify(xp));
    } catch {
      // storage unavailable
    }
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem('c_code_lab_badges', JSON.stringify(badges));
    } catch {
      // storage unavailable
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('c_code_lab_explain_new', JSON.stringify(explainLikeImNew));
    } catch {
      // storage unavailable
    }
  }, [explainLikeImNew]);

  // Handler to add XP with notification
  const handleAddXp = (points: number, reason: string) => {
    setXp((prev) => prev + points);
    setXpNotification(`+${points} XP: ${reason}`);
    setTimeout(() => {
      setXpNotification(null);
    }, 3500);
  };

  // Handler to unlock a badge
  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      if (!prev.includes(badgeId)) {
        return [...prev, badgeId];
      }
      return prev;
    });
  };

  // Toggle module completion
  const handleToggleComplete = (moduleId: string) => {
    const isAlreadyCompleted = completedModules.includes(moduleId);

    if (!isAlreadyCompleted) {
      // Award +100 XP for completing a module
      handleAddXp(100, `Completed Module ${moduleId.toUpperCase()}!`);

      // Unlock badges based on module
      if (moduleId === 'basics') handleUnlockBadge('C Explorer');
      if (moduleId === 'decisions') handleUnlockBadge('Decision Master');
      if (moduleId === 'loops') {
        handleUnlockBadge('First Loop');
        handleUnlockBadge('Loop Legend');
      }
      if (moduleId === 'patterns') handleUnlockBadge('Pattern Master');
      if (moduleId === 'practice') handleUnlockBadge('Bug Hunter');

      const nextCompleted = [...completedModules, moduleId];
      setCompletedModules(nextCompleted);

      // Check if all 5 modules are complete
      if (nextCompleted.length >= 5) {
        handleUnlockBadge('Code Champion');
        setTimeout(() => {
          setCurrentModule('celebration');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
      }
    } else {
      // Deselect module completion
      setCompletedModules((prev) => prev.filter((id) => id !== moduleId));
    }
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all curriculum progress and XP to start fresh?')) {
      setCompletedModules([]);
      setXp(0);
      setBadges(['C Explorer']);
      try {
        localStorage.removeItem('c_code_lab_progress');
        localStorage.removeItem('c_code_lab_xp');
        localStorage.removeItem('c_code_lab_badges');
      } catch {
        // storage unavailable
      }
      setCurrentModule('home');
    }
  };

  // Find info for current module
  const activeModuleData = MODULES_DATA.find((m) => m.id === currentModule);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col lg:flex-row">
      {/* Toast XP Notification */}
      {xpNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0d1c33] border border-cyan-400 text-cyan-300 font-mono text-xs px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 animate-bounce">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{xpNotification}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(id) => {
          setCurrentModule(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        completedModules={completedModules}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <button
                onClick={() => setCurrentModule('home')}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                C Code Lab
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 font-semibold truncate max-w-[150px] sm:max-w-none">
                {currentModule === 'home'
                  ? 'Home'
                  : currentModule === 'celebration'
                  ? 'Celebration & Badges'
                  : activeModuleData?.title || currentModule}
              </span>
            </div>
          </div>

          {/* Right Tools: Beginner Mode Toggle, Live XP, and Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* "Explain like I'm new" Beginner Toggle */}
            <button
              onClick={() => setExplainLikeImNew(!explainLikeImNew)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all ${
                explainLikeImNew
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle simplified beginner hints throughout the app"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${explainLikeImNew ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span className="hidden md:inline font-medium">Explain like I'm new</span>
              <span className="font-mono text-[11px] font-bold">
                {explainLikeImNew ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* XP Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300">{xp} XP</span>
            </div>

            {/* Completed count badge */}
            {completedModules.length > 0 && (
              <button
                onClick={() => {
                  if (completedModules.length >= 5) {
                    setCurrentModule('celebration');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all ${
                  completedModules.length >= 5
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 hover:bg-amber-900 cursor-pointer'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                }`}
              >
                {completedModules.length >= 5 ? (
                  <>
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>5/5 Complete!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{completedModules.length}/5 Done</span>
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentModule === 'home' && (
            <HomePage
              onStartLearning={() => setCurrentModule('basics')}
              onSelectModule={(id) => setCurrentModule(id)}
              completedModules={completedModules}
              xp={xp}
              badges={badges}
              onViewCelebration={() => setCurrentModule('celebration')}
            />
          )}

          {currentModule === 'basics' && (
            <BasicsLab
              onMarkComplete={() => handleToggleComplete('basics')}
              isCompleted={completedModules.includes('basics')}
            />
          )}

          {currentModule === 'decisions' && (
            <DecisionsLab
              onMarkComplete={() => handleToggleComplete('decisions')}
              isCompleted={completedModules.includes('decisions')}
            />
          )}

          {currentModule === 'loops' && (
            <LoopsLab
              onMarkComplete={() => handleToggleComplete('loops')}
              isCompleted={completedModules.includes('loops')}
            />
          )}

          {currentModule === 'patterns' && (
            <PatternsLab
              onMarkComplete={() => handleToggleComplete('patterns')}
              isCompleted={completedModules.includes('patterns')}
            />
          )}

          {currentModule === 'practice' && (
            <PracticeLab
              onMarkComplete={() => handleToggleComplete('practice')}
              isCompleted={completedModules.includes('practice')}
              xp={xp}
              onAddXp={handleAddXp}
              badges={badges}
              onUnlockBadge={handleUnlockBadge}
              explainLikeImNew={explainLikeImNew}
            />
          )}

          {currentModule === 'celebration' && (
            <CelebrationScreen
              xp={xp}
              badges={badges}
              onSelectModule={(id) => setCurrentModule(id)}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>

        {/* Quiet Minimal Footer */}
        <footer className="border-t border-slate-800/60 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">C Code Lab</span>
            <span>·</span>
            <span>Interactive Visual Simulation for First-Year Engineers</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Standard: C99</span>
            <span>·</span>
            <span className="text-cyan-400">Pure JavaScript Emulation</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
