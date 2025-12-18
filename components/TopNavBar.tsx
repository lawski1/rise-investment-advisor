'use client';

import { useState, useRef, useEffect } from 'react';
import { Investment, SortOption, FilterOption } from '@/lib/types';
import { 
  Search, 
  X, 
  TrendingUp,
  Building2,
  BarChart,
  Layers,
  ChevronDown,
  Filter
} from 'lucide-react';

interface TopNavBarProps {
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

export default function TopNavBar({
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
}: TopNavBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const dropdown = dropdownRefs.current[activeDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
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
  const sectors = Array.from(new Set(investments.map(inv => inv.sector).filter(Boolean)));

  return (
    <nav className="bg-white backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo area (will be handled by header) */}
          <div className="flex items-center gap-8">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center gap-2 animate-fadeIn">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search investments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => {
                        if (!searchTerm) {
                          setTimeout(() => setShowSearch(false), 200);
                        }
                      }}
                      autoFocus
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all"
                    />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearch(false);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={(el) => { dropdownRefs.current['sort'] = el; }}>
              <button
                onClick={() => toggleDropdown('sort')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Sort</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'sort' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 animate-fadeIn overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100/50">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort By</label>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="recommendationScore">Recommendation Score</option>
                    <option value="ytdReturn">YTD Return</option>
                    <option value="oneYearReturn">1 Year Return</option>
                    <option value="currentPrice">Price</option>
                    <option value="dividendYield">Dividend Yield</option>
                    <option value="changePercent">Change %</option>
                  </select>
                  <div className="px-3 py-2 border-t border-gray-100/50">
                    <button
                      onClick={() => {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        setActiveDropdown(null);
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors text-left"
                    >
                      {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Exchange Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current['exchange'] = el; }}>
              <button
                onClick={() => toggleDropdown('exchange')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Exchange</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'exchange' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'exchange' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-gray-100/50">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Exchange</label>
                  </div>
                  {(['NASDAQ', 'NYSE', 'SP500'] as const).map(exchange => (
                    <button
                      key={exchange}
                      onClick={() => toggleExchange(exchange)}
                      className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                        filters.exchange?.includes(exchange)
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      {exchange}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Risk Level Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current['risk'] = el; }}>
              <button
                onClick={() => toggleDropdown('risk')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <BarChart className="w-4 h-4" />
                <span>Risk</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'risk' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'risk' && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-gray-100/50">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk Level</label>
                  </div>
                  {(['Low', 'Medium', 'High'] as const).map(risk => (
                    <button
                      key={risk}
                      onClick={() => toggleRiskLevel(risk)}
                      className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                        filters.riskLevel?.includes(risk)
                          ? risk === 'Low'
                            ? 'bg-green-50 text-green-700 font-medium'
                            : risk === 'Medium'
                            ? 'bg-yellow-50 text-yellow-700 font-medium'
                            : 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current['type'] = el; }}>
              <button
                onClick={() => toggleDropdown('type')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Type</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'type' && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-gray-100/50">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Investment Type</label>
                  </div>
                  {(['ETF', 'Index Fund', 'Stock'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                        filters.type?.includes(type)
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Active filters indicator and clear */}
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <Filter className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">
                    {Object.keys(filters).length + (searchTerm ? 1 : 0)} active
                  </span>
                </div>
                <button
                  onClick={onClearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

