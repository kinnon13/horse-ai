import React from 'react'
import { Button } from '@/components/ui/Button'
import { FieldMapping } from './types'

interface FieldMappingProps {fieldMapping: FieldMapping
  availableFields: string[]
  onFieldMappingChange: (mapping: FieldMapping) => void
  onUpload: () => void
  uploading: boolean
}

export function FieldMappingComponent({
  fieldMapping,
  availableFields,
  onFieldMappingChange,
  onUpload,
  uploading
}: FieldMappingProps) {
  const requiredFields = ['name',
    'email',
    'phone',
    'location_city',
    'location_state']

  const handleFieldChange = (requiredField: string, csvField: string) => {
    onFieldMappingChange({
      ...fieldMapping,
      [requiredField]: csvField
    })
  }

  const isUploadReady = requiredFields.every(field => fieldMapping[field])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Map CSV Fields</h3>
        <p className="text-sm text-gray-600 mb-6">
          Match your CSV columns to the required fields for {fieldMapping.businessType || 'your business type'}
        </p>
      </div>

      <div className="space-y-4">
        {requiredFields.map((field) => (
          <div key={field} className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-gray-500">
                {getFieldDescription(field)}
              </p>
            </div>
            
            <div className="ml-4 w-48">
              <select
                value={fieldMapping[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select CSV column...</option>
                {availableFields.map((csvField) => (
                  <option key={csvField} value={csvField}>
                    {csvField}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          onClick={onUpload}
          disabled={!isUploadReady || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Data'}
        </Button>
      </div>
    </div>
  )
}

function getFieldDescription(field: string): string {
  const descriptions: Record<string, string> = {name: 'Business or contact name',
    email: 'Primary email address',
    phone: 'Phone number',
    location_city: 'City name',
    location_state: 'State or province'
  }
  return descriptions[field] || ''
}

