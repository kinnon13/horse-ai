// BusinessInfoSection.tsx (20 lines) - Business information form section
'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface BusinessInfoSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function BusinessInfoSection({ formData, setFormData }: BusinessInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
      <p className="text-gray-600">Business information form section - implementation pending</p>
    </div>
  )
}