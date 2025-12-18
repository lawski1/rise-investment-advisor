'use client';

import { Investment } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  investments: Investment[];
}

export default function TickerTape({ investments }: TickerTapeProps) {
  // Filter to show only stocks (not ETFs/Index Funds) and limit to most active/liquid
  const tickerStocks = investments
    .filter(inv => inv.type === 'Stock')
    .sort((a, b) => (b.volume || 0) - (a.volume || 0)) // Sort by volume
    .slice(0, 30); // Show top 30 most liquid stocks

  // Duplicate the array for seamless infinite scroll
  const duplicatedStocks = [...tickerStocks, ...tickerStocks];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 overflow-hidden relative border-b-2 border-yellow-400/30 shadow-lg">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
      
      <div className="flex items-center gap-8 ticker-scroll">
        {duplicatedStocks.map((stock, index) => {
          const isPositive = stock.changePercent >= 0;
          const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
          
          return (
            <div
              key={`${stock.symbol}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap px-4 py-1 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group"
              title={`${stock.name} - ${stock.exchange}`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                  ${stock.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

