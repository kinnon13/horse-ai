import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .order('page, section')

    if (error) throw error

    return NextResponse.json({ blocks: data || [] })
  } catch (error) {
    console.error('Content blocks load error:', error)
    return NextResponse.json({ blocks: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { block } = await req.json()

    const { error } = await supabase
      .from('content_blocks')
      .upsert({
        block_key: block.block_key,
        content: block.content,
        content_type: 'text',
        page: block.page,
        section: block.section,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'block_key'
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content save error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

