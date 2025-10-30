import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { BusinessFormData } from './BusinessListTypes'
import { BusinessFormHeader } from './BusinessFormHeader'
import { BusinessFormBasicInfo } from './BusinessFormBasicInfo'
import { BusinessFormContactInfo } from './BusinessFormContactInfo'
import { BusinessFormAdditionalInfo } from './BusinessFormAdditionalInfo'
import { BusinessFormActions } from './BusinessFormActions'
import { useBusinessFormHandlers } from './useBusinessFormHandlers'

interface BusinessFormProps {
  formData: BusinessFormData
  setFormData: (data: BusinessFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  onBack: () => void
}

export function BusinessForm({ formData, setFormData, onSubmit, loading, onBack }: BusinessFormProps) {
  const handlers = useBusinessFormHandlers(formData, setFormData)

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <BusinessFormHeader />
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <BusinessFormBasicInfo
              formData={formData}
              onServiceToggle={handlers.handleServiceToggle}
              onFieldUpdate={handlers.updateField}
            />
            
            <BusinessFormContactInfo
              formData={formData}
              onContactUpdate={handlers.updateContactInfo}
            />
            
            <BusinessFormAdditionalInfo
              formData={formData}
              onFieldUpdate={handlers.updateField}
            />
            
            <BusinessFormActions
              loading={loading}
              onBack={onBack}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}