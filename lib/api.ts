import { Investment, HistoricalDataPoint } from './types';
import axios from 'axios';

// API Configuration
// Get your free API key from: https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true' && ALPHA_VANTAGE_API_KEY !== 'demo';

/**
 * Fetch real-time quote from Alpha Vantage
 */
export async function fetchQuote(symbol: string): Promise<Partial<Investment> | null> {
  if (!USE_REAL_API) {
    return null; // Fall back to mock data
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (response.data['Error Message'] || response.data['Note']) {
      console.warn(`API limit or error for ${symbol}`);
      return null;
    }

    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return null;
    }

    return {
      currentPrice: parseFloat(quote['05. price']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch historical data from Alpha Vantage
 */
export async function fetchHistoricalData(
  symbol: string,
  period: '1M' | '3M' | '6M' | '1Y' | '5Y' = '1Y'
): Promise<HistoricalDataPoint[]> {
  if (!USE_REAL_API) {
    return []; // Fall back to mock data
  }

  try {
    // Map period to Alpha Vantage interval
    const interval = period === '1M' || period === '3M' ? 'daily' : 'weekly';
    const outputsize = period === '5Y' ? 'full' : 'compact';

    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: outputsize,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (response.data['Error Message'] || response.data['Note']) {
      console.warn(`API limit or error for ${symbol} historical data`);
      return [];
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      return [];
    }

    const data: HistoricalDataPoint[] = [];
    const entries = Object.entries(timeSeries).slice(0, period === '1M' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : period === '1Y' ? 365 : 1825);

    entries.forEach(([date, values]: [string, any]) => {
      data.push({
        date,
        price: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      });
    });

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Enhance investment with real-time data
 */
export async function enhanceInvestmentWithRealData(investment: Investment): Promise<Investment> {
  if (!USE_REAL_API) {
    return investment; // Return as-is if API not configured
  }

  try {
    const quote = await fetchQuote(investment.symbol);
    if (quote) {
      return {
        ...investment,
        currentPrice: quote.currentPrice || investment.currentPrice,
        changePercent: quote.changePercent !== undefined ? quote.changePercent : investment.changePercent,
        volume: quote.volume || investment.volume,
      };
    }
  } catch (error) {
    console.error(`Error enhancing investment ${investment.symbol}:`, error);
  }

  return investment;
}

/**
 * Batch fetch quotes (with rate limiting)
 */
export async function batchFetchQuotes(symbols: string[]): Promise<Map<string, Partial<Investment>>> {
  const results = new Map<string, Partial<Investment>>();
  
  if (!USE_REAL_API) {
    return results;
  }

  // Alpha Vantage free tier: 5 calls per minute, 500 per day
  // Process in batches with delays
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    
    // Rate limit: 5 calls per minute = 1 call every 12 seconds
    if (i > 0 && i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 12000)); // Wait 12 seconds
    }

    const quote = await fetchQuote(symbol);
    if (quote) {
      results.set(symbol, quote);
    }

    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return results;
}



