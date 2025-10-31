// spotlight-viral/route.ts - Create/post viral clips, track loops
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { user_id, clip_url, description, platform } = await req.json()
    
    if (!user_id || !clip_url) {
      return NextResponse.json({ error: 'user_id and clip_url required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('viral_clips')
      .insert({
        user_id,
        clip_url,
        description,
        platform: platform || 'spotlight',
        views: 0,
        loops: 0,
        status: 'pending'
      })
      .select('*')
      .single()

    if (error) {
      console.error('Viral clip error:', error)
      return NextResponse.json({ error: 'Failed to create clip' }, { status: 500 })
    }

    return NextResponse.json({ success: true, clip: data })
  } catch (error) {
    console.error('Spotlight viral error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
