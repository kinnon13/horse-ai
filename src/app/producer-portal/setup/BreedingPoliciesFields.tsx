// BreedingPoliciesFields.tsx (41 lines) - Breeding policies form fields
'use client'

import React from 'react'
import { ProducerSetupData } from './ProducerSetupTypes'

interface BreedingPoliciesFieldsProps {
  formData: any
  updateField: (field: keyof ProducerSetupData, value: any) => void
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
          onChange={(e) => updateField('breeding_policies' as keyof ProducerSetupData, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your breeding policies and guidelines..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stud Fee Policy
        </label>
        <input
          type="text"
          value={formData.stud_fee_policy || ''}
          onChange={(e) => updateField('stud_fee_policy' as keyof ProducerSetupData, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stud fee policy..."
        />
      </div>
    </div>
  )
}