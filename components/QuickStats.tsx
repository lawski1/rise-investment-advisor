'use client';

import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Award } from 'lucide-react';

interface QuickStatsProps {
  analysis: InvestmentAnalysis;
}

export default function QuickStats({ analysis }: QuickStatsProps) {
  const { investments } = analysis;
  
  // Calculate statistics
  const totalInvestments = investments.length;
  const strongBuys = investments.filter(inv => inv.recommendation === 'Strong Buy').length;
  const avgReturn = investments.reduce((sum, inv) => sum + (inv.ytdReturn || 0), 0) / totalInvestments;
  const positiveReturns = investments.filter(inv => (inv.changePercent || 0) > 0).length;
  const avgPrice = investments.reduce((sum, inv) => sum + inv.currentPrice, 0) / totalInvestments;
  const highDividend = investments.filter(inv => (inv.dividendYield || 0) > 3).length;

  const stats = [
    {
      label: 'Total Investments',
      value: totalInvestments,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Strong Buy',
      value: strongBuys,
      icon: Award,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Avg YTD Return',
      value: `${avgReturn.toFixed(2)}%`,
      icon: TrendingUp,
      color: avgReturn > 0 ? 'green' : 'red',
      bgColor: avgReturn > 0 ? 'bg-green-100' : 'bg-red-100',
      iconColor: avgReturn > 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Positive Today',
      value: `${((positiveReturns / totalInvestments) * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg Price',
      value: `$${avgPrice.toFixed(2)}`,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'High Dividend',
      value: highDividend,
      icon: Target,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 mb-6 border border-slate-700/50" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 146, 60, 0.1)' }}>
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Quick Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600/50 hover:shadow-md transition-all hover:scale-105 hover:border-orange-500/30"
            >
              <div className={`${stat.bgColor} p-2 rounded-lg w-fit mb-2`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

