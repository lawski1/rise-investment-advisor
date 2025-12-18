'use client';

import { Investment } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Shield, Plus } from 'lucide-react';
import { useState } from 'react';
import HistoricalChart from './HistoricalChart';

interface InvestmentCardProps {
  investment: Investment;
  onAddToComparison?: (investment: Investment) => void;
  showChart?: boolean;
}

export default function InvestmentCard({ investment, onAddToComparison, showChart = false }: InvestmentCardProps) {
  const [showChartState, setShowChartState] = useState(showChart);
  const isPositive = investment.changePercent >= 0;
  const recommendationColors = {
    'Strong Buy': 'bg-green-100 text-green-800 border-green-300',
    'Buy': 'bg-blue-100 text-blue-800 border-blue-300',
    'Hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Sell': 'bg-red-100 text-red-800 border-red-300',
  };

  const riskColors = {
    'Low': 'text-green-600',
    'Medium': 'text-yellow-600',
    'High': 'text-red-600',
  };

  return (
    <div className="card-polished p-6 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{investment.symbol}</h3>
          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{investment.name}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border shadow-soft ${recommendationColors[investment.recommendation]}`}>
          {investment.recommendation}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Price</p>
          <p className="text-xl font-bold text-gray-900">${investment.currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Change</p>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-600 mr-1.5" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600 mr-1.5" />
            )}
            <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{investment.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 mb-5">
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{investment.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
            {investment.type}
          </span>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
            {investment.exchange}
          </span>
          {investment.sector && (
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100">
              {investment.sector}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
        {investment.ytdReturn !== undefined && (
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">YTD Return</p>
              <p className="font-bold text-gray-900 text-base">{investment.ytdReturn.toFixed(2)}%</p>
            </div>
          </div>
        )}
        {investment.oneYearReturn !== undefined && (
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">1Y Return</p>
              <p className="font-bold text-gray-900 text-base">{investment.oneYearReturn.toFixed(2)}%</p>
            </div>
          </div>
        )}
        {investment.dividendYield !== undefined && (
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Dividend Yield</p>
              <p className="font-bold text-gray-900 text-base">{investment.dividendYield.toFixed(2)}%</p>
            </div>
          </div>
        )}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className={`p-2 rounded-lg mr-3 ${
            investment.riskLevel === 'Low' ? 'bg-green-100' :
            investment.riskLevel === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Shield className={`w-4 h-4 ${riskColors[investment.riskLevel]}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Risk Level</p>
            <p className={`font-bold text-base ${riskColors[investment.riskLevel]}`}>{investment.riskLevel}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">Recommendation Score</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${investment.recommendationScore}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-gray-900">{investment.recommendationScore}/100</span>
          </div>
        </div>
        <div className="flex gap-3">
          {onAddToComparison && (
            <button
              onClick={() => onAddToComparison(investment)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold flex items-center justify-center gap-2 shadow-colored hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              title="Add to comparison tool"
            >
              <Plus className="w-4 h-4" />
              Compare
            </button>
          )}
          <button
            onClick={() => setShowChartState(!showChartState)}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-semibold flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 transition-all"
            title={showChartState ? 'Hide historical chart' : 'Show historical chart'}
          >
            <BarChart3 className="w-4 h-4" />
            {showChartState ? 'Hide' : 'Show'} Chart
          </button>
        </div>
      </div>

      {showChartState && (
        <div className="mt-4">
          <HistoricalChart investment={investment} />
        </div>
      )}
    </div>
  );
}

