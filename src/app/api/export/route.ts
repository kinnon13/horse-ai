import { NextRequest, NextResponse } from 'next/server'
import { ExportGenerator } from '@/lib/export-generator'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, exportType, filters } = await request.json()

    if (!userId || !exportType) {
      return NextResponse.json({ error: 'User ID and export type required' }, { status: 400 })
    }

    const generator = new ExportGenerator()
    
    // Create export job record
    const { data: job, error: jobError } = await supabase
      .from('export_jobs')
      .insert({
        user_id: userId,
        job_type: exportType,
        status: 'processing',
        filters: filters || {}
      })
      .select()
      .single()

    if (jobError) {
      throw jobError
    }

    try {
      let fileContent: string | Buffer
      let mimeType: string
      let fileName: string

      switch (exportType) {
        case 'csv':
          fileContent = await generator.generateCSVExport(userId, filters)
          mimeType = 'text/csv'
          fileName = `horse-ai-export-${Date.now()}.csv`
          break

        case 'pdf':
          fileContent = await generator.generatePDFReport(userId, filters)
          mimeType = 'application/pdf'
          fileName = `horse-ai-report-${Date.now()}.pdf`
          break

        case 'report':
          const { horseName } = filters || {}
          if (!horseName) {
            throw new Error('Horse name required for individual report')
          }
          fileContent = await generator.generateEquiStatStyleReport(userId, horseName)
          mimeType = 'application/pdf'
          fileName = `${horseName}-report-${Date.now()}.pdf`
          break

        default:
          throw new Error('Invalid export type')
      }

      // In production, you'd upload to S3 or similar
      // For now, we'll return the content directly
      const base64Content = Buffer.isBuffer(fileContent) 
        ? fileContent.toString('base64')
        : Buffer.from(fileContent).toString('base64')

      // Update job status
      await supabase
        .from('export_jobs')
        .update({
          status: 'completed',
          file_url: `data:${mimeType};base64,${base64Content}`,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id)

      return NextResponse.json({
        success: true,
        jobId: job.id,
        fileName,
        mimeType,
        content: base64Content,
        downloadUrl: `data:${mimeType};base64,${base64Content}`
      })

    } catch (error) {
      // Update job status to failed
      await supabase
        .from('export_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id)

      throw error
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate export'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const jobId = searchParams.get('jobId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (jobId) {
      // Get specific job
      const { data: job, error } = await supabase
        .from('export_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        job
      })
    } else {
      // Get all jobs for user
      const { data: jobs, error } = await supabase
        .from('export_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        jobs
      })
    }

  } catch (error) {
    console.error('Get export jobs error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve export jobs'
    }, { status: 500 })
  }
}
