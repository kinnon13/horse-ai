import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 })
    }

    // Auth user
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if code exists and is valid
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (codeError || !referralCode) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    // Check if code is expired
    if (referralCode.expires_at && new Date(referralCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Referral code expired' }, { status: 400 })
    }

    // Check if code has reached max uses
    if (referralCode.current_uses >= referralCode.max_uses) {
      return NextResponse.json({ error: 'Referral code limit reached' }, { status: 400 })
    }

    // Check if user already used a referral code
    const { data: existingUser } = await supabase
      .from('users')
      .select('referral_code_used')
      .eq('id', user.id)
      .single()

    if (existingUser?.referral_code_used) {
      return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 })
    }

    // Create referral claim
    const { data: claim, error: claimError } = await supabase
      .from('referral_claims')
      .insert({referral_code_id: referralCode.id,
        new_user_id: user.id,
        claimed_at: new Date().toISOString(),
        reward_applied: false
      })
      .select('*')
      .single()

    if (claimError) {
      console.error('Error creating referral claim:', claimError)
      return NextResponse.json({ error: 'Failed to claim referral' }, { status: 500 })
    }

    // Update user with referral code
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({referral_code_used: code.toUpperCase(),
        referral_reward_applied: false
      })
      .eq('id', user.id)

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError)
    }

    // Update referral code usage count
    const { error: codeUpdateError } = await supabase
      .from('referral_codes')
      .update({current_uses: referralCode.current_uses + 1
      })
      .eq('id', referralCode.id)

    if (codeUpdateError) {
      console.error('Error updating referral code:', codeUpdateError)
    }

    return NextResponse.json({success: true, 
      reward_type: referralCode.reward_type,
      reward_value: referralCode.reward_value 
    }, { status: 200 })

  } catch (err) {
    console.error('POST /api/referrals/claim error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
