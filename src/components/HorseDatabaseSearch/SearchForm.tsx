import React from 'react'
import { Button } from '@/components/ui/Button'
import { Search, Loader2 } from 'lucide-react'
import { HorseSearchParams, SearchType } from './types'

interface SearchFormProps {searchType: SearchType
  searchParams: HorseSearchParams
  loading: boolean
  onSearchTypeChange: (type: SearchType) => void
  onSearchParamsChange: (params: Partial<HorseSearchParams>) => void
  onSearch: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export function SearchForm({
  searchType,
  searchParams,
  loading,
  onSearchTypeChange,
  onSearchParamsChange,
  onSearch,
  onKeyPress
}: SearchFormProps) {
  const searchTypes = [{ value: 'name', label: 'By Name' },
    { value: 'registration', label: 'By Registration' },
    { value: 'pedigree', label: 'By Pedigree' }] as const

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {searchTypes.map((type) => (
          <Button
            key={type.value}
            variant={searchType === type.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSearchTypeChange(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {searchType === 'name' && (
        <div>
          <input
            type="text"
            placeholder="Enter horse name..."
            value={searchParams.name}
            onChange={(e) => onSearchParamsChange({ name: e.target.value })}
            onKeyPress={onKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {searchType === 'registration' && (
        <div>
          <input
            type="text"
            placeholder="Enter registration number..."
            value={searchParams.registrationNumber}
            onChange={(e) => onSearchParamsChange({ registrationNumber: e.target.value })}
            onKeyPress={onKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {searchType === 'pedigree' && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter sire name..."
            value={searchParams.sire}
            onChange={(e) => onSearchParamsChange({ sire: e.target.value })}
            onKeyPress={onKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter dam name..."
            value={searchParams.dam}
            onChange={(e) => onSearchParamsChange({ dam: e.target.value })}
            onKeyPress={onKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <Button onClick={onSearch} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Search Database
          </>
        )}
      </Button>
    </div>
  )
}

