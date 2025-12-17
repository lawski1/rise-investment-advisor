'use client';

import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, Building2, BarChart } from 'lucide-react';

interface MarketSummaryProps {
  analysis: InvestmentAnalysis;
}

export default function MarketSummary({ analysis }: MarketSummaryProps) {
  const { marketSummary } = analysis;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold text-gray-500">NASDAQ</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{marketSummary.nasdaqAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mt-2">Average YTD Return</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <BarChart className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-gray-500">NYSE</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{marketSummary.nyseAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mt-2">Average YTD Return</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-semibold text-gray-500">S&P 500</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{marketSummary.sp500AvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mt-2">Average YTD Return</p>
        </div>
      </div>
    </div>
  );
}

