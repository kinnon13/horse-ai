// TODO: Add try-catch - wrap async operations for production
// withAuth.ts - HOC to wrap API routes with auth
import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from './authCheck'

type ApiHandler = (req: NextRequest, userId: string) => Promise<NextResponse>

export function withAuth(handler: ApiHandler) {
  return async (req: NextRequest) => {
    const auth = await checkAuth(req)
    
    if (!auth.authorized || !auth.userId) {
      return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, auth.userId)
  }
}

