// types.ts - User context types
export interface UserContext {
  userId: string
  userName?: string
  userType?: string
  
  emotionProfile: {
    dominant: string[]
    current: string
    confidence: number
  }
  
  lifecycleStage: string
  daysSinceSignup: number
  
  engagementScore: number
  engagementTrend: string
  
  churnRisk: number
  riskFactors: string[]
  interventionNeeded: boolean
  
  conversionStage: string
  hasSubscription: boolean
  subscriptionTier?: string
  
  ownsBusinessProbability: number
  businessType?: string
  crmUploadedProbability: number
  
  totalSearches: number
  lastActiveAt?: string
  
  pastConversations: Array<{
    date: string
    topics: string[]
    sentiment: string
  }>
  
  horses: Array<{
    name: string
    breed?: string
    verified: boolean
  }>
  
  recommendedStrategy: 'aggressive_convert' | 'soft_nurture' | 'build_trust' | 'problem_solve' | 'discovery'
  recommendedTone: 'enthusiastic' | 'supportive' | 'educational' | 'empathetic' | 'neutral'
}

