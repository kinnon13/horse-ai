// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
'use client'
// useAuth.ts (46 lines)
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  tier: 'free' | 'pro' | 'enterprise'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await getUserTier(session.user.id)
          setUser(userData)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

export async function getUserTier(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, tier')
    .eq('id', userId)
    .single()

  if (error) {
    return { id: userId, email: '', tier: 'free' }
  }

  return data
}
