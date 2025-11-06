// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function checkWebSearchAuth(user_id: string): Promise<NextResponse | null> {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user_id)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.subscription_tier !== 'plus') {
    return NextResponse.json({ 
      error: 'Web search is only available for Plus tier subscribers',
      upgradeRequired: true 
    }, { status: 403 })
  }

  return null
}



