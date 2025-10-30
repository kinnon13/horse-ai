// API route - exempt from single-task audit
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'No admin client' }, { status: 500 })
  }

  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      owner_user_id, 
      reward_type = 'free_month', 
      reward_value = 1,
      expires_at,
      max_uses = 100 
    } = body

    // Generate unique code
    const code = `HORSE${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data: referralCode, error } = await supabaseAdmin
      .from('referral_codes')
      .insert({
        code,
        owner_user_id,
        reward_type,
        reward_value,
        expires_at,
        max_uses,
        current_uses: 0,
        is_active: true
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creating referral code:', error)
      return NextResponse.json({ error: 'Failed to create referral code' }, { status: 500 })
    }

    return NextResponse.json({ referralCode }, { status: 200 })
  } catch (err) {
    console.error('POST /api/referrals/generate error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}



