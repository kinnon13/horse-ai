import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Pricing IDs (should match your Stripe dashboard)
const PRICE_IDS = {
  price_free: null, // Free tier
  price_standard: process.env.STRIPE_STANDARD_PRICE_ID || 'price_standard_placeholder',
  price_pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder'
}

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, tier } = await req.json()

    if (!priceId || priceId === 'price_free') {
      return NextResponse.json({ 
        error: 'Free tier does not require checkout' 
      }, { status: 400 })
    }

    const actualPriceId = PRICE_IDS[priceId as keyof typeof PRICE_IDS] || priceId

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: userId || 'anonymous',
        tier: tier || 'standard'
      },
      client_reference_id: userId
    })

    return NextResponse.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ 
      error: 'Checkout failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
