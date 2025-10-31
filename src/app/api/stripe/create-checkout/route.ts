// API route - exempt from single-task audit
import { NextRequest, NextResponse } from 'next/server'
import { StripeCheckoutService } from './StripeCheckoutService'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, userEmail, userName } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = new StripeCheckoutService()
    const result = await service.createCheckoutSession(priceId, userId, userEmail, userName)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create checkout session'
    }, { status: 500 })
  }
}