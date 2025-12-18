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
// URLs point to search results for the headline topic on the respective news sites
const mockNews: NewsItem[] = [
  {
    title: 'Federal Reserve Signals Potential Rate Cuts Ahead',
    source: 'Financial Times',
    publishedAt: '2 hours ago',
    category: 'Monetary Policy',
    url: 'https://www.ft.com/search?q=Federal+Reserve+rate+cuts',
  },
  {
    title: 'Tech Stocks Rally on Strong Earnings Reports',
    source: 'Bloomberg',
    publishedAt: '3 hours ago',
    category: 'Markets',
    url: 'https://www.bloomberg.com/search?query=tech+stocks+earnings',
  },
  {
    title: 'Oil Prices Surge Amid Supply Concerns',
    source: 'Reuters',
    publishedAt: '4 hours ago',
    category: 'Commodities',
    url: 'https://www.reuters.com/search?q=oil+prices+supply',
  },
  {
    title: 'S&P 500 Hits New Record High',
    source: 'Wall Street Journal',
    publishedAt: '5 hours ago',
    category: 'Markets',
    url: 'https://www.wsj.com/search?query=S%26P+500+record+high',
  },
  {
    title: 'Cryptocurrency Market Shows Volatility',
    source: 'CNBC',
    publishedAt: '6 hours ago',
    category: 'Crypto',
    url: 'https://www.cnbc.com/search/?query=cryptocurrency+volatility',
  },
  {
    title: 'Housing Market Shows Signs of Cooling',
    source: 'MarketWatch',
    publishedAt: '7 hours ago',
    category: 'Real Estate',
    url: 'https://www.marketwatch.com/search?q=housing+market+cooling',
  },
  {
    title: 'Major Banks Report Strong Q4 Earnings',
    source: 'Financial Times',
    publishedAt: '8 hours ago',
    category: 'Banking',
    url: 'https://www.ft.com/search?q=banks+Q4+earnings',
  },
  {
    title: 'Renewable Energy Stocks Gain Momentum',
    source: 'Bloomberg',
    publishedAt: '9 hours ago',
    category: 'Energy',
    url: 'https://www.bloomberg.com/search?query=renewable+energy+stocks',
  },
  {
    title: 'Inflation Data Shows Continued Decline',
    source: 'Reuters',
    publishedAt: '10 hours ago',
    category: 'Economy',
    url: 'https://www.reuters.com/search?q=inflation+data+decline',
  },
  {
    title: 'International Trade Agreements Boost Market Confidence',
    source: 'Wall Street Journal',
    publishedAt: '11 hours ago',
    category: 'Trade',
    url: 'https://www.wsj.com/search?query=trade+agreements+market',
  },
  {
    title: 'AI Companies Lead Tech Sector Growth',
    source: 'CNBC',
    publishedAt: '12 hours ago',
    category: 'Technology',
    url: 'https://www.cnbc.com/search/?query=AI+companies+tech+growth',
  },
  {
    title: 'Gold Prices Reach 6-Month High',
    source: 'MarketWatch',
    publishedAt: '13 hours ago',
    category: 'Commodities',
    url: 'https://www.marketwatch.com/search?q=gold+prices+high',
  },
  {
    title: 'Retail Sector Shows Mixed Results',
    source: 'Financial Times',
    publishedAt: '14 hours ago',
    category: 'Retail',
    url: 'https://www.ft.com/search?q=retail+sector+results',
  },
  {
    title: 'Healthcare Stocks Rally on Drug Approval News',
    source: 'Bloomberg',
    publishedAt: '15 hours ago',
    category: 'Healthcare',
    url: 'https://www.bloomberg.com/search?query=healthcare+stocks+drug+approval',
  },
  {
    title: 'Electric Vehicle Market Expands Globally',
    source: 'Reuters',
    publishedAt: '16 hours ago',
    category: 'Automotive',
    url: 'https://www.reuters.com/search?q=electric+vehicle+market',
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
          <a
            key={`${item.title}-${index}`}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 whitespace-nowrap px-4 py-1 hover:bg-blue-800/30 rounded-lg transition-colors cursor-pointer group"
            title={`${item.title} - ${item.source} (Click to read full story)`}
            onClick={(e) => {
              if (!item.url) {
                e.preventDefault();
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors underline-offset-2 group-hover:underline">
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
                <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
            </div>
            <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

