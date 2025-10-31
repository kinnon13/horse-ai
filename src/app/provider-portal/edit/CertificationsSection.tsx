// CertificationsSection.tsx (20 lines) - Certifications and credentials form section
'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface CertificationsSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function CertificationsSection({ formData, setFormData }: CertificationsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Certifications & Credentials</h3>
      <p className="text-gray-600">Certifications form section - implementation pending</p>
    </div>
  )
}