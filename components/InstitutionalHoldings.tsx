'use client';

import { useState, useEffect } from 'react';
import { InstitutionalData } from '@/lib/types';
import { fetchInstitutionalData } from '@/lib/institutionalData';
import { Building2, TrendingUp, TrendingDown, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface InstitutionalHoldingsProps {
  symbol: string;
  name?: string;
}

export default function InstitutionalHoldings({ symbol, name }: InstitutionalHoldingsProps) {
  const [data, setData] = useState<InstitutionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const institutionalData = await fetchInstitutionalData(symbol);
        setData(institutionalData);
      } catch (err) {
        setError('Failed to load institutional data');
        console.error('Error loading institutional data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700/50 rounded w-full"></div>
            <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
        <p className="text-gray-400 text-sm">{error || 'No institutional data available'}</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatShares = (shares: number) => {
    if (shares >= 1000000) {
      return `${(shares / 1000000).toFixed(2)}M`;
    } else if (shares >= 1000) {
      return `${(shares / 1000).toFixed(2)}K`;
    }
    return shares.toLocaleString();
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-yellow-50 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            Institutional Holdings
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {name || symbol} - Top institutional investors
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Updated {new Date(data.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400">Institutions</p>
          </div>
          <p className="text-2xl font-bold text-yellow-50">{data.numberOfInstitutions}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-400">Ownership</p>
          </div>
          <p className="text-2xl font-bold text-yellow-50">{data.institutionalOwnershipPercent.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-gray-400">Total Shares</p>
          </div>
          <p className="text-2xl font-bold text-yellow-50">{formatShares(data.totalInstitutionalHoldings)}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400">Top 10 Value</p>
          </div>
          <p className="text-2xl font-bold text-yellow-50">
            {formatCurrency(data.topHolders.reduce((sum, h) => sum + h.totalValue, 0))}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentActivity && (
        <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <h4 className="text-sm font-semibold text-yellow-50 mb-3">Recent Activity (Last Quarter)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">New Positions</p>
              <p className="text-lg font-bold text-green-400">{data.recentActivity.newPositions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Increased</p>
              <p className="text-lg font-bold text-blue-400">{data.recentActivity.increasedPositions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Decreased</p>
              <p className="text-lg font-bold text-orange-400">{data.recentActivity.decreasedPositions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Closed</p>
              <p className="text-lg font-bold text-red-400">{data.recentActivity.closedPositions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Holders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Institution</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Shares</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Value</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.topHolders.map((holder, index) => {
              const isPositive = (holder.changePercent || 0) > 0;
              const isNegative = (holder.changePercent || 0) < 0;
              
              return (
                <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-semibold text-yellow-50">{holder.name}</p>
                      {holder.percentageOfPortfolio && (
                        <p className="text-xs text-gray-400">{holder.percentageOfPortfolio.toFixed(2)}% of portfolio</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-gray-300 border border-slate-600/50">
                      {holder.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="text-sm font-medium text-gray-300">{formatShares(holder.shares)}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="text-sm font-semibold text-yellow-50">{formatCurrency(holder.totalValue)}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {holder.change !== undefined && holder.changePercent !== undefined && (
                      <div className="flex items-center justify-end gap-1">
                        {isPositive && <ArrowUpRight className="w-3 h-3 text-green-400" />}
                        {isNegative && <ArrowDownRight className="w-3 h-3 text-red-400" />}
                        {!isPositive && !isNegative && <Minus className="w-3 h-3 text-gray-400" />}
                        <span className={`text-sm font-semibold ${
                          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {isPositive ? '+' : ''}{holder.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-yellow-50">Data Source:</strong> Institutional holdings data from SEC Form 13F filings. 
          Data is updated quarterly and reflects positions as of the most recent filing date.
        </p>
      </div>
    </div>
  );
}

