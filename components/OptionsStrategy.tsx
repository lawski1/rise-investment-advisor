'use client';

import { useState } from 'react';
import { Investment } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface OptionsStrategyProps {
  investment: Investment;
}

interface Strategy {
  name: string;
  type: 'Covered Call' | 'Cash-Secured Put' | 'Protective Put';
  description: string;
  bestFor: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  potentialReturn: string;
  example: {
    stockPrice: number;
    strikePrice: number;
    premium: number;
    expiration: string;
    maxProfit: number;
    maxLoss: number;
    breakeven: number;
  };
}

export default function OptionsStrategy({ investment }: OptionsStrategyProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  // Generate strategies based on stock price and characteristics
  const generateStrategies = (): Strategy[] => {
    const strategies: Strategy[] = [];
    const isLowPrice = investment.currentPrice < 20;
    const isFord = investment.symbol === 'F';
    const volatility = investment.riskLevel === 'High' ? 0.3 : investment.riskLevel === 'Medium' ? 0.2 : 0.15;

    // Covered Call Strategy
    if (isLowPrice || isFord) {
      const strikePrice = investment.currentPrice * 1.05; // 5% OTM
      const premium = investment.currentPrice * 0.02; // 2% premium
      const maxProfit = (strikePrice - investment.currentPrice) + premium;
      const maxLoss = investment.currentPrice - premium;
      const breakeven = investment.currentPrice - premium;

      strategies.push({
        name: 'Covered Call',
        type: 'Covered Call',
        description: 'Sell a call option against shares you own. Best for generating income on stocks you want to hold.',
        bestFor: isFord 
          ? 'Ford stock - Generate monthly income while holding shares. Ideal for income-focused investors.'
          : 'Lower-priced stocks - Maximize income from premium collection while maintaining upside potential.',
        riskLevel: 'Low',
        potentialReturn: `${((premium / investment.currentPrice) * 100).toFixed(1)}% monthly income`,
        example: {
          stockPrice: investment.currentPrice,
          strikePrice: parseFloat(strikePrice.toFixed(2)),
          premium: parseFloat(premium.toFixed(2)),
          expiration: '30 days',
          maxProfit: parseFloat(maxProfit.toFixed(2)),
          maxLoss: parseFloat(maxLoss.toFixed(2)),
          breakeven: parseFloat(breakeven.toFixed(2)),
        },
      });
    }

    // Cash-Secured Put Strategy
    if (isLowPrice || isFord) {
      const strikePrice = investment.currentPrice * 0.95; // 5% ITM
      const premium = investment.currentPrice * 0.025; // 2.5% premium
      const maxProfit = premium;
      const maxLoss = strikePrice - premium;
      const breakeven = strikePrice - premium;

      strategies.push({
        name: 'Cash-Secured Put',
        type: 'Cash-Secured Put',
        description: 'Sell a put option with cash to cover assignment. Best for entering positions at lower prices.',
        bestFor: isFord
          ? 'Ford stock - Enter position at $' + strikePrice.toFixed(2) + ' or collect premium if not assigned.'
          : 'Lower-priced stocks - Collect premium while waiting for better entry prices.',
        riskLevel: 'Medium',
        potentialReturn: `${((premium / strikePrice) * 100).toFixed(1)}% premium yield`,
        example: {
          stockPrice: investment.currentPrice,
          strikePrice: parseFloat(strikePrice.toFixed(2)),
          premium: parseFloat(premium.toFixed(2)),
          expiration: '30 days',
          maxProfit: parseFloat(maxProfit.toFixed(2)),
          maxLoss: parseFloat(maxLoss.toFixed(2)),
          breakeven: parseFloat(breakeven.toFixed(2)),
        },
      });
    }

    // Protective Put Strategy
    const putStrikePrice = investment.currentPrice * 0.90; // 10% OTM protection
    const putPremium = investment.currentPrice * 0.03; // 3% premium
    const maxProfit = Infinity; // Unlimited upside
    const maxLoss = (investment.currentPrice - putStrikePrice) + putPremium;
    const breakeven = investment.currentPrice + putPremium;

    strategies.push({
      name: 'Protective Put',
      type: 'Protective Put',
      description: 'Buy a put option to protect downside. Best for protecting gains while maintaining upside.',
      bestFor: isFord
        ? 'Ford stock - Protect against downside while maintaining full upside potential.'
        : 'Any stock - Insurance against significant price drops.',
      riskLevel: 'Low',
      potentialReturn: 'Unlimited upside, limited downside',
      example: {
        stockPrice: investment.currentPrice,
        strikePrice: parseFloat(putStrikePrice.toFixed(2)),
        premium: parseFloat(putPremium.toFixed(2)),
        expiration: '30 days',
        maxProfit: maxProfit,
        maxLoss: parseFloat(maxLoss.toFixed(2)),
        breakeven: parseFloat(breakeven.toFixed(2)),
      },
    });

    return strategies;
  };

  const strategies = generateStrategies();

  const toggleDetails = (strategyName: string) => {
    setShowDetails(prev => ({ ...prev, [strategyName]: !prev[strategyName] }));
  };

  const getStrategyColor = (type: string) => {
    switch (type) {
      case 'Covered Call':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Cash-Secured Put':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Protective Put':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card-polished p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Options Strategy Research
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Best strategies for {investment.symbol} at ${investment.currentPrice.toFixed(2)}
          </p>
        </div>
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
          {investment.symbol === 'F' ? 'Ford Focus' : 'Lower-Priced Stock'}
        </span>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
          >
            <div
              className="p-5 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
              onClick={() => toggleDetails(strategy.name)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStrategyColor(strategy.type)}`}>
                      {strategy.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel} Risk
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{strategy.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{strategy.potentialReturn}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Info className="w-4 h-4" />
                      <span>{strategy.bestFor}</span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {showDetails[strategy.name] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {showDetails[strategy.name] && (
              <div className="border-t border-gray-200 bg-white p-5 animate-fadeIn">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Example Trade Details
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Current Price</p>
                    <p className="text-lg font-bold text-gray-900">${strategy.example.stockPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Strike Price</p>
                    <p className="text-lg font-bold text-gray-900">${strategy.example.strikePrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Premium</p>
                    <p className="text-lg font-bold text-gray-900">${strategy.example.premium.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Expiration</p>
                    <p className="text-lg font-bold text-gray-900">{strategy.example.expiration}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="font-bold text-gray-900">Max Profit</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {strategy.example.maxProfit === Infinity ? 'Unlimited' : `$${strategy.example.maxProfit.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {strategy.type === 'Covered Call' && 'If stock called away at strike'}
                      {strategy.type === 'Cash-Secured Put' && 'If put expires worthless'}
                      {strategy.type === 'Protective Put' && 'Unlimited upside potential'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <p className="font-bold text-gray-900">Max Loss</p>
                    </div>
                    <p className="text-2xl font-bold text-red-700">${strategy.example.maxLoss.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {strategy.type === 'Covered Call' && 'If stock drops to $0'}
                      {strategy.type === 'Cash-Secured Put' && 'If assigned at strike price'}
                      {strategy.type === 'Protective Put' && 'Stock price - strike + premium'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <p className="font-bold text-gray-900">Breakeven</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">${strategy.example.breakeven.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {strategy.type === 'Covered Call' && 'Stock price - premium received'}
                      {strategy.type === 'Cash-Secured Put' && 'Strike price - premium'}
                      {strategy.type === 'Protective Put' && 'Stock price + premium paid'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 mb-1">Strategy Notes</p>
                      <ul className="text-xs text-yellow-800 space-y-1">
                        {strategy.type === 'Covered Call' && (
                          <>
                            <li>• Best for stocks you're willing to sell at the strike price</li>
                            <li>• Generate monthly income from premium collection</li>
                            <li>• Limit upside potential but provide downside protection</li>
                            {investment.symbol === 'F' && (
                              <li>• Ford's dividend yield makes this strategy even more attractive</li>
                            )}
                          </>
                        )}
                        {strategy.type === 'Cash-Secured Put' && (
                          <>
                            <li>• Requires cash equal to strike price × 100 shares</li>
                            <li>• Best for stocks you want to own at lower prices</li>
                            <li>• Collect premium while waiting for better entry</li>
                            {investment.symbol === 'F' && (
                              <li>• Ford's volatility provides good premium opportunities</li>
                            )}
                          </>
                        )}
                        {strategy.type === 'Protective Put' && (
                          <>
                            <li>• Acts as insurance against significant price drops</li>
                            <li>• Maintains full upside potential</li>
                            <li>• Cost is the premium paid (insurance cost)</li>
                            {investment.symbol === 'F' && (
                              <li>• Protects Ford position while allowing full upside participation</li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Why These Strategies Work for {investment.symbol === 'F' ? 'Ford' : 'Lower-Priced Stocks'}</p>
            <ul className="text-xs text-blue-800 space-y-1">
              {investment.symbol === 'F' ? (
                <>
                  <li>• Ford's price range ($10-15) makes options strategies cost-effective</li>
                  <li>• Higher volatility provides better premium opportunities</li>
                  <li>• Dividend yield enhances covered call returns</li>
                  <li>• Lower capital requirement allows for position sizing flexibility</li>
                </>
              ) : (
                <>
                  <li>• Lower-priced stocks require less capital for options strategies</li>
                  <li>• Higher percentage returns from premium collection</li>
                  <li>• Easier to manage multiple contracts</li>
                  <li>• Better risk/reward ratios for income generation</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

