"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface FilterOption {
  type: 'select' | 'multiselect' | 'range' | 'date' | 'daterange'
  label: string
  key: string
  options?: Array<{ value: string; label: string }> | string[]
  min?: number
  max?: number
  step?: number
}

interface SearchFilterProps {
  searchPlaceholder?: string
  searchFields?: string[]
  filters?: FilterOption[]
  onSearch?: (searchTerm: string, filters: Record<string, any>) => void
  onFilter?: (filters: Record<string, any>) => void
  className?: string
  showFilterCount?: boolean
  debounceMs?: number
}

export default function SearchFilter({
  searchPlaceholder = "Search...",
  searchFields = [],
  filters = [],
  onSearch,
  onFilter,
  className = "",
  showFilterCount = true,
  debounceMs = 300
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // Trigger search when debounced term or filters change
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm, activeFilters)
    }
  }, [debouncedSearchTerm, activeFilters, onSearch])

  // Trigger initial search on mount
  useEffect(() => {
    if (onSearch) {
      onSearch('', {})
    }
  }, [onSearch])

  // Trigger filter callback when filters change
  useEffect(() => {
    if (onFilter) {
      onFilter(activeFilters)
    }
  }, [activeFilters])

  const handleFilterChange = useCallback((key: string, value: any) => {
    setActiveFilters(prev => {
      if (value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        const { [key]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: value }
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setActiveFilters({})
    setSearchTerm('')
  }, [])

  const getActiveFilterCount = useCallback(() => {
    return Object.keys(activeFilters).length
  }, [activeFilters])

  const renderFilterInput = (filter: FilterOption) => {
    const value = activeFilters[filter.key]

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label
              const isSelected = value?.includes(optionValue) || false
              
              return (
                <label key={optionValue} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = value || []
                      if (e.target.checked) {
                        handleFilterChange(filter.key, [...currentValues, optionValue])
                      } else {
                        handleFilterChange(filter.key, currentValues.filter((v: string) => v !== optionValue))
                      }
                    }}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">{optionLabel}</span>
                </label>
              )
            })}
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                min={filter.min}
                max={filter.max}
                step={filter.step || 1}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                min={filter.min}
                max={filter.max}
                step={filter.step || 1}
              />
            </div>
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        )

      case 'daterange':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="date"
                placeholder="From"
                value={value?.from || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                placeholder="To"
                value={value?.to || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'bg-amber-50 border-amber-300 text-amber-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilterCount && getActiveFilterCount() > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        )}

        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">Clear</span>
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(activeFilters).map(([key, value]) => {
              const filter = filters.find(f => f.key === key)
              if (!filter) return null

              let displayValue = value
              if (filter.type === 'range') {
                if (value && typeof value === 'object') {
                  const min = value.min || ''
                  const max = value.max || ''
                  if (min && max) {
                    displayValue = `${min}-${max}`
                  } else if (min) {
                    displayValue = `≥${min}`
                  } else if (max) {
                    displayValue = `≤${max}`
                  } else {
                    return null // Don't show empty range
                  }
                }
              } else if (filter.type === 'daterange') {
                if (value && typeof value === 'object') {
                  const from = value.from || ''
                  const to = value.to || ''
                  if (from && to) {
                    displayValue = `${from} to ${to}`
                  } else if (from) {
                    displayValue = `from ${from}`
                  } else if (to) {
                    displayValue = `until ${to}`
                  } else {
                    return null // Don't show empty date range
                  }
                }
              } else if (Array.isArray(value)) {
                displayValue = value.join(', ')
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                >
                  {filter.label}: {displayValue}
                  <button
                    onClick={() => handleFilterChange(key, null)}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
