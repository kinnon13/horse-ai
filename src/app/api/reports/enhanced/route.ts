import { NextRequest, NextResponse } from 'next/server'
import { EnhancedReportGenerator } from '@/lib/enhanced-reports'

export async function POST(request: NextRequest) {
  try {
    const { userId, reportType, horseName, template } = await request.json()

    if (!userId || !reportType) {
      return NextResponse.json({ error: 'User ID and report type required' }, { status: 400 })
    }

    const generator = new EnhancedReportGenerator()
    let reportBuffer: Buffer

    switch (reportType) {
      case 'pink_buckle':
        if (!horseName) {
          return NextResponse.json({ error: 'Horse name required for Pink Buckle report' }, { status: 400 })
        }
        reportBuffer = await generator.generatePinkBuckleReport(userId, horseName)
        break

      case 'heavens_sakes':
        if (!horseName) {
          return NextResponse.json({ error: 'Horse name required for Heavens Sakes report' }, { status: 400 })
        }
        reportBuffer = await generator.generateHeavensSakesReport(userId, horseName)
        break

      case 'custom':
        if (!template) {
          return NextResponse.json({ error: 'Template required for custom report' }, { status: 400 })
        }
        reportBuffer = await generator.generateCustomReport(userId, template)
        break

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Convert to base64 for response
    const base64Content = reportBuffer.toString('base64')
    const mimeType = 'application/pdf'
    const fileName = `${reportType}_report_${Date.now()}.pdf`

    return NextResponse.json({
      success: true,
      fileName,
      mimeType,
      content: base64Content,
      downloadUrl: `data:${mimeType};base64,${base64Content}`
    })

  } catch (error) {
    console.error('Enhanced report generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate enhanced report'
    }, { status: 500 })
  }
}
