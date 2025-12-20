'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, getCurrentUser, saveUser } from '@/lib/userData';

interface WatchlistButtonProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WatchlistButton({ symbol, size = 'md', showLabel = false }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check watchlist status on mount and when symbol changes
  useEffect(() => {
    const checkWatchlist = () => {
      setInWatchlist(isInWatchlist(symbol));
    };
    
    checkWatchlist();
    
    // Listen for watchlist updates from other components
    const handleWatchlistUpdate = () => {
      checkWatchlist();
    };
    
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [symbol]);

  const handleToggle = async (e: React.MouseEvent | React.TouchEvent) => {
    console.log('Watchlist button clicked for:', symbol);
    
    setIsAnimating(true);
    
    const wasInWatchlist = inWatchlist;
    let success = false;
    let newState = wasInWatchlist;
    
    try {
      if (wasInWatchlist) {
        console.log('Removing from watchlist:', symbol);
        success = removeFromWatchlist(symbol);
        if (success) {
          newState = false;
          setInWatchlist(false);
          console.log('Successfully removed from watchlist');
        } else {
          console.log('Failed to remove from watchlist');
        }
      } else {
        console.log('Adding to watchlist:', symbol);
        success = addToWatchlist(symbol);
        if (success) {
          newState = true;
          setInWatchlist(true);
          console.log('Successfully added to watchlist');
        } else {
          console.log('Failed to add to watchlist');
        }
      }

      // Verify the change was successful
      if (success) {
        // Double-check the state
        const verifyState = isInWatchlist(symbol);
        if (verifyState !== newState) {
          // State mismatch - correct it
          console.log('State mismatch detected, correcting...');
          setInWatchlist(verifyState);
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }

    setTimeout(() => setIsAnimating(false), 300);

    // Trigger custom event for watchlist updates
    if (typeof window !== 'undefined' && success) {
      window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
        detail: { symbol, added: !wasInWatchlist } 
      }));
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 min-w-[32px] min-h-[32px] p-1',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px] p-1.5',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px] p-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle(e);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-all cursor-pointer relative z-50 ${
        inWatchlist
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 border border-slate-600/50 hover:border-yellow-500/30'
      } ${isAnimating ? 'scale-125' : ''} group active:scale-95`}
      title={inWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      style={{ 
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      aria-label={inWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
    >
      <Star
        className={`${iconSizes[size]} ${inWatchlist ? 'fill-yellow-400 text-yellow-400' : 'group-hover:text-yellow-400'} transition-all pointer-events-none`}
      />
      {showLabel && (
        <span className="ml-2 text-sm font-medium pointer-events-none">
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </span>
      )}
    </button>
  );
}




