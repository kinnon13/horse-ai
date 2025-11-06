import { supabaseAdmin } from '@/lib/supabase-client'

interface DiagnosticsData {
  prompt: string
  response: string
  latency: number
  tokensUsed: number
  toolsUsed: string[]
  personalizedScore: number
  missedExpectations: string[]
}

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

export async function logDiagnostics(data: DiagnosticsData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[AI Diagnostics]', data)
  }

  await supabaseAdmin.from('ai_diagnostics').insert({
    prompt: data.prompt,
    response: data.response,
    latency: data.latency,
    tokens_used: data.tokensUsed,
    tools_used: data.toolsUsed,
    personalized_score: data.personalizedScore,
    missed_expectations: data.missedExpectations,
  })
}

export async function logAIInteraction(data: AIInteractionLog) {
  const missed = findMissedOpportunities(data)

  if (process.env.NODE_ENV === 'development') {
    console.log('[AI Interaction]', {
      userId: data.userId,
      provider: data.responseProvider,
      personalizedScore: data.personalizedScore,
      missed,
    })
  }

  await supabaseAdmin.from('ai_interaction_logs').insert({
    user_id: data.userId,
    query: data.query,
    context_built: data.contextBuilt,
    tools_used: data.toolsUsed,
    emotion_detected: data.emotionDetected,
    strategy_used: data.strategyUsed,
    response_provider: data.responseProvider,
    response_source: data.responseSource,
    final_response: data.finalResponse,
    error_occurred: data.errorOccurred,
    error_message: data.errorMessage,
    personalized_score: data.personalizedScore,
    missed_opportunities: missed,
    execution_time_ms: data.executionTimeMs,
    created_at: new Date().toISOString(),
  })
}

export function calculatePersonalizationScore(data: Partial<AIInteractionLog>): number {
  let score = 0

  if (data.contextBuilt) score += 20
  if (data.emotionDetected) score += 20
  if (data.toolsUsed?.includes('horses')) score += 20
  if (data.toolsUsed?.includes('memory')) score += 20
  if (data.contextBuilt?.userName && data.finalResponse?.includes(data.contextBuilt.userName)) {
    score += 10
  }
  if (data.strategyUsed && data.strategyUsed !== 'default') score += 10

  return score
}

function findMissedOpportunities(data: AIInteractionLog): string[] {
  const missed: string[] = []

  if (data.userId && !data.contextBuilt) {
    missed.push('context_missing')
  }

  if (!data.emotionDetected && data.userId) {
    missed.push('emotion_not_detected')
  }

  if (data.contextBuilt?.horses?.length > 0 && !data.toolsUsed.includes('horses')) {
    missed.push('horses_not_mentioned')
  }

  if (data.contextBuilt?.userName && !data.finalResponse.toLowerCase().includes(data.contextBuilt.userName.toLowerCase())) {
    missed.push('name_not_used')
  }

  if (data.contextBuilt?.churnRisk > 0.7 && data.strategyUsed !== 'retention') {
    missed.push('retention_strategy_missing')
  }

  if (data.contextBuilt?.ownsBusinessProbability > 0.6 && !data.finalResponse.toLowerCase().includes('business')) {
    missed.push('business_context_missing')
  }

  return missed
}


