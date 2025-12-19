'use client';

import { Play, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import VideoEmbed from '@/components/VideoEmbed';

export default function TutorialsPage() {
  const tutorials = [
    {
      id: 'options-basics',
      title: 'Options Trading Basics',
      description: 'Learn the fundamentals of options trading, including calls, puts, and basic terminology.',
      duration: '15 min',
      level: 'Beginner',
      videoId: '8V1xK8JZFOk', // Options Trading for Beginners - InTheMoney
      youtubeSearch: 'options trading basics tutorial beginner',
      topics: ['What are options', 'Calls vs Puts', 'Strike prices', 'Expiration dates', 'Premium pricing'],
    },
    {
      id: 'covered-calls',
      title: 'Covered Call Strategy',
      description: 'Master the covered call strategy to generate income from your stock holdings.',
      duration: '20 min',
      level: 'Beginner',
      videoId: 'q7BoBj8v_hY', // Covered Calls Explained - InTheMoney
      youtubeSearch: 'covered call strategy tutorial how to',
      topics: ['Strategy overview', 'When to use', 'Risk management', 'Real examples', 'Common mistakes'],
    },
    {
      id: 'cash-secured-puts',
      title: 'Cash-Secured Puts',
      description: 'Learn how to use cash-secured puts to buy stocks at a discount or generate income.',
      duration: '18 min',
      level: 'Beginner',
      videoId: 'YhJIDU9vE7k', // Cash Secured Puts Explained - InTheMoney
      youtubeSearch: 'cash secured puts tutorial strategy',
      topics: ['Put basics', 'Cash requirements', 'Assignment risk', 'Entry strategies', 'Exit strategies'],
    },
    {
      id: 'options-greeks',
      title: 'Understanding Options Greeks',
      description: 'Deep dive into Delta, Gamma, Theta, Vega, and Rho - the key metrics for options traders.',
      duration: '25 min',
      level: 'Intermediate',
      videoId: 'PoOX3FruYug', // Options Greeks Explained - InTheMoney
      youtubeSearch: 'options Greeks explained Delta Gamma Theta Vega',
      topics: ['Delta explained', 'Gamma risk', 'Time decay (Theta)', 'Volatility (Vega)', 'Interest rates (Rho)'],
    },
    {
      id: 'portfolio-management',
      title: 'Options Portfolio Management',
      description: 'Learn how to manage a portfolio of options positions and balance risk.',
      duration: '30 min',
      level: 'Intermediate',
      videoId: '2fRJsn155_4', // Options Portfolio Management - InTheMoney
      youtubeSearch: 'options portfolio management risk management',
      topics: ['Position sizing', 'Diversification', 'Risk management', 'Rolling strategies', 'Exit planning'],
    },
    {
      id: 'advanced-strategies',
      title: 'Advanced Options Strategies',
      description: 'Explore complex multi-leg strategies like spreads, straddles, and collars.',
      duration: '35 min',
      level: 'Advanced',
      videoId: '3nB3xqKbG-I', // Advanced Options Strategies - InTheMoney
      youtubeSearch: 'advanced options strategies spreads iron condors butterfly',
      topics: ['Vertical spreads', 'Iron condors', 'Butterfly spreads', 'Straddles and strangles', 'Risk/reward analysis'],
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
              <Play className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-50 tracking-tight">Video Tutorials</h1>
              <p className="text-gray-300 mt-2">Learn options trading through comprehensive video tutorials</p>
            </div>
          </div>
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong border border-slate-700/50 overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              {/* Video Embed with Fallback */}
              <div className="relative">
                <VideoEmbed
                  videoId={tutorial.videoId}
                  title={tutorial.title}
                  searchQuery={tutorial.youtubeSearch || tutorial.title + ' tutorial'}
                />
                {/* Always show search option as overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.youtubeSearch || tutorial.title + ' tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-black/80 text-white rounded text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Find Tutorials
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tutorial.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    tutorial.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tutorial.level}
                  </span>
                  <span className="text-xs text-gray-400">{tutorial.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-yellow-50 mb-2">{tutorial.title}</h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">{tutorial.description}</p>

                {/* Topics */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">Topics Covered:</p>
                  <ul className="space-y-1">
                    {tutorial.topics.slice(0, 3).map((topic, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="text-orange-400">•</span>
                        {topic}
                      </li>
                    ))}
                    {tutorial.topics.length > 3 && (
                      <li className="text-xs text-gray-500">+ {tutorial.topics.length - 3} more topics</li>
                    )}
                  </ul>
                </div>

                {/* Watch Button */}
                <div className="flex gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${tutorial.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Watch on YouTube
                  </a>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.youtubeSearch || tutorial.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg font-semibold hover:bg-slate-600/50 transition-colors flex items-center gap-2"
                    title="Search for alternative videos"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-yellow-50 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-400" />
            Additional Learning Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/strategies"
              className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
            >
              <h3 className="font-semibold text-yellow-50 mb-2">Strategy Explanations</h3>
              <p className="text-sm text-gray-400">Detailed written guides on options strategies</p>
            </Link>
            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
              <h3 className="font-semibold text-yellow-50 mb-2">Options Calculator</h3>
              <p className="text-sm text-gray-400">Calculate Greeks and profit/loss scenarios</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

