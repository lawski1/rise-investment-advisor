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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{investment.symbol} Price History</h3>
          <p className="text-sm text-gray-600">{period} Performance</p>
        </div>
        <div className="text-right">
          <div className={`flex items-center ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${performance < 0 ? 'rotate-180' : ''}`} />
            <span className="font-semibold">{performance >= 0 ? '+' : ''}{performance.toFixed(2)}%</span>
          </div>
          <p className="text-xs text-gray-500">Period Return</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
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
          <p className="text-gray-500">Start Price</p>
          <p className="font-semibold text-gray-900">${startPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Current Price</p>
          <p className="font-semibold text-gray-900">${endPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Change</p>
          <p className={`font-semibold ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(endPrice - startPrice).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

