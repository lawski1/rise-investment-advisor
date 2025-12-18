'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { InvestmentAnalysis, Investment, SortOption, FilterOption } from '@/lib/types';
import { analyzeInvestments } from '@/lib/financialData';
import { enhanceInvestmentWithRealData, batchFetchQuotes } from '@/lib/api';
import MarketSummary from '@/components/MarketSummary';
import ScrollFadeCard from '@/components/ScrollFadeCard';
import FadeWrapper from '@/components/FadeWrapper';
import ComparisonTool, { ComparisonToolHandle } from '@/components/ComparisonTool';
import TopNavBar from '@/components/TopNavBar';
import RiseLogo from '@/components/RiseLogo';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import QuickStats from '@/components/QuickStats';
import OptionsStrategy from '@/components/OptionsStrategy';
import { RefreshCw, TrendingUp, BarChart3, Target, Info } from 'lucide-react';
import { useScrollFade } from '@/hooks/useScrollFade';

export default function Home() {
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommendationScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterOption>({});
  const comparisonToolRef = useState<ComparisonToolHandle | null>(null)[0];
  
  // Refs for scroll-based fade effects
  const marketSummaryRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const resultsHeaderRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Scroll fade visibility - Market Summary should be visible immediately since it's at the top
  const [marketSummaryVisible, setMarketSummaryVisible] = useState(true);
  const comparisonVisible = useScrollFade(comparisonRef, 0.2);
  const resultsHeaderVisible = useScrollFade(resultsHeaderRef, 0.2);
  const footerVisible = useScrollFade(footerRef, 0.2);

  // Ensure market summary is visible when analysis loads
  useEffect(() => {
    if (analysis) {
      setMarketSummaryVisible(true);
    }
  }, [analysis]);

  const loadData = async (useAPI: boolean = false) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    let data = analyzeInvestments();

    if (useAPI && process.env.NEXT_PUBLIC_USE_REAL_API === 'true') {
      try {
        const symbols = data.investments.map(inv => inv.symbol);
        const quotes = await batchFetchQuotes(symbols);
        
        data = {
          ...data,
          investments: data.investments.map(inv => {
            const quote = quotes.get(inv.symbol);
            return quote ? { ...inv, ...quote } : inv;
          }),
        };
      } catch (error) {
        console.error('Error fetching real data:', error);
      }
    }

    setAnalysis(data);
    setFilteredInvestments(data.investments);
    setLoading(false);
  };

  useEffect(() => {
    loadData(useRealAPI);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setSortBy('recommendationScore');
    setSortOrder('desc');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement;
        if (searchButton) {
          searchButton.click();
        }
      }
      // Escape to clear filters
      if (e.key === 'Escape') {
        const hasFilters = searchTerm || Object.keys(filters).length > 0;
        if (hasFilters) {
          clearFilters();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchTerm, filters, clearFilters]);

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    if (!analysis) return [];
    
    let filtered = [...analysis.investments];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.symbol.toLowerCase().includes(searchLower) ||
        inv.name.toLowerCase().includes(searchLower)
      );
    }

    // Exchange filter
    if (filters.exchange && filters.exchange.length > 0) {
      filtered = filtered.filter(inv => filters.exchange!.includes(inv.exchange));
    }

    // Risk level filter
    if (filters.riskLevel && filters.riskLevel.length > 0) {
      filtered = filtered.filter(inv => filters.riskLevel!.includes(inv.riskLevel));
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(inv => filters.type!.includes(inv.type));
    }

    // Sector filter
    if (filters.sector && filters.sector.length > 0) {
      filtered = filtered.filter(inv => inv.sector && filters.sector!.includes(inv.sector));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      switch (sortBy) {
        case 'recommendationScore':
          aValue = a.recommendationScore;
          bValue = b.recommendationScore;
          break;
        case 'ytdReturn':
          aValue = a.ytdReturn || 0;
          bValue = b.ytdReturn || 0;
          break;
        case 'oneYearReturn':
          aValue = a.oneYearReturn || 0;
          bValue = b.oneYearReturn || 0;
          break;
        case 'currentPrice':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'dividendYield':
          aValue = a.dividendYield || 0;
          bValue = b.dividendYield || 0;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [analysis, searchTerm, sortBy, sortOrder, filters]);

  useEffect(() => {
    setFilteredInvestments(filteredAndSorted);
  }, [filteredAndSorted]);

  if (loading || !analysis) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-strong sticky top-0 z-50 animate-slideIn backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <RiseLogo size="md" showText={true} />
              <div>
                <p className="text-blue-50 text-sm font-medium leading-relaxed">
                  Discover profitable stocks, index funds, ETFs, and S&P 500 opportunities
                </p>
              </div>
            </div>
            <button
              onClick={() => loadData(useRealAPI)}
              className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-2 shadow-medium hover:shadow-strong"
              title="Refresh investment data"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Top Navigation Bar - positioned below header */}
      <div className="sticky top-[73px] z-[45]">
        <TopNavBar
        investments={analysis.investments}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filters={filters}
        setFilters={setFilters}
        onClearFilters={clearFilters}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Market Summary */}
          <div 
            ref={marketSummaryRef}
            className={`fade-on-scroll transition-all duration-1000 ease-out ${
              marketSummaryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ minHeight: '200px' }}
          >
            {analysis && <MarketSummary analysis={analysis} />}
          </div>

          {/* Quick Stats */}
          <FadeWrapper delay={0.1}>
            <QuickStats analysis={analysis} />
          </FadeWrapper>

          {/* Options Strategy Research Section - Ford & Lower-Priced Stocks */}
          {analysis && (() => {
            const fordStock = analysis.investments.find(inv => inv.symbol === 'F');
            // Get lower-priced stocks (under $25) sorted by covered call potential (volatility + dividend)
            const lowPriceStocks = analysis.investments
              .filter(inv => inv.currentPrice < 25 && inv.type === 'Stock' && inv.symbol !== 'F')
              .sort((a, b) => {
                // Sort by: high volatility first, then dividend yield, then price
                const aScore = (a.riskLevel === 'High' ? 3 : a.riskLevel === 'Medium' ? 2 : 1) + 
                               (a.dividendYield || 0) * 10 + 
                               (25 - a.currentPrice); // Lower price = higher score
                const bScore = (b.riskLevel === 'High' ? 3 : b.riskLevel === 'Medium' ? 2 : 1) + 
                               (b.dividendYield || 0) * 10 + 
                               (25 - b.currentPrice);
                return bScore - aScore;
              })
              .slice(0, 5); // Show top 5 lower-priced stocks
            const featuredStocks = fordStock ? [fordStock, ...lowPriceStocks] : lowPriceStocks;
            
            if (featuredStocks.length === 0) return null;
            
            return (
              <FadeWrapper delay={0.15}>
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-strong p-8 mb-8 border border-indigo-100/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                          <Target className="w-7 h-7 text-indigo-600" />
                        </div>
                        Options Strategy Research
                      </h2>
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        Covered calls, cash-secured puts, and protective strategies for {fordStock ? 'Ford' : 'lower-priced'} stocks
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {featuredStocks.map((stock, index) => (
                      <div key={stock.symbol} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                        <OptionsStrategy investment={stock} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-indigo-600" />
                      Why Options Strategies Work for Lower-Priced Stocks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-gray-900">Lower Capital Requirements:</strong> Options on stocks under $20 require less capital, making strategies more accessible.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-gray-900">Higher Percentage Returns:</strong> Premium collection as a percentage of stock price is more significant on lower-priced stocks.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-gray-900">Better Risk/Reward:</strong> Covered calls on lower-priced stocks provide better income-to-capital ratios.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span><strong className="text-gray-900">Ford-Specific Benefits:</strong> Ford's dividend yield and price range make it ideal for income-generating options strategies.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeWrapper>
            );
          })()}

          {/* Comparison Tool */}
          <div 
            ref={comparisonRef}
            className={`fade-on-scroll transition-all duration-1000 ease-out ${
              comparisonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '0.1s' }}
          >
            <ComparisonTool
              investments={analysis.investments}
              ref={(ref) => {
                if (ref) {
                  (window as any).comparisonTool = ref;
                }
              }}
            />
          </div>

          {/* Results Header */}
          <div 
            ref={resultsHeaderRef}
            className={`flex items-center justify-between fade-on-scroll transition-all duration-1000 ease-out ${
              resultsHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Investment Opportunities</h2>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-gray-600 font-medium">
                  Showing <span className="font-bold text-gray-900">{filteredInvestments.length}</span> of <span className="font-bold text-gray-900">{analysis.investments.length}</span> investments
                </p>
                {filteredInvestments.length < analysis.investments.length && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                    Filtered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Investment Grid */}
          {filteredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInvestments.map((investment, index) => (
                <ScrollFadeCard
                  key={investment.symbol}
                  investment={investment}
                  index={index}
                  onAddToComparison={(inv) => {
                    const tool = (window as any).comparisonTool;
                    if (tool) tool.addToComparison(inv);
                  }}
                />
              ))}
            </div>
          ) : (
            <FadeWrapper>
              <div className="card-polished p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No investments found</h3>
                  <p className="text-gray-600 mb-4">No investments match your current filters. Try adjusting your search criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </FadeWrapper>
          )}

          {/* Footer Info */}
          <div 
            ref={footerRef}
            className={`card-polished p-8 border-l-4 border-blue-500 fade-on-scroll transition-all duration-1000 ease-out ${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center tracking-tight">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              Investment Tips for Beginners
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 mr-3 font-bold text-lg">•</span>
                <span className="leading-relaxed"><strong className="text-gray-900">Diversify:</strong> Don't put all your money in one investment. Spread it across different sectors and asset types.</span>
              </li>
              <li className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 mr-3 font-bold text-lg">•</span>
                <span className="leading-relaxed"><strong className="text-gray-900">Start with Low Risk:</strong> S&P 500 index funds are excellent starting points for new investors.</span>
              </li>
              <li className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 mr-3 font-bold text-lg">•</span>
                <span className="leading-relaxed"><strong className="text-gray-900">Long-term Focus:</strong> Index funds work best when held for 5+ years. Avoid frequent trading.</span>
              </li>
              <li className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 mr-3 font-bold text-lg">•</span>
                <span className="leading-relaxed"><strong className="text-gray-900">Low Fees Matter:</strong> Look for expense ratios under 0.10% for index funds.</span>
              </li>
              <li className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 mr-3 font-bold text-lg">•</span>
                <span className="leading-relaxed"><strong className="text-gray-900">Dollar-Cost Averaging:</strong> Invest regularly (monthly) rather than trying to time the market.</span>
              </li>
            </ul>
            <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200/80 shadow-soft">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Disclaimer:</strong> This platform provides educational information only. Always consult with a licensed financial advisor before making investment decisions. Past performance does not guarantee future results. All investments carry risk of loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
