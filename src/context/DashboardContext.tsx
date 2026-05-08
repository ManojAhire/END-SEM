import { createContext, useContext, ReactNode } from 'react';
import type { ISSData, NewsArticle } from '../types';

interface DashboardContextValue {
  issData: ISSData | null;
  allArticles: NewsArticle[];
}

export const DashboardContext = createContext<DashboardContextValue>({
  issData: null,
  allArticles: [],
});

export function DashboardProvider({
  children,
  issData,
  allArticles,
}: {
  children: ReactNode;
  issData: ISSData | null;
  allArticles: NewsArticle[];
}) {
  return (
    <DashboardContext.Provider value={{ issData, allArticles }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
