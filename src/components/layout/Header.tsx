import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Satellite, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onRefreshISS: () => void;
  lastUpdated: Date | null;
}

export function Header({ onRefreshISS, lastUpdated }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 dark:bg-space-950/80 bg-white/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-space-950 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold dark:text-white text-gray-900 truncate">
              ISS <span className="text-cyan-500">&amp;</span> News Dashboard
            </h1>
            <p className="text-xs dark:text-slate-400 text-gray-500 hidden sm:block">
              Real-Time Tracking
            </p>
          </div>
        </div>

        {/* Center: live clock */}
        <div className="hidden md:flex items-center gap-2 dark:text-slate-300 text-gray-600 font-mono text-sm">
          <Clock className="w-4 h-4 text-cyan-500" />
          {time.toUTCString().replace('GMT', 'UTC')}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {lastUpdated && (
            <span className="hidden sm:block text-xs dark:text-slate-500 text-gray-400">
              ISS: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefreshISS}
            title="Refresh ISS"
            className="p-2 rounded-lg dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 dark:text-slate-300 text-gray-600" />
          </button>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2 rounded-lg dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-violet-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
