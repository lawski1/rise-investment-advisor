# Institutional Investing Data Integration

This document describes the institutional investing data integration and how to connect to real data sources.

## Overview

The site now includes institutional holdings data that tracks which major institutions (hedge funds, mutual funds, pension funds, etc.) are investing in each stock. This data is sourced from SEC Form 13F filings, which institutional investment managers are required to file quarterly.

## Current Implementation

Currently, the system uses **mock data** for demonstration purposes. The architecture is designed to easily switch to real API data sources.

## Available Data Sources

### 1. SEC EDGAR API (Free, Official)
- **URL**: https://www.sec.gov/edgar/sec-api-documentation
- **Cost**: Free
- **Data**: Official SEC filings including 13F forms
- **Limitations**: Requires proper User-Agent header, rate limiting
- **Best for**: Free, official data source

### 2. GuruFocus All Gurus API (Paid)
- **URL**: https://www.gurufocus.com/data/guru-all
- **Cost**: Paid subscription
- **Data**: Comprehensive holdings from 4,500+ investors, historical data back to 2003
- **Best for**: Comprehensive historical data and analysis

### 3. BDPO API (Paid)
- **URL**: https://bdpo.io/api
- **Cost**: Paid subscription
- **Data**: Institutional holdings, 13F and Form 4 filings
- **Best for**: Structured API with good documentation

### 4. Eulerpool Ownership API (Paid)
- **URL**: https://eulerpool.com/data-analytics/finanzdaten/api/eulerpool-ownership-api
- **Cost**: Paid subscription
- **Data**: Global institutional ownership data, daily updates
- **Best for**: Global coverage, daily updates

### 5. Kaleidoscope API (Paid)
- **URL**: https://api.kscope.io
- **Cost**: Paid subscription
- **Data**: 18M+ SEC filings, 13F holdings, 30+ years of history
- **Best for**: Extensive historical data

## How to Connect Real API

### Step 1: Choose a Data Provider
Select one of the providers above based on your needs and budget.

### Step 2: Get API Key
Sign up for the service and obtain your API key.

### Step 3: Update Environment Variables
Add to your `.env.local` file:
```env
NEXT_PUBLIC_USE_INSTITUTIONAL_API=true
NEXT_PUBLIC_INSTITUTIONAL_API_KEY=your_api_key_here
```

### Step 4: Update `lib/institutionalData.ts`
Replace the mock data generation with real API calls. Example structure:

```typescript
export async function fetchInstitutionalData(symbol: string): Promise<InstitutionalData | null> {
  if (!USE_REAL_API) {
    return generateMockInstitutionalData(symbol);
  }

  try {
    // Example with SEC EDGAR API
    const response = await axios.get(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: {
        'User-Agent': 'YourAppName your@email.com',
        'Accept': 'application/json'
      }
    });
    
    // Process response and map to InstitutionalData format
    // ...
    
    return processedData;
  } catch (error) {
    console.error(`Error fetching institutional data for ${symbol}:`, error);
    return generateMockInstitutionalData(symbol); // Fallback to mock
  }
}
```

## Data Structure

The system uses the following TypeScript interfaces:

- `InstitutionalData`: Main data structure containing holdings info
- `InstitutionalHolder`: Individual institution holding the stock
- `InstitutionalHolding`: Individual holding by an institution

See `lib/types.ts` for complete type definitions.

## Features

### Institutional Holdings Component
- Shows top 10 institutional holders
- Displays total institutional ownership percentage
- Shows recent activity (new positions, increases, decreases, closed)
- Displays change in holdings from previous quarter
- Responsive table with sorting capabilities

### Integration Points
- Available in `InvestmentCard` component for stocks
- Can be toggled on/off per investment
- Lazy loads data when component is viewed

## Usage

1. Navigate to any stock investment card
2. Click "Show Institutional Holdings" button
3. View detailed institutional ownership data
4. See top holders, recent activity, and ownership trends

## Future Enhancements

- Real-time API integration
- Historical trend charts
- Comparison across multiple stocks
- Alerts for significant institutional activity
- Integration with portfolio tracking

## Notes

- Data is updated quarterly (13F filings are quarterly)
- Mock data is realistic but randomly generated
- Real API integration requires proper rate limiting
- Some APIs may require CORS proxy for client-side requests

