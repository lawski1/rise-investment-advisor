'use client';

import { useState } from 'react';
import { Investment, SortOption, FilterOption } from '@/lib/types';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  TrendingUp,
  Building2,
  BarChart,
  Layers
} from 'lucide-react';

interface SidebarProps {
  investments: Investment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  filters: FilterOption;
  setFilters: (filters: FilterOption) => void;
  onClearFilters: () => void;
}

export default function Sidebar({
  investments,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filters,
  setFilters,
  onClearFilters,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: true,
    exchange: true,
    risk: true,
    type: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (key: keyof FilterOption, value: any) => {
    setFilters({ ...filters, [key]: value });
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

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;

  // Get unique sectors
  const sectors = Array.from(new Set(investments.map(inv => inv.sector).filter(Boolean)));

  return (
    <aside className="w-80 bg-white shadow-lg h-screen overflow-y-auto sticky top-0 border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters & Search
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('search')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Search</span>
            </div>
            {expandedSections.search ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.search && (
            <div className="mt-2 animate-fadeIn">
              <input
                type="text"
                placeholder="Symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 transition-all"
              />
            </div>
          )}
        </div>

        {/* Sort Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Sort By</span>
            </div>
            {expandedSections.sort ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.sort && (
            <div className="mt-2 space-y-2 animate-fadeIn">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="recommendationScore">Recommendation Score</option>
                <option value="ytdReturn">YTD Return</option>
                <option value="oneYearReturn">1 Year Return</option>
                <option value="currentPrice">Price</option>
                <option value="dividendYield">Dividend Yield</option>
                <option value="changePercent">Change %</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-sm text-gray-700">
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Exchange Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('exchange')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Exchange</span>
            </div>
            {expandedSections.exchange ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.exchange && (
            <div className="mt-2 space-y-2 animate-fadeIn">
              {(['NASDAQ', 'NYSE', 'SP500'] as const).map(exchange => (
                <button
                  key={exchange}
                  onClick={() => toggleExchange(exchange)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                    filters.exchange?.includes(exchange)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform hover:scale-105'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 transform hover:scale-102'
                  }`}
                >
                  {exchange}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Risk Level Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('risk')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Risk Level</span>
            </div>
            {expandedSections.risk ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.risk && (
            <div className="mt-2 space-y-2 animate-fadeIn">
              {(['Low', 'Medium', 'High'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => toggleRiskLevel(risk)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                    filters.riskLevel?.includes(risk)
                      ? risk === 'Low'
                        ? 'bg-green-600 text-white border-green-600 shadow-md transform hover:scale-105'
                        : risk === 'Medium'
                        ? 'bg-yellow-600 text-white border-yellow-600 shadow-md transform hover:scale-105'
                        : 'bg-red-600 text-white border-red-600 shadow-md transform hover:scale-105'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 transform hover:scale-102'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('type')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Investment Type</span>
            </div>
            {expandedSections.type ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.type && (
            <div className="mt-2 space-y-2 animate-fadeIn">
              {(['ETF', 'Index Fund', 'Stock'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                    filters.type?.includes(type)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform hover:scale-105'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 transform hover:scale-102'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters Count */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
            <p className="text-sm text-blue-900 font-semibold">
              {Object.keys(filters).length + (searchTerm ? 1 : 0)} active filter(s)
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

