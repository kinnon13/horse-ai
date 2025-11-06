import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/email/tokens'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token required' }, { status: 400 })
    }

    const result = await verifyToken(token)
    
    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error || 'Invalid token' })
    }

    // For MVP: return mock data
    // In production, fetch actual user/horse data from database
    return NextResponse.json({
      valid: true,
      data: {
        horseName: 'Thunder',
        horseBreed: 'Thoroughbred',
        horseAge: '5 years',
        userName: 'Horse Owner'
      }
    })
  } catch (err) {
    console.error('Token validation error:', err)
    return NextResponse.json(
      { valid: false, error: 'Server error' },
      { status: 500 }
    )
  }
}


