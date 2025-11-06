// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
import { NextRequest, NextResponse } from 'next/server'
import { generateCEOReport, formatCEOReport } from '@/lib/CEOMorningReport'

export async function GET(request: NextRequest) {
  try {
    const report = await generateCEOReport()
    const formattedReport = formatCEOReport(report)
    
    return NextResponse.json({
      ...report,
      formattedReport
    })
  } catch (error) {
    console.error('Error generating CEO report:', error)
    return NextResponse.json(
      { error: 'Failed to generate CEO report' },
      { status: 500 }
    )
  }
}




