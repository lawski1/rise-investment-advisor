# Rise Investment Advisor

A modern web application for researching and discovering profitable index funds, ETFs, and S&P 500 investment opportunities. Perfect for new investors looking to make informed decisions.

## Features

### Core Features
- **Market Overview**: Real-time summary of NASDAQ, NYSE, and S&P 500 average returns
- **Investment Research**: Comprehensive data on index funds and ETFs across major exchanges
- **Smart Recommendations**: AI-powered scoring system to identify the best investment opportunities
- **Risk Assessment**: Clear risk level indicators for each investment
- **Performance Metrics**: YTD returns, 1-year returns, dividend yields, and more
- **Beginner-Friendly**: Educational content and tips for new investors

### New Features ✨
- **🔍 Filtering & Sorting**: Filter by exchange, risk level, type, and sector. Sort by any metric
- **📊 Historical Charts**: Interactive price history charts (1M, 3M, 6M, 1Y, 5Y) using Recharts
- **⚖️ Comparison Tool**: Compare up to 4 investments side-by-side with detailed metrics
- **🌐 Real API Integration**: Optional Alpha Vantage API integration for live market data
- **🔎 Search**: Quick search by symbol or investment name

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

## API Integration

The application supports real-time data from Alpha Vantage API. See `API_SETUP.md` for detailed instructions.

**Quick Setup:**
1. Get free API key from: https://www.alphavantage.co/support/#api-key
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key_here
   NEXT_PUBLIC_USE_REAL_API=true
   ```
3. Restart dev server

**Note:** The app works perfectly with mock data if you don't configure the API. All features function without it.

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

