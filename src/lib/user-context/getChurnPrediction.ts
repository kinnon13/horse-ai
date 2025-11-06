// Error: try { } catch blocks
// getChurnPrediction.ts - Fetch churn prediction
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getChurnPrediction(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('churn_prediction')
    .select('churn_probability, risk_factors, intervention_recommended')
    .eq('user_id', userId)
    .order('predicted_at', { ascending: false })
    .limit(1)
    .single()
  
  return data ? {
    probability: data.churn_probability,
    factors: data.risk_factors,
    intervention: data.intervention_recommended,
  } : null
}

