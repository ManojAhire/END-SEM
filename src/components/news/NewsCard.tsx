import type { NewsArticle } from '../../types';
import { ExternalLink, Calendar, User, Building2 } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  technology: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  science: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sports: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function NewsCard({ article }: NewsCardProps) {
  const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general;

  return (
    <article className="glass-card overflow-hidden flex flex-col group hover:scale-[1.01] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-space-800 to-space-700 flex-shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${encodeURIComponent(article.id)}/800/450`;
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full border font-medium ${catColor}`}>
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold dark:text-white text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-xs dark:text-slate-400 text-gray-500 line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs dark:text-slate-500 text-gray-400 mt-1">
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{article.author}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {article.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(article.date).toLocaleDateString()}
          </span>
        </div>

        {/* Read more */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold dark:bg-white/5 bg-gray-100 dark:hover:bg-cyan-500/20 hover:bg-cyan-50 dark:text-slate-300 text-gray-700 hover:text-cyan-500 transition-all"
        >
          Read More
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
