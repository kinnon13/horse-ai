// src/app/api/opt-out/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ComplianceEngine } from '@/lib/compliance-engine'

const complianceEngine = new ComplianceEngine()

export async function POST(request: Request) {
  try {
    const { userId, contactMethod, reason } = await request.json()

    if (!userId || !contactMethod) {
      return NextResponse.json({ 
        error: 'User ID and contact method required' 
      }, { status: 400 })
    }

    // Handle STOP command
    await complianceEngine.handleStopRequest(userId, contactMethod)
    const success = true // handleStopRequest doesn't return a boolean, it throws on error

    if (success) {
      // Update user profile to mark as do_not_contact
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          do_not_contact: true,
          opt_out_reason: reason || 'User requested',
          opt_out_date: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating user opt-out status:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update opt-out status' 
        }, { status: 500 })
      }

      // Log the opt-out
      await supabase.from('opt_out_logs').insert({
        user_id: userId,
        contact_method: contactMethod,
        reason: reason || 'User requested',
        timestamp: new Date().toISOString(),
        status: 'processed'
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully opted out of all communications',
        details: {
          user_id: userId,
          contact_method: contactMethod,
          opt_out_date: new Date().toISOString()
        }
      }, { status: 200 })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to process opt-out request'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in opt-out processing:', error)
    return NextResponse.json({ 
      error: 'Failed to process opt-out request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID required' 
      }, { status: 400 })
    }

    // Check current opt-out status
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('do_not_contact, opt_out_reason, opt_out_date')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching opt-out status:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch opt-out status' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      opt_out_status: {
        do_not_contact: profile?.do_not_contact || false,
        reason: profile?.opt_out_reason,
        date: profile?.opt_out_date
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error checking opt-out status:', error)
    return NextResponse.json({ 
      error: 'Failed to check opt-out status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}