'use client';

import { useState, useEffect } from 'react';
import { Star, X, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { getWatchlist, removeFromWatchlist } from '@/lib/userData';
import { Investment } from '@/lib/types';

interface WatchlistPanelProps {
  investments: Investment[];
  onClose?: () => void;
}

export default function WatchlistPanel({ investments, onClose }: WatchlistPanelProps) {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [watchlistItems, setWatchlistItems] = useState<Investment[]>([]);

  useEffect(() => {
    const loadWatchlist = () => {
      const symbols = getWatchlist();
      setWatchlistSymbols(symbols);
      
      // Get investment data for watchlist symbols
      const items = investments.filter(inv => symbols.includes(inv.symbol));
      setWatchlistItems(items);
    };

    loadWatchlist();

    // Listen for watchlist updates
    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [investments]);

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol);
    setWatchlistSymbols(prev => prev.filter(s => s !== symbol));
    setWatchlistItems(prev => prev.filter(item => item.symbol !== symbol));
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { symbol, added: false } }));
  };

  if (watchlistItems.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-yellow-50 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            My Watchlist
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Your watchlist is empty</p>
          <p className="text-sm text-gray-500">Click the star icon on any investment to add it to your watchlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-yellow-50 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          My Watchlist ({watchlistItems.length})
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {watchlistItems.map((investment) => {
          const isPositive = investment.changePercent >= 0;
          return (
            <div
              key={investment.symbol}
              className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-yellow-50">{investment.symbol}</h4>
                    <span className="text-xs px-2 py-0.5 bg-slate-600/50 text-gray-300 rounded">
                      {investment.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{investment.name}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-lg font-bold text-yellow-50">${investment.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Change</p>
                      <div className="flex items-center gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{investment.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(investment.symbol)}
                  className="ml-4 p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                  title="Remove from watchlist"
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




