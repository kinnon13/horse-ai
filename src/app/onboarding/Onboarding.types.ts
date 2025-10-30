export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isCompleted: boolean
}

export interface OnboardingData {
  horseData: {
    horses: Array<{
      name: string
      breed: string
      type: string
      value?: number
    }>
  }
  preferences: {
    notifications: boolean
    marketUpdates: boolean
    breedingAlerts: boolean
    priceAlerts: boolean
    newsletter: boolean
  }
  scrubbingOptions: {
    removeDuplicates: boolean
    standardizeBreeds: boolean
    validatePricing: boolean
    cleanContactInfo: boolean
  }
}

export interface OnboardingContextType {
  currentStep: number
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  isComplete: boolean
}
