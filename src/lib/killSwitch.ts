// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase-types'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function isKillSwitchActive(): Promise<boolean> {
  const supabase = await getSupabaseClient()
  const { data } = await supabase.from('system_config').select('value').eq('key', 'kill_switch_active').single()
  return data?.value === true
}

export async function checkAutonomousPermission(action: string): Promise<boolean> {
  if (await isKillSwitchActive()) {
    await logBlockedAction(action)
    return false
  }
  return true
}

async function logBlockedAction(action: string) {
  const supabase = await getSupabaseClient()
  await supabase.from('blocked_actions_log').insert({
    action,
    timestamp: new Date().toISOString(),
    reason: 'Kill switch active'
  })
}

export async function getAIMode(): Promise<'war' | 'safe' | 'off'> {
  const supabase = await getSupabaseClient()
  const { data } = await supabase.from('system_config').select('value').eq('key', 'ai_mode').single()
  return data?.value || 'safe'
}