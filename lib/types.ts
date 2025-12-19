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

// Institutional Investing Data Types
export interface InstitutionalHolder {
  name: string;
  cik?: string; // Central Index Key (SEC identifier)
  type: 'Hedge Fund' | 'Mutual Fund' | 'Pension Fund' | 'Insurance Company' | 'Bank' | 'Other';
  totalValue: number; // Total value of holdings in USD
  shares: number;
  percentageOfPortfolio?: number;
  change?: number; // Change in shares from previous quarter
  changePercent?: number;
}

export interface InstitutionalHolding {
  symbol: string;
  name: string;
  shares: number;
  value: number; // Value in USD
  percentageOfInstitution?: number; // % of institution's portfolio
  change?: number; // Change in shares
  changePercent?: number;
}

export interface InstitutionalData {
  symbol: string;
  totalInstitutionalHoldings: number; // Total shares held by institutions
  institutionalOwnershipPercent: number; // % of float owned by institutions
  numberOfInstitutions: number;
  topHolders: InstitutionalHolder[];
  recentActivity?: {
    newPositions: number;
    increasedPositions: number;
    decreasedPositions: number;
    closedPositions: number;
  };
  lastUpdated: string; // Date of last 13F filing
}

