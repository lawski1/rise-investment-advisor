# API Setup Guide

## Alpha Vantage API Integration

The application now supports real-time data from Alpha Vantage API. Here's how to set it up:

### Step 1: Get Your Free API Key

1. Go to: https://www.alphavantage.co/support/#api-key
2. Fill out the form (name, email, organization)
3. Click "GET FREE API KEY"
4. Copy your API key

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
NEXT_PUBLIC_USE_REAL_API=true
```

### Step 3: Restart Development Server

```bash
npm run dev
```

## API Limits (Free Tier)

- **5 API calls per minute**
- **500 API calls per day**
- The application automatically handles rate limiting

## Features Enabled with Real API

✅ Real-time stock prices
✅ Live market data
✅ Historical price data
✅ Volume information
✅ Price changes

## Fallback Behavior

If the API is not configured or rate-limited:
- Application uses mock data (current behavior)
- All features still work
- No errors or broken functionality

## Alternative APIs

You can also integrate:
- **Yahoo Finance API** (unofficial, free)
- **IEX Cloud** (free tier available)
- **Polygon.io** (free tier available)

To switch APIs, update `lib/api.ts` with the new API endpoints.

