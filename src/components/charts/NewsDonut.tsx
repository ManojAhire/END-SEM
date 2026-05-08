import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { NewsArticle, NewsCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  general: '#00d4ff',
  technology: '#8b5cf6',
  science: '#10b981',
  business: '#f59e0b',
  sports: '#ef4444',
};

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  general: 'General',
  technology: 'Technology',
  science: 'Science',
  business: 'Business',
  sports: 'Sports',
};

interface NewsDonutProps {
  articles: NewsArticle[];
  onCategoryClick?: (cat: NewsCategory | null) => void;
  activeCategory?: NewsCategory | null;
}

export function NewsDonut({ articles, onCategoryClick, activeCategory }: NewsDonutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories: NewsCategory[] = ['general', 'technology', 'science', 'business', 'sports'];
  const counts = categories.map((c) => articles.filter((a) => a.category === c).length);

  const data = {
    labels: categories.map((c) => CATEGORY_LABELS[c]),
    datasets: [
      {
        data: counts,
        backgroundColor: categories.map((c) =>
          activeCategory && activeCategory !== c
            ? CATEGORY_COLORS[c] + '40'
            : CATEGORY_COLORS[c]
        ),
        borderColor: isDark ? '#0a0a1f' : '#f9fafb',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark ? '#94a3b8' : '#6b7280',
          padding: 12,
          font: { size: 11 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f1028' : '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        titleColor: isDark ? '#e2e8f0' : '#1f2937',
        bodyColor: isDark ? '#94a3b8' : '#6b7280',
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} article${ctx.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    onClick: (_: any, elements: any[]) => {
      if (!elements.length) {
        onCategoryClick?.(null);
        return;
      }
      const idx = elements[0].index;
      const cat = categories[idx];
      onCategoryClick?.(activeCategory === cat ? null : cat);
    },
  };

  const total = counts.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center dark:text-slate-400 text-gray-500 text-sm">
        Load news categories to see distribution
      </div>
    );
  }

  return (
    <div className="relative h-[260px]">
      <Doughnut data={data} options={options as any} />
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-16px' }}>
        <span className="text-2xl font-bold dark:text-white text-gray-900">{total}</span>
        <span className="text-xs dark:text-slate-400 text-gray-500">Articles</span>
      </div>
    </div>
  );
}
