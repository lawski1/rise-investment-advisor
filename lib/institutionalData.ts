import { InstitutionalData, InstitutionalHolder } from './types';
import axios from 'axios';

// Institutional Investing Data API
// Multiple data source options:
// 1. SEC EDGAR API (free, official) - https://www.sec.gov/edgar/sec-api-documentation
// 2. GuruFocus API (paid, comprehensive) - https://www.gurufocus.com/data/guru-all
// 3. BDPO API (paid) - https://bdpo.io/api
// 4. Eulerpool API (paid) - https://eulerpool.com

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_INSTITUTIONAL_API === 'true';
const INSTITUTIONAL_API_KEY = process.env.NEXT_PUBLIC_INSTITUTIONAL_API_KEY || '';

/**
 * Fetch institutional holdings data for a symbol
 * Currently uses mock data, but can be extended to use real APIs
 */
export async function fetchInstitutionalData(symbol: string): Promise<InstitutionalData | null> {
  // For now, return mock data
  // In production, integrate with one of the APIs mentioned above
  if (!USE_REAL_API) {
    return generateMockInstitutionalData(symbol);
  }

  // TODO: Implement real API integration
  // Example with SEC EDGAR API:
  // try {
  //   const response = await axios.get(`https://data.sec.gov/submissions/CIK${cik}.json`, {
  //     headers: {
  //       'User-Agent': 'YourAppName your@email.com',
  //       'Accept': 'application/json'
  //     }
  //   });
  //   // Process response...
  // } catch (error) {
  //   console.error(`Error fetching institutional data for ${symbol}:`, error);
  //   return generateMockInstitutionalData(symbol);
  // }

  return generateMockInstitutionalData(symbol);
}

/**
 * Generate mock institutional data for demonstration
 */
function generateMockInstitutionalData(symbol: string): InstitutionalData {
  // Generate realistic mock data based on symbol
  const baseHolders: InstitutionalHolder[] = [
    {
      name: 'Vanguard Group Inc',
      cik: '0000102909',
      type: 'Mutual Fund',
      totalValue: Math.random() * 5000000000 + 1000000000,
      shares: Math.floor(Math.random() * 50000000 + 10000000),
      percentageOfPortfolio: Math.random() * 5 + 0.5,
      change: Math.floor(Math.random() * 1000000 - 500000),
      changePercent: Math.random() * 10 - 5,
    },
    {
      name: 'BlackRock Inc',
      cik: '0001364742',
      type: 'Mutual Fund',
      totalValue: Math.random() * 4000000000 + 800000000,
      shares: Math.floor(Math.random() * 40000000 + 8000000),
      percentageOfPortfolio: Math.random() * 4 + 0.4,
      change: Math.floor(Math.random() * 800000 - 400000),
      changePercent: Math.random() * 8 - 4,
    },
    {
      name: 'State Street Corp',
      cik: '0000093751',
      type: 'Bank',
      totalValue: Math.random() * 2000000000 + 500000000,
      shares: Math.floor(Math.random() * 20000000 + 5000000),
      percentageOfPortfolio: Math.random() * 3 + 0.3,
      change: Math.floor(Math.random() * 500000 - 250000),
      changePercent: Math.random() * 6 - 3,
    },
    {
      name: 'Fidelity Management & Research',
      cik: '0000031526',
      type: 'Mutual Fund',
      totalValue: Math.random() * 1500000000 + 300000000,
      shares: Math.floor(Math.random() * 15000000 + 3000000),
      percentageOfPortfolio: Math.random() * 2.5 + 0.2,
      change: Math.floor(Math.random() * 400000 - 200000),
      changePercent: Math.random() * 5 - 2.5,
    },
    {
      name: 'Berkshire Hathaway Inc',
      cik: '0001067983',
      type: 'Other',
      totalValue: Math.random() * 1000000000 + 200000000,
      shares: Math.floor(Math.random() * 10000000 + 2000000),
      percentageOfPortfolio: Math.random() * 2 + 0.1,
      change: Math.floor(Math.random() * 300000 - 150000),
      changePercent: Math.random() * 4 - 2,
    },
  ];

  // Sort by total value
  const sortedHolders = baseHolders.sort((a, b) => b.totalValue - a.totalValue);

  // Calculate totals
  const totalShares = sortedHolders.reduce((sum, holder) => sum + holder.shares, 0);
  const totalValue = sortedHolders.reduce((sum, holder) => sum + holder.totalValue, 0);

  // Mock additional holders to reach realistic number
  const additionalHolders: InstitutionalHolder[] = [];
  for (let i = 0; i < 15; i++) {
    additionalHolders.push({
      name: `Institutional Investor ${i + 1}`,
      type: ['Hedge Fund', 'Mutual Fund', 'Pension Fund', 'Insurance Company'][Math.floor(Math.random() * 4)] as any,
      totalValue: Math.random() * 500000000 + 50000000,
      shares: Math.floor(Math.random() * 5000000 + 500000),
      percentageOfPortfolio: Math.random() * 1.5 + 0.05,
      change: Math.floor(Math.random() * 200000 - 100000),
      changePercent: Math.random() * 3 - 1.5,
    });
  }

  const allHolders = [...sortedHolders, ...additionalHolders].sort((a, b) => b.totalValue - a.totalValue);

  return {
    symbol,
    totalInstitutionalHoldings: totalShares,
    institutionalOwnershipPercent: Math.random() * 40 + 50, // 50-90% institutional ownership
    numberOfInstitutions: allHolders.length,
    topHolders: allHolders.slice(0, 10), // Top 10 holders
    recentActivity: {
      newPositions: Math.floor(Math.random() * 5 + 1),
      increasedPositions: Math.floor(Math.random() * 8 + 3),
      decreasedPositions: Math.floor(Math.random() * 6 + 2),
      closedPositions: Math.floor(Math.random() * 4 + 1),
    },
    lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Within last 90 days
  };
}

/**
 * Batch fetch institutional data for multiple symbols
 */
export async function batchFetchInstitutionalData(symbols: string[]): Promise<Map<string, InstitutionalData>> {
  const results = new Map<string, InstitutionalData>();

  for (const symbol of symbols) {
    const data = await fetchInstitutionalData(symbol);
    if (data) {
      results.set(symbol, data);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Get top institutional holders across all symbols
 */
export async function getTopInstitutionalHolders(symbols: string[], limit: number = 20): Promise<InstitutionalHolder[]> {
  const allData = await batchFetchInstitutionalData(symbols);
  const holderMap = new Map<string, InstitutionalHolder>();

  // Aggregate holdings across all symbols
  allData.forEach((data) => {
    data.topHolders.forEach((holder) => {
      const existing = holderMap.get(holder.name);
      if (existing) {
        existing.totalValue += holder.totalValue;
        existing.shares += holder.shares;
      } else {
        holderMap.set(holder.name, { ...holder });
      }
    });
  });

  // Sort by total value and return top N
  return Array.from(holderMap.values())
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, limit);
}

