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

  // Check watchlist status on mount and when symbol changes
  useEffect(() => {
    const checkWatchlist = () => {
      const status = isInWatchlist(symbol);
      setInWatchlist(status);
    };
    
    checkWatchlist();
    
    // Listen for watchlist updates from other components
    const handleWatchlistUpdate = () => {
      setTimeout(checkWatchlist, 50);
    };
    
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [symbol]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    // Immediate visual feedback
    alert(`Watchlist button clicked for ${symbol}! Check console for details.`);
    
    console.log('=== WATCHLIST BUTTON CLICKED ===');
    console.log('Symbol:', symbol);
    console.log('Current state:', inWatchlist);
    console.log('Event:', e);
    
    setIsAnimating(true);
    
    try {
      let newState: boolean;
      let success = false;
      
      if (inWatchlist) {
        console.log('Attempting to REMOVE from watchlist...');
        success = removeFromWatchlist(symbol);
        console.log('Remove result:', success);
        newState = false;
      } else {
        console.log('Attempting to ADD to watchlist...');
        success = addToWatchlist(symbol);
        console.log('Add result:', success);
        newState = true;
      }
      
      if (success) {
        // Update state immediately
        setInWatchlist(newState);
        console.log('State updated to:', newState);
        
        // Verify after a short delay
        setTimeout(() => {
          const verified = isInWatchlist(symbol);
          console.log('Verified state:', verified);
          setInWatchlist(verified);
          
          // Trigger update event
          window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
            detail: { symbol, added: newState } 
          }));
          
          alert(`Successfully ${newState ? 'added' : 'removed'} ${symbol} ${newState ? 'to' : 'from'} watchlist!`);
        }, 100);
      } else {
        console.error('Failed to update watchlist');
        alert(`Failed to update watchlist for ${symbol}. Check console.`);
      }
      
    } catch (error) {
      console.error('ERROR in watchlist toggle:', error);
      alert(`Error: ${error}`);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
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
      onClick={handleClick}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleClick(e as any);
      }}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-all cursor-pointer ${
        inWatchlist
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-2 border-yellow-500/50'
          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 border-2 border-slate-600/50 hover:border-yellow-500/30'
      } ${isAnimating ? 'scale-125' : ''} group active:scale-95`}
      title={inWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      style={{ 
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        position: 'relative',
        zIndex: 99999,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      aria-label={inWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      data-symbol={symbol}
      data-testid={`watchlist-button-${symbol}`}
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




