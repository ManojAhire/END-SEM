import axios from 'axios';
import type { NewsArticle, NewsCategory } from '../types';

// The Guardian Open API supports CORS — call directly from browser
// Free "test" API key works for development with no registration
const GUARDIAN_BASE = '/api/guardian';
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'test';

const SECTION_MAP: Record<NewsCategory, string> = {
  general: 'world',
  technology: 'technology',
  science: 'science',
  business: 'business',
  sports: 'sport',
};

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  general: 'General',
  technology: 'Technology',
  science: 'Science',
  business: 'Business',
  sports: 'Sports',
};

function toArticle(item: any, category: NewsCategory): NewsArticle {
  const fields = item.fields || {};
  return {
    id: item.id,
    title: fields.headline || item.webTitle,
    source: 'The Guardian',
    author: fields.byline || 'Guardian Staff',
    date: item.webPublicationDate,
    imageUrl:
      fields.thumbnail ||
      `https://source.unsplash.com/800x450/?${encodeURIComponent(CATEGORY_LABELS[category])}`,
    description: fields.trailText || 'Click to read the full article.',
    url: item.webUrl,
    category,
  };
}

export async function fetchNews(category: NewsCategory, page = 1): Promise<NewsArticle[]> {
  const section = SECTION_MAP[category];
  const { data } = await axios.get(`${GUARDIAN_BASE}/search`, {
    params: {
      section,
      'api-key': API_KEY,
      'show-fields': 'headline,byline,trailText,thumbnail',
      'page-size': 10,
      page,
      'order-by': 'newest',
    },
  });
  const results: any[] = data.response?.results ?? [];
  return results.map((item) => toArticle(item, category));
}

// localStorage cache helpers
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export function getCachedNews(category: NewsCategory): NewsArticle[] | null {
  try {
    const raw = localStorage.getItem(`news_${category}`);
    if (!raw) return null;
    const { articles, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return articles;
  } catch {
    return null;
  }
}

export function setCachedNews(category: NewsCategory, articles: NewsArticle[]) {
  try {
    localStorage.setItem(`news_${category}`, JSON.stringify({ articles, ts: Date.now() }));
  } catch {}
}
