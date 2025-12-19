'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/userData';

interface WatchlistButtonProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WatchlistButton({ symbol, size = 'md', showLabel = false }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setInWatchlist(isInWatchlist(symbol));
  }, [symbol]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (inWatchlist) {
      removeFromWatchlist(symbol);
      setInWatchlist(false);
    } else {
      addToWatchlist(symbol);
      setInWatchlist(true);
    }

    setTimeout(() => setIsAnimating(false), 300);

    // Trigger custom event for watchlist updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { symbol, added: !inWatchlist } }));
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-all ${
        inWatchlist
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 border border-slate-600/50 hover:border-yellow-500/30'
      } ${isAnimating ? 'scale-125' : ''} group`}
      title={inWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
    >
      <Star
        className={`${iconSizes[size]} ${inWatchlist ? 'fill-yellow-400 text-yellow-400' : 'group-hover:text-yellow-400'} transition-all`}
      />
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </span>
      )}
    </button>
  );
}


