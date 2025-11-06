// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { ImportService } from './ImportService'

const importService = new ImportService()

export async function POST(request: NextRequest) {
  try {
    const { type, csvData } = await request.json()
    
    if (!type || !csvData) {
      return NextResponse.json({ error: 'Type and CSV data required' }, { status: 400 })
    }

    const result = await importService.importData(type, csvData)
    return NextResponse.json({ success: true, result })

  } catch (error: unknown) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) || 'Import failed' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { type, csvData } = await request.json()
    
    if (!type || !csvData) {
      return NextResponse.json({ error: 'Type and CSV data required' }, { status: 400 })
    }

    const result = await importService.validateImportData(type, csvData)
    return NextResponse.json({ success: true, result })

  } catch (error: unknown) {
    console.error('Validation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) || 'Validation failed' 
    }, { status: 500 })
  }
}