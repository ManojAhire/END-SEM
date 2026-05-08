import { useState, useMemo, useEffect } from 'react';
import { NewsCard } from './NewsCard';
import { CategoryTabs } from './CategoryTabs';
import type { NewsArticle, NewsCategory } from '../../types';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorCard } from '../ui/ErrorCard';
import { Search, ArrowUpDown } from 'lucide-react';

interface NewsGridProps {
  articlesByCategory: Partial<Record<NewsCategory, NewsArticle[]>>;
  loading: Partial<Record<NewsCategory, boolean>>;
  errors: Partial<Record<NewsCategory, string>>;
  onLoad: (cat: NewsCategory) => void;
  filterCategory?: NewsCategory | null;
}

type SortKey = 'date' | 'source';

export function NewsGrid({ articlesByCategory, loading, errors, onLoad, filterCategory }: NewsGridProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('general');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('date');

  const displayCategory = filterCategory || activeCategory;
  const articles = articlesByCategory[displayCategory] || [];
  const isLoading = loading[displayCategory];
  const error = errors[displayCategory];

  // Auto-load when switching tabs
  const handleChange = (cat: NewsCategory) => {
    setActiveCategory(cat);
    if (!articlesByCategory[cat]) onLoad(cat);
  };

  const handleRefresh = (cat: NewsCategory) => onLoad(cat);

  const filtered = useMemo(() => {
    let list = [...articles];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    if (sort === 'date') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      list.sort((a, b) => a.source.localeCompare(b.source));
    }
    return list;
  }, [articles, search, sort]);

  // Load general on mount
  useEffect(() => { onLoad('general'); }, []);

  return (
    <div className="space-y-4">
      <CategoryTabs
        active={filterCategory || activeCategory}
        onChange={handleChange}
        onRefresh={handleRefresh}
        loading={!!isLoading}
      />

      {/* Search + Sort */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-slate-400 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm dark:bg-white/5 bg-gray-100 dark:text-white text-gray-900 dark:placeholder-slate-500 placeholder-gray-400 border border-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setSort((s) => (s === 'date' ? 'source' : 'date'))}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm dark:bg-white/5 bg-gray-100 dark:text-slate-300 text-gray-600 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort: {sort === 'date' ? 'Date' : 'Source'}
        </button>
      </div>

      {/* Grid */}
      {isLoading && !articles.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {error && !articles.length && (
        <ErrorCard message={error} onRetry={() => onLoad(displayCategory)} />
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-16 dark:text-slate-400 text-gray-500">
          {search ? 'No articles match your search.' : 'No articles loaded yet.'}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
