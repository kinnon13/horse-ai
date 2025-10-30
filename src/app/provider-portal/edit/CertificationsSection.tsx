'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface CertificationsSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function CertificationsSection({ formData, setFormData }: CertificationsSectionProps) {
  const handleCertificationAdd = () => {
    const cert = prompt('Enter certification:')
    if (cert && cert.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }))
    }
  }

  const handleCertificationRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Certifications</h2>
      <div className="space-y-2">
        {formData.certifications.map((cert, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm">{cert}</span>
            <button
              type="button"
              onClick={() => handleCertificationRemove(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleCertificationAdd}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Certification
        </button>
      </div>
    </div>
  )
}

