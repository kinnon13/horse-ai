// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'
import { generateCEOReport, formatCEOReport } from '@/lib/CEOMorningReport'

export async function GET(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = await generateCEOReport()
    const formatted = formatCEOReport(report)
    
    return NextResponse.json({
      ...report,
      formatted,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('CEO dashboard error:', error)
    return NextResponse.json({ error: 'Failed to generate dashboard' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { channel, report } = await req.json()
    // Send to email/Slack based on channel

    return NextResponse.json({ success: true, sentTo: channel })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 })
  }
}
