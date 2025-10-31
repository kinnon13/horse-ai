import React from 'react'

interface ServiceDirectorySearchLocationFieldProps {
  location: string
  setLocation: (location: string) => void
}

export function ServiceDirectorySearchLocationField({ location, setLocation }: ServiceDirectorySearchLocationFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Location</label>
      <input
        type="text"
        placeholder="City, State"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

