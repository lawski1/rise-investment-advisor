export interface Investment {
  symbol: string;
  name: string;
  type: 'ETF' | 'Index Fund' | 'Stock' | 'Commodity' | 'Cryptocurrency' | 'Index' | 'FX';
  exchange: 'NASDAQ' | 'NYSE' | 'SP500' | 'LSE' | 'CRYPTO' | 'FX' | 'COMMODITY';
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
  historicalData?: HistoricalDataPoint[];
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  volume?: number;
}

export type SortOption = 'recommendationScore' | 'ytdReturn' | 'oneYearReturn' | 'currentPrice' | 'dividendYield' | 'changePercent';
export type FilterOption = {
  exchange?: ('NASDAQ' | 'NYSE' | 'SP500' | 'LSE' | 'CRYPTO' | 'FX' | 'COMMODITY')[];
  riskLevel?: ('Low' | 'Medium' | 'High')[];
  type?: ('ETF' | 'Index Fund' | 'Stock' | 'Commodity' | 'Cryptocurrency' | 'Index' | 'FX')[];
  sector?: string[];
};

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

