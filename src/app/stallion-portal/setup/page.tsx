'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { getInitialStallionSetupData } from './StallionSetupConstants'
import { StallionSetupData } from './StallionSetupTypes'
import { StationInfoStep } from './StationInfoStep'
import { BusinessDetailsStep } from './BusinessDetailsStep'
import { StallionSetupCompletionStep } from './StallionSetupCompletionStep'

export default function StallionPortalSetup() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<StallionSetupData>(
    getInitialStallionSetupData(user?.email || '')
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
      console.log('Submitting stallion setup data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to stallion portal
      router.push('/stallion-portal')
    } catch (error) {
      console.error('Error submitting setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StationInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
      case 2:
        return <BusinessDetailsStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <StallionSetupCompletionStep formData={formData} onNext={handleSubmit} onBack={handleBack} />
      default:
        return <StationInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Stallion Portal Setup</h1>
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