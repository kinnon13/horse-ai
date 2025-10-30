export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

export interface OnboardingData {
  importedData?: ImportedData
  verifiedData?: VerifiedData
  scrubbingConfig?: ScrubbingConfig
  preferences?: Preferences
}

export interface ImportedData {
  method: 'csv' | 'api' | 'manual'
  file?: string
  source?: string
  records: number
}

export interface VerifiedData {
  verified: number
  flagged: number
  enriched: number
  newData: number
}

export interface ScrubbingConfig {
  enabled: boolean
  sources: {
    equibase: boolean
    aqha: boolean
    social: boolean
    news: boolean
  }
  frequency: string
}

export interface Preferences {
  notifications: boolean
  dataSharing: boolean
  marketing: boolean
  analytics: boolean
}

export interface VerificationStatus {
  status: 'pending' | 'processing' | 'completed'
  results?: VerifiedData
}

