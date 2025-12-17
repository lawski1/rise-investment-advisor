'use client';

import { Investment } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Shield } from 'lucide-react';

interface InvestmentCardProps {
  investment: Investment;
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{investment.symbol}</h3>
          <p className="text-sm text-gray-600 mt-1">{investment.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${recommendationColors[investment.recommendation]}`}>
          {investment.recommendation}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-lg font-semibold text-gray-900">${investment.currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Change</p>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <p className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{investment.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <p className="text-sm text-gray-600 mb-3">{investment.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {investment.type}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {investment.exchange}
          </span>
          {investment.sector && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {investment.sector}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        {investment.ytdReturn !== undefined && (
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
            <div>
              <p className="text-gray-500">YTD Return</p>
              <p className="font-semibold text-gray-900">{investment.ytdReturn.toFixed(2)}%</p>
            </div>
          </div>
        )}
        {investment.oneYearReturn !== undefined && (
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
            <div>
              <p className="text-gray-500">1Y Return</p>
              <p className="font-semibold text-gray-900">{investment.oneYearReturn.toFixed(2)}%</p>
            </div>
          </div>
        )}
        {investment.dividendYield !== undefined && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-yellow-600 mr-2" />
            <div>
              <p className="text-gray-500">Dividend Yield</p>
              <p className="font-semibold text-gray-900">{investment.dividendYield.toFixed(2)}%</p>
            </div>
          </div>
        )}
        <div className="flex items-center">
          <Shield className={`w-4 h-4 mr-2 ${riskColors[investment.riskLevel]}`} />
          <div>
            <p className="text-gray-500">Risk Level</p>
            <p className={`font-semibold ${riskColors[investment.riskLevel]}`}>{investment.riskLevel}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Recommendation Score</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${investment.recommendationScore}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-900">{investment.recommendationScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

