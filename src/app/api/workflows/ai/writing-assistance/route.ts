// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
// writing-assistance/route.ts - Generate bios/descriptions/reports
import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from './writing.service'

export async function POST(req: NextRequest) {
  try {
    const { type, context, tone, length } = await req.json()
    
    if (!type || !context) {
      return NextResponse.json(
        { error: 'Type and context required' },
        { status: 400 }
      )
    }

    const content = await generateContent(type, context, tone, length)
    
    return NextResponse.json({ 
      success: true, 
      content 
    })
  } catch (error) {
    console.error('Writing assistance error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
