'use client';

import { useState, useEffect, useMemo } from 'react';
import { Investment, SortOption, FilterOption } from '@/lib/types';
import { Filter, ArrowUpDown, X } from 'lucide-react';

interface FilterAndSortProps {
  investments: Investment[];
  onFilteredChange: (filtered: Investment[]) => void;
}

export default function FilterAndSort({ investments, onFilteredChange }: FilterAndSortProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommendationScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterOption>({});
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting using useMemo to prevent infinite loops
  const filteredAndSorted = useMemo(() => {
    let filtered = [...investments];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.symbol.toLowerCase().includes(searchLower) ||
        inv.name.toLowerCase().includes(searchLower)
      );
    }

    // Exchange filter
    if (filters.exchange && filters.exchange.length > 0) {
      filtered = filtered.filter(inv => filters.exchange!.includes(inv.exchange));
    }

    // Risk level filter
    if (filters.riskLevel && filters.riskLevel.length > 0) {
      filtered = filtered.filter(inv => filters.riskLevel!.includes(inv.riskLevel));
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(inv => filters.type!.includes(inv.type));
    }

    // Sector filter
    if (filters.sector && filters.sector.length > 0) {
      filtered = filtered.filter(inv => inv.sector && filters.sector!.includes(inv.sector));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      switch (sortBy) {
        case 'recommendationScore':
          aValue = a.recommendationScore;
          bValue = b.recommendationScore;
          break;
        case 'ytdReturn':
          aValue = a.ytdReturn || 0;
          bValue = b.ytdReturn || 0;
          break;
        case 'oneYearReturn':
          aValue = a.oneYearReturn || 0;
          bValue = b.oneYearReturn || 0;
          break;
        case 'currentPrice':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'dividendYield':
          aValue = a.dividendYield || 0;
          bValue = b.dividendYield || 0;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder, filters, investments]);

  // Update parent when filtered results change
  useEffect(() => {
    onFilteredChange(filteredAndSorted);
  }, [filteredAndSorted, onFilteredChange]);

  const handleFilterChange = (key: keyof FilterOption, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleExchange = (exchange: 'NASDAQ' | 'NYSE' | 'SP500') => {
    const current = filters.exchange || [];
    const newValue = current.includes(exchange)
      ? current.filter(e => e !== exchange)
      : [...current, exchange];
    handleFilterChange('exchange', newValue.length > 0 ? newValue : undefined);
  };

  const toggleRiskLevel = (risk: 'Low' | 'Medium' | 'High') => {
    const current = filters.riskLevel || [];
    const newValue = current.includes(risk)
      ? current.filter(r => r !== risk)
      : [...current, risk];
    handleFilterChange('riskLevel', newValue.length > 0 ? newValue : undefined);
  };

  const toggleType = (type: 'ETF' | 'Index Fund' | 'Stock') => {
    const current = filters.type || [];
    const newValue = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    handleFilterChange('type', newValue.length > 0 ? newValue : undefined);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy('recommendationScore');
    setSortOrder('desc');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="recommendationScore">Recommendation Score</option>
            <option value="ytdReturn">YTD Return</option>
            <option value="oneYearReturn">1 Year Return</option>
            <option value="currentPrice">Price</option>
            <option value="dividendYield">Dividend Yield</option>
            <option value="changePercent">Change %</option>
          </select>
          <button
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.keys(filters).length + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t pt-4 mt-4 space-y-4">
          {/* Exchange Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exchange</label>
            <div className="flex flex-wrap gap-2">
              {(['NASDAQ', 'NYSE', 'SP500'] as const).map(exchange => (
                <button
                  key={exchange}
                  onClick={() => toggleExchange(exchange)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.exchange?.includes(exchange)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {exchange}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Risk Level</label>
            <div className="flex flex-wrap gap-2">
              {(['Low', 'Medium', 'High'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => toggleRiskLevel(risk)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.riskLevel?.includes(risk)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Type</label>
            <div className="flex flex-wrap gap-2">
              {(['ETF', 'Index Fund', 'Stock'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.type?.includes(type)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
