import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GrokAPI } from '@/lib/grok'
import { CSVParser } from '@/lib/csv-parser'
import { calculatePoints } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Parse CSV
    const csvText = await file.text()
    const parsedData = CSVParser.parseCSV(csvText)
    const validation = CSVParser.validateRequiredFields(parsedData)

    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        errors: validation.errors,
        data: parsedData
      }, { status: 400 })
    }

    // AI Verification
    const grok = new GrokAPI()
    const verificationResults = []
    let totalVerified = 0

    for (const horse of parsedData) {
      try {
        const verification = await grok.verifyHorseData(horse)
        verificationResults.push({
          horse,
          verified: verification.verified,
          corrections: verification.corrections,
          confidence: verification.confidence
        })
        
        if (verification.verified) {
          totalVerified++
        }
      } catch (error) {
        console.error('Verification error:', error)
        verificationResults.push({
          horse,
          verified: false,
          corrections: ['Verification failed'],
          confidence: 0
        })
      }
    }

    // Calculate points
    const pointsEarned = calculatePoints(parsedData.length, totalVerified > 0)

    // Save to database
    const { data: horses, error: horsesError } = await supabase
      .from('horses')
      .insert(parsedData.map(horse => ({
        ...horse,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select()

    if (horsesError) {
      console.error('Database error:', horsesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to save data to database'
      }, { status: 500 })
    }

    // Create audit records
    const auditRecords = verificationResults.map(result => ({
      horse_id: result.horse.name, // This would be the actual ID in production
      audit_type: 'csv_upload' as const,
      status: result.verified ? 'verified' as const : 'flagged' as const,
      details: JSON.stringify({
        corrections: result.corrections,
        confidence: result.confidence
      }),
      created_at: new Date().toISOString()
    }))

    await supabase
      .from('audits')
      .insert(auditRecords)

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${parsedData.length} horses`,
      data: parsedData,
      verification: verificationResults,
      pointsEarned,
      horsesAdded: horses?.length || 0
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process upload'
    }, { status: 500 })
  }
}
