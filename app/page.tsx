'use client';

import { useEffect, useState, useCallback } from 'react';
import { InvestmentAnalysis, Investment } from '@/lib/types';
import { analyzeInvestments } from '@/lib/financialData';
import { enhanceInvestmentWithRealData, batchFetchQuotes } from '@/lib/api';
import MarketSummary from '@/components/MarketSummary';
import RecommendationSection from '@/components/RecommendationSection';
import FilterAndSort from '@/components/FilterAndSort';
import ComparisonTool, { ComparisonToolHandle } from '@/components/ComparisonTool';
import RiseLogo from '@/components/RiseLogo';
import { RefreshCw, TrendingUp } from 'lucide-react';

export default function Home() {
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const comparisonToolRef = useState<ComparisonToolHandle | null>(null)[0];

  // Memoize the callback to prevent infinite loops
  const handleFilteredChange = useCallback((filtered: Investment[]) => {
    setFilteredInvestments(filtered);
  }, []);

  const loadData = async (useAPI: boolean = false) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    let data = analyzeInvestments();

    // Optionally enhance with real API data
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

  if (loading || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  const nasdaqInvestments = analysis.investments.filter(inv => inv.exchange === 'NASDAQ');
  const nyseInvestments = analysis.investments.filter(inv => inv.exchange === 'NYSE');
  const sp500Investments = analysis.investments.filter(inv => inv.exchange === 'SP500');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <RiseLogo size="lg" showText={true} />
              <div>
                <p className="text-blue-100 text-lg">
                  Discover profitable index funds, ETFs, and S&P 500 investment opportunities
                </p>
              </div>
            </div>
            <button
              onClick={() => loadData(useRealAPI)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Market Summary */}
        <MarketSummary analysis={analysis} />

        {/* Comparison Tool */}
        <ComparisonTool
          investments={analysis.investments}
          ref={(ref) => {
            if (ref) {
              (window as any).comparisonTool = ref;
            }
          }}
        />

        {/* Filter and Sort */}
        <FilterAndSort
          investments={analysis.investments}
          onFilteredChange={handleFilteredChange}
        />

        {/* Display filtered results count */}
        {filteredInvestments.length !== analysis.investments.length && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredInvestments.length} of {analysis.investments.length} investments
          </div>
        )}

        {/* All Investments (Filtered) */}
        {filteredInvestments.length > 0 ? (
          <RecommendationSection
            title="All Investments"
            investments={filteredInvestments}
            description="Browse and compare all available investment opportunities. Use filters and sorting to find exactly what you're looking for."
            onAddToComparison={(inv) => {
              const tool = (window as any).comparisonTool;
              if (tool) tool.addToComparison(inv);
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No investments match your current filters. Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Top Recommendations */}
        <RecommendationSection
          title="Top Recommendations for New Investors"
          investments={analysis.topRecommendations}
          description="These investments have been carefully analyzed and scored based on performance, risk level, and growth potential. Perfect for investors just starting their journey."
          onAddToComparison={(inv) => {
            const tool = (window as any).comparisonTool;
            if (tool) tool.addToComparison(inv);
          }}
        />

        {/* NASDAQ Technology Investments */}
        <RecommendationSection
          title="NASDAQ Technology Index Funds & ETFs"
          investments={nasdaqInvestments}
          description="Technology-focused investments tracking NASDAQ indices. Higher growth potential with moderate to high risk."
          onAddToComparison={(inv) => {
            const tool = (window as any).comparisonTool;
            if (tool) tool.addToComparison(inv);
          }}
        />

        {/* NYSE Investments */}
        <RecommendationSection
          title="NYSE Index Funds & ETFs"
          investments={nyseInvestments}
          description="Broad market exposure through NYSE-listed ETFs. Balanced risk and return profiles."
          onAddToComparison={(inv) => {
            const tool = (window as any).comparisonTool;
            if (tool) tool.addToComparison(inv);
          }}
        />

        {/* S&P 500 Investments */}
        <RecommendationSection
          title="S&P 500 Index Funds & ETFs"
          investments={sp500Investments}
          description="The most popular and reliable S&P 500 investments. Low risk, steady returns - ideal for long-term wealth building."
          onAddToComparison={(inv) => {
            const tool = (window as any).comparisonTool;
            if (tool) tool.addToComparison(inv);
          }}
        />

        {/* Footer Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 border-l-4 border-blue-600">
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
    </main>
  );
}

