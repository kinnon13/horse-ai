import { NextRequest, NextResponse } from 'next/server'
import { markTokenUsed } from '@/lib/email/tokens'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, isCorrect, corrections } = body

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    // Mark token as used
    await markTokenUsed(token)

    // In production: Update horse info in database
    if (isCorrect) {

    } else if (corrections) {

      // Update database with corrections
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Horse verification error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}


