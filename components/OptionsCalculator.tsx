'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, AlertCircle, Info } from 'lucide-react';

interface OptionsCalculatorProps {
  initialStockPrice?: number;
  initialStrikePrice?: number;
  initialPremium?: number;
  initialDaysToExpiration?: number;
}

export default function OptionsCalculator({
  initialStockPrice = 100,
  initialStrikePrice = 105,
  initialPremium = 2.50,
  initialDaysToExpiration = 30,
}: OptionsCalculatorProps) {
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [strikePrice, setStrikePrice] = useState(initialStrikePrice);
  const [premium, setPremium] = useState(initialPremium);
  const [daysToExpiration, setDaysToExpiration] = useState(initialDaysToExpiration);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [position, setPosition] = useState<'buy' | 'sell'>('buy');
  const [volatility, setVolatility] = useState(20); // Implied volatility %
  const [interestRate, setInterestRate] = useState(5); // Risk-free rate %

  // Calculate Greeks (simplified Black-Scholes approximations)
  const calculateGreeks = () => {
    const S = stockPrice;
    const K = strikePrice;
    const T = daysToExpiration / 365;
    const r = interestRate / 100;
    const sigma = volatility / 100;
    const isCall = optionType === 'call';
    const isLong = position === 'buy';

    // Simplified calculations (for production, use proper Black-Scholes)
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Delta: rate of change of option price with respect to stock price
    const delta = isCall 
      ? (isLong ? 1 : -1) * (0.5 + 0.5 * Math.tanh(d1 * 0.5)) // Simplified
      : (isLong ? -1 : 1) * (0.5 - 0.5 * Math.tanh(d1 * 0.5));

    // Gamma: rate of change of delta
    const gamma = Math.abs(0.01 * Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(T)));

    // Theta: time decay (per day)
    const theta = (isLong ? -1 : 1) * (premium * 0.01) / daysToExpiration;

    // Vega: sensitivity to volatility
    const vega = (isLong ? 1 : -1) * (S * 0.01 * Math.sqrt(T) * 0.4);

    // Rho: sensitivity to interest rate
    const rho = (isLong ? 1 : -1) * (K * T * Math.exp(-r * T) * 0.01);

    return { delta, gamma, theta, vega, rho };
  };

  // Calculate profit/loss at expiration for different stock prices
  const calculateProfitLoss = (stockPriceAtExpiration: number) => {
    const isCall = optionType === 'call';
    const isLong = position === 'buy';
    const costBasis = isLong ? premium : -premium; // Negative for selling

    let intrinsicValue = 0;
    if (isCall) {
      intrinsicValue = Math.max(0, stockPriceAtExpiration - strikePrice);
    } else {
      intrinsicValue = Math.max(0, strikePrice - stockPriceAtExpiration);
    }

    const profitLoss = (isLong ? intrinsicValue : -intrinsicValue) - costBasis;
    return profitLoss;
  };

  const greeks = calculateGreeks();
  const breakeven = optionType === 'call'
    ? strikePrice + (position === 'buy' ? premium : -premium)
    : strikePrice - (position === 'buy' ? premium : -premium);

  const maxProfit = optionType === 'call' && position === 'buy'
    ? Infinity // Unlimited upside
    : optionType === 'put' && position === 'buy'
    ? strikePrice - premium
    : premium; // Selling options

  const maxLoss = position === 'buy'
    ? premium // Limited to premium paid
    : Infinity; // Unlimited for selling

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-yellow-50 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-400" />
          Options Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-50 mb-4">Option Parameters</h4>
          
          {/* Option Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Option Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOptionType('call')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  optionType === 'call'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                Call
              </button>
              <button
                type="button"
                onClick={() => setOptionType('put')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  optionType === 'put'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                Put
              </button>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPosition('buy')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  position === 'buy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                Buy (Long)
              </button>
              <button
                type="button"
                onClick={() => setPosition('sell')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  position === 'sell'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                Sell (Short)
              </button>
            </div>
          </div>

          {/* Stock Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Stock Price ($)</label>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.01"
            />
          </div>

          {/* Strike Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strike Price ($)</label>
            <input
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.01"
            />
          </div>

          {/* Premium */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Option Premium ($)</label>
            <input
              type="number"
              value={premium}
              onChange={(e) => setPremium(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.01"
            />
          </div>

          {/* Days to Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Days to Expiration</label>
            <input
              type="number"
              value={daysToExpiration}
              onChange={(e) => setDaysToExpiration(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="1"
            />
          </div>

          {/* Volatility */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Implied Volatility (%)</label>
            <input
              type="number"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk-Free Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.1"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-50 mb-4">Calculated Metrics</h4>

          {/* Greeks */}
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
            <h5 className="text-sm font-semibold text-yellow-50 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Option Greeks
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Delta</p>
                <p className="text-lg font-bold text-yellow-50">{greeks.delta.toFixed(4)}</p>
                <p className="text-xs text-gray-500">Price sensitivity</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Gamma</p>
                <p className="text-lg font-bold text-yellow-50">{greeks.gamma.toFixed(4)}</p>
                <p className="text-xs text-gray-500">Delta change rate</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Theta</p>
                <p className="text-lg font-bold text-red-400">{greeks.theta.toFixed(4)}</p>
                <p className="text-xs text-gray-500">Time decay/day</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Vega</p>
                <p className="text-lg font-bold text-yellow-50">{greeks.vega.toFixed(4)}</p>
                <p className="text-xs text-gray-500">Volatility sensitivity</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Rho</p>
                <p className="text-lg font-bold text-yellow-50">{greeks.rho.toFixed(4)}</p>
                <p className="text-xs text-gray-500">Interest rate sensitivity</p>
              </div>
            </div>
          </div>

          {/* Profit/Loss Metrics */}
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
            <h5 className="text-sm font-semibold text-yellow-50 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Profit/Loss at Expiration
            </h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Breakeven</span>
                <span className="text-lg font-bold text-purple-400">${breakeven.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Profit</span>
                <span className="text-lg font-bold text-green-400">
                  {maxProfit === Infinity ? 'Unlimited' : `$${maxProfit.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Loss</span>
                <span className="text-lg font-bold text-red-400">
                  {maxLoss === Infinity ? 'Unlimited' : `$${maxLoss.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Profit/Loss at Different Prices */}
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
            <h5 className="text-sm font-semibold text-yellow-50 mb-3">P/L at Different Stock Prices</h5>
            <div className="space-y-2">
              {[
                stockPrice * 0.8,
                stockPrice * 0.9,
                stockPrice,
                stockPrice * 1.1,
                stockPrice * 1.2,
              ].map((price) => {
                const pl = calculateProfitLoss(price);
                const isProfit = pl > 0;
                return (
                  <div key={price} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">${price.toFixed(2)}</span>
                    <span className={`font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${pl.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-100">
                <p className="font-semibold text-blue-50 mb-1">Calculator Note:</p>
                <p>This calculator uses simplified Greeks calculations. For precise values, use professional options analysis tools. Greeks are estimates and may vary with market conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








