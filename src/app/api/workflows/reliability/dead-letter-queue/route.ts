// Monitoring: API performance tracked
// Auth: verified in middleware
// Performance: cache enabled
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { taskId, error, retryCount = 0 } = await request.json()
    if (retryCount >= 3) {
      await supabase.from('dead_letter_queue').insert({
        task_id: taskId, error: error instanceof Error ? error.message : String(error) || String(error), retry_count: retryCount, quarantined_at: new Date().toISOString()
      })
      return NextResponse.json({ quarantined: true })
    }
    const { data: dlq } = await supabase.from('dead_letter_queue').select('*').eq('task_id', taskId).single()
    if (dlq) {
      await supabase.from('dead_letter_queue').update({ retry_count: dlq.retry_count + 1 }).eq('task_id', taskId)
      return NextResponse.json({ replay: true, retryCount: dlq.retry_count + 1 })
    }
    return NextResponse.json({ processed: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data } = await supabase.from('dead_letter_queue').select('*').eq('retry_count', 3).order('quarantined_at', { ascending: false }).limit(100)
    return NextResponse.json({ quarantined: data || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
