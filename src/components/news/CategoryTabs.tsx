import type { NewsCategory } from '../../types';
import { RefreshCw } from 'lucide-react';

const CATEGORIES: { id: NewsCategory; label: string; emoji: string }[] = [
  { id: 'general', label: 'General', emoji: '🌍' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'business', label: 'Business', emoji: '📈' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
];

interface CategoryTabsProps {
  active: NewsCategory;
  onChange: (cat: NewsCategory) => void;
  onRefresh: (cat: NewsCategory) => void;
  loading: boolean;
}

export function CategoryTabs({ active, onChange, onRefresh, loading }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              active === cat.id
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'dark:bg-white/5 bg-gray-100 dark:text-slate-300 text-gray-600 dark:hover:bg-white/10 hover:bg-gray-200'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => onRefresh(active)}
        disabled={loading}
        title="Refresh current category"
        className="ml-auto p-2 rounded-lg dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 dark:text-slate-300 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
