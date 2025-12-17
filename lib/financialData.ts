import { Investment, InvestmentAnalysis } from './types';

// Mock data generator - In production, this would fetch from real APIs
// For real implementation, you'd use APIs like:
// - Alpha Vantage API
// - Yahoo Finance API
// - IEX Cloud
// - Polygon.io

const generateMockPrice = (base: number, volatility: number = 0.02): number => {
  return base * (1 + (Math.random() - 0.5) * volatility);
};

const generateMockReturn = (base: number): number => {
  return base + (Math.random() - 0.5) * 10;
};

export const getNASDAQInvestments = (): Investment[] => {
  const nasdaqStocks: Investment[] = [
    {
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      type: 'ETF',
      exchange: 'NASDAQ',
      currentPrice: generateMockPrice(380),
      changePercent: generateMockReturn(0.5),
      volume: 45000000,
      marketCap: 200000000000,
      peRatio: 28.5,
      dividendYield: 0.65,
      ytdReturn: 42.3,
      oneYearReturn: 38.7,
      fiveYearReturn: 18.2,
      riskLevel: 'Medium',
      recommendation: 'Strong Buy',
      recommendationScore: 92,
      description: 'Tracks the NASDAQ-100 Index, providing exposure to 100 of the largest non-financial companies listed on NASDAQ.',
      sector: 'Technology',
    },
    {
      symbol: 'TECL',
      name: 'Direxion Daily Technology Bull 3X Shares',
      type: 'ETF',
      exchange: 'NASDAQ',
      currentPrice: generateMockPrice(45),
      changePercent: generateMockReturn(1.2),
      volume: 2500000,
      marketCap: 1200000000,
      peRatio: 32.1,
      dividendYield: 0.0,
      ytdReturn: 85.4,
      oneYearReturn: 72.3,
      fiveYearReturn: 25.8,
      riskLevel: 'High',
      recommendation: 'Buy',
      recommendationScore: 78,
      description: '3x leveraged ETF tracking technology stocks. High risk, high reward.',
      sector: 'Technology',
    },
    {
      symbol: 'FTEC',
      name: 'Fidelity MSCI Information Technology Index ETF',
      type: 'ETF',
      exchange: 'NASDAQ',
      currentPrice: generateMockPrice(125),
      changePercent: generateMockReturn(0.3),
      volume: 1200000,
      marketCap: 8500000000,
      peRatio: 29.8,
      dividendYield: 0.72,
      ytdReturn: 48.2,
      oneYearReturn: 41.5,
      fiveYearReturn: 19.3,
      riskLevel: 'Medium',
      recommendation: 'Strong Buy',
      recommendationScore: 88,
      description: 'Low-cost ETF tracking MSCI Information Technology Index.',
      sector: 'Technology',
    },
    {
      symbol: 'XLK',
      name: 'Technology Select Sector SPDR Fund',
      type: 'ETF',
      exchange: 'NASDAQ',
      currentPrice: generateMockPrice(195),
      changePercent: generateMockReturn(0.4),
      volume: 15000000,
      marketCap: 55000000000,
      peRatio: 30.2,
      dividendYield: 0.68,
      ytdReturn: 45.7,
      oneYearReturn: 39.2,
      fiveYearReturn: 18.5,
      riskLevel: 'Medium',
      recommendation: 'Buy',
      recommendationScore: 85,
      description: 'Tracks technology sector of S&P 500.',
      sector: 'Technology',
    },
  ];

  return nasdaqStocks.map(stock => ({
    ...stock,
    currentPrice: generateMockPrice(stock.currentPrice),
    changePercent: generateMockReturn(stock.changePercent),
  }));
};

export const getNYSEInvestments = (): Investment[] => {
  const nyseStocks: Investment[] = [
    {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF Trust',
      type: 'ETF',
      exchange: 'NYSE',
      currentPrice: generateMockPrice(450),
      changePercent: generateMockReturn(0.2),
      volume: 75000000,
      marketCap: 450000000000,
      peRatio: 24.8,
      dividendYield: 1.42,
      ytdReturn: 24.5,
      oneYearReturn: 22.3,
      fiveYearReturn: 14.8,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 95,
      description: 'The most popular S&P 500 ETF, providing broad market exposure with low fees.',
      sector: 'Diversified',
    },
    {
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      type: 'ETF',
      exchange: 'NYSE',
      currentPrice: generateMockPrice(245),
      changePercent: generateMockReturn(0.15),
      volume: 3500000,
      marketCap: 320000000000,
      peRatio: 23.5,
      dividendYield: 1.52,
      ytdReturn: 23.8,
      oneYearReturn: 21.5,
      fiveYearReturn: 14.2,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 94,
      description: 'Total stock market exposure with ultra-low expense ratio.',
      sector: 'Diversified',
    },
    {
      symbol: 'DIA',
      name: 'SPDR Dow Jones Industrial Average ETF',
      type: 'ETF',
      exchange: 'NYSE',
      currentPrice: generateMockPrice(350),
      changePercent: generateMockReturn(0.18),
      volume: 4500000,
      marketCap: 32000000000,
      peRatio: 22.3,
      dividendYield: 1.85,
      ytdReturn: 18.7,
      oneYearReturn: 16.2,
      fiveYearReturn: 12.5,
      riskLevel: 'Low',
      recommendation: 'Buy',
      recommendationScore: 82,
      description: 'Tracks the Dow Jones Industrial Average, 30 blue-chip stocks.',
      sector: 'Diversified',
    },
    {
      symbol: 'IVV',
      name: 'iShares Core S&P 500 ETF',
      type: 'ETF',
      exchange: 'NYSE',
      currentPrice: generateMockPrice(455),
      changePercent: generateMockReturn(0.2),
      volume: 5500000,
      marketCap: 380000000000,
      peRatio: 24.8,
      dividendYield: 1.40,
      ytdReturn: 24.3,
      oneYearReturn: 22.1,
      fiveYearReturn: 14.7,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 93,
      description: 'Low-cost S&P 500 ETF with strong liquidity.',
      sector: 'Diversified',
    },
  ];

  return nyseStocks.map(stock => ({
    ...stock,
    currentPrice: generateMockPrice(stock.currentPrice),
    changePercent: generateMockReturn(stock.changePercent),
  }));
};

export const getSP500Investments = (): Investment[] => {
  const sp500Stocks: Investment[] = [
    {
      symbol: 'VOO',
      name: 'Vanguard S&P 500 ETF',
      type: 'ETF',
      exchange: 'SP500',
      currentPrice: generateMockPrice(420),
      changePercent: generateMockReturn(0.2),
      volume: 4500000,
      marketCap: 380000000000,
      peRatio: 24.6,
      dividendYield: 1.45,
      ytdReturn: 24.8,
      oneYearReturn: 22.5,
      fiveYearReturn: 14.9,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 96,
      description: 'Ultra-low cost S&P 500 ETF, perfect for long-term investors.',
      sector: 'Diversified',
    },
    {
      symbol: 'SWPPX',
      name: 'Schwab S&P 500 Index Fund',
      type: 'Index Fund',
      exchange: 'SP500',
      currentPrice: generateMockPrice(85),
      changePercent: generateMockReturn(0.2),
      volume: 0,
      marketCap: 85000000000,
      peRatio: 24.7,
      dividendYield: 1.43,
      ytdReturn: 24.6,
      oneYearReturn: 22.4,
      fiveYearReturn: 14.8,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 95,
      description: 'No minimum investment S&P 500 index fund with zero commission.',
      sector: 'Diversified',
    },
    {
      symbol: 'FXAIX',
      name: 'Fidelity 500 Index Fund',
      type: 'Index Fund',
      exchange: 'SP500',
      currentPrice: generateMockPrice(165),
      changePercent: generateMockReturn(0.2),
      volume: 0,
      marketCap: 450000000000,
      peRatio: 24.8,
      dividendYield: 1.41,
      ytdReturn: 24.5,
      oneYearReturn: 22.3,
      fiveYearReturn: 14.7,
      riskLevel: 'Low',
      recommendation: 'Strong Buy',
      recommendationScore: 94,
      description: 'Fidelity\'s flagship S&P 500 index fund with industry-leading low fees.',
      sector: 'Diversified',
    },
    {
      symbol: 'SPLG',
      name: 'SPDR Portfolio S&P 500 ETF',
      type: 'ETF',
      exchange: 'SP500',
      currentPrice: generateMockPrice(58),
      changePercent: generateMockReturn(0.2),
      volume: 8500000,
      marketCap: 28000000000,
      peRatio: 24.7,
      dividendYield: 1.44,
      ytdReturn: 24.4,
      oneYearReturn: 22.2,
      fiveYearReturn: 14.6,
      riskLevel: 'Low',
      recommendation: 'Buy',
      recommendationScore: 90,
      description: 'Low-cost S&P 500 ETF alternative with fractional share trading.',
      sector: 'Diversified',
    },
  ];

  return sp500Stocks.map(stock => ({
    ...stock,
    currentPrice: generateMockPrice(stock.currentPrice),
    changePercent: generateMockReturn(stock.changePercent),
  }));
};

export const analyzeInvestments = (): InvestmentAnalysis => {
  const nasdaq = getNASDAQInvestments();
  const nyse = getNYSEInvestments();
  const sp500 = getSP500Investments();
  
  const allInvestments = [...nasdaq, ...nyse, ...sp500];
  
  // Calculate average returns
  const nasdaqAvg = nasdaq.reduce((sum, inv) => sum + (inv.ytdReturn || 0), 0) / nasdaq.length;
  const nyseAvg = nyse.reduce((sum, inv) => sum + (inv.ytdReturn || 0), 0) / nyse.length;
  const sp500Avg = sp500.reduce((sum, inv) => sum + (inv.ytdReturn || 0), 0) / sp500.length;
  
  // Sort by recommendation score
  const topRecommendations = [...allInvestments]
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);
  
  return {
    investments: allInvestments,
    totalCount: allInvestments.length,
    topRecommendations,
    marketSummary: {
      nasdaqAvgReturn: nasdaqAvg,
      nyseAvgReturn: nyseAvg,
      sp500AvgReturn: sp500Avg,
    },
  };
};

