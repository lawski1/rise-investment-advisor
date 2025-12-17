# Rise Investment Advisor

A modern web application for researching and discovering profitable index funds, ETFs, and S&P 500 investment opportunities. Perfect for new investors looking to make informed decisions.

## Features

- **Market Overview**: Real-time summary of NASDAQ, NYSE, and S&P 500 average returns
- **Investment Research**: Comprehensive data on index funds and ETFs across major exchanges
- **Smart Recommendations**: AI-powered scoring system to identify the best investment opportunities
- **Risk Assessment**: Clear risk level indicators for each investment
- **Performance Metrics**: YTD returns, 1-year returns, dividend yields, and more
- **Beginner-Friendly**: Educational content and tips for new investors

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive styling
- **Lucide React**: Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
rise/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── InvestmentCard.tsx  # Individual investment card
│   ├── MarketSummary.tsx   # Market overview component
│   └── RecommendationSection.tsx # Section for recommendations
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── financialData.ts    # Data fetching and analysis logic
└── package.json
```

## Current Implementation

The application currently uses mock data to demonstrate functionality. To integrate with real financial APIs, you'll need to:

1. **Get API Keys** from services like:
   - Alpha Vantage (free tier available)
   - Yahoo Finance API
   - IEX Cloud
   - Polygon.io

2. **Update `lib/financialData.ts`** to fetch real data from APIs

3. **Add environment variables** for API keys (create `.env.local`)

## Future Enhancements

- Real-time API integration
- Historical performance charts
- Portfolio tracking
- User accounts and saved investments
- Advanced filtering and sorting
- Comparison tool for multiple investments
- News and market sentiment analysis

## Disclaimer

This application is for educational purposes only. Always consult with a licensed financial advisor before making investment decisions. Past performance does not guarantee future results.

## License

MIT

