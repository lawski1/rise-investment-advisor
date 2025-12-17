'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { Investment } from '@/lib/types';
import { X, Plus, BarChart3 } from 'lucide-react';
import InvestmentCard from './InvestmentCard';

interface ComparisonToolProps {
  investments: Investment[];
}

export interface ComparisonToolHandle {
  addToComparison: (investment: Investment) => void;
}

const ComparisonTool = forwardRef<ComparisonToolHandle, ComparisonToolProps>(({ investments }, ref) => {
  const [selected, setSelected] = useState<Investment[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const addToComparison = (investment: Investment) => {
    if (selected.length >= 4) {
      alert('You can compare up to 4 investments at once');
      return;
    }
    if (!selected.find(inv => inv.symbol === investment.symbol)) {
      setSelected([...selected, investment]);
      setShowComparison(true);
    }
  };

  useImperativeHandle(ref, () => ({
    addToComparison,
  }));

  const removeFromComparison = (symbol: string) => {
    setSelected(selected.filter(inv => inv.symbol !== symbol));
  };

  const clearComparison = () => {
    setSelected([]);
    setShowComparison(false);
  };

  if (selected.length === 0 && !showComparison) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Comparison Bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Comparison ({selected.length}/4)</h3>
          </div>
          <div className="flex gap-2">
            {selected.length > 0 && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </button>
            )}
            {selected.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Selected Items */}
        <div className="flex flex-wrap gap-2">
          {selected.map(inv => (
            <div
              key={inv.symbol}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
            >
              <span className="font-semibold text-gray-900">{inv.symbol}</span>
              <button
                onClick={() => removeFromComparison(inv.symbol)}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {selected.length < 4 && (
            <div className="flex items-center text-gray-500 text-sm px-3 py-2">
              <Plus className="w-4 h-4 mr-1" />
              Add more to compare
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {showComparison && selected.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  {selected.map(inv => (
                    <th key={inv.symbol} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {inv.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
                  {selected.map(inv => (
                    <td key={inv.symbol} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inv.name}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Current Price</td>
                  {selected.map(inv => (
                    <td key={inv.symbol} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${inv.currentPrice.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Change %</td>
                  {selected.map(inv => (
                    <td
                      key={inv.symbol}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        inv.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {inv.changePercent >= 0 ? '+' : ''}{inv.changePercent.toFixed(2)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">YTD Return</td>
                  {selected.map(inv => (
                    <td
                      key={inv.symbol}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        (inv.ytdReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {inv.ytdReturn !== undefined ? `${inv.ytdReturn.toFixed(2)}%` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1 Year Return</td>
                  {selected.map(inv => (
                    <td
                      key={inv.symbol}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        (inv.oneYearReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {inv.oneYearReturn !== undefined ? `${inv.oneYearReturn.toFixed(2)}%` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dividend Yield</td>
                  {selected.map(inv => (
                    <td key={inv.symbol} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inv.dividendYield !== undefined ? `${inv.dividendYield.toFixed(2)}%` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Level</td>
                  {selected.map(inv => (
                    <td
                      key={inv.symbol}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        inv.riskLevel === 'Low'
                          ? 'text-green-600'
                          : inv.riskLevel === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {inv.riskLevel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Recommendation</td>
                  {selected.map(inv => (
                    <td key={inv.symbol} className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inv.recommendation === 'Strong Buy'
                            ? 'bg-green-100 text-green-800'
                            : inv.recommendation === 'Buy'
                            ? 'bg-blue-100 text-blue-800'
                            : inv.recommendation === 'Hold'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {inv.recommendation}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Recommendation Score</td>
                  {selected.map(inv => (
                    <td key={inv.symbol} className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${inv.recommendationScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{inv.recommendationScore}/100</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

ComparisonTool.displayName = 'ComparisonTool';

export default ComparisonTool;


