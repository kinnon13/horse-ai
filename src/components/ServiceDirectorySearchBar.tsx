import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ServiceDirectorySearchBarProps {
  location: string
  setLocation: (location: string) => void
  onSearch: () => void
  loading: boolean
}

export function ServiceDirectorySearchBar({ location, setLocation, onSearch, loading }: ServiceDirectorySearchBarProps) {
  return (
    <div className="flex gap-2">
      <Input 
        placeholder="City, State (e.g., Lexington, KY)"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <Button onClick={onSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Find Services'}
      </Button>
    </div>
  )
}

