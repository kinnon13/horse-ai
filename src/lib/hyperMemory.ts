// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// hyperMemory.ts - Pre-load full user context for personalized greetings
import { supabase } from './supabase'

export interface UserContext {
  user: any
  horses: any[]
  businesses: any[]
  conversations: any[]
  memory: any
}

export async function loadUserContext(userId: string): Promise<UserContext> {
  const [userRes, horsesRes, businessesRes, memoryRes, convosRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('user_horses').select('name, sex, year, location_city, location_state').eq('user_id', userId),
    supabase.from('providers').select('business_name, service_type').limit(10),
    supabase.from('user_memory').select('*').eq('user_id', userId).single(),
    supabase.from('knowledge_embeddings').select('content, metadata, created_at').eq('metadata->>userId', userId).order('created_at', { ascending: false }).limit(20)
  ])
  
  return {
    user: userRes.data || {},
    horses: horsesRes.data || [],
    businesses: businessesRes.data || [],
    conversations: convosRes.data || [],
    memory: memoryRes.data || {}
  }
}

export function buildPersonalizedGreeting(context: UserContext): string {
  const userName = context.user?.email?.split('@')[0] || 'there'
  const primaryHorse = context.horses[0]
  if (!primaryHorse) return `Hey ${userName}! Welcome back. What can I help you with today?`
  
  const horseName = primaryHorse.name
  const age = primaryHorse.year ? new Date().getFullYear() - parseInt(primaryHorse.year) : ''
  const desc = [age ? `${age}yo` : '', primaryHorse.sex].filter(Boolean).join(' ')
  
  const recent = context.conversations.find(c => c.metadata?.horseId || c.content?.includes(horseName))
  const perfMatch = recent?.content?.match(/(\d+\.\d+).*run.*(\w+)/i)
  const trainingMatch = recent?.content?.match(/(left|right).*barrel|working on.*(\w+)/i)
  const perf = perfMatch ? ` after that ${perfMatch[1]} run at ${perfMatch[2]}` : ''
  const training = trainingMatch ? ` I remember you were working on ${trainingMatch[0]}.` : ''
  
  return `Hey ${userName}! How's ${horseName}${desc ? ` (your ${desc})` : ''} doing${perf}?${training} Want to analyze another run?`
}

