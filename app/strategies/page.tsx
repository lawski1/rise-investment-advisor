'use client';

import { BookOpen, Target, TrendingUp, Shield, DollarSign, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function StrategiesPage() {
  const strategies = [
    {
      id: 'covered-call',
      name: 'Covered Call',
      icon: Target,
      difficulty: 'Beginner',
      risk: 'Low to Medium',
      description: 'Sell call options against stock you own to generate income while limiting upside potential.',
      whenToUse: 'When you own stock and want to generate additional income, or when you\'re willing to sell at a specific price.',
      pros: [
        'Generates income from premium collection',
        'Reduces cost basis of stock',
        'Provides some downside protection',
        'Relatively low risk strategy',
      ],
      cons: [
        'Limits upside potential',
        'Stock may be called away',
        'Requires owning the underlying stock',
      ],
      example: {
        stock: 'Ford (F)',
        stockPrice: '$12.50',
        strike: '$13.00',
        premium: '$0.50',
        maxProfit: '$1.00 (8%)',
        maxLoss: 'Stock drops to $0',
      },
      steps: [
        'Own 100 shares of the stock',
        'Sell 1 call option (representing 100 shares)',
        'Collect premium immediately',
        'If stock stays below strike: keep premium and stock',
        'If stock goes above strike: stock may be called away at strike price',
      ],
    },
    {
      id: 'cash-secured-put',
      name: 'Cash-Secured Put',
      icon: DollarSign,
      difficulty: 'Beginner',
      risk: 'Low to Medium',
      description: 'Sell put options with cash set aside to buy the stock if assigned. Collect premium while waiting.',
      whenToUse: 'When you want to buy a stock at a lower price, or generate income while waiting.',
      pros: [
        'Collect premium while waiting to buy',
        'Buy stock at discount if assigned',
        'Lower entry price if assigned',
        'Keep premium if not assigned',
      ],
      cons: [
        'Requires cash to secure the put',
        'May be forced to buy at strike price',
        'Limited to strike price as entry',
      ],
      example: {
        stock: 'Ford (F)',
        stockPrice: '$12.50',
        strike: '$12.00',
        premium: '$0.40',
        maxProfit: '$0.40 (premium)',
        maxLoss: 'Stock drops to $0',
      },
      steps: [
        'Set aside cash equal to strike price × 100 shares',
        'Sell 1 put option',
        'Collect premium immediately',
        'If stock stays above strike: keep premium, no stock purchase',
        'If stock drops below strike: buy stock at strike price',
      ],
    },
    {
      id: 'protective-put',
      name: 'Protective Put',
      icon: Shield,
      difficulty: 'Intermediate',
      risk: 'Low',
      description: 'Buy put options to protect existing stock positions from downside risk.',
      whenToUse: 'When you own stock and want to protect against losses while maintaining upside potential.',
      pros: [
        'Unlimited upside potential',
        'Limited downside risk',
        'Protects against market crashes',
        'Peace of mind',
      ],
      cons: [
        'Cost of premium reduces returns',
        'Puts expire worthless if stock rises',
        'Ongoing cost for protection',
      ],
      example: {
        stock: 'Ford (F)',
        stockPrice: '$12.50',
        strike: '$12.00',
        premium: '$0.30',
        maxProfit: 'Unlimited',
        maxLoss: '$0.80 (premium + difference)',
      },
      steps: [
        'Own 100 shares of the stock',
        'Buy 1 put option as insurance',
        'Pay premium for protection',
        'If stock rises: keep gains, lose premium',
        'If stock falls: protection kicks in at strike price',
      ],
    },
    {
      id: 'collar',
      name: 'Collar Strategy',
      icon: TrendingUp,
      difficulty: 'Intermediate',
      risk: 'Low',
      description: 'Combine covered call and protective put to create a price range with limited risk and reward.',
      whenToUse: 'When you want to protect downside while generating income, accepting limited upside.',
      pros: [
        'Defined risk and reward',
        'Generates income (from call)',
        'Protects downside (from put)',
        'Low cost or even credit',
      ],
      cons: [
        'Limited upside potential',
        'Limited downside protection',
        'More complex than single strategies',
      ],
      example: {
        stock: 'Ford (F)',
        stockPrice: '$12.50',
        callStrike: '$13.00',
        putStrike: '$12.00',
        netCost: '$0.20',
        maxProfit: '$0.80',
        maxLoss: '$0.70',
      },
      steps: [
        'Own 100 shares of the stock',
        'Sell 1 call option (generate income)',
        'Buy 1 put option (protect downside)',
        'Net cost/receive credit from premiums',
        'Stock price range is protected between strikes',
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
              <BookOpen className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-50 tracking-tight">Options Strategies Explained</h1>
              <p className="text-gray-300 mt-2">Learn about different options strategies and when to use them</p>
            </div>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="space-y-6">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <div
                key={strategy.id}
                className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-8 border border-slate-700/50"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                      <Icon className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-yellow-50 mb-2">{strategy.name}</h2>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-semibold">
                          {strategy.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-semibold">
                          Risk: {strategy.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-300 mb-6 leading-relaxed">{strategy.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* When to Use */}
                  <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600/50">
                    <h3 className="text-lg font-semibold text-yellow-50 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      When to Use
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{strategy.whenToUse}</p>
                  </div>

                  {/* Example Trade */}
                  <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600/50">
                    <h3 className="text-lg font-semibold text-yellow-50 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Example Trade
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock:</span>
                        <span className="text-yellow-50 font-semibold">{strategy.example.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock Price:</span>
                        <span className="text-yellow-50 font-semibold">{strategy.example.stockPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strike:</span>
                        <span className="text-yellow-50 font-semibold">{strategy.example.strike}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Premium:</span>
                        <span className="text-yellow-50 font-semibold">{strategy.example.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Profit:</span>
                        <span className="text-green-400 font-semibold">{strategy.example.maxProfit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Loss:</span>
                        <span className="text-red-400 font-semibold">{strategy.example.maxLoss}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-500/10 p-5 rounded-xl border border-green-500/30">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Advantages
                    </h3>
                    <ul className="space-y-2">
                      {strategy.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-green-400 font-bold mt-0.5">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/30">
                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Disadvantages
                    </h3>
                    <ul className="space-y-2">
                      {strategy.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-red-400 font-bold mt-0.5">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600/50">
                  <h3 className="text-lg font-semibold text-yellow-50 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                    How to Execute
                  </h3>
                  <ol className="space-y-3">
                    {strategy.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-bold border border-orange-500/30">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}


