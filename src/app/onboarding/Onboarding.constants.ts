import { WelcomeStep } from './steps/WelcomeStep'
import { DataImportStep } from './steps/DataImportStep'
import { AIVerificationStep } from './steps/AIVerificationStep'
import { ScrubbingSetupStep } from './steps/ScrubbingSetupStep'
import { PreferencesStep } from './steps/PreferencesStep'
import { CompleteStep } from './steps/CompleteStep'
import type { OnboardingStep } from './Onboarding.types'

const createDataImportHandler = (callbacks: any) => (data: any) => {
  callbacks.setOnboardingData((prev: any) => ({ ...prev, importedData: data }))
  callbacks.setCompletedSteps((prev: string[]) => [...prev, 'data-import'])
}

const createVerificationHandler = (callbacks: any) => (verifiedData: any) => {
  callbacks.setOnboardingData((prev: any) => ({ ...prev, verifiedData }))
  callbacks.setCompletedSteps((prev: string[]) => [...prev, 'ai-verification'])
}

const createScrubbingHandler = (callbacks: any) => (scrubbingConfig: any) => {
  callbacks.setOnboardingData((prev: any) => ({ ...prev, scrubbingConfig }))
  callbacks.setCompletedSteps((prev: string[]) => [...prev, 'scrubbing-setup'])
}

const createPreferencesHandler = (callbacks: any) => (preferences: any) => {
  callbacks.setOnboardingData((prev: any) => ({ ...prev, preferences }))
  callbacks.setCompletedSteps((prev: string[]) => [...prev, 'preferences'])
}

export const ONBOARDING_STEPS = (callbacks: any): OnboardingStep[] => [
  {
    id: 'welcome',
    title: 'Welcome to Horse.AI!',
    description: 'Let\'s get your equine database set up with some initial data.',
    component: <WelcomeStep onNext={() => callbacks.setCurrentStep(1)} />
  },
  {
    id: 'data-import',
    title: 'Import Your Data',
    description: 'Upload your existing horse data or let us help you find it.',
    component: <DataImportStep onDataImported={createDataImportHandler(callbacks)} />
  },
  {
    id: 'ai-verification',
    title: 'AI Data Verification',
    description: 'Our AI will verify and enrich your data automatically.',
    component: <AIVerificationStep data={callbacks.onboardingData.importedData} onVerified={createVerificationHandler(callbacks)} />
  },
  {
    id: 'scrubbing-setup',
    title: 'Enable Auto-Scrubbing',
    description: 'Set up automatic data enrichment from public sources.',
    component: <ScrubbingSetupStep onSetup={createScrubbingHandler(callbacks)} />
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Configure your notification and data sharing preferences.',
    component: <PreferencesStep onSave={createPreferencesHandler(callbacks)} />
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your Horse.AI database is ready to go.',
    component: <CompleteStep data={callbacks.onboardingData} onComplete={() => callbacks.router.push('/dashboard')} />
  }
]

