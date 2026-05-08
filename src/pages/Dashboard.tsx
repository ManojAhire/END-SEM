import { useState } from 'react';
import { useISS } from '../hooks/useISS';
import { useNews } from '../hooks/useNews';
import { ISSMap } from '../components/iss/ISSMap';
import { ISSStats } from '../components/iss/ISSStats';
import { PeopleInSpace } from '../components/iss/PeopleInSpace';
import { SpeedChart } from '../components/charts/SpeedChart';
import { NewsDonut } from '../components/charts/NewsDonut';
import { NewsGrid } from '../components/news/NewsGrid';
import { ChatWidget } from '../components/chatbot/ChatWidget';
import { Header } from '../components/layout/Header';
import { DashboardProvider } from '../context/DashboardContext';
import type { NewsCategory } from '../types';
import { Satellite, Newspaper, Activity } from 'lucide-react';

export default function Dashboard() {
  const { data: issData, people, refresh } = useISS();
  const { articlesByCategory, loading, errors, loadCategory, allArticles } = useNews();
  const [donutFilter, setDonutFilter] = useState<NewsCategory | null>(null);

  return (
    <DashboardProvider issData={issData} allArticles={allArticles}>
      <div className="min-h-screen dark:bg-space-950 bg-gray-50 font-sans">
        {/* Animated background stars */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 dark:block hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <Header onRefreshISS={refresh} lastUpdated={issData.lastUpdated} />

          <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">

            {/* ── SECTION 1: ISS TRACKING ────────────────────────────── */}
            <section id="iss-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Satellite className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-lg font-bold dark:text-white text-gray-900">
                  ISS Live Tracking
                </h2>
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium ml-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  LIVE · updates every 15s
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Map — takes 2/3 */}
                <div className="xl:col-span-2 space-y-4">
                  <ISSMap data={issData} />
                  <ISSStats data={issData} />
                </div>

                {/* Right sidebar */}
                <div className="space-y-4">
                  <PeopleInSpace data={people} />

                  {/* Speed Chart */}
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-semibold dark:text-white text-gray-900">
                        Speed History
                      </h3>
                      <span className="ml-auto text-xs dark:text-slate-400 text-gray-500">
                        Last {issData.speedHistory.length} readings
                      </span>
                    </div>
                    <SpeedChart speedHistory={issData.speedHistory} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 2: NEWS + CHARTS ────────────────────────────── */}
            <section id="news-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-violet-500/10">
                  <Newspaper className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-lg font-bold dark:text-white text-gray-900">
                  News Dashboard
                </h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Donut chart */}
                <div className="xl:col-span-1">
                  <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-3">
                      News Distribution
                    </h3>
                    <NewsDonut
                      articles={allArticles}
                      onCategoryClick={setDonutFilter}
                      activeCategory={donutFilter}
                    />
                    {donutFilter && (
                      <button
                        onClick={() => setDonutFilter(null)}
                        className="w-full mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        ✕ Clear filter
                      </button>
                    )}
                  </div>
                </div>

                {/* News grid */}
                <div className="xl:col-span-3">
                  <NewsGrid
                    articlesByCategory={articlesByCategory}
                    loading={loading}
                    errors={errors}
                    onLoad={loadCategory}
                    filterCategory={donutFilter}
                  />
                </div>
              </div>
            </section>

          </main>
        </div>

        {/* Floating AI Chatbot */}
        <ChatWidget issData={issData} articles={allArticles} people={people} />
      </div>
    </DashboardProvider>
  );
}
