// referral-claim/route.ts - Verify codes, award points
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code, new_user_id } = await req.json()
    if (!code || !new_user_id) {
      return NextResponse.json({ error: 'code and new_user_id required' }, { status: 400 })
    }
    const { data: referralCode, error: codeError } = await supabaseAdmin
      .from('referral_codes').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single()
    if (codeError || !referralCode || referralCode.current_uses >= referralCode.max_uses) {
      return NextResponse.json({ error: 'Invalid referral code or limit reached' }, { status: 400 })
    }
    const { data: claim, error: claimError } = await supabaseAdmin
      .from('referral_claims').insert({ referral_code_id: referralCode.id, new_user_id, reward_applied: false }).select('*').single()
    if (claimError) {
      return NextResponse.json({ error: 'Failed to claim referral' }, { status: 500 })
    }
    await supabaseAdmin.from('referral_codes').update({ current_uses: referralCode.current_uses + 1 }).eq('id', referralCode.id)
    return NextResponse.json({ success: true, claim, reward: referralCode.reward_type })
  } catch (error) {
    console.error('Referral claim error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
