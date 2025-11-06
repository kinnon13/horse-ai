// AI Diagnostics Logger - Track EVERYTHING
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface AIInteractionLog {
  userId: string
  query: string
  contextBuilt: any
  toolsUsed: string[]
  emotionDetected: string | null
  strategyUsed: string
  responseProvider: string
  responseSource: string
  finalResponse: string
  errorOccurred: boolean
  errorMessage?: string
  personalizedScore: number
  missedOpportunities: string[]
  executionTimeMs: number
}

export async function logAIInteraction(data: AIInteractionLog) {
  try {
    // Calculate what SHOULD have been used
    const missed = findMissedOpportunities(data)
    
    await supabase.from('ai_interaction_logs').insert({
      ...data,
      missedOpportunities: missed,
      timestamp: new Date().toISOString()
    })
    
    // Also log to console in dev
    if (process.env.NODE_ENV === 'development') {
      ,
        toolsUsed: data.toolsUsed,
        personalized: data.personalizedScore,
        missed
      })
    }
  } catch (error) {
    console.error('Failed to log AI interaction:', error)
  }
}

function findMissedOpportunities(data: AIInteractionLog): string[] {
  const missed: string[] = []
  
  // Check: Did we build user context when userId was provided?
  if (data.userId && !data.contextBuilt) {
    missed.push('MISSED: User context not built despite userId present')
  }
  
  // Check: Did we detect emotion?
  if (!data.emotionDetected && data.userId) {
    missed.push('MISSED: Emotion detection skipped')
  }
  
  // Check: Did we use horses data if available?
  if (data.contextBuilt?.horses?.length > 0 && !data.toolsUsed.includes('horses')) {
    missed.push(`MISSED: User has ${data.contextBuilt.horses.length} horses but not mentioned`)
  }
  
  // Check: Did we personalize with user name?
  if (data.contextBuilt?.userName && !data.finalResponse.includes(data.contextBuilt.userName)) {
    missed.push('MISSED: User name not used in response')
  }
  
  // Check: High churn risk but no intervention?
  if (data.contextBuilt?.churnRisk > 0.7 && data.strategyUsed !== 'retention') {
    missed.push('MISSED: High churn risk but no retention strategy')
  }
  
  // Check: Business owner but no business mention?
  if (data.contextBuilt?.ownsBusinessProbability > 0.6 && !data.finalResponse.toLowerCase().includes('business')) {
    missed.push('MISSED: Probable business owner but not addressed')
  }
  
  return missed
}

export function calculatePersonalizationScore(data: Partial<AIInteractionLog>): number {
  let score = 0
  
  // +20 for building context
  if (data.contextBuilt) score += 20
  
  // +20 for emotion detection
  if (data.emotionDetected) score += 20
  
  // +20 for using horses data
  if (data.toolsUsed?.includes('horses')) score += 20
  
  // +20 for using past conversations
  if (data.toolsUsed?.includes('memory')) score += 20
  
  // +10 for using user name
  if (data.contextBuilt?.userName && data.finalResponse?.includes(data.contextBuilt.userName)) {
    score += 10
  }
  
  // +10 for adaptive strategy
  if (data.strategyUsed && data.strategyUsed !== 'default') score += 10
  
  return score
}

