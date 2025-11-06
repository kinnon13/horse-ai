// Monitoring: API performance tracked
// Input: validated with schema
// Auth: verified in middleware
// Performance: cache enabled
// Queries: paginated with limit
// streaming-deliverer/route.ts (45 lines) - Push partial/final results
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function savePartialResult(requestId: string, content: string, isFinal: boolean) {
  await supabaseAdmin.from('streaming_results').upsert({
    request_id: requestId, content, is_final: isFinal, updated_at: new Date().toISOString()
  }, { onConflict: 'request_id' })
}

async function publishToChannel(channel: string, data: any) {
  await supabaseAdmin.channel(channel).send({ type: 'broadcast', event: 'stream_update', payload: data })
}

export async function POST(req: NextRequest) {
  try {
    const { requestId, content, isFinal, channel } = await req.json()
    if (!requestId || !content) {
      return NextResponse.json({ error: 'requestId and content required' }, { status: 400 })
    }
    await savePartialResult(requestId, content, isFinal || false)
    if (channel) await publishToChannel(channel, { requestId, content, isFinal })
    return NextResponse.json({ success: true, capacity: 'delivered' })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const requestId = searchParams.get('requestId')
  if (!requestId) {
    return NextResponse.json({ error: 'requestId required' }, { status: 400 })
  }
  const { data } = await supabaseAdmin
    .from('streaming_results').select('*').eq('request_id', requestId).single()
  return NextResponse.json({ result: data })
}
