// ISS position and tracking types
export interface ISSPosition {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface ISSData {
  position: ISSPosition;
  speed: number;
  altitude: number;
  trajectory: ISSPosition[];
  speedHistory: { time: string; speed: number }[];
  locationName: string;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface Astronaut {
  name: string;
  craft: string;
}

export interface PeopleInSpaceData {
  number: number;
  people: Astronaut[];
  loading: boolean;
  error: string | null;
}

// News types
export type NewsCategory = 'general' | 'technology' | 'science' | 'business' | 'sports';

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  author: string;
  date: string;
  imageUrl: string;
  description: string;
  url: string;
  category: NewsCategory;
}

export interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Theme
export type Theme = 'dark' | 'light';
