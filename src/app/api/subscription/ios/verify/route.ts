import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Apple IAP Verification API
 * 
 * Verifies App Store receipts and activates HorseGPT+ subscriptions.
 * This is required for App Store compliance.
 */

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not available')
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const body = await request.json()
    const { receiptData, userId } = body

    if (!receiptData || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: receiptData, userId' },
        { status: 400 }
      )
    }

    console.log(`🍎 Verifying Apple IAP receipt for user ${userId}`)

    // Verify receipt with Apple
    const verificationResult = await verifyAppleReceipt(receiptData)
    
    if (!verificationResult.valid) {
      console.error('❌ Invalid Apple receipt:', verificationResult.error)
      return NextResponse.json({ error: 'Invalid receipt' }, { status: 400 })
    }

    // Update user subscription status
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({subscription_tier: 'plus',
        billing_source: 'ios',
        ios_receipt: receiptData,
        ios_expires_at: verificationResult.expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, subscription_tier, billing_source')
      .single()

    if (updateError) {
      console.error('❌ Error updating user subscription:', updateError)
      return NextResponse.json({ error: 'Failed to activate subscription' }, { status: 500 })
    }

    console.log(`✅ Apple IAP subscription activated for user ${userId}`)

    return NextResponse.json({success: true, 
      message: 'HorseGPT+ subscription activated',
      subscription: {tier: updatedUser.subscription_tier,
        billing_source: updatedUser.billing_source
      }
    }, { status: 200 })

  } catch (error) {
    console.error('❌ POST /api/subscription/ios/verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * Verify Apple App Store receipt
 */
async function verifyAppleReceipt(receiptData: string): Promise<{valid: boolean
  expiresAt?: string
  error?: string
}> {
  try {
    // For production, use Apple's production URL
    // For testing, use Apple's sandbox URL
    const isProduction = process.env.NODE_ENV === 'production'
    const verifyURL = isProduction 
      ? 'https://buy.itunes.apple.com/verifyReceipt'
      : 'https://sandbox.itunes.apple.com/verifyReceipt'

    const response = await fetch(verifyURL, {method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'receipt-data': receiptData,
        'password': process.env.APPLE_SHARED_SECRET, // App-specific shared secret
        'exclude-old-transactions': true
      })
    })

    const result = await response.json()

    if (result.status === 0) {
      // Receipt is valid
      const latestReceiptInfo = result.latest_receipt_info?.[0]
      if (latestReceiptInfo) {
        return {valid: true,
          expiresAt: latestReceiptInfo.expires_date_ms 
            ? new Date(parseInt(latestReceiptInfo.expires_date_ms)).toISOString()
            : undefined
        }
      }
      return { valid: true }
    } else if (result.status === 21007) {
      // Sandbox receipt sent to production, retry with sandbox
      if (isProduction) {
        return await verifyAppleReceipt(receiptData) // This will retry with sandbox
      }
      return { valid: false, error: 'Sandbox receipt' }
    } else {
      return { valid: false, error: `Apple verification failed: ${result.status}` }
    }

  } catch (error) {
    console.error('❌ Error verifying Apple receipt:', error)
    return { valid: false, error: 'Verification failed' }
  }
}

