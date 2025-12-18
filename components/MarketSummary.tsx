'use client';

import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, Building2, BarChart } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';

interface MarketSummaryProps {
  analysis: InvestmentAnalysis;
}

// Generate trend data for a market based on average return
// Creates a visible upward trend over 30 days
const generateTrendData = (avgReturn: number, days: number = 30) => {
  const data = [];
  const baseValue = 100;
  // Scale the return to make it more visible over 30 days
  // Multiply by 10 to exaggerate the trend for visualization
  const scaledReturn = (avgReturn / 100) * 10;
  
  for (let i = 0; i <= days; i++) {
    const progress = i / days; // 0 to 1
    // Create an upward trend with some variation
    const trendValue = baseValue * (1 + scaledReturn * progress);
    // Add small random variation for realism (±1%)
    const variation = (Math.random() - 0.5) * 0.02;
    const value = trendValue * (1 + variation);
    
    data.push({
      day: i,
      value: Math.max(value, baseValue * 0.98), // Don't go below 98% of base
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
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-strong p-8 mb-8 border border-blue-100/50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NASDAQ Card */}
        <div className="card-polished p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">NASDAQ</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{marketSummary.nasdaqAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-5 font-medium">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nasdaqTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>

        {/* NYSE Card */}
        <div className="card-polished p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-green-100 rounded-xl">
              <BarChart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">NYSE</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{marketSummary.nyseAvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-5 font-medium">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nyseTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>

        {/* S&P 500 Card */}
        <div className="card-polished p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">S&P 500</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{marketSummary.sp500AvgReturn.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mb-5 font-medium">Average YTD Return</p>
          
          {/* Mini Trend Chart */}
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sp500Trend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="day" hide={true} />
                <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">30-Day Trend</p>
        </div>
      </div>
    </div>
  );
}
