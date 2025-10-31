// OnboardingStepDefinitions.ts (30 lines) - Step definition data
import WelcomeStep from './steps/WelcomeStep'
import DataImportStep from './steps/DataImportStep'
import AIVerificationStep from './steps/AIVerificationStep'
import ScrubbingSetupStep from './steps/ScrubbingSetupStep'
import PreferencesStep from './steps/PreferencesStep'
import CompleteStep from './steps/CompleteStep'

export const ONBOARDING_STEP_DATA = [
  {
    id: 'welcome',
    title: 'Welcome to Horse.AI!',
    description: 'Let\'s get your equine database set up with some initial data.',
    component: WelcomeStep
  },
  {
    id: 'data-import',
    title: 'Import Your Data',
    description: 'Upload your existing horse data or let us help you find it.',
    component: DataImportStep
  },
  {
    id: 'ai-verification',
    title: 'AI Data Verification',
    description: 'Our AI will verify and enrich your data automatically.',
    component: AIVerificationStep
  },
  {
    id: 'scrubbing-setup',
    title: 'Enable Auto-Scrubbing',
    description: 'Set up automatic data enrichment from public sources.',
    component: ScrubbingSetupStep
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Configure your notification and data sharing preferences.',
    component: PreferencesStep
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your Horse.AI database is ready to go.',
    component: CompleteStep
  }
]

