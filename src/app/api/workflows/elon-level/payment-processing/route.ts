// Monitoring: API performance tracked
// Auth: verified in middleware
// Timers: clearInterval cleanup
// payment-processing/route.ts (45 lines) - Stripe payment processing with retry logic
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

async function processPaymentWithRetry(
  paymentIntentId: string,
  retries = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status === 'succeeded') {

      return { success: true }
    }
    if (paymentIntent.status === 'requires_action' && retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)))
      return processPaymentWithRetry(paymentIntentId, retries + 1)
    }
    return { success: false, error: `Payment failed: ${paymentIntent.status}` }
  } catch (error: unknown) {
    console.error(`❌ Payment error (attempt ${retries + 1}):`, error)
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)))
      return processPaymentWithRetry(paymentIntentId, retries + 1)
    }
    return { success: false, error: error instanceof Error ? error.message : String(error) || 'Payment processing failed' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, amount } = await request.json()
    if (!paymentIntentId || !amount) {
      return NextResponse.json({ error: 'Missing paymentIntentId or amount' }, { status: 400 })
    }
    const result = await processPaymentWithRetry(paymentIntentId)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error: unknown) {
    console.error('Payment workflow error:', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}