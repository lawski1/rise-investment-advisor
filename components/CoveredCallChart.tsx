'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoveredCallChartProps {
  stockPrice: number;
  strikePrice: number;
  premium: number;
  maxProfit: number;
  maxLoss: number;
  breakeven: number;
  strategyType: 'Covered Call' | 'Cash-Secured Put' | 'Protective Put';
}

export default function CoveredCallChart({
  stockPrice,
  strikePrice,
  premium,
  maxProfit,
  maxLoss,
  breakeven,
  strategyType,
}: CoveredCallChartProps) {
  // Generate data points for the profit/loss curve
  const generateChartData = () => {
    const data: Array<{ stockPrice: number; profitLoss: number }> = [];
    
    // Calculate range: from 50% below current price to 50% above strike (or reasonable range)
    const minPrice = Math.max(0, Math.min(stockPrice * 0.5, breakeven - (strikePrice - stockPrice)));
    const maxPrice = Math.max(strikePrice * 1.5, stockPrice * 1.5);
    const range = maxPrice - minPrice;
    const steps = 50; // Number of data points
    
    for (let i = 0; i <= steps; i++) {
      const price = minPrice + (range * i) / steps;
      let profitLoss = 0;
      
      if (strategyType === 'Covered Call') {
        // Covered Call: 
        // - You own stock at entry price (stockPrice)
        // - You sold call at strike (strikePrice) and received premium
        // At expiration:
        // - If price <= strike: keep stock, profit = (price - stockPrice) + premium
        // - If price > strike: stock called away at strike, profit = (strike - stockPrice) + premium
        if (price <= strikePrice) {
          // Stock not called away, you keep it
          profitLoss = (price - stockPrice) + premium;
        } else {
          // Stock called away at strike price
          profitLoss = (strikePrice - stockPrice) + premium;
        }
      } else if (strategyType === 'Cash-Secured Put') {
        // Cash-Secured Put: Profit = premium if not assigned, or (strike - price) + premium if assigned
        if (price >= strikePrice) {
          profitLoss = premium; // Not assigned
        } else {
          profitLoss = (strikePrice - price) + premium; // Assigned
        }
      } else if (strategyType === 'Protective Put') {
        // Protective Put: Profit = (price - stockPrice) - premium, with floor at (strike - stockPrice) - premium
        const stockProfit = price - stockPrice;
        const putValue = Math.max(0, strikePrice - price);
        profitLoss = stockProfit - premium + putValue;
      }
      
      data.push({
        stockPrice: parseFloat(price.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  
  // Find key points for reference lines
  const zeroProfitIndex = chartData.findIndex(d => d.profitLoss >= 0);
  const zeroProfitPrice = zeroProfitIndex >= 0 ? chartData[zeroProfitIndex].stockPrice : breakeven;

  return (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-yellow-50 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Profit/Loss Scenario Chart
        </h4>
        <span className="text-xs text-gray-400 bg-slate-700/50 px-2 py-1 rounded">
          At Expiration
        </span>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
            <XAxis
              dataKey="stockPrice"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 11, fill: '#cbd5e1' }}
              stroke="#94a3b8"
              tickLine={{ stroke: '#94a3b8' }}
              label={{ value: 'Stock Price at Expiration ($)', position: 'insideBottom', offset: -5, fill: '#cbd5e1', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#cbd5e1' }}
              stroke="#94a3b8"
              tickLine={{ stroke: '#94a3b8' }}
              label={{ value: 'Profit/Loss ($)', angle: -90, position: 'insideLeft', fill: '#cbd5e1', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#f1f5f9' }}
              formatter={(value: number) => {
                const profitLoss = value as number;
                const color = profitLoss >= 0 ? '#10b981' : '#ef4444';
                return [
                  <span key="value" style={{ color, fontWeight: 'bold' }}>
                    ${profitLoss.toFixed(2)}
                  </span>,
                  'Profit/Loss',
                ];
              }}
              labelFormatter={(label) => `Stock Price: $${parseFloat(label).toFixed(2)}`}
            />
            
            {/* Zero profit line */}
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" strokeOpacity={0.6} strokeWidth={2} />
            
            {/* Current stock price line */}
            <ReferenceLine
              x={stockPrice}
              stroke="#fbbf24"
              strokeDasharray="3 3"
              strokeOpacity={0.8}
              strokeWidth={2}
              label={{ value: 'Current', position: 'top', fill: '#fbbf24', fontSize: 10, fontWeight: 'bold' }}
            />
            
            {/* Strike price line */}
            <ReferenceLine
              x={strikePrice}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              strokeOpacity={0.8}
              strokeWidth={2}
              label={{ value: 'Strike', position: 'top', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }}
            />
            
            {/* Breakeven line */}
            <ReferenceLine
              x={breakeven}
              stroke="#a855f7"
              strokeDasharray="2 2"
              strokeOpacity={0.8}
              strokeWidth={2}
              label={{ value: 'Breakeven', position: 'top', fill: '#a855f7', fontSize: 10, fontWeight: 'bold' }}
            />
            
            {/* Area fill - profit zone (above zero) */}
            <Area
              type="monotone"
              dataKey="profitLoss"
              stroke="none"
              fill="url(#profitGradient)"
              fillOpacity={0.3}
            />
            
            {/* Profit/Loss line */}
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#1e293b' }}
              name="Profit/Loss"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Key metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-600/50">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Max Profit</p>
          <p className="text-sm font-bold text-green-400">${maxProfit.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Max Loss</p>
          <p className="text-sm font-bold text-red-400">${maxLoss.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Breakeven</p>
          <p className="text-sm font-bold text-purple-400">${breakeven.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Premium</p>
          <p className="text-sm font-bold text-yellow-400">${premium.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Chart explanation */}
      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
        <p className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-yellow-50">Chart Explanation:</strong> This chart shows your profit or loss at expiration based on different stock prices. 
          {strategyType === 'Covered Call' && (
            <> The green line shows profit increases up to the strike price (max profit), then remains flat. If the stock price falls below breakeven, you'll experience losses.</>
          )}
          {strategyType === 'Cash-Secured Put' && (
            <> The green line shows you keep the premium if stock stays above strike. If assigned below strike, losses increase as stock price falls.</>
          )}
          {strategyType === 'Protective Put' && (
            <> The green line shows unlimited upside potential with protection at the strike price. Losses are limited to the premium paid.</>
          )}
        </p>
      </div>
    </div>
  );
}

