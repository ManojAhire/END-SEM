import { useState, useCallback } from 'react';
import { fetchNews, getCachedNews, setCachedNews } from '../services/newsApi';
import type { NewsArticle, NewsCategory } from '../types';
import toast from 'react-hot-toast';

export function useNews() {
  const [articlesByCategory, setArticlesByCategory] = useState<
    Partial<Record<NewsCategory, NewsArticle[]>>
  >({});
  const [loading, setLoading] = useState<Partial<Record<NewsCategory, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<NewsCategory, string>>>({});

  const loadCategory = useCallback(
    async (category: NewsCategory, forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedNews(category);
        if (cached) {
          setArticlesByCategory((prev) => ({ ...prev, [category]: cached }));
          toast.success(`Loaded ${category} news from cache`, { id: `cache-${category}` });
          return;
        }
      }

      setLoading((prev) => ({ ...prev, [category]: true }));
      setErrors((prev) => ({ ...prev, [category]: undefined }));

      try {
        const articles = await fetchNews(category);
        setCachedNews(category, articles);
        setArticlesByCategory((prev) => ({ ...prev, [category]: articles }));
        if (forceRefresh) toast.success(`${category} news refreshed!`);
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          [category]: err.message || 'Failed to load news',
        }));
        toast.error(`Failed to load ${category} news`);
      } finally {
        setLoading((prev) => ({ ...prev, [category]: false }));
      }
    },
    []
  );

  const allArticles = Object.values(articlesByCategory).flat() as NewsArticle[];

  return { articlesByCategory, loading, errors, loadCategory, allArticles };
}
