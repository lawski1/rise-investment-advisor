'use client';

import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, Building2, BarChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

interface MarketSummaryProps {
  analysis: InvestmentAnalysis;
}

// Generate trend data for a market based on average return
const generateTrendData = (avgReturn: number, days: number = 30) => {
  const data = [];
  const baseValue = 100; // Starting at 100
  const totalReturn = avgReturn / 100; // Convert percentage to decimal
  const dailyReturn = totalReturn / 365; // Approximate daily return
  
  for (let i = 0; i <= days; i++) {
    const value = baseValue * (1 + dailyReturn * i);
    data.push({
      day: i,
      value: Math.max(value, baseValue * 0.95), // Don't go below 95% of base
    });
  }
  
  return data;
};

export default function MarketSummary({ analysis }: MarketSummaryProps) {
  const { marketSummary } = analysis;

  const nasdaqTrend = generateTrendData(marketSummary.nasdaqAvgReturn);
  const nyseTrend = generateTrendData(marketSummary.nyseAvgReturn);
  const sp500Trend = generateTrendData(marketSummary.sp500AvgReturn);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NASDAQ Card */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold text-gray-500">NASDAQ</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{marketSummary.nasdaqAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-4">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nasdaqTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="nasdaqGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#nasdaqGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>

        {/* NYSE Card */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <BarChart className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-gray-500">NYSE</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{marketSummary.nyseAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-4">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nyseTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="nyseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#nyseGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>

        {/* S&P 500 Card */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-semibold text-gray-500">S&P 500</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{marketSummary.sp500AvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-4">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sp500Trend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#sp500Gradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>
      </div>
    </div>
  );
}
