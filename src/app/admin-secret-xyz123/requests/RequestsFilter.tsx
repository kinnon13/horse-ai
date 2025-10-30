import React from 'react'
import { ServiceRequest } from './RequestsTypes'

interface RequestsFilterProps {
  filter: 'all' | 'open' | 'claimed' | 'completed'
  setFilter: (filter: 'all' | 'open' | 'claimed' | 'completed') => void
}

export function RequestsFilter({ filter, setFilter }: RequestsFilterProps) {
  const filters = [
    { key: 'all', label: 'All Requests' },
    { key: 'open', label: 'Open' },
    { key: 'claimed', label: 'Claimed' },
    { key: 'completed', label: 'Completed' }
  ] as const

  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

