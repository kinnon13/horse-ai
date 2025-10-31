import React from 'react'
import { ImportOptionItem } from './ImportOptionItem'

interface DataImportOptionsProps {
  importMethod: string
  setImportMethod: (method: 'manual' | 'csv' | 'skip') => void
}

export function DataImportOptions({ importMethod, setImportMethod }: DataImportOptionsProps) {
  return (
    <div className="grid gap-4">
      <ImportOptionItem
        value="manual"
        label="Add Manually"
        description="Enter your horses one by one"
        checked={importMethod === 'manual'}
        onChange={(value) => setImportMethod(value as 'manual')}
      />
      <ImportOptionItem
        value="csv"
        label="Upload CSV File"
        description="Import from spreadsheet"
        checked={importMethod === 'csv'}
        onChange={(value) => setImportMethod(value as 'csv')}
      />
      <ImportOptionItem
        value="skip"
        label="Skip for Now"
        description="Add horses later"
        checked={importMethod === 'skip'}
        onChange={(value) => setImportMethod(value as 'skip')}
      />
    </div>
  )
}
