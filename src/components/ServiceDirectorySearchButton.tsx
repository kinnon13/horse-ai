import React from 'react'

interface ServiceDirectorySearchButtonProps {
  onSearch: () => void
  loading: boolean
}

export function ServiceDirectorySearchButton({ onSearch, loading }: ServiceDirectorySearchButtonProps) {
  return (
    <div className="flex items-end">
      <button
        onClick={onSearch}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  )
}

