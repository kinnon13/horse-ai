'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Target, Users, ArrowRight, ArrowLeft } from 'lucide-react'
import { StallionSetupData } from './StallionSetupTypes'

interface BusinessDetailsStepProps {formData: StallionSetupData
  setFormData: (data: StallionSetupData) => void
  onNext: () => void
  onBack: () => void
}

export function BusinessDetailsStep({ formData, setFormData, onNext, onBack }: BusinessDetailsStepProps) {
  const updateField = (field: keyof StallionSetupData, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const breedingMethods = ['Live Cover', 'AI Fresh', 'AI Frozen', 'Embryo Transfer']
  const services = ['Mare Care', 'Foaling Services', 'Training Services', 'Boarding Services',
    'Veterinary Services', 'Farrier Services', 'Collection Services', 'Shipping Services']

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-6 w-6 mr-2 text-green-600" />
          Business Details
        </CardTitle>
        <p className="text-gray-600">Tell us about your breeding business</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years in Business
              </label>
              <input
                type="number"
                value={formData.years_in_business || ''}
                onChange={(e) => updateField('years_in_business', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Stallions
              </label>
              <input
                type="number"
                value={formData.total_stallions}
                onChange={(e) => updateField('total_stallions', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Breedings
              </label>
              <input
                type="number"
                value={formData.annual_breedings}
                onChange={(e) => updateField('annual_breedings', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breeding Methods Offered
            </label>
            <div className="grid grid-cols-2 gap-2">
              {breedingMethods.map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.breeding_methods.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('breeding_methods', [...formData.breeding_methods, method])
                      } else {
                        updateField('breeding_methods', formData.breeding_methods.filter(m => m !== method))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Offered
            </label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('services', [...formData.services, service])
                      } else {
                        updateField('services', formData.services.filter(s => s !== service))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your breeding station, facilities, and what makes you unique..."
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

