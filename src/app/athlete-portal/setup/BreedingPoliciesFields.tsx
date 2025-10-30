// Breeding Policies Fields - Single responsibility
import React from 'react'

interface BreedingPoliciesFieldsProps {
  formData: any
  updateField: (field: string, value: any) => void
}

export default function BreedingPoliciesFields({ formData, updateField }: BreedingPoliciesFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Breeding Policies
        </label>
        <textarea
          value={formData.breeding_policies || ''}
          onChange={(e) => updateField('breeding_policies', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Describe your breeding policies..."
        />
      </div>
    </div>
  )
}
