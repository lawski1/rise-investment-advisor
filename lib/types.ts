export interface Investment {
  symbol: string;
  name: string;
  type: 'ETF' | 'Index Fund' | 'Stock';
  exchange: 'NASDAQ' | 'NYSE' | 'SP500';
  currentPrice: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  ytdReturn?: number;
  oneYearReturn?: number;
  fiveYearReturn?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
  recommendationScore: number; // 0-100
  description: string;
  sector?: string;
}

export interface InvestmentAnalysis {
  investments: Investment[];
  totalCount: number;
  topRecommendations: Investment[];
  marketSummary: {
    nasdaqAvgReturn: number;
    nyseAvgReturn: number;
    sp500AvgReturn: number;
  };
}

