'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface InsuranceSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function InsuranceSection({ formData, setFormData }: InsuranceSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Insurance Information</h2>
      <textarea
        value={formData.insurance_info}
        onChange={(e) => setFormData(prev => ({ ...prev, insurance_info: e.target.value }))}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Describe your insurance coverage..."
      />
    </div>
  )
}

