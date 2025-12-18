'use client';

import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url?: string;
  category?: string;
}

// Mock financial news data - can be replaced with real API
const mockNews: NewsItem[] = [
  {
    title: 'Federal Reserve Signals Potential Rate Cuts Ahead',
    source: 'Financial Times',
    publishedAt: '2 hours ago',
    category: 'Monetary Policy',
  },
  {
    title: 'Tech Stocks Rally on Strong Earnings Reports',
    source: 'Bloomberg',
    publishedAt: '3 hours ago',
    category: 'Markets',
  },
  {
    title: 'Oil Prices Surge Amid Supply Concerns',
    source: 'Reuters',
    publishedAt: '4 hours ago',
    category: 'Commodities',
  },
  {
    title: 'S&P 500 Hits New Record High',
    source: 'Wall Street Journal',
    publishedAt: '5 hours ago',
    category: 'Markets',
  },
  {
    title: 'Cryptocurrency Market Shows Volatility',
    source: 'CNBC',
    publishedAt: '6 hours ago',
    category: 'Crypto',
  },
  {
    title: 'Housing Market Shows Signs of Cooling',
    source: 'MarketWatch',
    publishedAt: '7 hours ago',
    category: 'Real Estate',
  },
  {
    title: 'Major Banks Report Strong Q4 Earnings',
    source: 'Financial Times',
    publishedAt: '8 hours ago',
    category: 'Banking',
  },
  {
    title: 'Renewable Energy Stocks Gain Momentum',
    source: 'Bloomberg',
    publishedAt: '9 hours ago',
    category: 'Energy',
  },
  {
    title: 'Inflation Data Shows Continued Decline',
    source: 'Reuters',
    publishedAt: '10 hours ago',
    category: 'Economy',
  },
  {
    title: 'International Trade Agreements Boost Market Confidence',
    source: 'Wall Street Journal',
    publishedAt: '11 hours ago',
    category: 'Trade',
  },
  {
    title: 'AI Companies Lead Tech Sector Growth',
    source: 'CNBC',
    publishedAt: '12 hours ago',
    category: 'Technology',
  },
  {
    title: 'Gold Prices Reach 6-Month High',
    source: 'MarketWatch',
    publishedAt: '13 hours ago',
    category: 'Commodities',
  },
  {
    title: 'Retail Sector Shows Mixed Results',
    source: 'Financial Times',
    publishedAt: '14 hours ago',
    category: 'Retail',
  },
  {
    title: 'Healthcare Stocks Rally on Drug Approval News',
    source: 'Bloomberg',
    publishedAt: '15 hours ago',
    category: 'Healthcare',
  },
  {
    title: 'Electric Vehicle Market Expands Globally',
    source: 'Reuters',
    publishedAt: '16 hours ago',
    category: 'Automotive',
  },
];

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);

  // In the future, this can fetch from a real API
  useEffect(() => {
    // Example: Fetch from NewsAPI or Alpha Vantage News
    // const fetchNews = async () => {
    //   try {
    //     const response = await fetch('/api/news');
    //     const data = await response.json();
    //     setNews(data);
    //   } catch (error) {
    //     console.error('Error fetching news:', error);
    //   }
    // };
    // fetchNews();
  }, []);

  // Duplicate news for seamless infinite scroll
  const duplicatedNews = [...news, ...news];

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-2.5 overflow-hidden relative border-b-2 border-blue-400/30 shadow-lg">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-purple-900 to-transparent z-10 pointer-events-none" />
      
      {/* News icon label */}
      <div className="absolute left-4 top-0 bottom-0 flex items-center z-20 bg-gradient-to-r from-blue-900 to-transparent pr-6">
        <div className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-lg border border-blue-600/50">
          <Newspaper className="w-4 h-4 text-blue-300" />
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">News</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 news-scroll ml-32">
        {duplicatedNews.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-center gap-4 whitespace-nowrap px-4 py-1 hover:bg-blue-800/30 rounded-lg transition-colors cursor-pointer group"
            title={`${item.title} - ${item.source}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-blue-300 font-medium">{item.source}</span>
                  <span className="text-xs text-blue-400">•</span>
                  <span className="text-xs text-blue-300">{item.publishedAt}</span>
                  {item.category && (
                    <>
                      <span className="text-xs text-blue-400">•</span>
                      <span className="text-xs text-blue-400 bg-blue-800/50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {item.url && (
                <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="w-1 h-1 bg-blue-500 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

