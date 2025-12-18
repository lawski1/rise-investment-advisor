'use client';

import { useState } from 'react';
import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, Building2, BarChart, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

interface MarketSummaryProps {
  analysis: InvestmentAnalysis;
}

type TimePeriod = 'today' | 'week' | 'month';

interface ChartDataPoint {
  time: string;
  value: number;
  label: string;
}

// Generate detailed trend data for different time periods
const generateTrendData = (avgReturn: number, period: TimePeriod): { data: ChartDataPoint[]; gainLoss: number } => {
  const data: ChartDataPoint[] = [];
  const baseValue = 100;
  let days = 0;
  let points = 0;
  let gainLoss = 0;

  switch (period) {
    case 'today':
      days = 1;
      points = 24; // Hourly data for today
      gainLoss = (avgReturn / 100) * 0.5; // Today's gain/loss (smaller portion)
      for (let i = 0; i <= points; i++) {
        const hour = i;
        const progress = i / points;
        const trendValue = baseValue * (1 + (gainLoss * progress));
        const variation = (Math.random() - 0.5) * 0.01;
        const value = trendValue * (1 + variation);
        data.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          value: Math.max(value, baseValue * 0.995),
          label: `Hour ${hour}`,
        });
      }
      break;
    case 'week':
      days = 7;
      points = 7; // Daily data for week
      gainLoss = (avgReturn / 100) * 0.15; // Week's gain/loss
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i <= points; i++) {
        const progress = i / points;
        const trendValue = baseValue * (1 + (gainLoss * progress));
        const variation = (Math.random() - 0.5) * 0.02;
        const value = trendValue * (1 + variation);
        data.push({
          time: dayNames[i % 7],
          value: Math.max(value, baseValue * 0.98),
          label: `Day ${i + 1}`,
        });
      }
      break;
    case 'month':
      days = 30;
      points = 30; // Daily data for month
      gainLoss = avgReturn / 100; // Month's gain/loss (full return)
      for (let i = 0; i <= points; i++) {
        const progress = i / points;
        const trendValue = baseValue * (1 + (gainLoss * progress));
        const variation = (Math.random() - 0.5) * 0.02;
        const value = trendValue * (1 + variation);
        data.push({
          time: `${i + 1}`,
          value: Math.max(value, baseValue * 0.95),
          label: `Day ${i + 1}`,
        });
      }
      break;
  }

  return { data, gainLoss: gainLoss * 100 };
};

export default function MarketSummary({ analysis }: MarketSummaryProps) {
  const { marketSummary } = analysis;
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

  const nasdaqData = generateTrendData(marketSummary.nasdaqAvgReturn, selectedPeriod);
  const nyseData = generateTrendData(marketSummary.nyseAvgReturn, selectedPeriod);
  const sp500Data = generateTrendData(marketSummary.sp500AvgReturn, selectedPeriod);

  const periodLabels = {
    today: 'Today',
    week: 'Last Week',
    month: 'One Month',
  };

  const MarketCard = ({ 
    icon: Icon, 
    iconBg, 
    iconColor, 
    name, 
    avgReturn, 
    chartData, 
    gainLoss, 
    lineColor 
  }: {
    icon: any;
    iconBg: string;
    iconColor: string;
    name: string;
    avgReturn: number;
    chartData: ChartDataPoint[];
    gainLoss: number;
    lineColor: string;
  }) => {
    const isPositive = gainLoss >= 0;
    const startValue = chartData[0]?.value || 100;
    const endValue = chartData[chartData.length - 1]?.value || 100;
    const actualGainLoss = ((endValue - startValue) / startValue) * 100;

    return (
      <div className="card-polished p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBg} rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{name}</span>
        </div>
        
        {/* Gain/Loss Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-3xl font-bold tracking-tight ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{actualGainLoss.toFixed(2)}%
            </p>
          </div>
          <p className="text-xs text-gray-500 font-medium">{periodLabels[selectedPeriod]} Gain/Loss</p>
        </div>

        <p className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{avgReturn.toFixed(2)}%</p>
        <p className="text-xs text-gray-600 mb-4 font-medium">Average YTD Return</p>
        
        {/* Enhanced Detailed Chart */}
        <div className="h-40 w-full bg-gradient-to-b from-gray-50 to-white rounded-lg p-2 border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                stroke="#d1d5db"
                tickLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                hide={true}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={`url(#gradient-${name})`}
                dot={false}
                activeDot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center font-medium">{periodLabels[selectedPeriod]} Performance</p>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-strong p-8 mb-8 border border-blue-100/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Market Overview</h2>
        
        {/* Time Period Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-soft border border-gray-200 w-full sm:w-auto">
          {(['today', 'week', 'month'] as TimePeriod[]).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NASDAQ Card */}
        <MarketCard
          icon={Building2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          name="NASDAQ"
          avgReturn={marketSummary.nasdaqAvgReturn}
          chartData={nasdaqData.data}
          gainLoss={nasdaqData.gainLoss}
          lineColor="#3b82f6"
        />

        {/* NYSE Card */}
        <MarketCard
          icon={BarChart}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          name="NYSE"
          avgReturn={marketSummary.nyseAvgReturn}
          chartData={nyseData.data}
          gainLoss={nyseData.gainLoss}
          lineColor="#10b981"
        />

        {/* S&P 500 Card */}
        <MarketCard
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          name="S&P 500"
          avgReturn={marketSummary.sp500AvgReturn}
          chartData={sp500Data.data}
          gainLoss={sp500Data.gainLoss}
          lineColor="#a855f7"
        />
      </div>
    </div>
  );
}
