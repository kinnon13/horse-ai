// authCheck.ts - Universal auth middleware for all API routes
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function checkAuth(req: NextRequest): Promise<{ authorized: boolean; userId?: string; error?: NextResponse }> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        authorized: false,
        error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return {
        authorized: false,
        error: NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    }

    return { authorized: true, userId: user.id }
  } catch (error) {
    return {
      authorized: false,
      error: NextResponse.json({ error: 'Auth check failed' }, { status: 500 })
    }
  }
}

