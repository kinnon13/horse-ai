// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { ReportGeneratorService } from './report-generator'

export async function POST(request: NextRequest) {
  try {
    const { userId, reportType, horseName, template } = await request.json()

    if (!userId || !reportType) {
      return NextResponse.json({ error: 'User ID and report type required' }, { status: 400 })
    }

    let result
    
    switch (reportType) {
      case 'pink_buckle':
        result = await ReportGeneratorService.generatePinkBuckleReport(userId, horseName)
        break
      case 'heavens_sakes':
        result = await ReportGeneratorService.generateHeavensSakesReport(userId, horseName)
        break
      case 'custom':
        result = await ReportGeneratorService.generateCustomReport(userId, template)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.toString('base64'),
      reportType
    })

  } catch (error) {
    console.error('Enhanced report generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate enhanced report'
    }, { status: 500 })
  }
}