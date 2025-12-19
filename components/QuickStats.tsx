'use client';

import { InvestmentAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Award, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBiggestInstitutionalMoves, InstitutionalMove } from '@/lib/institutionalData';

interface QuickStatsProps {
  analysis: InvestmentAnalysis;
  onFilterChange?: (filters: any) => void;
  onScrollToSection?: (section: string) => void;
}

export default function QuickStats({ analysis, onFilterChange, onScrollToSection }: QuickStatsProps) {
  const { investments } = analysis;
  const [biggestPurchase, setBiggestPurchase] = useState<InstitutionalMove | null>(null);
  const [biggestSale, setBiggestSale] = useState<InstitutionalMove | null>(null);
  const [loadingInstitutional, setLoadingInstitutional] = useState(true);

  const handleStatClick = (statLabel: string, statValue?: any) => {
    // Scroll to investment grid section
    const scrollToInvestments = () => {
      const element = document.querySelector('[data-section="investments"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight * 0.4, behavior: 'smooth' });
      }
    };

    // Scroll to market summary
    const scrollToMarketSummary = () => {
      const element = document.querySelector('[data-section="market-summary"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Scroll to specific stock
    const scrollToStock = (symbol: string) => {
      const element = document.querySelector(`[data-symbol="${symbol}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the card briefly
        element.classList.add('ring-4', 'ring-orange-500', 'ring-opacity-50');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-orange-500', 'ring-opacity-50');
        }, 2000);
      } else {
        scrollToInvestments();
      }
    };

    switch (statLabel) {
      case 'Total Investments':
        scrollToInvestments();
        break;
      case 'Strong Buy':
        if (onFilterChange) {
          onFilterChange({ recommendation: 'Strong Buy' });
        }
        scrollToInvestments();
        break;
      case 'Avg YTD Return':
        scrollToMarketSummary();
        break;
      case 'Positive Today':
        if (onFilterChange) {
          // Filter would need to be handled by parent component
          scrollToInvestments();
        }
        break;
      case 'Avg Price':
        scrollToInvestments();
        break;
      case 'High Dividend':
        if (onFilterChange) {
          // Filter for high dividend (would need parent to handle)
          scrollToInvestments();
        }
        break;
      case 'Biggest Purchase':
        if (biggestPurchase) {
          scrollToStock(biggestPurchase.symbol);
        }
        break;
      case 'Biggest Sale':
        if (biggestSale) {
          scrollToStock(biggestSale.symbol);
        }
        break;
      default:
        scrollToInvestments();
    }
  };

  // Fetch biggest institutional moves
  useEffect(() => {
    const loadInstitutionalMoves = async () => {
      try {
        // Get only stock symbols for institutional data
        const stockSymbols = investments
          .filter(inv => inv.type === 'Stock')
          .map(inv => inv.symbol)
          .slice(0, 20); // Limit to first 20 stocks for performance

        if (stockSymbols.length > 0) {
          const moves = await getBiggestInstitutionalMoves(stockSymbols, 1);
          if (moves.purchases.length > 0) {
            setBiggestPurchase(moves.purchases[0]);
          }
          if (moves.sales.length > 0) {
            setBiggestSale(moves.sales[0]);
          }
        }
      } catch (error) {
        console.error('Error loading institutional moves:', error);
      } finally {
        setLoadingInstitutional(false);
      }
    };

    loadInstitutionalMoves();
  }, [investments]);
  
  // Format currency helper
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };
  
  // Calculate statistics
  const totalInvestments = investments.length;
  const strongBuys = investments.filter(inv => inv.recommendation === 'Strong Buy').length;
  const avgReturn = investments.reduce((sum, inv) => sum + (inv.ytdReturn || 0), 0) / totalInvestments;
  const positiveReturns = investments.filter(inv => (inv.changePercent || 0) > 0).length;
  const avgPrice = investments.reduce((sum, inv) => sum + inv.currentPrice, 0) / totalInvestments;
  const highDividend = investments.filter(inv => (inv.dividendYield || 0) > 3).length;

  interface StatItem {
    label: string;
    value: string | number;
    icon: any;
    color: string;
    bgColor: string;
    iconColor: string;
    subtitle?: string;
    valueDetail?: string;
    onClick?: () => void;
  }

  const stats: StatItem[] = [
    {
      label: 'Total Investments',
      value: totalInvestments,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Strong Buy',
      value: strongBuys,
      icon: Award,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Avg YTD Return',
      value: `${avgReturn.toFixed(2)}%`,
      icon: TrendingUp,
      color: avgReturn > 0 ? 'green' : 'red',
      bgColor: avgReturn > 0 ? 'bg-green-100' : 'bg-red-100',
      iconColor: avgReturn > 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Positive Today',
      value: `${((positiveReturns / totalInvestments) * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg Price',
      value: `$${avgPrice.toFixed(2)}`,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'High Dividend',
      value: highDividend,
      icon: Target,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  // Add institutional moves to stats if available
  if (!loadingInstitutional && biggestPurchase) {
    stats.push({
      label: 'Biggest Purchase',
      value: `${biggestPurchase.symbol}`,
      icon: ArrowUpRight,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      subtitle: biggestPurchase.institution,
      valueDetail: formatCurrency(biggestPurchase.value),
    });
  }

  if (!loadingInstitutional && biggestSale) {
    stats.push({
      label: 'Biggest Sale',
      value: `${biggestSale.symbol}`,
      icon: ArrowDownRight,
      color: 'red',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      subtitle: biggestSale.institution,
      valueDetail: formatCurrency(biggestSale.value),
    });
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 mb-6 border border-slate-700/50" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 146, 60, 0.1)' }}>
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Quick Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const hasSubtitle = 'subtitle' in stat;
          const hasValueDetail = 'valueDetail' in stat;
          return (
            <div
              key={index}
              onClick={() => handleStatClick(stat.label, stat.value)}
              className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600/50 hover:shadow-md hover:shadow-orange-500/20 transition-all hover:scale-105 hover:border-orange-500/50 cursor-pointer group active:scale-95"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStatClick(stat.label, stat.value);
                }
              }}
              title={`Click to view ${stat.label.toLowerCase()} details`}
            >
              <div className={`${stat.bgColor} p-2 rounded-lg w-fit mb-2`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-yellow-50 mb-1">{stat.value}</p>
              {hasValueDetail && (
                <p className="text-sm font-semibold text-green-400 mb-1">{stat.valueDetail}</p>
              )}
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              {hasSubtitle && (
                <p className="text-xs text-gray-500 mt-1 truncate" title={stat.subtitle}>
                  {stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

