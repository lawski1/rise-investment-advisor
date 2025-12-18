'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { InvestmentAnalysis, Investment, SortOption, FilterOption } from '@/lib/types';
import { analyzeInvestments } from '@/lib/financialData';
import { enhanceInvestmentWithRealData, batchFetchQuotes } from '@/lib/api';
import MarketSummary from '@/components/MarketSummary';
import ScrollFadeCard from '@/components/ScrollFadeCard';
import ComparisonTool, { ComparisonToolHandle } from '@/components/ComparisonTool';
import Sidebar from '@/components/Sidebar';
import RiseLogo from '@/components/RiseLogo';
import { RefreshCw, TrendingUp } from 'lucide-react';
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

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy('recommendationScore');
    setSortOrder('desc');
  };

  if (loading || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-10 animate-slideIn">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RiseLogo size="md" showText={true} />
                <div>
                  <p className="text-blue-100 text-sm">
                    Discover profitable stocks, index funds, ETFs, and S&P 500 opportunities
                  </p>
                </div>
              </div>
              <button
                onClick={() => loadData(useRealAPI)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
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
              <h2 className="text-2xl font-bold text-gray-900">Investment Opportunities</h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredInvestments.length} of {analysis.investments.length} investments
              </p>
            </div>
          </div>

          {/* Investment Grid */}
          {filteredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
            <div className="bg-white rounded-lg shadow-md p-8 text-center fade-on-scroll transition-all duration-700 ease-out opacity-100">
              <p className="text-gray-600">No investments match your current filters. Try adjusting your search criteria.</p>
            </div>
          )}

          {/* Footer Info */}
          <div 
            ref={footerRef}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 fade-on-scroll transition-all duration-1000 ease-out ${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              Investment Tips for Beginners
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Diversify:</strong> Don't put all your money in one investment. Spread it across different sectors and asset types.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Start with Low Risk:</strong> S&P 500 index funds are excellent starting points for new investors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Long-term Focus:</strong> Index funds work best when held for 5+ years. Avoid frequent trading.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Low Fees Matter:</strong> Look for expense ratios under 0.10% for index funds.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Dollar-Cost Averaging:</strong> Invest regularly (monthly) rather than trying to time the market.</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>Disclaimer:</strong> This platform provides educational information only. Always consult with a licensed financial advisor before making investment decisions. Past performance does not guarantee future results. All investments carry risk of loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
