'use client';

import { Investment, HistoricalDataPoint } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface HistoricalChartProps {
  investment: Investment;
  period?: '1M' | '3M' | '6M' | '1Y' | '5Y';
}

export default function HistoricalChart({ investment, period = '1Y' }: HistoricalChartProps) {
  // Generate mock historical data if not available
  const generateMockData = (): HistoricalDataPoint[] => {
    const data: HistoricalDataPoint[] = [];
    const days = period === '1M' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : period === '1Y' ? 365 : 1825;
    const basePrice = investment.currentPrice;
    const volatility = 0.02;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const trend = (days - i) / days; // Upward trend over time
      const random = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 - trend * 0.1 + random * trend); // Slight upward trend with volatility

      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(price, basePrice * 0.7), // Don't go below 70% of current
        volume: investment.volume * (0.8 + Math.random() * 0.4),
      });
    }

    return data;
  };

  const historicalData = investment.historicalData || generateMockData();

  // Format data for chart
  const chartData = historicalData.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: Number(point.price.toFixed(2)),
    fullDate: point.date,
  }));

  // Calculate performance
  const startPrice = chartData[0]?.price || investment.currentPrice;
  const endPrice = chartData[chartData.length - 1]?.price || investment.currentPrice;
  const performance = ((endPrice - startPrice) / startPrice) * 100;

  return (
    <div className="bg-slate-800/90 rounded-lg shadow-md p-6 border border-slate-700/50">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-yellow-50">{investment.symbol} Price History</h3>
          <p className="text-sm text-gray-300">{period} Performance</p>
        </div>
        <div className="text-right">
          <div className={`flex items-center ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${performance < 0 ? 'rotate-180' : ''}`} />
            <span className="font-semibold">{performance >= 0 ? '+' : ''}{performance.toFixed(2)}%</span>
          </div>
          <p className="text-xs text-gray-400">Period Return</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#cbd5e1"
            fontSize={12}
            tick={{ fill: '#cbd5e1' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#cbd5e1"
            fontSize={12}
            tick={{ fill: '#cbd5e1' }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-400">Start Price</p>
          <p className="font-semibold text-yellow-50">${startPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Current Price</p>
          <p className="font-semibold text-yellow-50">${endPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Change</p>
          <p className={`font-semibold ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(endPrice - startPrice).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}



