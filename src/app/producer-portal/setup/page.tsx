'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { getInitialProducerSetupData } from './ProducerSetupConstants'
import { ProducerSetupData } from './ProducerSetupTypes'
import { BusinessInfoStep } from './BusinessInfoStep'
import { BreedingOperationStep } from './BreedingOperationStep'
import { ProducerSetupCompletionStep } from './ProducerSetupCompletionStep'

export default function ProducerPortalSetup() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProducerSetupData>(
    getInitialProducerSetupData(user?.email || '')
  )

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Here you would save the form data to your backend
      console.log('Submitting producer setup data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to producer portal
      router.push('/producer-portal')
    } catch (error) {
      console.error('Error submitting setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
      case 2:
        return <BreedingOperationStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <ProducerSetupCompletionStep formData={formData} onNext={handleSubmit} onBack={handleBack} />
      default:
        return <BusinessInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Producer Portal Setup</h1>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}