'use client'

import React, { useState } from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'
import { BusinessInfoSection } from './BusinessInfoSection'
import { ServicesSection } from './ServicesSection'
import { ServiceAreasSection } from './ServiceAreasSection'
import { CertificationsSection } from './CertificationsSection'
import { InsuranceSection } from './InsuranceSection'
import { FormActions } from './FormActions'

interface ProviderProfileFormProps {
  provider: ProviderProfileTypes.Provider
  onSave: (data: ProviderProfileTypes.ProviderFormData) => void
  saving: boolean
}

export function ProviderProfileForm({ provider, onSave, saving }: ProviderProfileFormProps) {
  const [formData, setFormData] = useState<ProviderProfileTypes.ProviderFormData>({
    business_name: provider.business_name || '',
    business_type: provider.business_type || '',
    services_offered: provider.services_offered || [],
    service_areas: provider.service_areas || [],
    phone: provider.phone || '',
    email: provider.email || '',
    website: provider.website || '',
    description: provider.description || '',
    years_experience: provider.years_experience || 0,
    certifications: provider.certifications || [],
    insurance_info: provider.insurance_info || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BusinessInfoSection formData={formData} setFormData={setFormData} />
      <ServicesSection formData={formData} setFormData={setFormData} />
      <ServiceAreasSection formData={formData} setFormData={setFormData} />
      <CertificationsSection formData={formData} setFormData={setFormData} />
      <InsuranceSection formData={formData} setFormData={setFormData} />
      <FormActions saving={saving} />
    </form>
  )
}
